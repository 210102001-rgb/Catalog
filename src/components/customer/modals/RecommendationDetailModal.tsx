import React from 'react';
import Modal from '../../ui/Modal';

interface RecommendationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onOrder: (item: any) => void;
}

export default function RecommendationDetailModal({ isOpen, onClose, item, onOrder }: RecommendationDetailModalProps) {
    if (!item) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Rekomendasi Papan Reklame"
        >
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Image & Match Score */}
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'}')` }}
                    ></div>
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg border border-emerald-400/50">
                        {item.match || '95%'} Match
                    </div>
                </div>

                {/* Info Header */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-white text-2xl font-black">{item.name || 'Billboard Digital Sudirman'}</h3>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm">{item.location || 'Jakarta Pusat'}</span>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="text-[#92adc9] text-[10px] uppercase font-black mb-1">Impressions</p>
                        <p className="text-white font-bold">{item.impressions || '850k/minggu'}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="text-[#92adc9] text-[10px] uppercase font-black mb-1">Tipe Produk</p>
                        <p className="text-white font-bold">{item.type || 'Digital'}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide">Tentang Lokasi</h4>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                        Lokasi strategis di jantung kota Jakarta dengan visibilitas optimal dari berbagai arah. Sangat cocok untuk brand awareness skala besar dengan traffic kendaraan padat setiap harinya.
                    </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[#5a718a] text-[10px] uppercase font-black">Estimasi Tarif</p>
                        <p className="text-primary text-2xl font-black">{item.price || 'Rp 12jt'}<span className="text-xs text-[#92adc9] font-normal">/bulan</span></p>
                    </div>
                    <button
                        onClick={() => onOrder(item)}
                        className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-black transition-all shadow-xl shadow-blue-900/40"
                    >
                        Pesan Sekarang
                    </button>
                </div>
            </div>
        </Modal>
    );
}
