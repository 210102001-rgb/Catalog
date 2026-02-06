import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CustomerLayout from "../../components/customer/CustomerLayout";
import CustomerHeader from "../../components/customer/CustomerHeader";
import LogoutModal from "../../components/customer/modals/LogoutModal";
import { showSuccessAlert, showErrorAlert, showInfoAlert } from "../../utils/swalConfig";

export default function CustomerProfile({ onCartOpen, onNotifOpen }: any) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    phone: "",
    email: "",
  });
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [joinDate, setJoinDate] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    npwp: false,
    emailVerifiedSince: "",
    npwpValidUntil: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/customer/profile", {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          company_name: userData.company_name || "",
          phone: userData.phone || "",
          email: userData.email || "",
        });
        setBalance(userData.balance || 0);
        setPoints(userData.points || 0);
        setJoinDate(
          userData.created_at
            ? new Date(userData.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""
        );

        // Set verification status
        setVerificationStatus({
          email: userData.email_verified || false,
          npwp: userData.npwp_verified || false,
          emailVerifiedSince: userData.email_verified_at
            ? new Date(userData.email_verified_at).toLocaleDateString("id-ID", {
                month: "short",
                year: "numeric",
              })
            : "Nov 2023",
          npwpValidUntil: userData.npwp_valid_until
            ? new Date(userData.npwp_valid_until).toLocaleDateString("id-ID", {
                year: "numeric",
              })
            : "2028",
        });
      } else {
        const errorData = await response.json();
        showErrorAlert("Gagal Mengambil Data", errorData.error || "Terjadi kesalahan saat mengambil data profil");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showErrorAlert("Oops...", "Terjadi kesalahan saat menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the image here
      const formData = new FormData();
      formData.append("avatar", file);

      // Example API call for avatar upload
      // await fetch('/api/user/avatar', { method: 'PUT', body: formData });

      showSuccessAlert("Foto Profil Diperbarui!", "Foto profil baru berhasil diunggah");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          company_name: formData.company_name,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessAlert("Profil Diperbarui!", data.message || "Profil berhasil diperbarui");
      } else {
        showErrorAlert("Gagal Memperbarui Profil!", data.error || "Terjadi kesalahan saat memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorAlert("Oops...", "Terjadi kesalahan saat memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Profil Saya - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="profile" title="Kelola Profil">
        <main className="flex-1 flex flex-col relative bg-background-dark min-h-0 overflow-y-auto">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" aria-label="Unggah foto profil" />
          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
              {/* Profile Hero */}
              <div className="relative overflow-hidden bg-[#1a2633] border border-[#324d67] rounded-xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="relative group">
                    <div className="size-24 md:size-32 rounded-full border-2 border-[#324d67] p-1 group-hover:border-primary transition-all">
                      <div className="w-full h-full rounded-full bg-[#111a22] flex items-center justify-center text-3xl font-bold text-gray-300">
                        {loading ? "CU" : user ? user.name.charAt(0).toUpperCase() + (user.name.split(" ").length > 1 ? user.name.split(" ").pop()?.charAt(0).toUpperCase() : "") : "CU"}
                      </div>
                    </div>
                    <button onClick={handleCameraClick} className="absolute bottom-1 right-1 size-8 bg-primary rounded-full flex items-center justify-center border-2 border-[#1a2633] hover:bg-blue-600 transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-white">photo_camera</span>
                    </button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{loading ? "Customer User" : user ? user.name : "Customer User"}</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Bergabung sejak {loading ? "14 November 2023" : joinDate} • 12 Kampanye Selesai</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-[#111a22] px-4 py-2 rounded-lg border border-[#324d67]">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Saldo Kredit</p>
                        <p className="text-white font-semibold">Rp {loading ? "25.000.000" : balance.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="bg-[#111a22] px-4 py-2 rounded-lg border border-[#324d67]">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Poin Reward</p>
                        <p className="text-white font-semibold">{loading ? "4.250" : points} Pts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#1a2633] border border-[#324d67] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white border-b border-[#324d67] pb-4 mb-2">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Nama Lengkap</label>
                        <input
                          name="name"
                          className="bg-[#111a22] border border-[#324d67] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nama Lengkap"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Nama Perusahaan</label>
                        <input
                          name="company_name"
                          className="bg-[#111a22] border border-[#324d67] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          placeholder="Nama Perusahaan"
                        />
                      </div>
                      <div className="flex flex-col gap-2 opacity-60">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Alamat Email</label>
                        <div className="bg-[#111a22] border border-[#324d67] rounded-lg px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed">{formData.email}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Nomor Telepon</label>
                        <input
                          name="phone"
                          className="bg-[#111a22] border border-[#324d67] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nomor Telepon"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        disabled={loading}
                        className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Memproses..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#1a2633] border border-[#324d67] rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="text-base font-bold text-white">Verifikasi Identitas</h3>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified_user</span>
                      <div>
                        <p className="text-white text-xs font-bold">Email Terverifikasi</p>
                        <p className="text-emerald-500 text-[10px] font-medium">Sejak {verificationStatus.emailVerifiedSince}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px]">domain_verification</span>
                      <div>
                        <p className="text-white text-xs font-bold">NPWP Terverifikasi</p>
                        <p className="text-emerald-500 text-[10px] font-medium">Valid hingga {verificationStatus.npwpValidUntil}</p>
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-lg border border-[#324d67] text-gray-400 text-xs font-bold hover:bg-[#233648] hover:text-white transition-all uppercase tracking-wider">Upload Dokumen Baru</button>
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
