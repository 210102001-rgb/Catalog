import React, { useState } from "react";
import Modal from "../../ui/Modal";
import { showErrorAlert, showInfoAlert } from "../../../utils/swalConfig";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function CancelOrderModal({ isOpen, onClose, order }: CancelOrderModalProps) {
  const [reason, setReason] = useState("");

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Batalkan Pesanan">
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <span className="material-symbols-outlined">warning</span>
            <h4 className="font-black uppercase tracking-widest text-xs">Peringatan Pembatalan</h4>
          </div>
          <p className="text-red-400/80 text-xs leading-relaxed font-medium">
            Anda akan mengajukan pembatalan untuk pesanan <strong className="text-red-400">{order.id}</strong>. Sesuai S&K, dana yang telah dibayarkan mungkin tidak dapat dikembalikan seutuhnya jika produksi telah dimulai.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Alasan Pembatalan</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all h-32 resize-none"
            placeholder="Mohon berikan alasan pembatalan Anda..."
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all text-sm">
            Kembali
          </button>
          <button
            onClick={async () => {
              if (!reason) {
                await showErrorAlert("Alasan Diperlukan!", "Mohon isi alasan pembatalan.");
                return;
              }
              await showInfoAlert("Pengajuan Terkirim!", "Pengajuan pembatalan telah dikirim ke admin.");
              onClose();
            }}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-red-900/20 transition-all text-sm"
          >
            Ajukan Pembatalan
          </button>
        </div>
      </div>
    </Modal>
  );
}
