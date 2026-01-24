import React from 'react';
import Modal from '../../ui/Modal';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const handleLogout = () => {
        // Clear session logic here
        window.location.href = '/auth/customer-login';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Keluar Akun"
        >
            <div className="text-center py-6">
                <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-red-500 text-[40px]">logout</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Apakah Anda yakin ingin keluar?</h3>
                <p className="text-[#92adc9] text-sm leading-relaxed mb-8">
                    Sesi Anda akan dihentikan dan Anda perlu login kembali untuk mengakses portal pelanggan.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-900/20"
                    >
                        Ya, Keluar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
