import React from 'react';
import Modal from '../../ui/Modal';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Invoice Pembayaran"
        >
            <div className="space-y-8 p-2">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-8">
                    <div>
                        <h3 className="text-primary font-black text-2xl tracking-tighter mb-1 italic uppercase">ReklameKu</h3>
                        <p className="text-[#5a718a] text-[10px] uppercase font-black tracking-widest">Digital Billboard Solutions</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-bold text-sm">INVOICE</p>
                        <p className="text-primary font-black text-lg">{order.id.replace('#', '')}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="text-[#5a718a] font-black uppercase tracking-widest mb-2">Ditagih Ke:</p>
                        <p className="text-white font-bold mb-1">Customer User</p>
                        <p className="text-[#92adc9]">PT. Creative Media Nusantara</p>
                        <p className="text-[#92adc9]">Jakarta, Indonesia</p>
                    </div>
                    <div>
                        <p className="text-[#5a718a] font-black uppercase tracking-widest mb-2">Detail Transaksi:</p>
                        <div className="flex justify-between mb-1">
                            <span className="text-[#92adc9]">Tanggal:</span>
                            <span className="text-white font-bold">15 Nov 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#92adc9]">Jatuh Tempo:</span>
                            <span className="text-white font-bold">20 Nov 2024</span>
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="grid grid-cols-4 gap-4 border-b border-white/5 pb-3 mb-3 text-[10px] font-black text-[#5a718a] uppercase tracking-widest">
                        <div className="col-span-2">Deskripsi</div>
                        <div className="text-center">Durasi</div>
                        <div className="text-right">Total</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center text-xs">
                        <div className="col-span-2">
                            <p className="text-white font-bold mb-1">{order.name}</p>
                            <p className="text-[#92adc9] text-[10px]">{order.type}</p>
                        </div>
                        <div className="text-center text-white font-bold">{order.duration}</div>
                        <div className="text-right text-primary font-black">{order.price}</div>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-4">
                    <div className="w-56 space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-[#92adc9]">Subtotal:</span>
                            <span className="text-white font-bold">{order.price}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[#92adc9]">PPN (11%):</span>
                            <span className="text-white font-bold">Rp 0 (Incl.)</span>
                        </div>
                        <div className="flex justify-between items-center bg-primary/10 p-3 rounded-xl border border-primary/20">
                            <span className="text-[#92adc9] text-[10px] font-black uppercase">Total Bayar:</span>
                            <span className="text-primary font-black text-xl">{order.price}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-[#92adc9] hover:text-white font-bold py-4 rounded-2xl border border-white/10 transition-all text-xs flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Unduh PDF</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all text-xs"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
}
