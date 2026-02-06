import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Get admin user for customer chat
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get the first admin user (in real app, you might want a specific support admin)
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "No admin found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json({ error: "Failed to retrieve admin" }, { status: 500 });
  }
});
