import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Get chat messages between admin and customer
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    // Extract customerId from URL params
    const url = new URL(request.url);
    const customerId = parseInt(url.pathname.split("/").pop() || "");

    console.log("API called for customerId:", customerId, "by user:", user.id);

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }

    // Mark messages from customer to admin as read
    await prisma.chat.updateMany({
      where: {
        sender_id: customerId,
        receiver_id: user.id,
        read: false,
      },
      data: {
        read: true,
        read_at: new Date(),
      },
    });

    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          { sender_id: user.id, receiver_id: customerId },
          { sender_id: customerId, receiver_id: user.id },
        ],
      },
      orderBy: { created_at: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    console.log("Found messages:", messages.length);

    // Transform messages to frontend format
    const transformedMessages = messages.map((msg) => ({
      id: msg.id,
      text: msg.message,
      time: new Date(msg.created_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: msg.sender_id === user.id,
      sender: msg.sender.name,
      receiver: msg.receiver.name,
      read: msg.read, // Add read status
    }));

    console.log("Returning transformed messages:", transformedMessages.length);
    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error("Get chat messages error:", error);
    return NextResponse.json({ error: "Failed to retrieve chat messages" }, { status: 500 });
  }
});

// Send message from admin to customer
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    // Extract customerId from URL params
    const url = new URL(request.url);
    const customerId = parseInt(url.pathname.split("/").pop() || "");

    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const newMessage = await prisma.chat.create({
      data: {
        sender_id: user.id,
        receiver_id: customerId,
        message,
        type: "TEXT",
        read: false, // Admin messages are not read by admin
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Transform the new message to frontend format
    const transformedMessage = {
      id: newMessage.id,
      text: newMessage.message,
      time: new Date(newMessage.created_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: newMessage.sender_id === user.id,
      sender: newMessage.sender.name,
      receiver: newMessage.receiver.name,
      read: newMessage.read, // Add read status
    };

    return NextResponse.json(transformedMessage, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
});
