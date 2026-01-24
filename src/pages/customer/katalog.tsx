import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';
import ProductCard from '../../components/ProductCard';
import FilterModal from '../../components/customer/modals/FilterModal';
import DateRangeModal from '../../components/customer/modals/DateRangeModal';
import CheckoutModal from '../../components/customer/modals/CheckoutModal';

export default function Katalog() {
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [dateRange, setDateRange] = useState('15 Nov - 15 Des');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const baseProducts: any[] = [
        { id: 1, name: 'Tol Jagorawi KM 4', type: 'DIGITAL', status: 'TERSEDIA', statusColor: 'bg-green-500', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80', description: 'Akses masuk Jakarta, traffic padat commuter.', impressions: '450k/minggu', size: "14' x 48'", location: 'Jakarta Timur', price: 'Rp 32jt', rating: 4.8 },
        { id: 2, name: 'Bundaran HI', type: 'STATIS', status: 'TERSEDIA', statusColor: 'bg-green-500', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', description: 'Jantung kota Jakarta, visibilitas tinggi.', impressions: '850k/minggu', size: "20' x 60'", location: 'Jakarta Pusat', price: 'Rp 125jt', rating: 4.9 },
        { id: 3, name: 'Sudirman CBD', type: 'LED', status: 'TERBATAS', statusColor: 'bg-yellow-600', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80', description: 'Kawasan bisnis premium Jakarta.', impressions: '210k/minggu', size: "10' x 22'", location: 'Jakarta Selatan', price: 'Rp 18jt', rating: 4.5 },
        { id: 4, name: 'Tol Cikampek KM 15', type: 'DIGITAL', status: 'TERSEDIA', statusColor: 'bg-green-500', image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80', description: 'Jalur utama menuju Bandung dan Jawa Barat.', impressions: '320k/minggu', size: "12' x 36'", location: 'Karawang', price: 'Rp 22jt', rating: 4.6 },
    ];

    // Mock expansion of products to test pagination
    const allProducts = Array.from({ length: 15 }, (_, i) => ({
        ...baseProducts[i % baseProducts.length],
        id: i + 1,
        name: `${baseProducts[i % baseProducts.length].name} #${i + 1}`
    }));

    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleApplyDate = (start: string, end: string) => {
        setDateRange(`${start} - ${end}`);
    };

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setIsCheckoutOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>Katalog Produk - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="katalog" title="Katalog Produk" showSearch={true}>
                <main className="flex flex-col flex-1 bg-[#101922] relative p-4 md:p-8">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        {/* Page Heading & Controls */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">Katalog Papan Reklame</h1>
                                <p className="text-[#92adc9] text-base font-normal max-w-xl">Jelajahi dan pilih lokasi papan reklame strategis untuk kampanye Anda berikutnya.</p>
                            </div>
                            <div className="flex bg-[#1a2633] p-1.5 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-[#5a718a] hover:text-white'}`}
                                >
                                    Grid View
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-lg' : 'text-[#5a718a] hover:text-white'}`}
                                >
                                    Map View
                                </button>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex gap-4 items-center bg-[#1a2633] p-4 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex-1 relative md:hidden">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92adc9] text-[18px]">search</span>
                                <input className="w-full bg-[#111a22] border border-white/5 rounded-xl h-12 pl-12 pr-4 text-white text-sm" placeholder="Cari lokasi..." />
                            </div>
                            <div className="hidden md:flex gap-3">
                                <button onClick={() => setIsDateOpen(true)} className="flex items-center gap-3 px-6 h-12 rounded-xl border border-white/5 bg-[#111a22] text-white hover:bg-[#233648] transition-all">
                                    <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                                    <span className="text-sm font-bold uppercase tracking-wider">{dateRange}</span>
                                </button>
                                <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-3 px-6 h-12 rounded-xl border border-white/5 bg-[#111a22] text-white hover:bg-[#233648] transition-all">
                                    <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                                    <span className="text-sm font-bold uppercase tracking-wider">Lainnya</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            {/* Desktop Filter Aside */}
                            <aside className="hidden lg:block w-72 shrink-0 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-xs font-black uppercase tracking-widest px-2">Kategori Harga</h3>
                                    <div className="bg-[#1a2633] rounded-3xl p-6 border border-white/5 space-y-6">
                                        <div className="h-1.5 bg-[#111a22] rounded-full relative">
                                            <div className="absolute left-0 right-1/4 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full border-4 border-primary"></div>
                                        </div>
                                        <p className="text-[#92adc9] text-[10px] uppercase font-black tracking-widest text-center">Hingga Rp 75jt / bln</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-xs font-black uppercase tracking-widest px-2">Tipe Papan</h3>
                                    <div className="bg-[#1a2633] rounded-3xl p-2 border border-white/5">
                                        {['Sangat Strategis', 'Digital/LED', 'Billboard Statis', 'Videotron'].map((t, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 cursor-pointer group">
                                                <div className={`size-5 rounded border border-white/20 flex items-center justify-center transition-all ${i < 2 ? 'bg-primary border-primary' : ''}`}>
                                                    {i < 2 && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                                </div>
                                                <span className="text-[#92adc9] text-sm font-bold group-hover:text-white transition-colors">{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            {/* Product List Area */}
                            <div className="flex-1 flex flex-col gap-10">
                                {/* Product Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {currentProducts.map((p) => (
                                        <ProductCard key={p.id} {...p} onSelect={() => handleSelectProduct(p)} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 pb-20 border-t border-white/5">
                                    <p className="text-[#5a718a] text-xs font-bold uppercase tracking-widest">
                                        Menampilkan <span className="text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allProducts.length)}</span> dari <span className="text-white">{allProducts.length}</span> Produk
                                    </p>

                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-[#92adc9] hover:text-white hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`size-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-transparent text-[#5a718a] hover:text-white hover:bg-white/5'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-[#92adc9] hover:text-white hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </CustomerLayout>

            <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            <DateRangeModal isOpen={isDateOpen} onClose={() => setIsDateOpen(false)} onApply={handleApplyDate} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedProduct} />
        </>
    );
}
