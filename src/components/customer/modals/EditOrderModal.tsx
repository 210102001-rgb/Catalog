import React, { useState } from "react";
import Modal from "../../ui/Modal";
import { showInfoAlert } from "../../../utils/swalConfig";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function EditOrderModal({ isOpen, onClose, order }: EditOrderModalProps) {
  const [duration, setDuration] = useState(order?.duration?.split(" ")[0] || "1");
  const [notes, setNotes] = useState("");

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ubah Rincian Pesanan">
      <div className="space-y-6">
        <div className="bg-[#111a22] p-4 rounded-xl border border-white/5 flex gap-4">
          <div className="size-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${order.image}')` }}></div>
          <div>
            <h4 className="text-white font-bold">{order.name}</h4>
            <p className="text-[#92adc9] text-xs">{order.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="duration-input" className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">
              Durasi Sewa (Bulan)
            </label>
            <input
              id="duration-input"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes-textarea" className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">
              Catatan Perubahan
            </label>
            <textarea
              id="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all h-24 resize-none"
              placeholder="Jelaskan perubahan yang diinginkan..."
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all text-sm">
            Batal
          </button>
          <button
            onClick={async () => {
              await showInfoAlert("Permintaan Terkirim!", "Permintaan perubahan telah dikirim ke admin.");
              onClose();
            }}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all text-sm"
          >
            Kirim Perubahan
          </button>
        </div>
      </div>
    </Modal>
  );
}
