import React, { useState, useEffect } from "react";
import Head from "next/head";
import CustomerLayout from "../../components/customer/CustomerLayout";
import ProductCard from "../../components/ProductCard";
import FilterModal, { FilterState } from "../../components/customer/modals/FilterModal";
import DateRangeModal from "../../components/customer/modals/DateRangeModal";
import CheckoutModal from "../../components/customer/modals/CheckoutModal";
import { useAuth } from "../../hooks/useAuth";

export default function Katalog() {
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [dateRange, setDateRange] = useState("15 Nov - 15 Des");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 200000000,
    types: [],
    city: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          setLoadingProducts(true);
          const response = await fetch("/api/customer/products", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            const productsData = data.products || [];
            setProducts(productsData);
            applyFilters(productsData, searchQuery, filters);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchProducts();
    }
  }, [user]);

  // Apply filters when search or filters change
  useEffect(() => {
    applyFilters(products, searchQuery, filters);
  }, [searchQuery, filters, products]);

  const applyFilters = (productsData: any[], query: string, filterState: FilterState) => {
    let filtered = [...productsData];

    // Search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(lowerQuery) ||
        p.location?.toLowerCase().includes(lowerQuery) ||
        p.type?.toLowerCase().includes(lowerQuery)
      );
    }

    // Type filter
    if (filterState.types.length > 0) {
      filtered = filtered.filter(p =>
        filterState.types.some(type => p.type?.toLowerCase().includes(type.toLowerCase()))
      );
    }

    // City filter
    if (filterState.city) {
      filtered = filtered.filter(p =>
        p.location?.toLowerCase().includes(filterState.city.toLowerCase())
      );
    }

    // Price filter (assuming price is stored as number or formatted string)
    if (filterState.priceMax > 0) {
      filtered = filtered.filter(p => {
        const price = typeof p.price === 'number' ? p.price : parseFloat(p.price?.replace(/[^\d.]/g, '') || '0');
        return price >= filterState.priceMin && price <= filterState.priceMax;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 200000000,
      types: [],
      city: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery.trim() || filters.types.length > 0 || filters.city || filters.priceMin > 0 || filters.priceMax < 200000000;

  // Apply pagination
  const totalPages = Math.ceil((filteredProducts && Array.isArray(filteredProducts) ? filteredProducts.length : 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts && Array.isArray(filteredProducts) ? filteredProducts.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handleApplyDate = (start: string, end: string) => {
    setDateRange(`${start} - ${end}`);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || loadingProducts) {
    return (
      <CustomerLayout activePage="katalog" title="Katalog Produk" showSearch={true}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout activePage="katalog" title="Katalog Produk" showSearch={true}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Katalog Produk - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="katalog" title="Katalog Produk" showSearch={true}>
        <main className="flex flex-col flex-1 bg-background-dark relative p-6 md:p-8 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Page Heading & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl font-bold tracking-tight">Katalog Papan Reklame</h1>
                <p className="text-gray-400 text-base font-normal max-w-xl">Jelajahi dan pilih lokasi papan reklame strategis untuk kampanye Anda berikutnya.</p>
              </div>
              <div className="flex bg-[#1a2633] p-1 rounded-lg border border-[#324d67]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === "map" ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                >
                  Map View
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1a2633] p-4 rounded-xl border border-[#324d67] shadow-sm">
              <div className="flex-1 relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
                <input
                  className="w-full bg-[#111a22] border border-[#324d67] rounded-lg h-10 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none placeholder-gray-500"
                  placeholder="Cari lokasi, nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsDateOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-[#324d67] bg-[#1a2633] text-gray-300 hover:bg-[#233648] hover:text-white transition-all w-full md:w-auto"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{dateRange}</span>
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`flex items-center justify-center gap-2 px-4 h-10 rounded-lg border transition-all w-full md:w-auto ${
                    hasActiveFilters
                      ? "bg-primary border-primary text-white"
                      : "border-[#324d67] bg-[#1a2633] text-gray-300 hover:bg-[#233648] hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
                  {hasActiveFilters && (
                    <span className="size-5 bg-white text-primary rounded-full text-[10px] font-bold flex items-center justify-center">{filters.types.length + (searchQuery ? 1 : 0)}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Filter aktif:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary-400">×</button>
                  </span>
                )}
                {filters.types.map(type => (
                  <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    {type}
                    <button onClick={() => setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type) }))} className="hover:text-primary-400">×</button>
                  </span>
                ))}
                {filters.city && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    {filters.city}
                    <button onClick={() => setFilters(prev => ({ ...prev, city: "" }))} className="hover:text-primary-400">×</button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-gray-500 hover:text-white text-xs font-medium underline ml-2"
                >
                  Hapus semua
                </button>
              </div>
            )}

            <div className="flex gap-8 items-start">
              {/* Product List Area */}
              <div className="flex-1 flex flex-col gap-6">
                {/* View Mode Indicator */}
                {viewMode === "map" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-500">map</span>
                    <span className="text-yellow-500 text-sm font-medium">Mode Peta - Menampilkan {currentProducts.length} lokasi</span>
                  </div>
                )}

                {/* Product Grid */}
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        {...p}
                        image={p.images && p.images.length > 0 ? p.images[0] : p.image}
                        onSelect={() => handleSelectProduct(p)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">Tidak ada produk ditemukan</div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 pb-20 border-t border-[#324d67]">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    Menampilkan{" "}
                    <span className="text-white">
                      {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)}
                    </span>{" "}
                    dari <span className="text-white">{filteredProducts.length}</span> Produk
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="size-9 flex items-center justify-center rounded-lg bg-[#1a2633] border border-[#324d67] text-gray-400 hover:text-white hover:bg-[#233648] disabled:opacity-30 disabled:hover:bg-[#1a2633] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`size-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          currentPage === page ? "bg-primary text-white shadow-sm" : "bg-transparent text-gray-400 hover:text-white hover:bg-[#1a2633]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="size-9 flex items-center justify-center rounded-lg bg-[#1a2633] border border-[#324d67] text-gray-400 hover:text-white hover:bg-[#233648] disabled:opacity-30 disabled:hover:bg-[#1a2633] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </CustomerLayout>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
      <DateRangeModal isOpen={isDateOpen} onClose={() => setIsDateOpen(false)} onApply={handleApplyDate} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedProduct} />
    </>
  );
}
