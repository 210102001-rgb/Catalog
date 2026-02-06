import React from "react";
import Modal from "../../ui/Modal";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail Pesanan ${order.id}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Header Info */}
        <div className="flex gap-4 p-4 bg-[#111a22] rounded-xl border border-[#324d67]">
          <div
            className="h-20 w-32 rounded-lg bg-cover bg-center shrink-0 border border-[#324d67]"
            style={{ backgroundImage: `url('${order.images && order.images.length > 0 ? order.images[0] : order.image || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}')` }}
          ></div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{order.name || "Papan Reklame"}</h3>
            <p className="text-gray-400 text-xs mb-2 line-clamp-1">{order.location}</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${order.statusColor || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>{order.status}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm p-1">
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">ID Pesanan</p>
            <p className="text-white font-medium text-xs md:text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Tipe Produk</p>
            <p className="text-white font-medium text-xs md:text-sm">{order.type || "Standard"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Periode</p>
            <p className="text-white font-medium text-xs md:text-sm">{order.period || "15 Nov - 15 Des 2024"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Durasi</p>
            <p className="text-white font-medium text-xs md:text-sm">{order.duration}</p>
          </div>
          <div className="col-span-2 pt-3 border-t border-[#324d67]">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Total Biaya</p>
            <p className="text-white text-lg font-bold">{order.amount || order.price}</p>
          </div>
        </div>

        {/* Timeline / Progress */}
        <div className="space-y-4 pt-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Status Progres</h4>
          <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#324d67]">
            <div className="relative pl-8">
              <span className="absolute left-0 top-1 size-4 rounded-full bg-emerald-500 border-2 border-[#1a2633] z-10 shadow-sm"></span>
              <p className="text-sm font-bold text-white">Pembayaran Diterima</p>
              <p className="text-[10px] text-gray-500">14 Nov 2024, 09:12</p>
            </div>
            <div className="relative pl-8">
              <span className="absolute left-0 top-1 size-4 rounded-full bg-emerald-500 border-2 border-[#1a2633] z-10 shadow-sm"></span>
              <p className="text-sm font-bold text-white">Produksi Materi Iklan</p>
              <p className="text-[10px] text-gray-500">15 Nov 2024, 14:30</p>
            </div>
            <div className="relative pl-8">
              <span className="absolute left-0 top-1 size-4 rounded-full bg-primary border-2 border-[#1a2633] z-10 shadow-sm"></span>
              <p className="text-sm font-bold text-primary">Pemasangan di Lokasi</p>
              <p className="text-[10px] text-gray-500">Sedang diproses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3 pt-6 border-t border-[#324d67]">
        <button className="flex-1 border border-[#324d67] text-gray-300 font-bold py-2.5 rounded-lg hover:bg-[#233648] hover:text-white transition-all text-xs uppercase tracking-wider">Download Invoice</button>
        <button className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-all shadow-sm text-xs uppercase tracking-wider">Hubungi Admin</button>
      </div>
    </Modal>
  );
}
