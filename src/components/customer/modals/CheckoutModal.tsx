import React, { useState } from 'react';
import Modal from '../../ui/Modal';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
    const [step, setStep] = useState(1);
    const [duration, setDuration] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [notes, setNotes] = useState('');

    if (!product) return null;

    const basePrice = parseInt(product.price?.replace(/[^\d]/g, '') || '0');
    const discount = duration >= 12 ? 0.15 : duration >= 6 ? 0.1 : duration >= 3 ? 0.05 : 0;
    const totalPrice = basePrice * duration * (1 - discount);

    const handleNext = () => setStep(2);
    const handlePrev = () => setStep(1);

    const handleFinalize = () => {
        alert('Pesanan Anda telah berhasil dibuat! Tim kami akan menghubungi Anda segera.');
        onClose();
        setStep(1);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? "Konfirmasi Pesanan" : "Pengaturan Kampanye"}
        >
            <div className="space-y-6">
                {/* Stepper Indicator */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-[#5a718a]'}`}>1</div>
                    <div className={`h-1 w-12 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-white/5'}`}></div>
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-[#5a718a]'}`}>2</div>
                </div>

                {step === 1 ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        {/* Product Summary Card */}
                        <div className="bg-gradient-to-br from-[#1a2b3c] to-[#0f1720] p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
                            <div className="flex gap-5 relative z-10">
                                <div className="h-24 w-32 rounded-2xl bg-cover bg-center shrink-0 shadow-xl border border-white/5" style={{ backgroundImage: `url('${product.image}')` }}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-wider mb-2">
                                        {product.type || 'PREMIUM'}
                                    </div>
                                    <h3 className="text-white font-black text-xl mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center gap-1.5 text-[#92adc9]">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        <span className="text-xs font-bold truncate">{product.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest mb-1">Dimensi</p>
                                <p className="text-white font-bold text-sm tracking-tight">{product.size || 'Custom'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest mb-1">Impressions</p>
                                <p className="text-white font-bold text-sm tracking-tight">{product.impressions || '450k/mng'}</p>
                            </div>
                        </div>

                        <div className="bg-primary p-0.5 rounded-2xl shadow-xl shadow-primary/20">
                            <button
                                onClick={handleNext}
                                className="w-full bg-[#111a22] hover:bg-transparent text-white hover:text-white py-4 rounded-[14px] font-black uppercase tracking-widest transition-all text-sm flex items-center justify-center gap-3"
                            >
                                <span>Konfigurasi Sewa</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Durasi Sewa</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer font-bold"
                                    >
                                        <option value={1}>1 Bulan</option>
                                        <option value={3}>3 Bulan (Hemat 5%)</option>
                                        <option value={6}>6 Bulan (Hemat 10%)</option>
                                        <option value={12}>1 Tahun (Hemat 15%)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all dark:[color-scheme:dark] font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#5a718a] uppercase tracking-widest pl-1">Catatan Tambahan</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Contoh: Lampirkan logo brand..."
                                    className="w-full bg-[#111a22] border border-white/5 text-white rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 font-medium"
                                />
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 rounded-3xl space-y-4 shadow-xl">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-[#92adc9]">Subtotal ({duration} bln)</span>
                                <span className="text-white">Rp {(basePrice * duration).toLocaleString('id-ID')}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-emerald-400">
                                    <span>Diskon Member ({(discount * 100)}%)</span>
                                    <span>- Rp {(basePrice * duration * discount).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest mb-1">Total Estimasi</p>
                                    <p className="text-primary text-2xl font-black">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#5a718a] text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-emerald-500 text-xs font-black uppercase tracking-tighter">Budget Tersedia</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/5 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                <span>Kembali</span>
                            </button>
                            <button
                                onClick={handleFinalize}
                                className="flex-[2] bg-primary hover:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 text-sm flex items-center justify-center gap-2"
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
