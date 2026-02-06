import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";
import { orderService } from "@/services/orderService";
import { Prisma } from "@prisma/client";

// Get specific order by ID (admin)
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { id } = await params;
      // Check if id is a UUID (36 characters with dashes) or order number
      let order;
      if (id.length === 36 && id.includes("-")) {
        // It's a UUID
        order = await prisma.order.findUnique({
          where: { uuid: id },
        });
      } else if (id.startsWith("ORD-")) {
        // It's an order number
        order = await prisma.order.findUnique({
          where: { order_number: id },
        });
      } else {
        // Try numeric ID
        const orderId = parseInt(id);
        if (isNaN(orderId)) {
          return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }
        order = await orderService.getById(orderId);
      }

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
    }
  })(request);
};

// Update order
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const { id } = await params;
      const data = await request.json();

      // Find order by UUID, order_number, or numeric ID
      let whereClause;
      if (id.length === 36 && id.includes("-")) {
        whereClause = { uuid: id };
      } else if (id.startsWith("ORD-")) {
        whereClause = { order_number: id };
      } else {
        const orderId = parseInt(id);
        if (isNaN(orderId)) {
          return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }
        whereClause = { id: orderId };
      }

      // Get current order to compare status
      const currentOrder = await prisma.order.findUnique({
        where: whereClause,
        select: { status: true, order_number: true, user_id: true, id: true },
      });

      if (!currentOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Prepare update data based on incoming fields
      const updateData: any = {
        updated_at: new Date(),
      };

      // Map frontend fields to database fields
      if (data.status) {
        updateData.status = data.status;
      }
      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }
      if (data.total_amount !== undefined) {
        updateData.total_amount = new Prisma.Decimal(data.total_amount);
      }
      if (data.final_amount !== undefined) {
        updateData.final_amount = new Prisma.Decimal(data.final_amount);
      }
      if (data.shipping_address !== undefined) {
        updateData.shipping_address = data.shipping_address;
      }
      if (data.billing_address !== undefined) {
        updateData.billing_address = data.billing_address;
      }
      if (data.payment_method !== undefined) {
        updateData.payment_method = data.payment_method;
      }
      if (data.payment_status !== undefined) {
        updateData.payment_status = data.payment_status;
      }
      if (data.start_date !== undefined) {
        updateData.start_date = new Date(data.start_date);
      }
      if (data.end_date !== undefined) {
        updateData.end_date = new Date(data.end_date);
      }

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id: currentOrder.id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Trigger notification if status changed
      if (data.status && data.status !== currentOrder.status) {
        await notificationTrigger.orderStatusChanged(currentOrder.id, updatedOrder.user_id, updatedOrder.order_number, data.status, currentOrder.status);
      }

      return NextResponse.json({
        message: "Order updated successfully",
        order: {
          id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          status: updatedOrder.status,
        },
      });
    } catch (error) {
      console.error("Update order error:", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  })(request);
};

// Delete specific order (admin)
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { id } = await params;
      let orderId;

      // Check if id is a UUID or order number
      if (id.length === 36 && id.includes("-")) {
        // It's a UUID - find the numeric ID
        const order = await prisma.order.findUnique({
          where: { uuid: id },
          select: { id: true },
        });
        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        orderId = order.id;
      } else if (id.startsWith("ORD-")) {
        // It's an order number - find the numeric ID
        const order = await prisma.order.findUnique({
          where: { order_number: id },
          select: { id: true },
        });
        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        orderId = order.id;
      } else {
        // Try numeric ID
        orderId = parseInt(id);
        if (isNaN(orderId)) {
          return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }
      }

      await orderService.softDelete(orderId);

      return NextResponse.json({
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Delete order error:", error);
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
  })(request);
};
