import { notificationService } from "./notificationService";

export const notificationTrigger = {
  // Trigger notification when order is created
  orderCreated: async (orderId: number, customerId: number, orderNumber: string) => {
    try {
      await notificationService.createOrderNotification(customerId, orderId, "Pesanan Baru Dibuat", `Pesanan ${orderNumber} telah berhasil dibuat. Tim kami akan segera memproses pesanan Anda.`, "ORDER_STATUS");
    } catch (error) {
      console.error("Failed to send order created notification:", error);
    }
  },

  // Trigger notification when order status changes
  orderStatusChanged: async (orderId: number, customerId: number, orderNumber: string, newStatus: string, oldStatus: string) => {
    try {
      let title = "";
      let message = "";

      switch (newStatus) {
        case "CONFIRMED":
          title = "Pesanan Dikonfirmasi";
          message = `Pesanan ${orderNumber} telah dikonfirmasi. Pembayaran Anda sedang diverifikasi.`;
          break;
        case "IN_PROGRESS":
          title = "Pesanan Diproses";
          message = `Pesanan ${orderNumber} sedang dalam proses pengerjaan.`;
          break;
        case "SHIPPED":
          title = "Pesanan Dikirim";
          message = `Pesanan ${orderNumber} telah dikirim dan sedang dalam perjalanan.`;
          break;
        case "DELIVERED":
          title = "Pesanan Selesai";
          message = `Pesanan ${orderNumber} telah selesai. Terima kasih telah menggunakan layanan kami!`;
          break;
        case "CANCELLED":
          title = "Pesanan Dibatalkan";
          message = `Pesanan ${orderNumber} telah dibatalkan. Jika ada pertanyaan, silakan hubungi support.`;
          break;
        case "COMPLETED":
          title = "Pesanan Selesai";
          message = `Pesanan ${orderNumber} telah selesai sepenuhnya. Terima kasih atas kepercayaan Anda!`;
          break;
        default:
          return; // Don't send notification for other status changes
      }

      await notificationService.createOrderNotification(customerId, orderId, title, message, "ORDER_STATUS");
    } catch (error) {
      console.error("Failed to send order status change notification:", error);
    }
  },

  // Trigger notification when payment status changes
  paymentStatusChanged: async (orderId: number, customerId: number, orderNumber: string, paymentStatus: string) => {
    try {
      let title = "";
      let message = "";

      switch (paymentStatus) {
        case "PAID":
          title = "Pembayaran Berhasil";
          message = `Pembayaran untuk pesanan ${orderNumber} telah berhasil diverifikasi.`;
          break;
        case "FAILED":
          title = "Pembayaran Gagal";
          message = `Pembayaran untuk pesanan ${orderNumber} gagal. Silakan coba kembali atau hubungi support.`;
          break;
        case "REFUNDED":
          title = "Pembayaran Dikembalikan";
          message = `Pembayaran untuk pesanan ${orderNumber} telah dikembalikan ke rekening Anda.`;
          break;
        default:
          return;
      }

      await notificationService.createOrderNotification(customerId, orderId, title, message, "PAYMENT_STATUS");
    } catch (error) {
      console.error("Failed to send payment status change notification:", error);
    }
  },

  // Trigger notification when admin sends chat message
  adminChatMessage: async (customerId: number, adminName: string, messagePreview: string) => {
    try {
      await notificationService.create({
        user_id: customerId,
        title: `Pesan Baru dari ${adminName}`,
        message: messagePreview.length > 50 ? messagePreview.substring(0, 50) + "..." : messagePreview,
        type: "CHAT_MESSAGE",
      });
    } catch (error) {
      console.error("Failed to send admin chat notification:", error);
    }
  },

  // Trigger notification when customer sends chat message to admin
  customerChatMessage: async (adminId: number, customerName: string, messagePreview: string) => {
    try {
      await notificationService.create({
        user_id: adminId,
        title: `Pesan Baru dari ${customerName}`,
        message: messagePreview.length > 50 ? messagePreview.substring(0, 50) + "..." : messagePreview,
        type: "CHAT_MESSAGE",
      });
    } catch (error) {
      console.error("Failed to send customer chat notification:", error);
    }
  },

  // Trigger notification when product is approved/rejected
  productStatusChanged: async (creatorId: number, productName: string, newStatus: string) => {
    try {
      let title = "";
      let message = "";

      switch (newStatus) {
        case "APPROVED":
          title = "Produk Disetujui";
          message = `Produk "${productName}" telah disetujui dan sekarang tersedia untuk pelanggan.`;
          break;
        case "REJECTED":
          title = "Produk Ditolak";
          message = `Produk "${productName}" tidak memenuhi syarat dan telah ditolak. Silakan periksa kembali.`;
          break;
        default:
          return;
      }

      await notificationService.create({
        user_id: creatorId,
        title,
        message,
        type: "PRODUCT_UPDATE",
      });
    } catch (error) {
      console.error("Failed to send product status change notification:", error);
    }
  },

  // Trigger system alert notification
  systemAlert: async (userId: number, title: string, message: string) => {
    try {
      await notificationService.create({
        user_id: userId,
        title,
        message,
        type: "SYSTEM_ALERT",
      });
    } catch (error) {
      console.error("Failed to send system alert:", error);
    }
  },

  // Trigger promotion notification to all users
  sendPromotion: async (title: string, message: string) => {
    try {
      await notificationService.createSystemNotification(title, message, "PROMOTION");
    } catch (error) {
      console.error("Failed to send promotion notification:", error);
    }
  },

  // Trigger welcome notification for new customers
  welcomeNewCustomer: async (customerId: number, customerName: string) => {
    try {
      await notificationService.create({
        user_id: customerId,
        title: "Selamat Datang di ReklameKu!",
        message: `Halo ${customerName}, selamat datang! Nikmati pengalaman beriklan terbaik dengan platform kami.`,
        type: "SYSTEM_ALERT",
      });
    } catch (error) {
      console.error("Failed to send welcome notification:", error);
    }
  },

  // Trigger reminder notification
  sendReminder: async (userId: number, title: string, message: string, reminderType: string = "SYSTEM_ALERT") => {
    try {
      await notificationService.create({
        user_id: userId,
        title,
        message,
        type: reminderType,
      });
    } catch (error) {
      console.error("Failed to send reminder notification:", error);
    }
  },
};
