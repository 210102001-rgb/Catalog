import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';
import ChangePasswordModal from '../../components/customer/modals/ChangePasswordModal';

export default function CustomerSettings() {
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    return (
        <>
            <Head>
                <title>Pengaturan - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="settings" title="Pengaturan Akun">
                <main className="flex-1 flex flex-col bg-background-dark text-white p-4 md:p-8">
                    <div className="max-w-4xl mx-auto w-full space-y-10 pb-20">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Pengaturan</h1>
                            <p className="text-[#92adc9]">Kelola preferensi akun, keamanan, dan notifikasi Anda.</p>
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Notifications Settings */}
                            <div className="bg-card-dark border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                        <span className="material-symbols-outlined">notifications_active</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Notifikasi</h3>
                                        <p className="text-[#92adc9] text-xs font-medium">Preferensi pengiriman pesan</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Update Status Pesanan', desc: 'Email konfirmasi dan progres produksi' },
                                        { label: 'Penawaran Eksklusif', desc: 'Info diskon dan lokasi baru strategis' },
                                        { label: 'Aktivitas Akun', desc: 'Laporan login dan keamanan' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="pr-4">
                                                <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.label}</p>
                                                <p className="text-xs text-[#5a718a]">{item.desc}</p>
                                            </div>
                                            <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#111a22] transition-colors focus:outline-none ring-1 ring-primary/30">
                                                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out"></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="bg-card-dark border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                                        <span className="material-symbols-outlined">security</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Keamanan</h3>
                                        <p className="text-[#92adc9] text-xs font-medium">Lindungi data dan akun Anda</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsPasswordOpen(true)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-left group"
                                    >
                                        <div>
                                            <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Ubah Password</p>
                                            <p className="text-xs text-[#5a718a]">Terakhir diubah 3 bulan lalu</p>
                                        </div>
                                        <span className="material-symbols-outlined text-[#5a718a] group-hover:text-primary transition-all">chevron_right</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all text-left">
                                        <div>
                                            <p className="font-bold text-sm mb-1">2FA Authentication</p>
                                            <p className="text-xs text-[#5a718a]">Tingkatkan proteksi login</p>
                                        </div>
                                        <span className="material-symbols-outlined text-emerald-500">verified</span>
                                    </button>
                                </div>
                            </div>

                            {/* General Settings */}
                            <div className="bg-card-dark border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-500 shadow-inner">
                                        <span className="material-symbols-outlined">tune</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Preferensi</h3>
                                        <p className="text-[#92adc9] text-xs font-medium">Tampilan dan bahasa aplikasi</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <label className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest">Bahasa</label>
                                        <select className="bg-transparent text-white font-bold outline-none cursor-pointer">
                                            <option value="id" className="bg-[#111a22]">Bahasa Indonesia</option>
                                            <option value="en" className="bg-[#111a22]">English (US)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <label className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest">Zona Waktu</label>
                                        <select className="bg-transparent text-white font-bold outline-none cursor-pointer">
                                            <option value="wib" className="bg-[#111a22]">(GMT+07:00) Jakarta</option>
                                            <option value="sgt" className="bg-[#111a22]">(GMT+08:00) Singapore</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dangerous Zone */}
                            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                                        <span className="material-symbols-outlined">delete_forever</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-red-500">Zona Bahaya</h3>
                                        <p className="text-red-400 text-xs font-medium opacity-70">Hapus akun secara permanen</p>
                                    </div>
                                </div>
                                <p className="text-red-400/60 text-xs leading-relaxed">
                                    Menghapus akun akan menghilangkan semua riwayat pesanan, kredit saldo, dan data kampanye secara permanen.
                                </p>
                                <button className="w-full py-4 rounded-2xl bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-400 hover:text-white text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                    Hapus Akun Saya
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </CustomerLayout>

            <ChangePasswordModal
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
            />
        </>
    );
}
