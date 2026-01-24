import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';
import CustomerHeader from '../../components/customer/CustomerHeader';
import LogoutModal from '../../components/customer/modals/LogoutModal';

export default function CustomerProfile({ onCartOpen, onNotifOpen }: any) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert('Foto profil baru terpilih! (Mock upload)');
        }
    };

    return (
        <>
            <Head>
                <title>Profil Saya - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="profile" title="Kelola Profil">
                <main className="flex-1 flex flex-col relative bg-background-dark text-white">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleLogoChange}
                        accept="image/*"
                    />
                    <div className="flex-1 p-4 md:p-8">
                        <div className="max-w-4xl mx-auto space-y-8 pb-12">
                            {/* Profile Hero */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2b3c] to-[#0f1720] rounded-3xl border border-white/5 p-8 md:p-10 shadow-2xl">
                                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                    <div className="relative group">
                                        <div className="size-32 md:size-40 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-1 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                            <div className="w-full h-full rounded-full bg-[#111a22] flex items-center justify-center text-5xl font-black">CU</div>
                                        </div>
                                        <button
                                            onClick={handleCameraClick}
                                            className="absolute bottom-2 right-2 size-10 bg-primary rounded-full flex items-center justify-center border-4 border-[#121b24] hover:scale-110 transition-transform shadow-xl"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                        </button>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                            <h2 className="text-3xl md:text-4xl font-black">Customer User</h2>
                                        </div>
                                        <p className="text-[#92adc9] text-base mb-6">Bergabung sejak 14 November 2023 • 12 Kampanye Selesai</p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
                                                <p className="text-[#5a718a] text-[10px] uppercase font-bold tracking-widest">Saldo Kredit</p>
                                                <p className="text-white font-bold">Rp 25.000.000</p>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
                                                <p className="text-[#5a718a] text-[10px] uppercase font-bold tracking-widest">Poin Reward</p>
                                                <p className="text-white font-bold">4.250 Pts</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-card-dark border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                                        <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-2">Informasi Dasar</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[#92adc9] text-xs font-bold uppercase tracking-widest">Nama Lengkap</label>
                                                <input className="bg-[#111a22] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all" defaultValue="Customer User" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[#92adc9] text-xs font-bold uppercase tracking-widest">Nama Perusahaan</label>
                                                <input className="bg-[#111a22] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all" defaultValue="PT. Creative Media" />
                                            </div>
                                            <div className="flex flex-col gap-2 text-white/50">
                                                <label className="text-[#92adc9] text-xs font-bold uppercase tracking-widest">Alamat Email</label>
                                                <div className="bg-[#111a22]/50 border border-white/5 rounded-xl px-4 py-3 cursor-not-allowed">customer@email.com</div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[#92adc9] text-xs font-bold uppercase tracking-widest">Nomor Telepon</label>
                                                <input className="bg-[#111a22] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all" defaultValue="+62 812-3456-7890" />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button className="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-blue-500/20 active:translate-y-0.5">
                                                Simpan Perubahan
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-card-dark border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
                                        <h3 className="text-lg font-bold">Verifikasi Identitas</h3>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                                            <div>
                                                <p className="text-white text-sm font-bold">Email Terverifikasi</p>
                                                <p className="text-emerald-500/70 text-[10px] uppercase font-black">Sejak Nov 2023</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="material-symbols-outlined text-emerald-500">domain_verification</span>
                                            <div>
                                                <p className="text-white text-sm font-bold">NPWP Terverifikasi</p>
                                                <p className="text-emerald-500/70 text-[10px] uppercase font-black">Valid hingga 2028</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 rounded-xl border border-white/10 text-[#92adc9] text-sm font-bold hover:text-white hover:bg-white/5 transition-all">
                                            Upload Dokumen Baru
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </CustomerLayout>
        </>
    );
}
