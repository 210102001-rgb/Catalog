import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';
import CustomerHeader from '../../components/customer/CustomerHeader';
import OrderDetailModal from '../../components/customer/modals/OrderDetailModal';
import EditOrderModal from '../../components/customer/modals/EditOrderModal';
import CancelOrderModal from '../../components/customer/modals/CancelOrderModal';
import InvoiceModal from '../../components/customer/modals/InvoiceModal';
import NewOrderModal from '../../components/customer/modals/NewOrderModal';
import CheckoutModal from '../../components/customer/modals/CheckoutModal';

export default function CustomerOrders() {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const orders: any[] = [
        { id: '#ORD-2024-001', name: 'Tol Jagorawi KM 4', location: 'Jakarta Timur', type: 'Digital Billboard', size: "14' x 48'", period: '15 Nov - 15 Des 2024', duration: '30 Hari', price: 'Rp 32.000.000', status: 'Sedang Berjalan', statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80' },
        { id: '#ORD-2024-002', name: 'Bundaran HI', location: 'Jakarta Pusat', type: 'Static Billboard', size: "20' x 60'", period: '1 Des - 31 Des 2024', duration: '30 Hari', price: 'Rp 125.000.000', status: 'Menunggu Pembayaran', statusColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
        { id: '#ORD-2024-003', name: 'Sudirman CBD', location: 'Jakarta Selatan', type: 'LED Billboard', size: "10' x 22'", period: '10 Jan - 10 Feb 2025', duration: '30 Hari', price: 'Rp 18.000.000', status: 'Aktif', statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' }
    ];

    const handleAction = (order: any, type: 'detail' | 'edit' | 'cancel' | 'invoice') => {
        setSelectedOrder(order);
        if (type === 'detail') setIsDetailOpen(true);
        if (type === 'edit') setIsEditOpen(true);
        if (type === 'cancel') setIsCancelOpen(true);
        if (type === 'invoice') setIsInvoiceOpen(true);
    };

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setIsNewOrderOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <Head>
                <title>Pesanan Saya - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="orders" title="Riwayat Pesanan">
                <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                        {/* Page Heading & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">Pesanan Saya</h1>
                                <p className="text-[#92adc9] text-base md:text-lg">Kelola dan pantau status pesanan papan reklame secara real-time.</p>
                            </div>
                            <button
                                onClick={() => setIsNewOrderOpen(true)}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>Pesan Baru</span>
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Pesanan', value: '8', icon: 'shopping_bag', color: 'primary' },
                                { label: 'Sedang Berjalan', value: '3', icon: 'play_circle', color: 'emerald' },
                                { label: 'Perlu Tindakan', value: '2', icon: 'pending_actions', color: 'yellow' },
                                { label: 'Total Investasi', value: 'Rp 125M', icon: 'payments', color: 'emerald' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-card-dark border border-white/5 rounded-3xl p-5 flex flex-col gap-2 shadow-xl hover:bg-[#1a2b3c] transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[#5a718a] text-[10px] uppercase font-black tracking-[0.2em]">{stat.label}</p>
                                        <span className={`material-symbols-outlined text-${stat.color}-500 text-[20px] group-hover:scale-110 transition-transform`}>{stat.icon}</span>
                                    </div>
                                    <p className="text-white text-2xl font-black">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filter Toolbar */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#1a2633] border border-white/5 p-4 rounded-2xl shadow-xl">
                            <div className="flex-1 relative w-full max-w-lg hidden md:block">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5a718a]">search</span>
                                <input className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111a22] border border-white/5 text-sm text-white outline-none focus:ring-1 focus:ring-primary" placeholder="Cari ID pesanan..." />
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                                <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Semua Status</button>
                                <button className="px-6 py-2.5 bg-transparent text-[#5a718a] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Sedang Berjalan</button>
                                <button className="px-6 py-2.5 bg-transparent text-[#5a718a] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Selesai</button>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4 pb-20">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-card-dark border border-white/5 rounded-3xl p-6 hover:border-primary/40 transition-all shadow-2xl group relative overflow-hidden">
                                    <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-start gap-6">
                                            <div
                                                className="h-24 w-36 md:h-28 md:w-44 rounded-2xl bg-cover bg-center shrink-0 shadow-2xl border border-white/5"
                                                style={{ backgroundImage: `url('${order.image}')` }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h3 className="text-white text-xl font-black truncate group-hover:text-primary transition-colors">{order.name}</h3>
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.statusColor}`}>
                                                        <span className="size-1.5 rounded-full bg-current animate-pulse"></span>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <p className="text-[#5a718a] text-[10px] uppercase font-black tracking-widest mb-1">ID Transaksi</p>
                                                        <p className="text-white text-sm font-bold tracking-tight">{order.id}</p>
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <p className="text-[#5a718a] text-[10px] uppercase font-black tracking-widest mb-1">Periode Sewa</p>
                                                        <p className="text-white text-sm font-bold tracking-tight">{order.period}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[#5a718a] text-[10px] uppercase font-black tracking-widest mb-1">Total Harga</p>
                                                        <p className="text-primary text-sm font-black italic">{order.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Group */}
                                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                            <button
                                                onClick={() => handleAction(order, 'detail')}
                                                className="flex-1 lg:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 text-[#92adc9] hover:text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">visibility</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(order, 'invoice')}
                                                className="flex-1 lg:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 text-[#92adc9] hover:text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">receipt_long</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Invoice</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(order, 'edit')}
                                                className="flex-1 lg:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 text-emerald-500/80 hover:text-emerald-400 rounded-xl border border-emerald-500/10 transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">edit_note</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(order, 'cancel')}
                                                className="flex-1 lg:flex-none h-11 px-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 hover:text-red-400 rounded-xl border border-red-500/10 transition-all flex items-center justify-center"
                                                title="Batalkan Pesanan"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </CustomerLayout>

            <OrderDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} order={selectedOrder} />
            <EditOrderModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} order={selectedOrder} />
            <CancelOrderModal isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} order={selectedOrder} />
            <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
            <NewOrderModal isOpen={isNewOrderOpen} onClose={() => setIsNewOrderOpen(false)} onSelectProduct={handleSelectProduct} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedProduct} />
        </>
    );
}
