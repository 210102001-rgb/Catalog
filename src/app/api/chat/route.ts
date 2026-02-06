import { NextRequest, NextResponse } from "next/server";
import { chatService } from "@/services/chatService";
import { requireAuth } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";
import { prisma } from "@/lib/db";

// Send a new message
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { receiver_id, message, type } = await request.json();

    // Validate required fields
    if (!receiver_id || !message) {
      return NextResponse.json({ error: "Receiver ID and message are required" }, { status: 400 });
    }

    // Check that user is not trying to send message to themselves
    if (user.id === receiver_id) {
      return NextResponse.json({ error: "Cannot send message to yourself" }, { status: 400 });
    }

    // Create chat message
    const chat = await chatService.create({
      sender_id: user.id,
      receiver_id,
      message,
      type,
    });

    // Trigger notification for the receiver
    if (user.role === "ADMIN") {
      // Admin sending to customer
      await notificationTrigger.adminChatMessage(receiver_id, user.name, message);
    } else {
      // Customer sending to admin
      // Get admin user ID (you might want to get the specific admin handling this customer)
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true },
      });

      if (admin) {
        await notificationTrigger.customerChatMessage(admin.id, user.name, message);
      }
    }

    return NextResponse.json(
      {
        message: "Message sent successfully",
        chat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
});
