import React, { useState } from 'react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle logic
        alert('Kata sandi berhasil diperbarui');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-card-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <span className="material-symbols-outlined">lock_open</span>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Ganti Kata Sandi</h2>
                        </div>
                        <button onClick={onClose} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-[#92adc9] hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Kata Sandi Saat Ini</label>
                            <input
                                type="password"
                                required
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full bg-[#111a22] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Kata Sandi Baru</label>
                            <input
                                type="password"
                                required
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full bg-[#111a22] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Konfirmasi Kata Sandi Baru</label>
                            <input
                                type="password"
                                required
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full bg-[#111a22] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
