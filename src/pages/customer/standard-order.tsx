import React, { useState, useEffect } from "react";
import Head from "next/head";
import CustomerLayout from "../../components/customer/CustomerLayout";
import ProductCard from "../../components/ProductCard";
import CheckoutModal from "../../components/customer/modals/CheckoutModal";
import { useAuth } from "../../hooks/useAuth";

export default function StandardOrder() {
  const { user, loading: authLoading } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price_asc");

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/customer/products", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            // Filter products that are marked as STANDAR type
            const standardProducts = (data.products || []).filter(
              (p: any) => p.type?.toUpperCase() === "STANDAR" || p.type?.toUpperCase() === "STANDARD"
            );
            setProducts(standardProducts);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [user]);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      // Search filter
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch =
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.location?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (category !== "all") {
        const categoryLower = category.toLowerCase();
        const matchesCategory =
          p.name?.toLowerCase().includes(categoryLower) ||
          p.type?.toLowerCase().includes(categoryLower);
        if (!matchesCategory) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  if (authLoading || loading) {
    return (
      <CustomerLayout activePage="standard-order" title="Produk Standar" showSearch={true}>
        <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">Pemesanan Produk Standar</h1>
              <p className="text-[#92adc9] text-base md:text-lg">Pilih produk promosi standar untuk kebutuhan marketing Anda.</p>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout activePage="standard-order" title="Produk Standar" showSearch={true}>
        <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-center h-screen">
              <p className="text-white">Silakan login terlebih dahulu</p>
            </div>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Pemesanan Standar - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="standard-order" title="Produk Standar" showSearch={true}>
        <main className="flex-1 flex flex-col bg-background-dark text-white p-6 md:p-8 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Page Heading */}
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Pemesanan Produk Standar</h1>
              <p className="text-gray-400 text-sm md:text-base">Pilih produk promosi standar untuk kebutuhan marketing Anda.</p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1a2633] p-4 rounded-xl border border-[#324d67] shadow-sm">
              <div className="flex-1 relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
                <input
                  className="w-full bg-[#111a22] border border-[#324d67] rounded-lg h-10 pl-12 pr-10 text-white text-sm focus:ring-1 focus:ring-primary outline-none placeholder-gray-500"
                  placeholder="Cari produk..."
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
                <div className="relative w-full md:w-48">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 h-10 rounded-lg border border-[#324d67] bg-[#111a22] text-white text-sm appearance-none cursor-pointer focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="baliho">Baliho</option>
                    <option value="banner">Banner</option>
                    <option value="stand">Stand Display</option>
                    <option value="indoor">Indoor</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 h-10 rounded-lg border border-[#324d67] bg-[#111a22] text-white text-sm appearance-none cursor-pointer focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || category !== "all") && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Filter aktif:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary-400">×</button>
                  </span>
                )}
                {category !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    {category}
                    <button onClick={() => setCategory("all")} className="hover:text-primary-400">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("all");
                  }}
                  className="text-gray-500 hover:text-white text-xs font-medium underline ml-2"
                >
                  Hapus semua
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    {...p}
                    image={p.images && p.images.length > 0 ? p.images[0] : p.image}
                    onSelect={() => handleSelectProduct(p)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  <p className="text-base font-medium">Tidak ada produk ditemukan</p>
                  <p className="text-xs mt-1">Coba ubah filter atau kata pencarian</p>
                </div>
              )}
            </div>

            {/* Products Count */}
            <div className="flex justify-between items-center pt-4 pb-12 border-t border-[#324d67]">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                Menampilkan <span className="text-white">{filteredProducts.length}</span> dari <span className="text-white">{products.length}</span> Produk
              </p>
            </div>
          </div>
        </main>
      </CustomerLayout>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedProduct} />
    </>
  );
}
