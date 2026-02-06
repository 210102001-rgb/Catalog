import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Get chat messages for customer
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const adminId = parseInt(searchParams.get("adminId") || "1"); // Default to admin ID 1
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Verify admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId, role: "ADMIN" },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.chat.findMany({
        where: {
          OR: [
            { sender_id: user.id, receiver_id: adminId },
            { sender_id: adminId, receiver_id: user.id },
          ],
        },
        orderBy: { created_at: "asc" },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.chat.count({
        where: {
          OR: [
            { sender_id: user.id, receiver_id: adminId },
            { sender_id: adminId, receiver_id: user.id },
          ],
        },
      }),
    ]);

    // Transform for frontend
    const transformedMessages = messages.map((message) => ({
      id: message.id,
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      message: message.message,
      created_at: message.created_at,
      read: message.read,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        role: message.sender.role,
      },
      receiver: {
        id: message.receiver.id,
        name: message.receiver.name,
        role: message.receiver.role,
      },
    }));

    return NextResponse.json({
      messages: transformedMessages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get customer chat error:", error);
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
});
