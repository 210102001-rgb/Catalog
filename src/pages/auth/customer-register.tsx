import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
import Modal from "../../components/ui/Modal";

export default function CustomerRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "individual",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password cocok
    if (formData.password !== formData.confirmPassword) {
      await showErrorAlert("Password Tidak Cocok!", "Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          userType: formData.userType,
          companyName: formData.companyName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registrasi berhasil
        await showSuccessAlert("Registrasi Berhasil!", data.message || "Registrasi customer berhasil");
        router.push("/customer/dashboard");
      } else {
        // Handle error
        await showErrorAlert("Registrasi Gagal!", data.error || "Registrasi gagal");
      }
    } catch (error) {
      console.error("Registration error:", error);
      await showErrorAlert("Oops...", "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Daftar Customer - ReklameKu</title>
      </Head>
      <div className="flex min-h-screen flex-1">
        {/* Left Side: Visual Hero */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            alt="Papan reklame digital modern di pusat kota"
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-12 text-white">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-3xl">campaign</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">ReklameKu</h2>
            </div>
            <p className="max-w-lg text-lg text-slate-200">Bergabung sekarang untuk mendapatkan penawaran terbaik. Akses katalog lengkap, kelola kampanye iklan, dan tingkatkan visibilitas brand Anda.</p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background-light dark:bg-background-dark">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Brand Header for Mobile */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <span className="material-symbols-outlined text-2xl">campaign</span>
                </div>
                <span className="text-xl font-bold text-white">ReklameKu</span>
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-10">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Daftar Customer</h1>
              <p className="text-[#92adc9] text-base font-normal leading-normal">Buat akun customer untuk mulai menyewa titik reklame.</p>
            </div>

            {/* Form Section */}
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="fullname">
                    Nama Lengkap
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                    id="fullname"
                    name="fullname"
                    placeholder="John Doe"
                    required
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                    id="email"
                    name="email"
                    placeholder="customer@email.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="flex w-full flex-1 items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary/50">
                    <input
                      autoComplete="new-password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-0 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] border-r-0 text-base font-normal leading-normal transition-colors"
                      id="password"
                      name="password"
                      placeholder="********"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex cursor-pointer items-center justify-center border border-border-dark bg-surface-dark pr-[15px] rounded-r-lg border-l-0 text-[#92adc9] group-focus-within:border-primary transition-colors hover:text-white"
                    >
                      <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="confirmPassword">
                    Konfirmasi Password
                  </label>
                  <div className="flex w-full flex-1 items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary/50">
                    <input
                      autoComplete="new-password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-0 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] border-r-0 text-base font-normal leading-normal transition-colors"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="********"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <div
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="flex cursor-pointer items-center justify-center border border-border-dark bg-surface-dark pr-[15px] rounded-r-lg border-l-0 text-[#92adc9] group-focus-within:border-primary transition-colors hover:text-white"
                    >
                      <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="phone">
                    Nomor Telepon
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                    id="phone"
                    name="phone"
                    placeholder="081234567890"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* User Type Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="userType">
                    Tipe Pengguna
                  </label>
                  <select
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                  >
                    <option value="individual">Individu</option>
                    <option value="company">Perusahaan</option>
                  </select>
                </div>

                {/* Company Name Field (conditional) */}
                {formData.userType === "company" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium leading-normal pb-2" htmlFor="companyName">
                      Nama Perusahaan
                    </label>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-dark focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                      id="companyName"
                      name="companyName"
                      placeholder="Nama perusahaan Anda"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <label className="flex gap-x-3 items-start cursor-pointer group">
                    <input
                      className="h-5 w-5 mt-0.5 rounded border-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-offset-0 focus:ring-primary focus:outline-none transition-colors"
                      type="checkbox"
                      required
                    />
                    <span className="text-slate-700 dark:text-white text-sm font-normal leading-normal">
                      Saya setuju dengan{" "}
                      <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline font-medium">
                        Syarat & Ketentuan
                      </button>{" "}
                      dan{" "}
                      <button type="button" onClick={() => setShowPrivacy(true)} className="text-primary hover:underline font-medium">
                        Kebijakan Privasi
                      </button>
                    </span>
                  </label>
                </div>

                {/* Register Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memuat...
                      </>
                    ) : (
                      <span className="truncate">Daftar</span>
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-sm text-[#92adc9]">
                    Sudah punya akun?{" "}
                    <Link href="/auth/customer-login" className="text-primary hover:underline font-medium">
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-6">
              <p className="text-center text-xs text-slate-400 dark:text-slate-600">ReklameKu v1.0 | Dilindungi SSL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Syarat & Ketentuan">
        <div>
          <h4>1. Definisi</h4>
          <p>"ReklameKu" merujuk pada platform manajemen dan pemesanan reklame. "Pengguna" merujuk pada individu atau entitas yang menggunakan layanan kami.</p>

          <h4>2. Akun Pengguna</h4>
          <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya.</p>

          <h4>3. Pemesanan & Pembayaran</h4>
          <p>Semua pemesanan tunduk pada ketersediaan lokasi. Pembayaran harus diselesaikan sesuai dengan ketentuan yang tertera pada faktur tagihan.</p>

          <h4>4. Konten Iklan</h4>
          <p>Materi iklan yang diajukan tidak boleh mengandung unsur SARA, pornografi, atau materi ilegal lainnya sesuai hukum yang berlaku di Indonesia. ReklameKu berhak menolak materi yang dianggap tidak pantas.</p>

          <h4>5. Pembatalan</h4>
          <p>Kebijakan pembatalan berlaku sesuai dengan jenis kontrak yang disepakati. Biaya pembatalan mungkin dikenakan jika dilakukan mendekati tanggal tayang.</p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Kebijakan Privasi">
        <div>
          <h4>1. Pengumpulan Data</h4>
          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan data perusahaan saat Anda mendaftar atau melakukan pemesanan.</p>

          <h4>2. Penggunaan Data</h4>
          <p>Informasi pribadi Anda digunakan untuk memproses pesanan, mengelola akun, dan mengirimkan informasi terkait layanan kami. Kami tidak menjual data Anda kepada pihak ketiga.</p>

          <h4>3. Keamanan Data</h4>
          <p>Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah atau penyalahgunaan.</p>

          <h4>4. Hak Pengguna</h4>
          <p>Anda berhak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda yang tersimpan di sistem kami kapan saja melalui pengaturan akun.</p>

          <h4>5. Perubahan Kebijakan</h4>
          <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui email atau pemberitahuan di platform.</p>
        </div>
      </Modal>
    </>
  );
}
