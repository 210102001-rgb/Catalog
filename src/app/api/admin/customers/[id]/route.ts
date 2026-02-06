import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Get specific customer by ID
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const { id } = await params;
      const customerId = parseInt(id);

      const customer = await prisma.user.findUnique({
        where: { id: customerId, role: "CUSTOMER" },
        include: {
          orders: {
            select: {
              id: true,
              order_number: true,
              status: true,
              final_amount: true,
              created_at: true,
            },
          },
          receivedChats: {
            where: {
              sender: { role: "ADMIN" },
            },
            select: {
              id: true,
              message: true,
              created_at: true,
            },
            take: 5, // Limit to 5 recent chats
          },
        },
      });

      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }

      // Transform data
      const transformedCustomer = {
        id: customer.id,
        uuid: customer.uuid,
        name: customer.name,
        email: customer.email,
        company_name: customer.company_name,
        phone: customer.phone,
        status: customer.status,
        created_at: customer.created_at,
        orders: customer.orders.length,
        total_spent: 0, // Simplified for now
        recent_orders: customer.orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          amount: order.final_amount,
          date: order.created_at,
        })),
        recent_chats: customer.receivedChats
          ? customer.receivedChats.map((chat: any) => ({
              id: chat.id,
              message: chat.message,
              date: chat.created_at,
            }))
          : [],
      };

      return NextResponse.json(transformedCustomer);
    } catch (error) {
      console.error("Get customer error:", error);
      return NextResponse.json({ error: "Failed to retrieve customer" }, { status: 500 });
    }
  })(request);
};

// Update customer
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const { id } = await params;
      const customerId = parseInt(id);
      const data = await request.json();

      const updatedCustomer = await prisma.user.update({
        where: { id: customerId, role: "CUSTOMER" },
        data: {
          name: data.name,
          email: data.email,
          company_name: data.company_name,
          phone: data.phone,
          status: data.status,
        },
      });

      return NextResponse.json({
        message: "Customer updated successfully",
        customer: {
          id: updatedCustomer.id,
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          company: updatedCustomer.company_name || "-",
          phone: updatedCustomer.phone || "-",
          status: updatedCustomer.status,
        },
      });
    } catch (error) {
      console.error("Update customer error:", error);
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
  })(request);
};

// Delete customer
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const { id } = await params;
      const customerId = parseInt(id);

      // Check if customer has orders
      const orderCount = await prisma.order.count({
        where: { user_id: customerId },
      });

      if (orderCount > 0) {
        return NextResponse.json({ error: "Cannot delete customer with existing orders" }, { status: 400 });
      }

      await prisma.user.delete({
        where: { id: customerId, role: "CUSTOMER" },
      });

      return NextResponse.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Delete customer error:", error);
      return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
  })(request);
};
