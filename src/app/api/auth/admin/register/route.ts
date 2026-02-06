import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, email, dan password harus diisi" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name,
        email,
        password_hash: hashedPassword,
        phone: phone || null,
        user_type: "INDIVIDUAL", // Admin typically doesn't have company
        company_name: null,
        role: "ADMIN", // Explicitly set role as admin
        status: "ACTIVE",
      },
    });

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword, message: "Registrasi admin berhasil" }, { status: 201 });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi admin" }, { status: 500 });
  }
}
