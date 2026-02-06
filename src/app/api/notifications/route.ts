import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notificationService";
import { requireAuth } from "@/lib/auth";

// Get user notifications
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all";

    const result = await notificationService.getUserNotifications(user.id, page, limit, type);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Failed to retrieve notifications" }, { status: 500 });
  }
});

// Create new notification (admin only)
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { user_id, title, message, type, order_id } = await request.json();

    // Validate required fields
    if (!user_id || !title || !message || !type) {
      return NextResponse.json({ error: "User ID, title, message, and type are required" }, { status: 400 });
    }

    const notification = await notificationService.create({
      user_id,
      title,
      message,
      type,
      order_id,
    });

    return NextResponse.json(
      {
        message: "Notification created successfully",
        notification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
});
