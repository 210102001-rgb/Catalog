import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import CustomerLayout from "../../components/customer/CustomerLayout";
import CustomerHeader from "../../components/customer/CustomerHeader";
import StatCard from "../../components/StatCard";
import RecommendationDetailModal from "../../components/customer/modals/RecommendationDetailModal";
import CheckoutModal from "../../components/customer/modals/CheckoutModal";
import LogoutModal from "../../components/customer/modals/LogoutModal";
import { useAuth } from "../../hooks/useAuth";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalImpressions: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch dashboard data
      const fetchDashboardData = async () => {
        try {
          const statsResponse = await fetch("/api/customer/dashboard/stats", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Use credentials instead of Bearer token
          });

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          }

          const ordersResponse = await fetch("/api/customer/dashboard/recent-orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Use credentials instead of Bearer token
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setRecentOrders(ordersData);
          }

          const recommendationsResponse = await fetch("/api/customer/dashboard/recommendations", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Use credentials instead of Bearer token
          });

          if (recommendationsResponse.ok) {
            const recommendationsData = await recommendationsResponse.json();
            setRecommendations(recommendationsData);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchDashboardData();
    }
  }, [user]);

  const handleRecommendClick = (item: any) => {
    setSelectedItem(item);
    setIsRecommendOpen(true);
  };

  const handleOrderRedirect = (item: any) => {
    setIsRecommendOpen(false);
    setSelectedItem(item);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <CustomerLayout activePage="dashboard" title="Dashboard Overview">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout activePage="dashboard" title="Dashboard Overview">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Customer - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="dashboard" title="Dashboard">
        <main className="flex-1 flex flex-col relative bg-background-dark p-6 md:p-8 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-[#1a2633] rounded-xl border border-[#324d67] p-6 md:p-10 shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[160px]">campaign</span>
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  SELAMAT DATANG, {user.name.toUpperCase()}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
                  Halo {user.name},<br />
                  <span className="text-primary">Siap pasang iklan?</span>
                </h3>
                <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-xl">Kelola kampanye iklan papan reklame Anda secara real-time dan jangkau audiens tertarget dengan lokasi strategis.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/customer/katalog"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    Lihat Katalog
                  </Link>
                  <Link href="/customer/standard-order" className="flex items-center justify-center gap-2 bg-[#101922] hover:bg-[#15202b] text-white border border-[#324d67] px-6 py-3 rounded-lg font-semibold transition-all">
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Buat Pesanan
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="campaign" title="Kampanye Aktif" value={stats.activeCampaigns.toString()} trend="+2" trendColor="text-[#0bda5b]" />
              <StatCard icon="visibility" title="Total Impressions" value={`${(stats.totalImpressions / 1000000).toFixed(1)}M`} trend="+15%" trendColor="text-[#0bda5b]" />
              <StatCard icon="payments" title="Pengeluaran" value={`Rp ${(stats.totalSpent / 1000000).toFixed(1)}M`} trend="Bulan ini" trendUp={false} trendColor="text-[#92adc9]" />
              <StatCard icon="schedule" title="Pesanan Pending" value={stats.pendingOrders.toString()} trend="Menunggu" trendUp={false} trendColor="text-orange-400" />
            </div>

            {/* Recent Orders & Recommendations */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-20">
              {/* Recent Orders */}
              <div className="xl:col-span-2 card overflow-hidden flex flex-col">
                <div className="p-6 flex items-center justify-between border-b border-[#324d67] bg-[#1a2633]/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">history</span>
                    <h3 className="text-white text-lg font-bold">Pesanan Terbaru</h3>
                  </div>
                  <Link href="/customer/orders" className="text-primary text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-1">
                    Semua Pesanan
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2633] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#324d67]">
                        <th className="p-4 pl-6">ID Pesanan</th>
                        <th className="p-4">Lokasi</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#324d67] text-sm">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-[#2a3f55] transition-colors group cursor-pointer">
                            <td className="p-4 pl-6 text-white font-medium">#{order.order_number}</td>
                            <td className="p-4 text-gray-400 group-hover:text-white transition-colors">{order.location || "N/A"}</td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-opacity-10 border ${
                                  order.status === "COMPLETED"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : order.status === "PENDING"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                }`}
                              >
                                <span className={`size-1.5 rounded-full ${order.status === "COMPLETED" ? "bg-emerald-500" : order.status === "PENDING" ? "bg-yellow-500" : "bg-blue-500"}`}></span> {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-right pr-6 text-white font-medium font-mono">Rp {order.total_amount?.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500">
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

              {/* Recommendations */}
              <div className="card flex flex-col h-full">
                <div className="p-6 border-b border-[#324d67] bg-[#1a2633]/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <h3 className="text-white text-lg font-bold">Rekomendasi</h3>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-4 gap-4">
                  {recommendations.length > 0 ? (
                    recommendations.map((item: any) => (
                      <div key={item.id} onClick={() => handleRecommendClick(item)} className="p-3 rounded-xl bg-[#1a2633] hover:bg-[#233648] cursor-pointer transition-all border border-[#324d67] group">
                        <div className="flex gap-4">
                          <div className="size-16 rounded-lg bg-cover bg-center shrink-0 border border-[#324d67]" style={{ backgroundImage: `url('${item.images && item.images.length > 0 ? item.images[0] : item.image}')` }}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">{item.name}</h4>
                            <p className="text-gray-400 text-xs mb-2">{item.location}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-white font-bold text-sm font-mono">{item.price}</span>
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">{item.match} match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">Tidak ada rekomendasi saat ini</div>
                  )}

                  {/* Promotion Card */}
                  <div className="mt-auto p-5 rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group">
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-primary opacity-10 group-hover:scale-110 transition-transform">sell</span>
                    <h4 className="text-white font-bold text-sm mb-2">Penawaran Eksklusif</h4>
                    <p className="text-primary-100/70 text-xs leading-relaxed mb-4">Dapatkan diskon 15% untuk pemesanan pertama di area Jakarta Pusat.</p>
                    <button className="text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">Klaim Diskon Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </CustomerLayout>

      <RecommendationDetailModal isOpen={isRecommendOpen} onClose={() => setIsRecommendOpen(false)} item={selectedItem} onOrder={handleOrderRedirect} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedItem} />
    </>
  );
}
