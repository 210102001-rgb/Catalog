import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notificationService";
import { requireAuth } from "@/lib/auth";

// Get specific notification
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const notificationId = parseInt(id);

      const notification = await notificationService.getById(notificationId);

      if (!notification) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      // Check if user owns this notification or is admin
      if (notification.user_id !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json(notification);
    } catch (error) {
      console.error("Get notification error:", error);
      return NextResponse.json({ error: "Failed to retrieve notification" }, { status: 500 });
    }
  })(request);
};

// Update notification (mark as read)
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const notificationId = parseInt(id);
      const { read } = await request.json();

      const notification = await notificationService.getById(notificationId);

      // Check if user owns this notification or is admin
      if (!notification || (notification.user_id !== user.id && user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const updatedNotification = await notificationService.update(notificationId, { read });

      return NextResponse.json({
        message: "Notification updated successfully",
        notification: updatedNotification,
      });
    } catch (error) {
      console.error("Update notification error:", error);
      return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
  })(request);
};

// Delete notification
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  return requireAuth(async (request: NextRequest, user: any) => {
    try {
      const { id } = await params;
      const notificationId = parseInt(id);

      const notification = await notificationService.getById(notificationId);

      // Check if user owns this notification or is admin
      if (!notification || (notification.user_id !== user.id && user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      await notificationService.delete(notificationId);

      return NextResponse.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Delete notification error:", error);
      return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
  })(request);
};