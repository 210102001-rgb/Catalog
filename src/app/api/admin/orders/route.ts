import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";
import { orderService } from "@/services/orderService";
import { v4 as uuidv4 } from "uuid";

// Get all orders (admin)
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";
    const userId = searchParams.get("userId") || "";

    const filters: any = {};
    if (status) filters.status = status;
    if (userId) filters.userId = parseInt(userId);

    const result = await orderService.getAll(page, limit, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
});

// Create new order
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.user_id || !data.items || !data.total_amount) {
      return NextResponse.json({ error: "User ID, items, and total amount are required" }, { status: 400 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        uuid: uuidv4(),
        order_number: `ORD-${Date.now()}`,
        user_id: data.user_id,
        admin_id: user.id,
        total_amount: data.total_amount,
        final_amount: data.total_amount, // Assuming final amount equals total amount initially
        status: data.status || "PENDING",
        start_date: data.start_date ? new Date(data.start_date) : new Date(),
        end_date: data.end_date ? new Date(data.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        shipping_address: data.shipping_address,
        billing_address: data.billing_address,
        notes: data.notes,
        order_items: {
          create: data.items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            start_date: item.start_date ? new Date(item.start_date) : new Date(),
            end_date: item.end_date ? new Date(item.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Trigger notification for order creation
    await notificationTrigger.orderCreated(order.id, order.user_id, order.order_number);

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
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
});

// Update order status (admin)
export const PUT = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const updatedOrder = await orderService.updateStatus(orderId, status);

    return NextResponse.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
});

// Delete order (soft delete)
export const DELETE = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await orderService.softDelete(parseInt(orderId));

    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
});
