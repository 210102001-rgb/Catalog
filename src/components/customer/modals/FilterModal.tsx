import React from 'react';
import Modal from '../../ui/Modal';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Papan Reklame"
        >
            <div className="space-y-6">
                {/* Price */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Rentang Harga</h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-white text-sm font-medium mb-4">
                            <span>Rp 5jt</span>
                            <span>Rp 100jt+</span>
                        </div>
                        <div className="relative h-1.5 w-full bg-white/10 rounded-full mb-2">
                            <div className="absolute left-[10%] right-[30%] top-0 bottom-0 bg-primary rounded-full"></div>
                        </div>
                        <p className="text-center text-[#92adc9] text-sm mt-3">Rp 12jt - Rp 75jt / bulan</p>
                    </div>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Tipe Papan</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['Digital', 'Statis', 'LED', 'Videotron'].map((type) => (
                            <label key={type} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 cursor-pointer transition-all">
                                <input type="checkbox" className="w-5 h-5 rounded border-[#5a718a] bg-[#111a22] text-primary focus:ring-0" />
                                <span className="text-[#92adc9] text-sm font-medium">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Kota</h3>
                    <select className="w-full bg-white/5 border border-white/5 text-white rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary transition-all">
                        <option value="jakarta">Jakarta</option>
                        <option value="surabaya">Surabaya</option>
                        <option value="bandung">Bandung</option>
                        <option value="medan">Medan</option>
                    </select>
                </div>

                <div className="pt-6">
                    <button
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                        onClick={onClose}
                    >
                        Terapkan Filter
                    </button>
                    <button
                        className="w-full mt-3 text-sm text-[#92adc9] hover:text-white font-medium py-2 transition-colors"
                        onClick={onClose}
                    >
                        Atur Ulang
                    </button>
                </div>
            </div>
        </Modal>
    );
}
