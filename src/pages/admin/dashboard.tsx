import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import DateRangeModal from '../../components/admin/modals/DateRangeModal';
import NotificationModal from '../../components/admin/modals/NotificationModal';

export default function AdminDashboard() {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

    // Date state
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const handleApplyDate = (start: string, end: string) => {
        setDateRange({ start, end });
    };

    return (
        <>
            <Head>
                <title>Dashboard Admin - ReklameKu</title>
            </Head>
            <AdminLayout activePage="dashboard">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Dashboard Overview">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsDateModalOpen(true)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-card-dark text-white rounded-lg hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    <span className="text-sm font-medium">{dateRange.start ? `${dateRange.start} - ${dateRange.end}` : 'Bulan Ini'}</span>
                                </button>
                                <button
                                    onClick={() => setIsNotifModalOpen(true)}
                                    className="relative p-2 rounded-lg bg-card-dark text-white hover:bg-surface-hover transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card-dark"></span>
                                </button>
                            </div>
                        </div>
                    </Header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon="payments" title="Total Pendapatan" value="Rp 452.000.000" trend="+12%" />
                            <StatCard icon="shopping_bag" title="Pesanan Baru" value="12" trend="+4" />
                            <StatCard
                                icon="ad_units"
                                title="Papan Reklame Aktif"
                                value="85"
                                trend="98% Aktif"
                                trendUp={false}
                                trendColor="text-text-secondary"
                            />
                            <StatCard
                                icon="forum"
                                title="Chat Tertunda"
                                value="5"
                                trend="Perlu Tindakan"
                                trendUp={false}
                                trendColor="text-orange-400"
                            />
                        </div>

                        {/* Recent Orders & Messages */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Recent Orders Table */}
                            <div className="xl:col-span-2 bg-card-dark rounded-xl border border-white/5 overflow-hidden flex flex-col">
                                <div className="p-6 flex items-center justify-between border-b border-white/5">
                                    <h3 className="text-white text-lg font-bold">Pesanan Terbaru</h3>
                                    <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                                        Lihat Semua
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                                <th className="p-4">ID Pesanan</th>
                                                <th className="p-4">Client</th>
                                                <th className="p-4">Lokasi</th>
                                                <th className="p-4">Durasi</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm">
                                            <tr className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">#ORD-7742</td>
                                                <td className="p-4 text-text-secondary group-hover:text-white flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold">
                                                        N
                                                    </div>
                                                    Nike Indonesia
                                                </td>
                                                <td className="p-4 text-text-secondary">Bundaran HI, Jakarta</td>
                                                <td className="p-4 text-text-secondary">30 Hari</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <span className="size-1.5 rounded-full bg-emerald-500"></span> Aktif
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-white font-medium">Rp 45.000.000</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">#ORD-7741</td>
                                                <td className="p-4 text-text-secondary group-hover:text-white flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[10px] font-bold">
                                                        C
                                                    </div>
                                                    Coca-Cola
                                                </td>
                                                <td className="p-4 text-text-secondary">Tol Jagorawi KM 4</td>
                                                <td className="p-4 text-text-secondary">15 Hari</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                        <span className="size-1.5 rounded-full bg-yellow-500"></span> Menunggu
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-white font-medium">Rp 12.500.000</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">#ORD-7740</td>
                                                <td className="p-4 text-text-secondary group-hover:text-white flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                                                        S
                                                    </div>
                                                    Shopee
                                                </td>
                                                <td className="p-4 text-text-secondary">Sudirman, Jakarta</td>
                                                <td className="p-4 text-text-secondary">7 Hari</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                        <span className="size-1.5 rounded-full bg-blue-500"></span> Terjadwal
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-white font-medium">Rp 8.200.000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Messages Widget */}
                            <div className="bg-card-dark rounded-xl border border-white/5 flex flex-col">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-white text-lg font-bold">Chat Tertunda</h3>
                                    <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">5 Baru</div>
                                </div>
                                <div className="flex-1 flex flex-col p-2 overflow-y-auto max-h-[400px]">
                                    {/* Message Item 1 */}
                                    <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer flex gap-3 group transition-colors">
                                        <div className="relative">
                                            <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                MR
                                            </div>
                                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-card-dark rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">
                                                    Mike Ross
                                                </p>
                                                <p className="text-text-secondary text-[10px]">2m lalu</p>
                                            </div>
                                            <p className="text-text-secondary text-xs truncate">
                                                Halo, apakah billboard di Sudirman tersedia minggu depan?
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message Item 2 */}
                                    <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer flex gap-3 group transition-colors bg-white/[0.02]">
                                        <div className="relative">
                                            <div className="size-10 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                                                SC
                                            </div>
                                            <div className="absolute bottom-0 right-0 size-3 bg-gray-500 border-2 border-card-dark rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">
                                                    Sarah Connor
                                                </p>
                                                <p className="text-text-secondary text-[10px]">1j lalu</p>
                                            </div>
                                            <p className="text-white text-xs truncate font-medium">
                                                Saya perlu update kreatif untuk kampanye weekend.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message Item 3 */}
                                    <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer flex gap-3 group transition-colors">
                                        <div className="relative">
                                            <div className="size-10 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                                DK
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">
                                                    David Kim
                                                </p>
                                                <p className="text-text-secondary text-[10px]">3j lalu</p>
                                            </div>
                                            <p className="text-text-secondary text-xs truncate">Tolong kirim invoice bulan lalu.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-white/5">
                                    <Link
                                        href="/admin/chat"
                                        className="w-full py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 block text-center"
                                    >
                                        Lihat Semua Pesan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </AdminLayout>

            <DateRangeModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                onApply={handleApplyDate}
            />

            <NotificationModal
                isOpen={isNotifModalOpen}
                onClose={() => setIsNotifModalOpen(false)}
            />
        </>
    );
}
