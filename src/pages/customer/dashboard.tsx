import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import CustomerHeader from '../../components/customer/CustomerHeader';
import StatCard from '../../components/StatCard';
import RecommendationDetailModal from '../../components/customer/modals/RecommendationDetailModal';
import CheckoutModal from '../../components/customer/modals/CheckoutModal';
import LogoutModal from '../../components/customer/modals/LogoutModal';

export default function CustomerDashboard() {
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const recommendations: any[] = [
    { id: 1, name: "Digital Tol Jagorawi", type: "DIGITAL", match: "95%", price: "Rp 12jt", impressions: "450k/minggu", location: "Jakarta Timur", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format" },
    { id: 2, name: "Mall Kelapa Gading", type: "LED", match: "88%", price: "Rp 8jt", impressions: "210k/minggu", location: "Jakarta Utara", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format" }
  ];

  const handleRecommendClick = (item: any) => {
    setSelectedItem(item);
    setIsRecommendOpen(true);
  };

  const handleOrderRedirect = (item: any) => {
    setIsRecommendOpen(false);
    setSelectedItem(item);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Head>
        <title>Dashboard Customer - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="dashboard" title="Dashboard Overview">
        <main className="flex-1 flex flex-col relative bg-background-dark p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2b3c] to-[#0f1720] rounded-3xl border border-white/5 p-6 md:p-10 text-white shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[160px]">campaign</span>
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black tracking-widest mb-4">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  PENAWARAN TERBARU TERSEDIA
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Halo Customer,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Siap pasang iklan?</span></h3>
                <p className="text-[#92adc9] text-base md:text-lg mb-8 leading-relaxed max-w-xl">Kelola kampanye iklan papan reklame Anda secara real-time dan jangkau audiens tertarget dengan lokasi strategis.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/customer/katalog"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    Lihat Katalog
                  </Link>
                  <Link
                    href="/customer/standard-order"
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 rounded-xl font-bold transition-all hover:border-white/30"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Buat Pesanan
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="campaign" title="Kampanye Aktif" value="3" trend="+2" trendColor="text-[#0bda5b]" />
              <StatCard icon="visibility" title="Total Impressions" value="2.4M" trend="+15%" trendColor="text-[#0bda5b]" />
              <StatCard icon="payments" title="Pengeluaran" value="Rp 45.2M" trend="Bulan ini" trendUp={false} trendColor="text-[#92adc9]" />
              <StatCard icon="schedule" title="Pesanan Pending" value="2" trend="Menunggu" trendUp={false} trendColor="text-orange-400" />
            </div>

            {/* Recent Orders & Recommendations */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-20">
              {/* Recent Orders */}
              <div className="xl:col-span-2 bg-[#1a2633] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-xl">
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">history</span>
                    <h3 className="text-white text-lg font-bold">Pesanan Terbaru</h3>
                  </div>
                  <Link href="/customer/orders" className="text-primary text-sm font-bold hover:text-blue-400 transition-colors flex items-center gap-1 group">
                    Semua Pesanan
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[#5a718a] text-[10px] uppercase tracking-[0.2em] font-black">
                        <th className="p-5 pl-8">ID Pesanan</th>
                        <th className="p-5">Lokasi</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right pr-8">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {[
                        { id: '#ORD-2024-001', loc: 'Sudirman, Jakarta', status: 'Aktif', color: 'emerald', total: 'Rp 15M' },
                        { id: '#ORD-2024-002', loc: 'Gatot Subroto, Jkt', status: 'Pending', color: 'yellow', total: 'Rp 8.5M' }
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                          <td className="p-5 pl-8 text-white font-bold">{order.id}</td>
                          <td className="p-5 text-[#92adc9] group-hover:text-white transition-colors">{order.loc}</td>
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${order.color}-500/10 text-${order.color}-500 border border-${order.color}-500/20`}>
                              <span className={`size-1.5 rounded-full bg-${order.color}-500`}></span> {order.status}
                            </span>
                          </td>
                          <td className="p-5 text-right pr-8 text-white font-black">{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-[#1a2633] rounded-3xl border border-white/5 flex flex-col shadow-xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <h3 className="text-white text-lg font-bold">Rekomendasi</h3>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-4 gap-4">
                  {recommendations.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleRecommendClick(item)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-[#233648] cursor-pointer transition-all border border-transparent hover:border-white/10 group shadow-lg"
                    >
                      <div className="flex gap-4">
                        <div className="size-16 rounded-xl bg-cover bg-center shrink-0 shadow-2xl" style={{ backgroundImage: `url('${item.image}')` }}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm mb-0.5 truncate group-hover:text-primary transition-colors">{item.name}</h4>
                          <p className="text-[#92adc9] text-[10px] mb-2">{item.location}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-white font-black text-sm">{item.price}</span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-black border border-emerald-500/20 uppercase tracking-tighter">{item.match} match</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promotion Card */}
                  <div className="mt-2 p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-xl relative overflow-hidden group">
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-primary opacity-10 group-hover:scale-110 transition-transform">sell</span>
                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Penawaran Eksklusif</h4>
                    <p className="text-[#92adc9] text-[11px] leading-relaxed mb-4">Dapatkan diskon 15% untuk pemesanan pertama di area Jakarta Pusat.</p>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Klaim Diskon Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </CustomerLayout>

      <RecommendationDetailModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        item={selectedItem}
        onOrder={handleOrderRedirect}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={selectedItem}
      />
    </>
  );
}
