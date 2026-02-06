import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { notificationTrigger } from "@/services/notificationTrigger";

// Test notification triggers
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { action, userId, message } = await request.json();

    switch (action) {
      case "test_order_created":
        await notificationTrigger.orderCreated(1, userId || 2, "ORD-TEST-001");
        break;
      case "test_order_confirmed":
        await notificationTrigger.orderStatusChanged(1, userId || 2, "ORD-TEST-001", "CONFIRMED", "PENDING");
        break;
      case "test_payment_paid":
        await notificationTrigger.paymentStatusChanged(1, userId || 2, "ORD-TEST-001", "PAID");
        break;
      case "test_chat_message":
        await notificationTrigger.adminChatMessage(userId || 2, "Admin Support", message || "Test message from admin");
        break;
      case "test_promotion":
        await notificationTrigger.sendPromotion("Promo Spesial!", "Dapatkan diskon 50% untuk pemesanan pertama!");
        break;
      case "test_welcome":
        await notificationTrigger.welcomeNewCustomer(userId || 2, "Test Customer");
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ message: "Test notification sent successfully" });
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json({ error: "Failed to send test notification" }, { status: 500 });
  }
});
