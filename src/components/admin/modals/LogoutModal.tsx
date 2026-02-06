import React from "react";
import Modal from "../../ui/Modal";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { showErrorAlert } from "@/utils/swalConfig";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear any local storage or cookies if needed
      localStorage.clear();

      // Close modal and redirect to login
      onClose();
      router.push("/auth/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      await showErrorAlert("Gagal Logout!", "Terjadi kesalahan saat logout");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Keluar">
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">Apakah Anda yakin ingin keluar dari Admin Console? Anda harus login kembali untuk mengakses halaman ini.</p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
            Keluar
          </button>
        </div>
      </div>
    </Modal>
  );
}
