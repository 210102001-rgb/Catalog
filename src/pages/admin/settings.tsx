import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok) {
        await showSuccessAlert("Berhasil", "Profil telah diperbarui successfully");
        // Optionally reload to update global state
        window.location.reload();
      } else {
        await showErrorAlert("Gagal", data.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error(error);
      await showErrorAlert("Error", "Terjadi kesalahan sistem");
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      await showErrorAlert("Validasi Gagal", "Password baru dan konfirmasi tidak cocok");
      return;
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await showSuccessAlert("Berhasil", "Password telah diperbarui");
        setPassword({ current: "", new: "", confirm: "" });
      } else {
        await showErrorAlert("Gagal", data.error || "Gagal memperbarui password");
      }
    } catch (error) {
      console.error(error);
      await showErrorAlert("Error", "Terjadi kesalahan sistem");
    }
  };

  return (
    <>
      <Head>
        <title>Pengaturan - ReklameKu</title>
      </Head>
      <AdminLayout activePage="settings">
        <main className="flex-1 flex flex-col min-h-0 bg-background-dark overflow-hidden">
          <Header title="Pengaturan Sistem">
            <div className="flex items-center gap-2">
               <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                  Live Mode
               </span>
            </div>
          </Header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - Main Settings */}
              <div className="xl:col-span-2 space-y-8">
                {/* Profile Section */}
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      Profil Saya
                    </h3>
                    <span className="text-xs text-text-secondary bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      Administrator
                    </span>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-white/5">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold text-white uppercase border-4 border-card-dark shadow-xl ring-2 ring-white/10 group-hover:ring-primary transition-all">
                          {profile.name.charAt(0)}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white">camera_alt</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-3">
                        <div>
                          <h4 className="text-white font-medium text-lg">Foto Profil</h4>
                          <p className="text-sm text-text-secondary mt-1">
                            Foto ini akan ditampilkan di profil admin dan chat. <br/>
                            Gunakan file JPG, GIF atau PNG. Maksimal 1MB.
                          </p>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                          <button type="button" className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                            Upload Baru
                          </button>
                          <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-red-400 text-sm font-medium rounded-lg transition-colors border border-white/10">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="profile-name" className="text-sm font-medium text-slate-300">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">badge</span>
                          <input
                            id="profile-name"
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#101922] border border-[#324d67] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profile-email" className="text-sm font-medium text-slate-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">mail</span>
                          <input
                            id="profile-email"
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#101922] border border-[#324d67] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                            placeholder="admin@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Section */}
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <span className="material-symbols-outlined">lock_reset</span>
                      </div>
                      Ganti Password
                    </h3>
                  </div>

                  <form onSubmit={handleSavePassword} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="current-password" className="text-sm font-medium text-slate-300">
                          Password Saat Ini
                        </label>
                        <input
                          id="current-password"
                          type="password"
                          name="current"
                          value={password.current}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 bg-[#101922] border border-[#324d67] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="text-sm font-medium text-slate-300">
                          Password Baru
                        </label>
                        <input
                          id="new-password"
                          type="password"
                          name="new"
                          value={password.new}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 bg-[#101922] border border-[#324d67] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Min. 8 karakter"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium text-slate-300">
                          Konfirmasi Password
                        </label>
                        <input
                          id="confirm-password"
                          type="password"
                          name="confirm"
                          value={password.confirm}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 bg-[#101922] border border-[#324d67] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Ulangi password baru"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button type="submit" className="px-6 py-2.5 bg-card-dark hover:bg-surface-hover text-white border border-white/10 font-semibold rounded-lg transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">key</span>
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Notifications & Preferences */}
              <div className="space-y-8">
                {/* Notifications Section */}
                <div className="card p-6 h-fit sticky top-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                       <span className="material-symbols-outlined">notifications_active</span>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold">Notifikasi</h3>
                        <p className="text-xs text-text-secondary">Atur preferensi notifikasi Anda</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-start justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-white mt-0.5 text-[20px]">mail</span>
                        <div>
                          <p className="font-medium text-white text-sm">Email Alerts</p>
                          <p className="text-xs text-text-secondary mt-0.5">Update pesanan & laporan</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationChange} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>

                    <label className="flex items-start justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                         <span className="material-symbols-outlined text-gray-400 group-hover:text-white mt-0.5 text-[20px]">devices</span>
                        <div>
                          <p className="font-medium text-white text-sm">Push Notifications</p>
                          <p className="text-xs text-text-secondary mt-0.5">Notifikasi browser realtime</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="push" checked={notifications.push} onChange={handleNotificationChange} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>

                     <label className="flex items-start justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                         <span className="material-symbols-outlined text-gray-400 group-hover:text-white mt-0.5 text-[20px]">campaign</span>
                        <div>
                          <p className="font-medium text-white text-sm">Marketing Info</p>
                          <p className="text-xs text-text-secondary mt-0.5">Promo & fitur baru</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="marketing" checked={notifications.marketing} onChange={handleNotificationChange} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </AdminLayout>
    </>
  );
}
