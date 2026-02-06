import React, { useState } from "react";
import Modal from "../../ui/Modal";
import { showSuccessAlert, showErrorAlert } from "../../../utils/swalConfig";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!product) return null;

  const basePrice = parseInt(product.price_daily) || parseInt(product.price?.replace(/[^\d]/g, "") || "0");
  const dailyPrice = basePrice || 1000000; // Default to 1M IDR per day if not provided
  const totalPrice = dailyPrice * duration * 30; // Assuming monthly pricing

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleFinalize = async () => {
    try {
      // Calculate dates
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(start.getMonth() + duration);

      // Prepare order data
      const orderData = {
        total_amount: totalPrice,
        tax_amount: totalPrice * 0.11, // 11% tax
        discount_amount: 0,
        final_amount: totalPrice * 1.11, // With tax
        currency: "IDR",
        payment_method: "BANK_TRANSFER", // Default payment method
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        notes: notes,
        shipping_address: product.location,
        billing_address: product.location,
        order_items: [
          {
            product_id: product.id,
            quantity: 1,
            unit_price: dailyPrice,
            total_price: totalPrice,
            start_date: start.toISOString(),
            end_date: end.toISOString(),
          },
        ],
      };

      // Submit order to API
      const response = await fetch("/api/customer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        await showSuccessAlert("Pesanan Berhasil Dibuat!", "Pesanan Anda telah berhasil dibuat! Tim kami akan menghubungi Anda segera.");
        onClose();
        setStep(1);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      await showErrorAlert("Gagal Membuat Pesanan", "Gagal membuat pesanan. Silakan coba lagi.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? "Konfirmasi Pesanan" : "Pengaturan Kampanye"}>
      <div className="space-y-6">
        {/* Stepper Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors border ${step >= 1 ? "bg-primary border-primary text-white" : "bg-[#1a2633] border-[#324d67] text-gray-500"}`}>1</div>
          <div className={`h-0.5 w-12 transition-colors ${step >= 2 ? "bg-primary" : "bg-[#324d67]"}`}></div>
          <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors border ${step >= 2 ? "bg-primary border-primary text-white" : "bg-[#1a2633] border-[#324d67] text-gray-500"}`}>2</div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Product Summary Card */}
            <div className="bg-[#1a2633] p-4 rounded-xl border border-[#324d67]">
              <div className="flex gap-4">
                <div className="h-20 w-28 rounded-lg bg-cover bg-center shrink-0 border border-[#324d67]" style={{ backgroundImage: `url('${product.images?.[0] || product.image}')` }}></div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="inline-flex w-fit items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">{product.type || "PREMIUM"}</div>
                  <h3 className="text-white font-bold text-lg leading-tight truncate">{product.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="text-xs truncate">{product.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a2633] p-3 rounded-xl border border-[#324d67]">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Dimensi</p>
                <p className="text-white font-semibold text-sm">{product.size_width && product.size_height ? `${product.size_width}" x ${product.size_height}"` : "Custom"}</p>
              </div>
              <div className="bg-[#1a2633] p-3 rounded-xl border border-[#324d67]">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Impressions</p>
                <p className="text-white font-semibold text-sm">{product.impressions || "450k/mng"}</p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Konfigurasi Sewa</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 pl-1">Durasi Sewa</label>
                  <div className="relative">
                    <select
                      id="duration-select"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full bg-[#111a22] border border-[#324d67] text-white rounded-xl px-4 py-3 text-sm focus:border-primary outline-none appearance-none cursor-pointer"
                    >
                      <option value={1}>1 Bulan</option>
                      <option value={3}>3 Bulan (5%)</option>
                      <option value={6}>6 Bulan (10%)</option>
                      <option value={12}>1 Tahun (15%)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 pl-1">Tanggal Mulai</label>
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#111a22] border border-[#324d67] text-white rounded-xl px-4 py-3 text-sm focus:border-primary outline-none dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 pl-1">Catatan</label>
                <textarea
                  id="notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Lampirkan logo brand..."
                  className="w-full bg-[#111a22] border border-[#324d67] text-white rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none h-24"
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#1a2633] border border-[#324d67] p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-400">Subtotal ({duration} bln)</span>
                <span className="text-white">Rp {(dailyPrice * duration * 30).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-emerald-500">
                <span>PPN 11%</span>
                <span>+ Rp {(dailyPrice * duration * 30 * 0.11).toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-3 border-t border-[#324d67] flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-0.5">Total Estimasi</p>
                  <p className="text-primary text-xl font-bold">Rp {(dailyPrice * duration * 30 * 1.11).toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-emerald-500 text-xs font-bold">
                  Budget Tersedia
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="flex-1 bg-[#1a2633] hover:bg-[#233648] text-white font-medium py-3 rounded-xl border border-[#324d67] transition-all text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Kembali</span>
              </button>
              <button
                onClick={handleFinalize}
                className="flex-[2] bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Buat Pesanan</span>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
