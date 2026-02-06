import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, password, role = "CUSTOMER", company_name, phone } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name,
        email,
        password_hash: hashedPassword,
        role: role.toUpperCase() as any,
        company_name: company_name || null,
        phone: phone || null,
        status: "ACTIVE",
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Trigger welcome notification for new customers
    if (user.role === "CUSTOMER") {
      await notificationTrigger.welcomeNewCustomer(user.id, user.name);
    }

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
};
