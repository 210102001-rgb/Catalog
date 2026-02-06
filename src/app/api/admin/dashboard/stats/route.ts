import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export const GET = requireAdmin(async (req: NextRequest, user: any) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else {
        // Default relative comparison for newOrders only
    }

    // Get total revenue (sum of all completed orders)
    // If date filter is present, apply it to the revenue calculation
    const revenueWhere: any = { status: { in: ["COMPLETED", "DELIVERED"] } };
    if (startDate && endDate) {
        revenueWhere.created_at = dateFilter.created_at;
    }

    const totalRevenueResult = await prisma.order.aggregate({
      where: revenueWhere,
      _sum: { final_amount: true },
    });
    const totalRevenue = totalRevenueResult._sum.final_amount?.toNumber() || 0;

    // Get new orders
    // If date filter is present, use it. Otherwise default to last 30 days.
    let newOrdersWhere: any = {};
    if (startDate && endDate) {
         newOrdersWhere.created_at = dateFilter.created_at;
    } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        newOrdersWhere.created_at = { gte: thirtyDaysAgo };
    }

    const newOrders = await prisma.order.count({
      where: newOrdersWhere,
    });

    // Get active billboards (published products)
    const activeBillboards = await prisma.product.count({
      where: { published: true, status: "APPROVED" },
    });

    // Get pending chats (unread messages)
    const pendingChats = await prisma.chat.count({
      where: { read: false },
    });

    return NextResponse.json({
      totalRevenue,
      newOrders,
      activeBillboards,
      pendingChats,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
});
