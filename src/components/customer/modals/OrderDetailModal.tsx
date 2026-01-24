import React from 'react';
import Modal from '../../ui/Modal';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detail Pesanan ${order.id}`}
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Header Info */}
                <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div
                        className="h-20 w-32 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url('${order.image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}')` }}
                    ></div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">{order.name || 'Papan Reklame'}</h3>
                        <p className="text-[#92adc9] text-sm mb-2">{order.location}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${order.statusColor || 'bg-white/10 text-white'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm p-2">
                    <div>
                        <p className="text-[#92adc9] text-xs uppercase font-bold tracking-wider mb-1">ID Pesanan</p>
                        <p className="text-white font-medium">{order.id}</p>
                    </div>
                    <div>
                        <p className="text-[#92adc9] text-xs uppercase font-bold tracking-wider mb-1">Tipe Produk</p>
                        <p className="text-white font-medium">{order.type || 'Standard'}</p>
                    </div>
                    <div>
                        <p className="text-[#92adc9] text-xs uppercase font-bold tracking-wider mb-1">Periode</p>
                        <p className="text-white font-medium">{order.period || '15 Nov - 15 Des 2024'}</p>
                    </div>
                    <div>
                        <p className="text-[#92adc9] text-xs uppercase font-bold tracking-wider mb-1">Durasi</p>
                        <p className="text-white font-medium">{order.duration}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5">
                        <p className="text-[#92adc9] text-xs uppercase font-bold tracking-wider mb-1">Total Biaya</p>
                        <p className="text-primary text-xl font-black">{order.amount || order.price}</p>
                    </div>
                </div>

                {/* Timeline / Progress */}
                <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Status Progres</h4>
                    <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        <div className="relative pl-8">
                            <span className="absolute left-0 top-1 size-4 rounded-full bg-emerald-500 border-4 border-[#111a22]"></span>
                            <p className="text-sm font-semibold text-white">Pembayaran Diterima</p>
                            <p className="text-xs text-[#92adc9]">14 Nov 2024, 09:12</p>
                        </div>
                        <div className="relative pl-8">
                            <span className="absolute left-0 top-1 size-4 rounded-full bg-emerald-500 border-4 border-[#111a22]"></span>
                            <p className="text-sm font-semibold text-white">Produksi Materi Iklan</p>
                            <p className="text-xs text-[#92adc9]">15 Nov 2024, 14:30</p>
                        </div>
                        <div className="relative pl-8">
                            <span className="absolute left-0 top-1 size-4 rounded-full bg-primary border-4 border-[#111a22]"></span>
                            <p className="text-sm font-semibold text-primary">Pemasangan di Lokasi</p>
                            <p className="text-xs text-[#92adc9]">Sedang diproses</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <button
                    className="flex-1 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-all text-sm"
                >
                    Download Invoice
                </button>
                <button
                    className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm"
                >
                    Hubungi Admin
                </button>
            </div>
        </Modal>
    );
}
