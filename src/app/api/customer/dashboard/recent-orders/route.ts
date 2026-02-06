import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export const GET = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const recentOrders = await prisma.order.findMany({
      where: { user_id: user.id },
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
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
      const location = order.order_items[0]?.product?.location || "Lokasi tidak tersedia";

      return {
        id: order.id,
        order_number: order.order_number,
        location,
        status: order.status,
        total_amount: order.final_amount.toNumber(),
      };
    });

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json({ error: "Failed to fetch recent orders" }, { status: 500 });
  }
});
