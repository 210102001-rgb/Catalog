import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password || "admin123", 10);

    // Create a test user (admin or customer)
    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name: name || (role === "ADMIN" ? "Admin User" : "Test Customer"),
        email: email || (role === "ADMIN" ? "admin@example.com" : "test@example.com"),
        password_hash: passwordHash,
        role: role || "ADMIN",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
