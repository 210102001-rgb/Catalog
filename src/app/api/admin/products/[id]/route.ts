import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productService } from "@/services/productService";
import { notificationTrigger } from "@/services/notificationTrigger";
import { requireAdmin, getUserFromNextRequest, verifyToken, isAdmin, requireAuth } from "@/lib/auth";

// Helper function to check admin access
async function requireAdminAccess(request: NextRequest) {
  // Get user from request headers first
  let user = getUserFromNextRequest(request);

  // If no user from headers, try to get from cookies
  if (!user || !user.id) {
    const token = request.cookies.get("auth_token")?.value;
    if (token) {
      try {
        const decoded = verifyToken(token);
        // Fetch the full user from the database
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
      } catch (error) {
        // Token invalid, continue with null user
      }
    }
  }

  // Check if user exists and is admin
  if (!user || !user.id || !isAdmin(user)) {
    return null;
  }

  return user;
}

// Get a specific product by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
try {
    const { id } = await params;
    const user = await requireAdminAccess(request);

    if (!user) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await productService.getById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({ error: "Failed to retrieve product" }, { status: 500 });
  }
}

// Update product
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      
      if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const productId = parseInt(id);
    const data = await request.json();

    // Get current product to check status change
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { status: true, name: true, created_by: true },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product
const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: data.status,
        approved_by: data.status === "APPROVED" ? user.id : undefined,
        approved_at: data.status === "APPROVED" ? new Date() : undefined,
        updated_at: new Date(),
      },
    });

    // Trigger notification if status changed to APPROVED or REJECTED
    if (data.status && data.status !== currentProduct.status) {
      if (data.status === "APPROVED" || data.status === "REJECTED") {
        await notificationTrigger.productStatusChanged(currentProduct.created_by, currentProduct.name, data.status);
      }
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
} catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
  })(request);
};

// Delete a specific product by ID
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAdmin(async (request: NextRequest, user: any) => {
    try {
const { id } = await params;
    const productId = parseInt(id);

      if (isNaN(productId)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
      }

      // Using soft delete
      await productService.softDelete(productId);

      return NextResponse.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
  })(request);
};
