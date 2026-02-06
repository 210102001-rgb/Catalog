import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notificationService";
import { requireAuth } from "@/lib/auth";

// Get unread notification count
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const count = await notificationService.getUnreadCount(user.id);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Get unread count error:", error);
    return NextResponse.json({ error: "Failed to retrieve unread count" }, { status: 500 });
  }
});
