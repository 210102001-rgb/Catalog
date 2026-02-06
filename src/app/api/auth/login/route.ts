import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json(); // role is now optional

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    // Find user - if role is specified, filter by role, otherwise find any user
    const user = await prisma.user.findUnique({
      where: role ? { email, role } : { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
      },
    });

    // Create JWT token
    const token = sign({ id: user.id, uuid: user.uuid, email: user.email, role: user.role, userType: user.user_type }, JWT_SECRET, { expiresIn: "7d" });

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    // Set HTTP-only cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: "Login berhasil",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 });
  }
}
