import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import DateRangeModal from '../../components/admin/modals/DateRangeModal';

export default function AdminReports() {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const handleApplyDate = (start: string, end: string) => {
        setDateRange({ start, end });
        // In a real app, this would fetch filtered data
    };

    const handleExport = () => {
        // Mock PDF Export
        alert("Downloading PDF Report...");
    };

    return (
        <>
            <Head>
                <title>Laporan & Rekap - ReklameKu</title>
            </Head>
            <AdminLayout activePage="reports">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Laporan & Rekap">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setIsDateModalOpen(true)}
                                className="w-full md:w-auto px-4 py-2 bg-card-dark hover:bg-surface-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                {dateRange.start ? `${dateRange.start} - ${dateRange.end}` : 'Pilih Periode'}
                            </button>
                            <button
                                onClick={handleExport}
                                className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Download PDF
                            </button>
                        </div>
                    </Header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        {/* Period Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon="monetization_on" title="Total Revenue" value="Rp 452M" trend="+12%" />
                            <StatCard icon="shopping_bag" title="Total Pesanan" value="245" trend="+18" />
                            <StatCard icon="people" title="Customer Baru" value="32" trend="+8" />
                            <StatCard icon="trending_up" title="Growth Rate" value="15.3%" trend="+2.1%" />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-card-dark rounded-xl border border-white/5 p-6">
                                <h3 className="text-white text-lg font-bold mb-4">Revenue Trend</h3>
                                <div className="h-64 flex items-center justify-center text-text-secondary border-2 border-dashed border-white/10 rounded-lg">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">bar_chart</span>
                                        <p>Chart Visualization Placeholder</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card-dark rounded-xl border border-white/5 p-6">
                                <h3 className="text-white text-lg font-bold mb-4">Lokasi Populer</h3>
                                <div className="space-y-3">
                                    {[
                                        { location: 'Bundaran HI, Jakarta', orders: 45, percentage: 85 },
                                        { location: 'Tol Jagorawi KM 4', orders: 38, percentage: 72 },
                                        { location: 'Sudirman CBD', orders: 32, percentage: 60 },
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-white text-sm font-medium">{item.location}</p>
                                                <p className="text-text-secondary text-sm">{item.orders} pesanan</p>
                                            </div>
                                            <div className="w-full bg-background-dark rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Performance Table */}
                        <div className="bg-card-dark rounded-xl border border-white/5 p-6">
                            <h3 className="text-white text-lg font-bold mb-4">Performance by Product Type</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                            <th className="p-4">Type</th>
                                            <th className="p-4 text-right">Total Units</th>
                                            <th className="p-4 text-right">Occupancy Rate</th>
                                            <th className="p-4 text-right">Revenue</th>
                                            <th className="p-4 text-right">Growth</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        <tr className="hover:bg-white/5">
                                            <td className="p-4 text-white font-medium">Digital Billboard</td>
                                            <td className="p-4 text-right text-white">24</td>
                                            <td className="p-4 text-right text-white">92%</td>
                                            <td className="p-4 text-right text-white font-medium">Rp 268M</td>
                                            <td className="p-4 text-right text-green-400">+15%</td>
                                        </tr>
                                        <tr className="hover:bg-white/5">
                                            <td className="p-4 text-white font-medium">Static Billboard</td>
                                            <td className="p-4 text-right text-white">16</td>
                                            <td className="p-4 text-right text-white">88%</td>
                                            <td className="p-4 text-right text-white font-medium">Rp 152M</td>
                                            <td className="p-4 text-right text-green-400">+8%</td>
                                        </tr>
                                        <tr className="hover:bg-white/5">
                                            <td className="p-4 text-white font-medium">LED Screen</td>
                                            <td className="p-4 text-right text-white">8</td>
                                            <td className="p-4 text-right text-white">75%</td>
                                            <td className="p-4 text-right text-white font-medium">Rp 32M</td>
                                            <td className="p-4 text-right text-green-400">+22%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <DateRangeModal
                        isOpen={isDateModalOpen}
                        onClose={() => setIsDateModalOpen(false)}
                        onApply={handleApplyDate}
                    />
                </main>
            </AdminLayout>
        </>
    );
}
