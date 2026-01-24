import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';

export default function AdminSettings() {
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@reklameku.com',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profil berhasil diperbarui (Simulasi)');
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password berhasil diubah (Simulasi)');
    };

    return (
        <>
            <Head>
                <title>Pengaturan - ReklameKu</title>
            </Head>
            <AdminLayout activePage="settings">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Pengaturan" />

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                        {/* Profile Section */}
                        <div className="bg-card-dark rounded-xl border border-white/5 p-6 max-w-4xl">
                            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined">person</span>
                                Profil Saya
                            </h3>
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-white uppercase border-2 border-primary">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <div>
                                        <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                                            Ubah Avatar
                                        </button>
                                        <p className="text-xs text-text-secondary mt-2">JPG, GIF or PNG. Max size 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                                        Simpan Profil
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Section */}
                        <div className="bg-card-dark rounded-xl border border-white/5 p-6 max-w-4xl">
                            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined">lock</span>
                                Ganti Password
                            </h3>
                            <form onSubmit={handleSavePassword} className="space-y-6">
                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Password Saat Ini</label>
                                        <input
                                            type="password"
                                            name="current"
                                            value={password.current}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2.5 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Password Baru</label>
                                        <input
                                            type="password"
                                            name="new"
                                            value={password.new}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2.5 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            name="confirm"
                                            value={password.confirm}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2.5 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="px-6 py-2.5 bg-card-dark hover:bg-surface-hover text-white border border-white/10 font-semibold rounded-lg transition-colors">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Notifications Section */}
                        <div className="bg-card-dark rounded-xl border border-white/5 p-6 max-w-4xl">
                            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined">notifications</span>
                                Notifikasi
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-background-dark rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors">
                                    <div>
                                        <p className="font-medium text-white">Notifikasi Email</p>
                                        <p className="text-sm text-text-secondary">Terima update pesanan dan laporan via email</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="email"
                                        checked={notifications.email}
                                        onChange={handleNotificationChange}
                                        className="w-5 h-5 rounded border-slate-600 bg-card-dark text-primary focus:ring-primary"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-background-dark rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors">
                                    <div>
                                        <p className="font-medium text-white">Push Notifications</p>
                                        <p className="text-sm text-text-secondary">Terima notifikasi real-time di browser</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="push"
                                        checked={notifications.push}
                                        onChange={handleNotificationChange}
                                        className="w-5 h-5 rounded border-slate-600 bg-card-dark text-primary focus:ring-primary"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
            </AdminLayout>
        </>
    );
}
