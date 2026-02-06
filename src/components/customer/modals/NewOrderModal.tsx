import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";

interface Product {
  id: number;
  name: string;
  visibility: string;
  price_daily: number;
  location: string;
  images?: string[];
}

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function NewOrderModal({ isOpen, onClose, onSelectProduct }: NewOrderModalProps) {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/customer/products?limit=10");
          if (response.ok) {
            const data = await response.json();
            setAvailableProducts(data.products || []);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Produk Reklame" size="xl">
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Memuat produk tersedia...</p>
          </div>
        ) : (
          <>
            {/* Header Info */}
            <div className="bg-[#1a2633] border border-[#324d67] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">ad_units</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Produk Reklame Tersedia</h3>
                  <p className="text-gray-400 text-xs text-medium">Pilih produk yang ingin Anda pesan</p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <button 
                    key={product.id} 
                    onClick={() => onSelectProduct(product)} 
                    className="group bg-[#1a2633] border border-[#324d67] hover:border-primary/50 hover:bg-[#233648] rounded-xl p-3 flex gap-4 transition-all duration-200 text-left w-full"
                  >
                    {/* Product Image */}
                    <div className="relative shrink-0">
                      <div
                        className="size-16 rounded-lg bg-cover bg-center border border-[#324d67] group-hover:border-primary/30 transition-colors"
                        style={{ 
                          backgroundImage: product.images && product.images.length > 0 
                            ? `url('${product.images[0]}')`
                            : 'linear-gradient(135deg, #111a22 0%, #1a2633 100%)'
                        }}
                      >
                        {(!product.images || product.images.length === 0) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">image_not_supported</span>
                          </div>
                        )}
                      </div>
                      {/* Availability Badge */}
                      <div className="absolute -top-1 -right-1 size-3 bg-emerald-500 border-2 border-[#1a2633] rounded-full shadow-sm"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                       <h4 className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{product.name}</h4>
                       <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span className="truncate">{product.location}</span>
                       </div>
                       <p className="text-primary text-xs font-bold mt-1">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price_daily)} / hari
                       </p>
                    </div>
                    
                    {/* Arrow Icon */}
                    <div className="flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 bg-[#1a2633] border border-[#324d67] rounded-xl border-dashed">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
                    <p className="text-sm font-medium">Tidak ada produk tersedia</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
