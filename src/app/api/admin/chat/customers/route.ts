import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Get list of customers for admin chat
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Get customers with recent chat activity, ordered by last message time
    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
...(search && {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        company_name: true,
        status: true,
        created_at: true,
        last_login_at: true,
        // Get latest chat message between admin and customer
        receivedChats: {
          where: {
            OR: [
              { sender: { role: "CUSTOMER" }, receiver_id: user.id },
              { sender_id: user.id, receiver: { role: "CUSTOMER" } },
            ],
          },
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            message: true,
            created_at: true,
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Transform data for frontend and sort by last message time
    const transformedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const lastMessage = customer.receivedChats[0];

        // Count unread messages
        const unreadCount = await prisma.chat.count({
          where: {
            sender_id: customer.id,
            receiver_id: user.id,
            read: false,
          },
        });

        // Determine online status based on last login (last 5 minutes)
        const isOnline = customer.last_login_at ? new Date().getTime() - new Date(customer.last_login_at).getTime() < 5 * 60 * 1000 : false;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          company: customer.company_name || "-",
          status: customer.status, // This is already dynamic from the database
          lastMessage: lastMessage?.message || "Belum ada pesan",
          lastMessageTime: lastMessage?.created_at || customer.created_at,
          unread: unreadCount,
          online: isOnline, // This is now dynamic
        };
      })
    );

    // Sort customers by last message time (most recent first)
    const sortedCustomers = transformedCustomers.sort((a, b) => {
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    return NextResponse.json(sortedCustomers);
  } catch (error) {
    console.error("Get chat customers error:", error);
    return NextResponse.json({ error: "Failed to retrieve customers" }, { status: 500 });
  }
});
