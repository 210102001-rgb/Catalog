import { prisma } from "@/lib/db";

interface CreateChatInput {
  sender_id: number;
  receiver_id: number;
  message: string;
  type?: string; // Using string to accept any message type
}

interface UpdateChatInput {
  message?: string;
  read?: boolean;
}

export const chatService = {
  // Get chat by ID
  getById: async (id: number) => {
    return await prisma.chat.findUnique({
      where: { id },
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
  },

  // Create new chat
  create: async (input: CreateChatInput) => {
    return await prisma.chat.create({
      data: {
        sender_id: input.sender_id,
        receiver_id: input.receiver_id,
        message: input.message,
        type: (input.type || "TEXT") as any,
      },
    });
  },

  // Update chat (mark as read)
  update: async (id: number, input: UpdateChatInput) => {
    return await prisma.chat.update({
      where: { id },
      data: {
        message: input.message,
        read: input.read,
        read_at: input.read ? new Date() : undefined,
      },
    });
  },

  // Mark chat as read
  markAsRead: async (id: number) => {
    return await prisma.chat.update({
      where: { id },
      data: {
        read: true,
        read_at: new Date(),
      },
    });
  },

  // Get chats between two users
  getChatsBetweenUsers: async (userId1: number, userId2: number, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where: {
          OR: [
            { sender_id: userId1, receiver_id: userId2 },
            { sender_id: userId2, receiver_id: userId1 },
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
      }),
      prisma.chat.count({
        where: {
          OR: [
            { sender_id: userId1, receiver_id: userId2 },
            { sender_id: userId2, receiver_id: userId1 },
          ],
        },
      }),
    ]);

    return {
      chats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get user's unread messages
  getUnreadMessages: async (userId: number) => {
    return await prisma.chat.findMany({
      where: {
        receiver_id: userId,
        read: false,
      },
      orderBy: { created_at: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  // Get recent chats for a user
  getRecentChats: async (userId: number, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    // Get recent chats where user is either sender or receiver
    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where: {
          OR: [{ sender_id: userId }, { receiver_id: userId }],
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.chat.count({
        where: {
          OR: [{ sender_id: userId }, { receiver_id: userId }],
        },
      }),
    ]);

    return {
      chats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
