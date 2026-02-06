import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notificationService } from "@/services/notificationService";
import { requireAuth } from "@/lib/auth";

// Map frontend filter values to Prisma enum values
const mapFilterToEnum = (filter: string): string | undefined => {
  const filterMap: Record<string, string> = {
    order_status: "ORDER_STATUS",
    payment_status: "PAYMENT_STATUS",
    product_update: "PRODUCT_UPDATE",
    promotion: "PROMOTION",
    chat_message: "CHAT_MESSAGE",
    system_alert: "SYSTEM_ALERT",
    review_reply: "REVIEW_REPLY",
  };

  return filterMap[filter];
};

// Get all notifications (admin only)
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
          },
        },
      ];
    }

    if (type && type !== "all") {
      const enumType = mapFilterToEnum(type);
      if (enumType) {
        where.type = enumType;
      }
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              order_number: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return NextResponse.json({
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    return NextResponse.json({ error: "Failed to retrieve notifications" }, { status: 500 });
  }
});

// Create system-wide notification (admin only)
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, message, type } = await request.json();

    // Validate required fields
    if (!title || !message || !type) {
      return NextResponse.json({ error: "Title, message, and type are required" }, { status: 400 });
    }

    // Map frontend type to Prisma enum
    const enumType = mapFilterToEnum(type) || "SYSTEM_ALERT";

    // Create system notification for all active users
    const result = await notificationService.createSystemNotification(title, message, enumType);

    return NextResponse.json(
      {
        message: "System notification created successfully",
        notificationsCreated: result.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create system notification error:", error);
    return NextResponse.json({ error: "Failed to create system notification" }, { status: 500 });
  }
});
