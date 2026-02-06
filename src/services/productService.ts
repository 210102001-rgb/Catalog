import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  category_id?: number;
  subcategory_id?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  size_width?: number;
  size_height?: number;
  illumination?: boolean;
  visibility?: string; // Using string to accept any visibility value
  price_daily: number;
  price_weekly?: number;
  price_monthly?: number;
  price_yearly?: number;
  stock_quantity?: number;
  images?: string[];
  specifications?: any;
  featured?: boolean;
  published?: boolean;
  created_by: number;
}

interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  category_id?: number;
  subcategory_id?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  size_width?: number;
  size_height?: number;
  illumination?: boolean;
  visibility?: string; // Using string to accept any visibility value
  price_daily?: number;
  price_weekly?: number;
  price_monthly?: number;
  price_yearly?: number;
  availability_status?: string; // Using string to accept any status value
  stock_quantity?: number;
  images?: string[];
  specifications?: any;
  featured?: boolean;
  published?: boolean;
  status?: string; // Using string to accept any status value
}

export const productService = {
  // Get product by ID
  getById: async (id: number) => {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        creator: true,
        category: true,
        subcategory: true,
        reviews: true,
      },
    });
  },

  // Get product by UUID
  getByUuid: async (uuid: string) => {
    return await prisma.product.findUnique({
      where: { uuid },
      include: {
        creator: true,
        category: true,
        subcategory: true,
        reviews: true,
      },
    });
  },

  // Get product by slug
  getBySlug: async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        creator: true,
        category: true,
        subcategory: true,
        reviews: true,
      },
    });
  },

  // Create new product
  create: async (input: CreateProductInput) => {
    return await prisma.product.create({
      data: {
        uuid: uuidv4(),
        name: input.name,
        slug: input.slug,
        description: input.description,
        category_id: input.category_id,
        subcategory_id: input.subcategory_id,
        location: input.location,
        latitude: input.latitude,
        longitude: input.longitude,
        size_width: input.size_width,
        size_height: input.size_height,
        illumination: input.illumination,
        visibility: (input.visibility || "DAYTIME") as any,
        price_daily: input.price_daily,
        price_weekly: input.price_weekly || 0,
        price_monthly: input.price_monthly || 0,
        price_yearly: input.price_yearly || 0,
        stock_quantity: input.stock_quantity || 1,
        images: input.images || [],
        specifications: input.specifications,
        featured: input.featured || false,
        published: input.published || false,
        created_by: input.created_by,
        status: "DRAFT" as any,
      },
    });
  },

  // Update product
  update: async (id: number, input: UpdateProductInput) => {
    return await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        category_id: input.category_id,
        subcategory_id: input.subcategory_id,
        location: input.location,
        latitude: input.latitude,
        longitude: input.longitude,
        size_width: input.size_width,
        size_height: input.size_height,
        illumination: input.illumination,
        visibility: input.visibility as any,
        price_daily: input.price_daily,
        price_weekly: input.price_weekly || 0,
        price_monthly: input.price_monthly || 0,
        price_yearly: input.price_yearly || 0,
        availability_status: input.availability_status as any,
        stock_quantity: input.stock_quantity,
        images: input.images,
        specifications: input.specifications,
        featured: input.featured,
        published: input.published,
        status: input.status as any,
      },
    });
  },

  // Approve product
  approve: async (id: number, approvedById: number) => {
    return await prisma.product.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        approved_by: approvedById,
        approved_at: new Date(),
      },
    });
  },

  // Reject product
  reject: async (id: number, reason?: string) => {
    return await prisma.product.update({
      where: { id },
      data: {
        status: "REJECTED" as any,
      },
    });
  },

  // Delete product (soft delete)
  softDelete: async (id: number) => {
    return await prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },

  // Hard delete product
  hardDelete: async (id: number) => {
    return await prisma.product.delete({
      where: { id },
    });
  },

  // Get all products with pagination, filtering, and sorting
  getAll: async (page: number = 1, limit: number = 10, filters: any = {}, orderBy: any = { created_at: "desc" }) => {
    const skip = (page - 1) * limit;

    const whereClause: any = { deleted_at: null };

    // Apply filters
    if (filters.published !== undefined) {
      whereClause.published = filters.published;
    }

    if (filters.category_id) {
      whereClause.category_id = filters.category_id;
    }

    if (filters.subcategory_id) {
      whereClause.subcategory_id = filters.subcategory_id;
    }

    if (filters.status) {
      whereClause.status = filters.status as any;
    }

    if (filters.type) {
      // Assuming type filter maps to visibility field
      whereClause.visibility = filters.type as any;
    }

    if (filters.search) {
      whereClause.OR = [{ name: { contains: filters.search, mode: "insensitive" } }, { description: { contains: filters.search, mode: "insensitive" } }, { location: { contains: filters.search, mode: "insensitive" } }];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderBy,
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          category: true,
          subcategory: true,
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get products by user
  getByUser: async (userId: number, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          created_by: userId,
          deleted_at: null,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          category: true,
          subcategory: true,
        },
      }),
      prisma.product.count({
        where: {
          created_by: userId,
          deleted_at: null,
        },
      }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
