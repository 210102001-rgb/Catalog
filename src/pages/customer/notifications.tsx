import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';

export default function CustomerNotifications() {
    const [filter, setFilter] = useState('all');

    const notifications: any[] = [
        { id: 1, title: 'Pembayaran Dikonfirmasi', msg: 'Pembayaran untuk iklan Sudirman CBD telah diverifikasi oleh admin.', time: '10:30', date: 'Hari ini', type: 'order', read: false },
        { id: 2, title: 'Promo Akhir Tahun', msg: 'Dapatkan potongan 10% untuk sewa di atas 6 bulan selama Desember.', time: 'Yesterday', date: 'Kemarin', type: 'promo', read: true },
        { id: 3, title: 'Akun Diupdate', msg: 'Password akun Anda berhasil diubah.', time: '14 Nov', date: '2 hari lalu', type: 'system', read: true },
        { id: 4, title: 'Invoice Tersedia', msg: 'Invoice #INV-2024-088 sudah bisa diunduh di halaman Pesanan.', time: '12 Nov', date: '3 hari lalu', type: 'order', read: true },
    ];

    const filteredNotifs = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

    return (
        <>
            <Head>
                <title>Notifikasi - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="notifications" title="Notifikasi Saya">
                <main className="flex-1 flex flex-col bg-background-dark text-white p-4 md:p-8">
                    <div className="max-w-4xl mx-auto w-full space-y-6 pb-20">
                        {/* Heading */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Notifikasi</h1>
                                <p className="text-[#92adc9]">Tetap update dengan status pesanan dan penawaran terbaru kami.</p>
                            </div>
                            <div className="flex gap-2 bg-card-dark p-1.5 rounded-2xl border border-white/5">
                                {['all', 'order', 'promo'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-[#5a718a] hover:text-white'}`}
                                    >
                                        {f === 'all' ? 'Semua' : f === 'order' ? 'Pesanan' : 'Promo'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notif List */}
                        <div className="space-y-4 pt-4">
                            {filteredNotifs.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`group relative flex gap-4 md:gap-6 p-5 md:p-6 rounded-2xl border transition-all cursor-pointer ${notif.read ? 'bg-card-dark border-white/5 opacity-70' : 'bg-[#1a2b3c] border-primary/20 shadow-xl'}`}
                                >
                                    {!notif.read && <div className="absolute top-0 right-0 p-2"><span className="size-2 bg-primary rounded-full block"></span></div>}

                                    <div className={`size-12 md:size-14 rounded-2xl flex items-center justify-center shrink-0 ${getColor(notif.type)} shadow-lg`}>
                                        <span className="material-symbols-outlined text-[24px] md:text-[28px]">{getIcon(notif.type)}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-black text-sm md:text-lg truncate tracking-tight transition-colors ${notif.read ? 'text-white/80' : 'text-primary'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] md:text-xs font-bold text-[#5a718a] bg-white/5 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-tighter whitespace-nowrap ml-4">
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed max-w-2xl ${notif.read ? 'text-[#92adc9]/60' : 'text-[#92adc9]'}`}>
                                            {notif.msg}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a718a]">{notif.date}</span>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Detail Pesanan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </CustomerLayout>
        </>
    );
}

const getColor = (type: string) => {
    switch (type) {
        case 'order': return 'bg-primary text-white';
        case 'promo': return 'bg-orange-500 text-white';
        default: return 'bg-slate-500 text-white';
    }
};

const getIcon = (type: string) => {
    switch (type) {
        case 'order': return 'shopping_bag';
        case 'promo': return 'celebration';
        default: return 'settings';
    }
};
