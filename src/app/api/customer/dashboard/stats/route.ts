import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export const GET = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get active campaigns (orders with certain statuses)
    const activeCampaigns = await prisma.order.count({
      where: {
        user_id: user.id,
        status: { in: ["CONFIRMED", "IN_PROGRESS", "SHIPPED"] },
      },
    });

    // Get total impressions (this could be calculated differently based on actual business logic)
    // For now, using a placeholder calculation
    const totalImpressions = activeCampaigns * 800000; // Approximate calculation

    // Get total spent (sum of all completed orders)
    const totalSpentResult = await prisma.order.aggregate({
      where: {
        user_id: user.id,
        status: { in: ["COMPLETED", "DELIVERED"] },
      },
      _sum: { final_amount: true },
    });
    const totalSpent = totalSpentResult._sum.final_amount?.toNumber() || 0;

    // Get pending orders (orders with PENDING status)
    const pendingOrders = await prisma.order.count({
      where: {
        user_id: user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      activeCampaigns,
      totalImpressions,
      totalSpent,
      pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching customer dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
});
