import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get("auth_token")?.value;
  let userId = null;

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        userId = decoded.id;
      }
    } catch (error) {
      // Invalid token
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    // Be careful with users who might not have a password set (e.g. social login), but here we assume password auth
    if (!user.password_hash) {
         return NextResponse.json({ error: "User does not have a password set" }, { status: 400 });
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
