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
            <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-[#324d67] pb-6">
                    <div>
                        <h3 className="text-primary font-bold text-2xl tracking-tight mb-1">ReklameKu</h3>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Digital Billboard Solutions</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-bold text-sm">INVOICE</p>
                        <p className="text-primary font-bold text-lg">{order.id.replace('#', '')}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="text-gray-500 font-bold uppercase tracking-wider mb-2">Ditagih Ke:</p>
                        <p className="text-white font-medium mb-1">Customer User</p>
                        <p className="text-gray-400">PT. Creative Media Nusantara</p>
                        <p className="text-gray-400">Jakarta, Indonesia</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold uppercase tracking-wider mb-2">Detail Transaksi:</p>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Tanggal:</span>
                            <span className="text-white font-medium">15 Nov 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Jatuh Tempo:</span>
                            <span className="text-white font-medium">20 Nov 2024</span>
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="bg-[#111a22] rounded-xl p-4 border border-[#324d67]">
                    <div className="grid grid-cols-4 gap-4 border-b border-[#324d67] pb-3 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Deskripsi</div>
                        <div className="text-center">Durasi</div>
                        <div className="text-right">Total</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center text-xs">
                        <div className="col-span-2">
                            <p className="text-white font-bold mb-1">{order.name}</p>
                            <p className="text-gray-400 text-[10px]">{order.type}</p>
                        </div>
                        <div className="text-center text-white font-bold">{order.duration}</div>
                        <div className="text-right text-primary font-bold">{order.price}</div>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-2">
                    <div className="w-56 space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="text-white font-bold">{order.price}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">PPN (11%):</span>
                            <span className="text-white font-bold">Rp 0 (Incl.)</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#111a22] p-3 rounded-lg border border-[#324d67]">
                            <span className="text-gray-400 text-[10px] font-bold uppercase">Total Bayar:</span>
                            <span className="text-primary font-bold text-xl">{order.price}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#324d67]">
                    <button className="flex-1 bg-[#1a2633] hover:bg-[#233648] text-gray-300 hover:text-white font-bold py-3 rounded-xl border border-[#324d67] transition-all text-xs flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Unduh PDF</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-sm transition-all text-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
}
