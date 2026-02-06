import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromNextRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Get user from request headers first
  let user = getUserFromNextRequest(request);

  // If no user from headers, try to get from cookies
  if (!user || !user.id) {
    const token = request.cookies.get("auth_token")?.value;
    if (token) {
      try {
        const decoded = verifyToken(token);
        // Fetch the full user from the database
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
      } catch (error) {
        // Token invalid, continue with null user
      }
    }
  }

  // Check if user exists and is authenticated
  if (!user || !user.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    // Fetch user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { password_hash, remember_token, ...safeUserData } = userData;

    return NextResponse.json({
      user: safeUserData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Failed to retrieve user data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Get user from request (this should ideally be extracted to a middleware or shared helper)
  let user = null;
  const token = request.cookies.get("auth_token")?.value;

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        user = { id: decoded.id };
      }
    } catch (error) {
      // Token invalid
    }
  }

  if (!user || !user.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
      },
    });

    // Remove sensitive data
    const { password_hash, remember_token, ...safeUserData } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: safeUserData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
