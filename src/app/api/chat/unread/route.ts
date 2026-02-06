import { NextRequest, NextResponse } from "next/server";
import { chatService } from "@/services/chatService";
import { requireAuth } from "@/lib/auth";

// Get unread messages for the authenticated user
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const unreadMessages = await chatService.getUnreadMessages(user.id);

    return NextResponse.json({
      messages: unreadMessages,
      count: unreadMessages.length,
    });
  } catch (error) {
    console.error("Get unread messages error:", error);
    return NextResponse.json({ error: "Failed to retrieve unread messages" }, { status: 500 });
  }
});
