import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, userType, companyName } = await request.json();

// Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, email, dan password harus diisi" }, { status: 400 });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: "Nama harus antara 2 dan 100 karakter" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json({ error: "Password harus mengandung huruf besar, huruf kecil, dan angka" }, { status: 400 });
    }

    // Validate phone format
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      return NextResponse.json({ error: "Format nomor telepon tidak valid" }, { status: 400 });
    }

    // Validate user type
    const validUserTypes = ["INDIVIDUAL", "COMPANY"];
    if (userType && !validUserTypes.includes(userType)) {
      return NextResponse.json({ error: "Tipe user tidak valid" }, { status: 400 });
    }

    // Validate company name for company users
    if (userType === "COMPANY" && !companyName) {
      return NextResponse.json({ error: "Nama perusahaan wajib diisi untuk tipe COMPANY" }, { status: 400 });
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

    // Create customer user
    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name,
        email,
        password_hash: hashedPassword,
        phone: phone || null,
        user_type: (userType || "INDIVIDUAL").toUpperCase(),
        company_name: companyName || null,
        role: "CUSTOMER", // Explicitly set role as customer
        status: "ACTIVE",
      },
    });

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword, message: "Registrasi customer berhasil" }, { status: 201 });
  } catch (error) {
    console.error("Customer registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi customer" }, { status: 500 });
  }
}
