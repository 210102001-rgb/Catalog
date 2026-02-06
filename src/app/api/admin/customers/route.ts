import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper function to generate random password
function generateRandomPassword(length: number = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Get all customers with filtering and pagination
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    // Only admins can access customer data
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }, { company_name: { contains: search, mode: "insensitive" } }];
    }

    if (status && status !== "Semua") {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          uuid: true,
          name: true,
          email: true,
          company_name: true,
          phone: true,
          status: true,
          created_at: true,
          // Get order statistics
          orders: {
            select: {
              id: true,
              final_amount: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Transform data to match frontend expectations
    const transformedCustomers = customers.map((customer) => ({
      id: customer.id,
      uuid: customer.uuid,
      name: customer.name,
      email: customer.email,
      company: customer.company_name || "-",
      phone: customer.phone || "-",
      status: customer.status,
      orders: customer.orders.length,
      spent: customer.orders.reduce((sum, order) => sum + Number(order.final_amount || 0), 0),
      createdAt: customer.created_at,
    }));

    return NextResponse.json({
      customers: transformedCustomers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json({ error: "Failed to retrieve customers" }, { status: 500 });
  }
});

// Create new customer
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Generate a random password for the customer
    const tempPassword = generateRandomPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name: data.name,
        email: data.email,
        company_name: data.company || null,
        phone: data.phone || null,
        role: "CUSTOMER",
        status: data.status || "ACTIVE",
        password_hash: passwordHash,
      },
    });

    return NextResponse.json(
      {
        message: "Customer created successfully",
        customer: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          company: newUser.company_name || "-",
          phone: newUser.phone || "-",
          status: newUser.status,
          orders: 0,
          spent: 0,
          createdAt: newUser.created_at,
        },
        // Include temporary password (should be changed on first login)
        tempPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
});
