import { prisma } from "@/lib/db";
import { hashPassword } from "../lib/auth";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating UUIDs

// Define the enums locally since they might not be properly exported from Prisma client
type UserRole = "ADMIN" | "CUSTOMER";
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
type UserType = "INDIVIDUAL" | "COMPANY";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  user_type?: UserType;
  company_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  company_name?: string;
  status?: UserStatus;
}

export const userService = {
  // Get user by ID
  getById: async (id: number) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Get user by UUID
  getByUuid: async (uuid: string) => {
    return await prisma.user.findUnique({
      where: { uuid },
    });
  },

  // Get user by email
  getByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Create new user
  create: async (input: CreateUserInput) => {
    const hashedPassword = await hashPassword(input.password);

    return await prisma.user.create({
      data: {
        uuid: uuidv4(), // Using uuidv4 to generate UUID
        name: input.name,
        email: input.email,
        password_hash: hashedPassword,
        role: input.role || "CUSTOMER",
        user_type: input.user_type || "INDIVIDUAL",
        company_name: input.company_name,
        phone: input.phone,
        address: input.address,
        city: input.city,
        postal_code: input.postal_code,
        status: "PENDING_VERIFICATION",
      },
    });
  },

  // Update user
  update: async (id: number, input: UpdateUserInput) => {
    const updateData: any = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      postal_code: input.postal_code,
      company_name: input.company_name,
      status: input.status,
    };

    if (input.password) {
      updateData.password_hash = await hashPassword(input.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete user (soft delete)
  softDelete: async (id: number) => {
    return await prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },

  // Hard delete user
  hardDelete: async (id: number) => {
    return await prisma.user.delete({
      where: { id },
    });
  },

  // Get all users with pagination
  getAll: async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.user.count({ where: { deleted_at: null } }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get users by role
  getByRole: async (role: UserRole, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { role, deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.user.count({ where: { role, deleted_at: null } }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
