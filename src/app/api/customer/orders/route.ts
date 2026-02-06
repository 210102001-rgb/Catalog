import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { Decimal } from "@prisma/client/runtime/library";
import { notificationTrigger } from "@/services/notificationTrigger";

// Get customer orders
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      user_id: user.id,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          order_items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  location: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
});

// Create new order (customer)
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.order_items || !data.total_amount) {
      return NextResponse.json({ error: "Order items and total amount are required" }, { status: 400 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        uuid: uuidv4(),
        order_number: `ORD-${Date.now()}`,
        user_id: user.id,
        total_amount: new Decimal(data.total_amount),
        final_amount: new Decimal(data.total_amount), // Set final_amount equal to total_amount initially
        status: "PENDING",
        start_date: data.start_date ? new Date(data.start_date) : new Date(),
        end_date: data.end_date ? new Date(data.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        shipping_address: data.shipping_address,
        billing_address: data.billing_address,
        notes: data.notes,
        order_items: {
          create: data.order_items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: new Decimal(item.unit_price),
            total_price: new Decimal(item.total_price),
            start_date: item.start_date ? new Date(item.start_date) : new Date(),
            end_date: item.end_date ? new Date(item.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })),
        },
      },
    });

    // Trigger notification for order creation
    await notificationTrigger.orderCreated(order.id, user.id, order.order_number);

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          total_amount: order.total_amount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
});
