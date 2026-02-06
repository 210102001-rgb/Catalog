import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export const GET = requireAdmin(async (req: NextRequest, user: any) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const recentOrders = await prisma.order.findMany({
      where: whereClause,
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                location: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the expected format
    const transformedOrders = recentOrders.map((order) => {
      const duration = Math.floor((new Date(order.end_date).getTime() - new Date(order.start_date).getTime()) / (1000 * 60 * 60 * 24));
      const location = order.order_items[0]?.product?.location || "Lokasi tidak tersedia";

      return {
        id: order.id,
        order_number: order.order_number,
        user: { name: order.user.name },
        location,
        duration,
        status: order.status,
        amount: order.final_amount.toNumber(),
      };
    });

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json({ error: "Failed to fetch recent orders" }, { status: 500 });
  }
});
