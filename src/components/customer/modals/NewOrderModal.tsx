import React from 'react';
import Modal from '../../ui/Modal';

interface NewOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct: (product: any) => void;
}

export default function NewOrderModal({ isOpen, onClose, onSelectProduct }: NewOrderModalProps) {
    const availableProducts = [
        { id: 1, name: 'Tol Jagorawi KM 4', type: 'DIGITAL', price: 'Rp 32.000.000', location: 'Jakarta Timur', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80' },
        { id: 2, name: 'Bundaran HI', type: 'STATIS', price: 'Rp 125.000.000', location: 'Jakarta Pusat', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'Sudirman CBD', type: 'LED', price: 'Rp 18.000.000', location: 'Jakarta Selatan', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Tol Cikampek KM 15', type: 'DIGITAL', price: 'Rp 22.000.000', location: 'Karawang', image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pilih Produk Reklame" maxWidth="max-w-4xl">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableProducts.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onSelectProduct(product)}
                            className="bg-card-dark border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-primary transition-all text-left group"
                        >
                            <div
                                className="size-24 rounded-xl bg-cover bg-center shrink-0 shadow-lg group-hover:scale-105 transition-transform"
                                style={{ backgroundImage: `url('${product.image}')` }}
                            ></div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-white font-black truncate mb-1">{product.name}</h4>
                                <p className="text-[#92adc9] text-[10px] uppercase font-bold tracking-widest mb-2">{product.type} • {product.location}</p>
                                <p className="text-primary font-black">{product.price}</p>
                            </div>
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-[#5a718a] group-hover:text-primary transition-colors">chevron_right</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-xs font-bold text-[#92adc9] hover:text-white transition-colors"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </Modal>
    );
}
