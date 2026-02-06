import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

interface CreateOrderInput {
  user_id: number;
  admin_id?: number;
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  final_amount: number;
  currency?: string;
  payment_method?: any;
  start_date: Date;
  end_date: Date;
  notes?: string;
  shipping_address?: string;
  billing_address?: string;
  status?: any;
}

export interface UpdateOrderInput {
  total_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  currency?: string;
  status?: any;
  payment_method?: any;
  payment_status?: any;
  payment_date?: Date;
  start_date?: Date;
  end_date?: Date;
  notes?: string;
  shipping_address?: string;
  billing_address?: string;
}

export const orderService = {
  // Get order by ID
  getById: async (id: number) => {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        admin: true,
        order_items: {
          include: {
            product: true,
          },
        },
        payments: true,
        order_notifications: true,
      },
    });
  },

  // Get order by UUID
  getByUuid: async (uuid: string) => {
    return await prisma.order.findUnique({
      where: { uuid },
      include: {
        user: true,
        admin: true,
        order_items: {
          include: {
            product: true,
          },
        },
        payments: true,
        order_notifications: true,
      },
    });
  },

  // Get order by order number
  getByOrderNumber: async (orderNumber: string) => {
    return await prisma.order.findUnique({
      where: { order_number: orderNumber },
      include: {
        user: true,
        admin: true,
        order_items: {
          include: {
            product: true,
          },
        },
        payments: true,
        order_notifications: true,
      },
    });
  },

  // Create new order
  create: async (input: CreateOrderInput) => {
    // Generate a unique order number
    const timestamp = Date.now().toString();
    const orderNumber = `ORD-${timestamp}`;

    return await prisma.order.create({
      data: {
        uuid: uuidv4(),
        order_number: orderNumber,
        user_id: input.user_id,
        admin_id: input.admin_id,
        total_amount: input.total_amount,
        tax_amount: input.tax_amount || 0,
        discount_amount: input.discount_amount || 0,
        final_amount: input.final_amount,
        currency: input.currency || "IDR",
        status: "PENDING" as any,
        payment_method: input.payment_method as any,
        payment_status: (input.payment_method ? "PENDING" : "PENDING") as any,
        start_date: input.start_date,
        end_date: input.end_date,
        notes: input.notes,
        shipping_address: input.shipping_address,
        billing_address: input.billing_address,
      },
    });
  },

  // Update order
  update: async (id: number, input: UpdateOrderInput) => {
    return await prisma.order.update({
      where: { id },
      data: {
        total_amount: input.total_amount,
        tax_amount: input.tax_amount,
        discount_amount: input.discount_amount,
        final_amount: input.final_amount,
        currency: input.currency,
        status: input.status as any,
        payment_method: input.payment_method as any,
        payment_status: input.payment_status as any,
        payment_date: input.payment_date,
        start_date: input.start_date,
        end_date: input.end_date,
        notes: input.notes,
        shipping_address: input.shipping_address,
        billing_address: input.billing_address,
      },
    });
  },

  // Update order status
  updateStatus: async (id: number, status: string) => {
    return await prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  },

  // Update payment status
  updatePaymentStatus: async (id: number, paymentStatus: string) => {
    return await prisma.order.update({
      where: { id },
      data: { payment_status: paymentStatus as any },
    });
  },

  // Delete order (soft delete)
  softDelete: async (id: number) => {
    return await prisma.order.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },

  // Get all orders with pagination
  getAll: async (page: number = 1, limit: number = 10, filters: any = {}) => {
    const skip = (page - 1) * limit;

    const whereClause: any = { deleted_at: null };

    if (filters.userId) {
      whereClause.user_id = filters.userId;
    }

    if (filters.adminId) {
      whereClause.admin_id = filters.adminId;
    }

    if (filters.status) {
      whereClause.status = filters.status as any;
    }

    if (filters.paymentStatus) {
      whereClause.payment_status = filters.paymentStatus as any;
    }

    if (filters.startDate && filters.endDate) {
      whereClause.start_date = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
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
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get orders by user
  getByUser: async (userId: number, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
      }),
      prisma.order.count({
        where: {
          user_id: userId,
          deleted_at: null,
        },
      }),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
