import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import DateRangeModal from "../../components/admin/modals/DateRangeModal";
import NotificationModal from "../../components/admin/modals/NotificationModal";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newOrders: 0,
    activeBillboards: 0,
    pendingChats: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);

  // Date state
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const handleApplyDate = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  useEffect(() => {
    if (user) {
      // Fetch dashboard stats
      const fetchDashboardData = async () => {
        try {
          const params = new URLSearchParams();
          if (dateRange.start && dateRange.end) {
            params.append("start_date", dateRange.start);
            params.append("end_date", dateRange.end);
          }
          const queryString = params.toString() ? `?${params.toString()}` : "";

          const statsResponse = await fetch(`/api/admin/dashboard/stats${queryString}`, {
            method: "GET",
            credentials: "include",
          });

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          }

          const ordersResponse = await fetch(`/api/admin/dashboard/recent-orders${queryString}`, {
            method: "GET",
            credentials: "include",
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setRecentOrders(ordersData);
          }

          // Messages usually don't need date filter as they are "current unhandled", but we can add if needed. 
          // Keeping it without filter for now as it's "Pending" state.
          const messagesResponse = await fetch("/api/admin/dashboard/pending-messages", {
            method: "GET",
            credentials: "include",
          });

          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setPendingMessages(messagesData);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchDashboardData();
    }
  }, [user, dateRange]);

  if (loading) {
    return (
      <AdminLayout activePage="dashboard">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="dashboard">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin - ReklameKu</title>
      </Head>
      <AdminLayout activePage="dashboard">
        <main className="flex-1 flex flex-col min-h-0 bg-background-dark overflow-hidden">
          <Header title="Dashboard Overview">
            <div className="flex items-center gap-3 w-full md:w-auto">
               {/* Actions */}
               <button onClick={() => setIsDateModalOpen(true)} className="px-4 py-2 bg-[#1a2633] border border-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  <span className="text-sm font-medium">{dateRange.start ? `${dateRange.start} - ${dateRange.end}` : "Bulan Ini"}</span>
                </button>
                <button onClick={() => setIsNotifModalOpen(true)} className="relative p-2 rounded-lg bg-[#1a2633] border border-gray-700 hover:bg-gray-800 text-white transition-all">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#1a2633]"></span>
                </button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="payments" title="Total Pendapatan" value={`Rp ${stats.totalRevenue.toLocaleString()}`} trend="+12%" />
              <StatCard icon="shopping_bag" title="Pesanan Baru" value={stats.newOrders.toString()} trend="+4" />
              <StatCard icon="ad_units" title="Papan Reklame Aktif" value={stats.activeBillboards.toString()} trend="98% Aktif" trendUp={true} trendColor="text-emerald-500" />
              <StatCard icon="forum" title="Chat Tertunda" value={stats.pendingChats.toString()} trend="Perlu Tindakan" trendUp={false} trendColor="text-orange-400" />
            </div>

            {/* Recent Orders & Messages */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="xl:col-span-2 card overflow-hidden flex flex-col">
                <div className="p-6 flex items-center justify-between border-b border-[#324d67] bg-[#1a2633]/50">
                  <h3 className="text-white text-lg font-bold">Pesanan Terbaru</h3>
                  <Link href="/admin/orders" className="text-primary text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-1">
                    Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2633] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#324d67]">
                        <th className="p-4 pl-6">ID Pesanan</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Lokasi</th>
                        <th className="p-4">Durasi</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#324d67] text-sm">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-[#2a3f55] transition-colors group">
                            <td className="p-4 pl-6 text-white font-medium">#{order.order_number}</td>
                            <td className="p-4 text-gray-300 group-hover:text-white flex items-center gap-2">
                              <div className="size-7 rounded-md bg-[#1a2633] border border-[#324d67] text-primary flex items-center justify-center text-[10px] font-bold">
                                {order.user.name.charAt(0)}
                              </div>
                              <span className="font-medium">{order.user.name}</span>
                            </td>
                            <td className="p-4 text-gray-400">{order.location || "N/A"}</td>
                            <td className="p-4 text-gray-400">
                               <span className="bg-[#1a2633] border border-[#324d67] px-2 py-0.5 rounded text-xs font-mono">{order.duration || "N/A"} Hari</span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-opacity-10 ${
                                  order.status === "COMPLETED"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : order.status === "PENDING"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                }`}
                              >
                                <span className={`size-1.5 rounded-full ${order.status === "COMPLETED" ? "bg-emerald-500" : order.status === "PENDING" ? "bg-yellow-500" : "bg-blue-500"}`}></span>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right text-white font-medium font-mono">Rp {order.amount?.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                             <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-3xl opacity-30">inbox</span>
                                <p>Tidak ada pesanan terbaru</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Messages Widget */}
              <div className="card flex flex-col">
                <div className="p-6 border-b border-[#324d67] flex justify-between items-center">
                  <h3 className="text-white text-lg font-bold">Chat Tertunda</h3>
                  <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">{pendingMessages.length} Baru</div>
                </div>
                <div className="flex-1 flex flex-col p-2 overflow-y-auto max-h-[400px]">
                  {pendingMessages.length > 0 ? (
                    pendingMessages.map((message: any) => (
                      <div key={message.id} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer flex gap-3 group transition-colors">
                        <div className="relative">
                          <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {message.sender.name.charAt(0)}
                            {message.sender.name.split(" ")[1]?.charAt(0) || ""}
                          </div>
                          <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-card-dark rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">{message.sender.name}</p>
                            <p className="text-text-secondary text-[10px]">{message.timeAgo}</p>
                          </div>
                          <p className="text-text-secondary text-xs truncate">{message.lastMessage}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-text-secondary">Tidak ada chat tertunda</div>
                  )}
                </div>
                <div className="p-4 border-t border-white/5">
                  <Link href="/admin/chat" className="w-full py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 block text-center">
                    Lihat Semua Pesan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AdminLayout>

      <DateRangeModal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} onApply={handleApplyDate} />

      <NotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} />
    </>
  );
}
