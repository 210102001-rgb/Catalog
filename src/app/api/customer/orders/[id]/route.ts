import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/orderService";
import { requireAuth } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";

// Get specific order by ID (customer)
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }

      const order = await orderService.getById(orderId);

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Ensure the order belongs to the current user
      if (order.user_id !== user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
    }
  })(request);
};

// Update specific order (customer - limited updates)
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }

      const updateData = await request.json();

      // Check if the order belongs to the current user
      const order = await orderService.getById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.user_id !== user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Allow only certain fields to be updated by customer
      const allowedUpdates: (keyof import("@/services/orderService").UpdateOrderInput)[] = ["notes", "shipping_address", "billing_address"];

      const filteredUpdateData: any = {};
      for (const field of allowedUpdates) {
        if (updateData[field] !== undefined) {
          filteredUpdateData[field] = updateData[field];
        }
      }

      const updatedOrder = await orderService.update(orderId, filteredUpdateData);

      return NextResponse.json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
} catch (error) {
      console.error("Update order error:", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  })(request);
};

// Cancel order (customer - only if PENDING)
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }

      // Get order details for validation
      const order = await orderService.getById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if order belongs to the authenticated user
      if (order.user_id !== user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Customers can only cancel if order is PENDING
      if (order.status !== "PENDING") {
        return NextResponse.json({ error: "Order can only be cancelled when status is PENDING" }, { status: 400 });
      }

      // Update order status to CANCELLED
      const cancelledOrder = await orderService.updateStatus(orderId, "CANCELLED");

      // Trigger notification for order cancellation
      await notificationTrigger.orderStatusChanged(
        cancelledOrder.id, 
        user.id, 
        cancelledOrder.order_number || `ORD-${orderId}`, 
        "CANCELLED", 
        order.status
      );

      return NextResponse.json({
        message: "Order cancelled successfully",
        order: {
          id: cancelledOrder.id,
          order_number: cancelledOrder.order_number,
          status: cancelledOrder.status,
        },
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
    }
  })(request);
};
