import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';
import CustomerHeader from '../../components/customer/CustomerHeader';
import ProductCard from '../../components/ProductCard';
import CheckoutModal from '../../components/customer/modals/CheckoutModal';
import LogoutModal from '../../components/customer/modals/LogoutModal';

export default function StandardOrder() {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <Head>
                <title>Pemesanan Standar - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="standard-order" title="Produk Standar" showSearch={true}>
                <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        {/* Page Heading */}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">Pemesanan Produk Standar</h1>
                            <p className="text-[#92adc9] text-base md:text-lg max-w-2xl">Pilih dari katalog papan reklame standar kami dengan harga tetap, proses cepat, dan jaminan lokasi strategis.</p>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#1a2633] border border-white/5 p-4 rounded-2xl shadow-xl">
                            {/* Search */}
                            <div className="relative w-full lg:max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#92adc9]">search</span>
                                </div>
                                <input
                                    className="block w-full pl-12 pr-4 py-3 border border-white/5 rounded-xl leading-5 bg-[#111a22] text-white placeholder-[#5a718a] focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                                    placeholder="Cari lokasi atau ID produk..."
                                    type="text"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-hide">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#111a22] hover:bg-[#233648] border border-white/5 rounded-xl text-xs font-bold text-white transition-all whitespace-nowrap">
                                    <span>Tipe: Semua</span>
                                    <span className="material-symbols-outlined text-[18px] text-primary">expand_more</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#111a22] hover:bg-[#233648] border border-white/5 rounded-xl text-xs font-bold text-white transition-all whitespace-nowrap">
                                    <span>Harga: Semua</span>
                                    <span className="material-symbols-outlined text-[18px] text-primary">expand_more</span>
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-[#92adc9] hover:text-white text-xs font-bold transition-colors whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                            {[
                                { name: "Tol Jagorawi KM 4", type: "DIGITAL", status: "TERSEDIA", col: "bg-green-500", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format", desc: "Akses masuk Jakarta, traffic padat commuter.", imp: "450k/mng", size: "14' x 48'", loc: "Jakarta Timur", price: "Rp 32jt", rating: 4.8 },
                                { name: "Bundaran HI", type: "STATIS", status: "TERSEDIA", col: "bg-green-500", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format", desc: "Jantung kota Jakarta, visibilitas tinggi.", imp: "850k/mng", size: "20' x 60'", loc: "Jakarta Pusat", price: "Rp 125jt", rating: 4.9 },
                                { name: "Sudirman CBD", type: "LED", status: "TERBATAS", col: "bg-yellow-600", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format", desc: "Kawasan bisnis premium Jakarta.", imp: "210k/mng", size: "10' x 22'", loc: "Jakarta Selatan", price: "Rp 18jt", rating: 4.5 },
                                { name: "Tol Cikampek KM 15", type: "DIGITAL", status: "TERSEDIA", col: "bg-green-500", img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format", desc: "Jalur utama menuju Bandung dan Jawa Barat.", imp: "320k/mng", size: "12' x 36'", loc: "Karawang", price: "Rp 22jt", rating: 4.6 },
                                { name: "Jl. Asia Afrika", type: "STATIS", status: "TERSEDIA", col: "bg-green-500", img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format", desc: "Jalan protokol Bandung, area komersial.", imp: "180k/mng", size: "8' x 24'", loc: "Bandung", price: "Rp 12jt", rating: 4.7 },
                                { name: "Mall Tunjungan Plaza", type: "LED", status: "TERSEDIA", col: "bg-green-500", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format", desc: "Pusat perbelanjaan utama Surabaya.", imp: "280k/mng", size: "6' x 18'", loc: "Surabaya", price: "Rp 15jt", rating: 4.4 }
                            ].map((p, i) => (
                                <ProductCard
                                    key={i}
                                    name={p.name}
                                    type={p.type}
                                    status={p.status}
                                    statusColor={p.col}
                                    image={p.img}
                                    description={p.desc}
                                    impressions={p.imp}
                                    size={p.size}
                                    location={p.loc}
                                    price={p.price}
                                    rating={p.rating}
                                    onSelect={() => handleSelectProduct(p)}
                                />
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="flex justify-center pt-8 pb-12">
                            <button className="bg-[#1a2633] hover:bg-[#233648] text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/5 hover:border-primary/50 shadow-xl">
                                Muat Lebih Banyak
                            </button>
                        </div>
                    </div>
                </main>
            </CustomerLayout>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={selectedProduct}
            />
        </>
    );
}
