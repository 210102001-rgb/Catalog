import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// This route is protected and only accessible by admins
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    // Fetch admin dashboard data
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    });
    const totalAdmins = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    return NextResponse.json({
      data: {
        totalUsers,
        totalCustomers,
        totalAdmins,
        adminInfo: {
          id: user.id,
          email: user.email,
          name: (await prisma.user.findUnique({ where: { id: user.id } }))?.name,
        },
      },
      message: "Admin dashboard data retrieved successfully",
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to retrieve admin dashboard data" }, { status: 500 });
  }
});
