import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    // Create a test customer
    const customer = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name: name || "Test Customer",
        email: email || "test@example.com",
        password_hash: "test123", // This will be changed on first login
        role: "CUSTOMER",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });

    res.status(201).json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
}
