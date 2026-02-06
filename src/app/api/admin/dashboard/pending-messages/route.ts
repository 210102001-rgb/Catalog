import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  return `${diffDays} hari lalu`;
}

export const GET = requireAdmin(async (req: NextRequest, user: any) => {
  try {
    // Get unread messages where admin is the receiver
    // Since we don't have a clear role distinction in Chat model for "Admin Receiver", 
    // we might need to assume a specific logic or fetch all unread messages that are NOT from the current user.
    // However, usually "Pending Chats" refers to chats initiated by customers that haven't been replied to by admins.
    
    // For now, let's fetch unread messages sent by any user with role 'CUSTOMER'
    // This requires joining with User model, which is simpler if we just filtering by 'read: false'
    // and assume the current admin user is the intended recipient.
    
    const pendingMessages = await prisma.chat.findMany({
      where: {
        read: false,
        receiver_id: user.id, // Ensure the admin is the receiver
      },
      orderBy: { created_at: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true, // Check role
          },
        },
      },
      take: 5,
    });

    // Transform the data to match the expected format
    const transformedMessages = pendingMessages.map((message) => ({
      id: message.id,
      sender: { name: message.sender.name },
      lastMessage: message.message,
      timeAgo: formatTimeAgo(message.created_at),
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error("Error fetching pending messages:", error);
    return NextResponse.json({ error: "Failed to fetch pending messages" }, { status: 500 });
  }
});
