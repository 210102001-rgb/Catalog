import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromNextRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
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
  try {
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

    // Parse request body
    const { name, company_name, phone } = await request.json();

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        company_name,
        phone,
      },
    });

    // Remove sensitive data
    const { password_hash, remember_token, ...safeUserData } = updatedUser;

    return NextResponse.json({
      user: safeUserData,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 });
  }
}
