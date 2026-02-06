import React, { useState, useEffect } from "react";
import Head from "next/head";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { useAuth } from "../../hooks/useAuth";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  order?: {
    id: number;
    order_number: string;
  };
}

export default function CustomerNotifications() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("type", filter);

      const response = await fetch(`/api/notifications?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to mock data if API fails
      setNotifications([
        { id: 1, title: "Pembayaran Dikonfirmasi", message: "Pembayaran untuk iklan Sudirman CBD telah diverifikasi oleh admin.", type: "ORDER_STATUS", read: false, created_at: new Date().toISOString() },
        { id: 2, title: "Promo Akhir Tahun", message: "Dapatkan potongan 10% untuk sewa di atas 6 bulan selama Desember.", type: "PROMOTION", read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, title: "Akun Diupdate", message: "Password akun Anda berhasil diubah.", type: "SYSTEM_ALERT", read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications/unread", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)));
        await fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
        setUnreadCount(0);
        await showSuccessAlert("Berhasil", "Semua notifikasi telah ditandai sebagai sudah dibaca");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      await showErrorAlert("Error", "Gagal menandai semua notifikasi sebagai sudah dibaca");
    }
  };

  const getTimeDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m lalu`;
    } else if (diffHours < 24) {
      return `${diffHours}j lalu`;
    } else if (diffDays === 1) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
  };

  const filteredNotifs = filter === "all" ? notifications : notifications.filter((n) => n.type.toLowerCase().includes(filter));

  if (authLoading) {
    return (
      <CustomerLayout activePage="notifications" title="Notifikasi Saya">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout activePage="notifications" title="Notifikasi Saya">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Notifikasi - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="notifications" title="Notifikasi Saya">
        <main className="flex-1 flex flex-col bg-background-dark text-white p-6 md:p-8 min-h-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-6 pb-20">
            {/* Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">Notifikasi</h1>
                <p className="text-gray-400 text-sm">Tetap update dengan status pesanan dan penawaran terbaru kami.</p>
                {unreadCount > 0 && <p className="text-primary text-xs font-bold mt-2">{unreadCount} notifikasi belum dibaca</p>}
              </div>
              <div className="flex bg-[#1a2633] p-1 rounded-lg border border-[#324d67] self-start md:self-auto">
                {["all", "order_status", "promotion", "system_alert"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                  >
                    {f === "all" ? "Semua" : f === "order_status" ? "Pesanan" : f === "promotion" ? "Promo" : "Sistem"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <div className="flex justify-end">
                <button onClick={markAllAsRead} className="px-4 py-2 bg-[#1a2633] border border-[#324d67] hover:bg-[#233648] hover:text-white text-gray-400 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider">
                  Tandai Semua Dibaca
                </button>
              </div>
            )}

            {/* Notif List */}
            <div className="space-y-4 pt-2">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredNotifs.length > 0 ? (
                filteredNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                    className={`group relative flex gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                      notif.read ? "bg-[#111a22] border-[#324d67] opacity-60 hover:opacity-100" : "bg-[#1a2633] border-primary/30 hover:border-primary/50 shadow-sm"
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute top-4 right-4 animate-pulse">
                        <span className="size-2 bg-primary rounded-full block"></span>
                      </div>
                    )}

                    <div className={`size-10 md:size-12 rounded-lg flex items-center justify-center shrink-0 ${getColor(notif.type)} shadow-sm`}>
                      <span className="material-symbols-outlined text-[20px] md:text-[24px]">{getIcon(notif.type)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-sm md:text-base truncate tracking-tight transition-colors ${notif.read ? "text-gray-300" : "text-white"}`}>{notif.title}</h3>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-4 mt-1">{getTimeDisplay(notif.created_at)}</span>
                      </div>
                      <p className={`text-sm leading-relaxed max-w-2xl ${notif.read ? "text-gray-500" : "text-gray-400"}`}>{notif.message}</p>
                      {notif.order && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold text-gray-500 bg-[#111a22] px-2 py-1 rounded border border-[#324d67]">Order #{notif.order.order_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <span className="material-symbols-outlined text-4xl mb-3 opacity-50">notifications</span>
                  <h3 className="text-white text-base font-bold mb-1">Tidak ada notifikasi</h3>
                  <p className="text-xs text-center">{filter === "all" ? "Anda tidak memiliki notifikasi saat ini" : `Tidak ada notifikasi dengan filter "${filter}"`}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </CustomerLayout>
    </>
  );
}

const getColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "order_status":
      return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    case "promotion":
      return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
    case "payment_status":
      return "bg-green-500/10 text-green-500 border border-green-500/20";
    case "system_alert":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
  }
};

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "order_status":
      return "shopping_bag";
    case "promotion":
      return "celebration";
    case "payment_status":
      return "payments";
    case "system_alert":
      return "warning";
    default:
      return "notifications";
  }
};
