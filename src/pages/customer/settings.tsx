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
                <main className="flex-1 flex flex-col bg-background-dark text-white p-6 md:p-8 min-h-0 overflow-y-auto">
                    <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 tracking-tight text-white">Pengaturan</h1>
                            <p className="text-gray-400 text-sm">Kelola preferensi akun, keamanan, dan notifikasi Anda.</p>
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Notifications Settings */}
                            <div className="bg-[#1a2633] border border-[#324d67] rounded-xl p-6 space-y-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white">Notifikasi</h3>
                                        <p className="text-gray-400 text-xs font-medium">Preferensi pengiriman pesan</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        {
                                            label: 'Update Status Pesanan',
                                            desc: 'Email konfirmasi dan progres produksi',
                                            checked: true
                                        },
                                        {
                                            label: 'Penawaran Eksklusif',
                                            desc: 'Info diskon dan lokasi baru strategis',
                                            checked: true
                                        },
                                        {
                                            label: 'Aktivitas Akun',
                                            desc: 'Laporan login dan keamanan',
                                            checked: false
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#111a22] border border-[#324d67] group">
                                            <div className="pr-4">
                                                <p className="font-bold text-xs mb-0.5 text-gray-200 group-hover:text-primary transition-colors">{item.label}</p>
                                                <p className="text-[10px] text-gray-500">{item.desc}</p>
                                            </div>
                                            <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.checked ? 'bg-primary' : 'bg-gray-700'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.checked ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="bg-[#1a2633] border border-[#324d67] rounded-xl p-6 space-y-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                        <span className="material-symbols-outlined text-[20px]">shield</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white">Keamanan</h3>
                                        <p className="text-gray-400 text-xs font-medium">Password & Otentikasi</p>
                                    </div>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="p-4 rounded-lg bg-[#111a22] border border-[#324d67]">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-xs text-white">Password</p>
                                                <p className="text-[10px] text-gray-500 mt-1">Terakhir diubah 3 bulan lalu</p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-500 text-[18px]">lock</span>
                                        </div>
                                        <div className="flex items-center gap-1 my-3">
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                                <div key={i} className="size-1.5 rounded-full bg-gray-500/50"></div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setIsPasswordOpen(true)}
                                            className="w-full py-2 rounded-md bg-[#1a2633] hover:bg-[#233648] text-primary text-xs font-bold border border-primary/20 hover:border-primary/50 transition-all"
                                        >
                                            Ubah Password
                                        </button>
                                    </div>
                                    
                                    <div className="p-4 rounded-lg bg-[#111a22] border border-[#324d67] opacity-60">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-bold text-xs text-white">Autentikasi 2 Faktor</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">Tambah lapisan keamanan ekstra</p>
                                            </div>
                                            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-700 transition-colors focus:outline-none">
                                                <span className="translate-x-0 inline-block h-4 w-4 transform rounded-full bg-gray-400 shadow ring-0 transition duration-200 ease-in-out"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
