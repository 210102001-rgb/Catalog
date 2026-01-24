import React from 'react';
import Modal from '../../ui/Modal';

interface CartItem {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
}

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
}

export default function CartModal({ isOpen, onClose, items }: CartModalProps) {
    const total = items.length > 0 ? "Rp 155.000.000" : "Rp 0"; // Mock total

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Keranjang Pesanan"
        >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                            <div
                                className="size-16 rounded-lg bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url('${item.image}')` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                                <p className="text-[#92adc9] text-xs mb-1">{item.location}</p>
                                <p className="text-primary font-bold text-sm">{item.price}</p>
                            </div>
                            <button className="text-[#92adc9] hover:text-red-500 transition-colors self-start p-1">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <span className="material-symbols-outlined text-[48px] text-[#233648] mb-2">shopping_cart_off</span>
                        <p className="text-[#92adc9] text-sm">Keranjang Anda masih kosong</p>
                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center text-white">
                        <span className="text-sm font-medium">Total Estimasi</span>
                        <span className="text-lg font-bold text-primary">{total}</span>
                    </div>
                    <button
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                        onClick={() => {
                            alert('Proceeding to Checkout...');
                            onClose();
                        }}
                    >
                        Checkout Sekarang
                    </button>
                </div>
            )}
        </Modal>
    );
}
