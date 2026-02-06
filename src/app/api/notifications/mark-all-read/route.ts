import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notificationService";
import { requireAuth } from "@/lib/auth";

// Mark all notifications as read
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    await notificationService.markAllAsRead(user.id);

    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }
});
