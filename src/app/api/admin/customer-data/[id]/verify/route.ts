import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Verify customer data (admin)
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAdmin(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const data = await request.json();

      const customerDataId = parseInt(id);
      if (isNaN(customerDataId)) {
        return NextResponse.json({ error: "Invalid customer data ID" }, { status: 400 });
      }

      // Get current customer data
      const currentData = await prisma.customerData.findUnique({
        where: { id: customerDataId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!currentData) {
        return NextResponse.json({ error: "Customer data not found" }, { status: 404 });
      }

      // Update verification status
      const updatedData = await prisma.customerData.update({
        where: { id: customerDataId },
        data: {
          verification_status: data.approved ? "APPROVED" : "REJECTED",
          verified_by: user.id,
          verified_at: new Date(),
          rejected_reason: data.approved ? null : data.reason,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      });

      // Update user NPWP verification status if approved
      if (data.approved) {
        await prisma.user.update({
          where: { id: currentData.user_id },
          data: {
            npwp_verified: true,
            npwp_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          },
        });
      }

      return NextResponse.json({
        message: `Customer data ${data.approved ? "approved" : "rejected"} successfully`,
        data: updatedData,
      });
    } catch (error) {
      console.error("Verify customer data error:", error);
      return NextResponse.json({ error: "Failed to verify customer data" }, { status: 500 });
    }
  })(request);
};

// Delete customer data (admin)
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAdmin(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;

      const customerDataId = parseInt(id);
      if (isNaN(customerDataId)) {
        return NextResponse.json({ error: "Invalid customer data ID" }, { status: 400 });
      }

      // Check if customer data exists
      const customerData = await prisma.customerData.findUnique({
        where: { id: customerDataId },
      });

      if (!customerData) {
        return NextResponse.json({ error: "Customer data not found" }, { status: 404 });
      }

      // Delete customer data
      await prisma.customerData.delete({
        where: { id: customerDataId },
      });

      return NextResponse.json({
        message: "Customer data deleted successfully",
      });
    } catch (error) {
      console.error("Delete customer data error:", error);
      return NextResponse.json({ error: "Failed to delete customer data" }, { status: 500 });
    }
  })(request);
};