import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Get all customer data (admin)
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.verification_status = status;
    }

    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          company_name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [customerDataList, total] = await Promise.all([
      prisma.customerData.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      }),
      prisma.customerData.count({ where }),
    ]);

    return NextResponse.json({
      data: customerDataList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get customer data error:", error);
    return NextResponse.json({ error: "Failed to retrieve customer data" }, { status: 500 });
  }
});

// Create customer data (customer - for future use)
export const POST = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if customer data already exists for this user
    const existingData = await prisma.customerData.findFirst({
      where: { user_id: data.user_id },
    });

    if (existingData) {
      return NextResponse.json({ error: "Customer data already exists for this user" }, { status: 400 });
    }

    const customerData = await prisma.customerData.create({
      data: {
        user_id: data.user_id,
        company_name: data.company_name,
        company_address: data.company_address,
        company_phone: data.company_phone,
        npwp_number: data.npwp_number,
        npwp_file: data.npwp_file,
        ktp_number: data.ktp_number,
        ktp_file: data.ktp_file,
        bank_account: data.bank_account,
        bank_name: data.bank_name,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Customer data created successfully",
      data: customerData,
    });
  } catch (error) {
    console.error("Create customer data error:", error);
    return NextResponse.json({ error: "Failed to create customer data" }, { status: 500 });
  }
});