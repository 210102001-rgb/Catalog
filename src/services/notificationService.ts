import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

interface CreateNotificationInput {
  user_id: number;
  title: string;
  message: string;
  type: string;
  order_id?: number;
  data?: any;
}

interface UpdateNotificationInput {
  read?: boolean;
}

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

export const notificationService = {
  // Get notification by ID
  getById: async (id: number) => {
    return await prisma.notification.findUnique({
      where: { id },
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
    });
  },

  // Get notifications for a user
  getUserNotifications: async (userId: number, page: number = 1, limit: number = 20, type?: string) => {
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (type && type !== "all") {
      const enumType = mapFilterToEnum(type);
      if (enumType) {
        where.type = enumType;
      }
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
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

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get unread notification count for a user
  getUnreadCount: async (userId: number) => {
    return await prisma.notification.count({
      where: {
        user_id: userId,
        read: false,
      },
    });
  },

  // Create new notification
  create: async (input: CreateNotificationInput) => {
    return await prisma.notification.create({
      data: {
        user_id: input.user_id,
        order_id: input.order_id,
        title: input.title,
        message: input.message,
        type: input.type as any,
        data: input.data,
      },
    });
  },

  // Create bulk notifications (e.g., for promotions)
  createBulk: async (inputs: CreateNotificationInput[]) => {
    return await prisma.notification.createMany({
      data: inputs.map((input) => ({
        user_id: input.user_id,
        order_id: input.order_id,
        title: input.title,
        message: input.message,
        type: input.type as any,
        data: input.data,
      })),
    });
  },

  // Update notification (mark as read)
  update: async (id: number, input: UpdateNotificationInput) => {
    return await prisma.notification.update({
      where: { id },
      data: {
        read: input.read,
        read_at: input.read ? new Date() : undefined,
      },
    });
  },

  // Mark notification as read
  markAsRead: async (id: number) => {
    return await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        read_at: new Date(),
      },
    });
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId: number) => {
    return await prisma.notification.updateMany({
      where: {
        user_id: userId,
        read: false,
      },
      data: {
        read: true,
        read_at: new Date(),
      },
    });
  },

  // Delete notification
  delete: async (id: number) => {
    return await prisma.notification.delete({
      where: { id },
    });
  },

  // Get notification types statistics for admin
  getNotificationStats: async () => {
    const stats = await prisma.notification.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    });

    // Calculate read rates separately
    const readStats = await prisma.notification.groupBy({
      by: ["type"],
      where: { read: true },
      _count: {
        id: true,
      },
    });

    return stats.map((stat) => {
      const readCount = readStats.find((r) => r.type === stat.type)?._count.id || 0;
      const totalCount = stat._count.id || 0;
      const readRate = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

      return {
        type: stat.type,
        count: totalCount,
        readRate,
      };
    });
  },

  // Create system notification for all users
  createSystemNotification: async (title: string, message: string, type: string = "SYSTEM_ALERT") => {
    const users = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true },
    });

    const notifications = users.map((user) => ({
      user_id: user.id,
      title,
      message,
      type: type as any,
    }));

    const result = await prisma.notification.createMany({
      data: notifications,
    });

    return result;
  },

  // Create order-related notification
  createOrderNotification: async (userId: number, orderId: number, title: string, message: string, type: string = "ORDER_STATUS") => {
    return await prisma.notification.create({
      data: {
        user_id: userId,
        order_id: orderId,
        title,
        message,
        type: type as any,
      },
    });
  },
};
