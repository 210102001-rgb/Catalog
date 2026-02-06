import { prisma } from "./src/lib/db";

async function createTestMessages() {
  try {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const customer = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });

    if (admin && customer) {
      await prisma.chat.create({
        data: {
          sender_id: admin.id,
          receiver_id: customer.id,
          message: "Hello, how can I help you today?",
          type: "TEXT",
          read: false,
        },
      });
      await prisma.chat.create({
        data: {
          sender_id: customer.id,
          receiver_id: admin.id,
          message: "I'm interested in the Premium City Center Billboard. Can you provide more details?",
          type: "TEXT",
          read: false,
        },
      });
      console.log("Test messages created");
    } else {
      console.log("Admin or customer user not found");
    }
  } catch (error) {
    console.error("Error creating test messages:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMessages();
