import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import ProductModal from "../../components/admin/modals/ProductModal";
import DeleteModal from "../../components/admin/modals/DeleteModal";
import { useAuth } from "../../hooks/useAuth";

interface Product {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  type: string;
  location: string;
  price: string;
  price_daily: number;
  price_weekly: number;
  price_monthly: number;
  price_yearly: number;
  status: string;
  impressions: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  featured: boolean;
  visibility: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  creator?: {
    name: string;
    email: string;
  };
}

export default function AdminProducts() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterPublished, setFilterPublished] = useState("Semua");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, currentPage, itemsPerPage, sortBy, sortOrder, filterType, filterStatus, filterPublished, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy,
        order: sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (filterType !== "Semua") params.append("type", filterType);
      if (filterStatus !== "Semua") params.append("status", filterStatus);
      if (filterPublished !== "Semua") params.append("published", filterPublished === "Ya" ? "true" : "false");

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAdd = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = async (formData: any): Promise<boolean> => {
    try {
      let response;
      const isFormData = formData instanceof FormData;

      if (isFormData) {
        // Handle FormData (image upload)
        response = await fetch("/api/admin/products", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      } else {
        // Handle JSON data (no image upload)
        if (selectedProduct) {
          // Update existing product
          response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
          });
        } else {
          // Create new product without image upload
          const transformedData = {
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product-" + Date.now(),
            description: formData.description || formData.name,
            location: formData.location,
            price_daily: parseFloat(formData.price.replace(/[Rp.\s]/g, "")) || 0,
            price_weekly: parseFloat(formData.price.replace(/[Rp.\s]/g, "")) * 4 || 0,
            price_monthly: parseFloat(formData.price.replace(/[Rp.\s]/g, "")) || 0,
            price_yearly: parseFloat(formData.price.replace(/[Rp.\s]/g, "")) * 12 || 0,
            images: formData.image && typeof formData.image === "string" && formData.image.trim() !== "" ? [formData.image] : [],
            visibility: formData.type === "Digital" ? "DAYTIME" : formData.type === "LED" ? "NIGHTTIME" : "ALWAYSON",
            featured: formData.status === "Aktif",
            published: formData.status === "Aktif",
          };

          response = await fetch("/api/admin/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(transformedData),
          });
        }
      }

      if (response.ok) {
        const result = await response.json();
        // Refresh the product list
        await fetchProducts();
        setIsProductModalOpen(false);
        return true;
      } else {
        const errorData = await response.json();
        console.error("Failed to save product:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error saving product:", error);
      return false;
    }
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          // Refresh the product list
          await fetchProducts();
          setIsDeleteModalOpen(false);
        } else {
          console.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Nama Produk", "Lokasi", "Harga/Hari", "Visibility", "Status", "Published"];
    const rows = products.map((p) => [
      p.id, 
      p.name, 
      p.location, 
      `Rp ${p.price_daily?.toLocaleString() || 0}`, 
      p.visibility || "N/A", 
      p.status, 
      p.published ? "Published" : "Draft"
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_produk_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-card-dark border border-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
      >
        &lt;
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 rounded-lg border transition-colors ${currentPage === i ? "bg-primary border-primary text-white" : "bg-card-dark border-slate-600 text-white hover:bg-surface-hover"}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-card-dark border border-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
      >
        &gt;
      </button>
    );

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary mr-4">
          Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} produk
        </span>
        <div className="flex items-center gap-1">{pages}</div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <AdminLayout activePage="products">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="products">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Kelola Produk - ReklameKu</title>
      </Head>
      <AdminLayout activePage="products">
        <main className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
          <Header title="Kelola Produk">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar - Desktop */}
              <div className="relative hidden md:block w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Filter Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-10 px-3 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Digital">Digital</option>
                <option value="Statis">Statis</option>
                <option value="LED">LED</option>
              </select>

              {/* Action Buttons */}
              <button 
                onClick={handleExport}
                className="h-10 px-4 bg-[#1a2633] border border-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span className="hidden sm:inline">Export</span>
              </button>

              <button 
                onClick={handleAdd}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>
          </Header>
          
          {/* Mobile Search - Visible only on mobile, below header */}
          <div className="md:hidden px-6 py-4 bg-gray-900 border-b border-gray-800">
             <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {dataLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="card overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1a2633] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#324d67]">
                          <th className="p-4 pl-6">ID</th>
                          <th className="p-4">Gambar</th>
                          <th className="p-4">Nama Produk</th>
                          <th className="p-4">Tipe</th>
                          <th className="p-4">Lokasi</th>
                          <th className="p-4">Harga/Hari</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Published</th>
                          <th className="p-4 text-center pr-6">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#324d67] text-sm">
                        {products.length > 0 ? (
                          products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#2a3f55] transition-colors group">
                              <td className="p-4 pl-6 text-white font-medium">#{product.id}</td>
                              <td className="p-4">
                                <div className="h-10 w-16 bg-[#1a2633] border border-[#324d67] rounded overflow-hidden flex items-center justify-center shadow-sm">
                                  {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="material-symbols-outlined text-gray-500">image</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="text-white font-semibold group-hover:text-primary transition-colors">{product.name}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">oleh {product.creator?.name || "Admin"}</div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{product.visibility}</span>
                              </td>
                              <td className="p-4 text-gray-400">{product.location}</td>
                              <td className="p-4 text-white font-medium font-mono tracking-tight">Rp {product.price_daily?.toLocaleString()}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5 bg-[#1a2633] w-fit px-2 py-1 rounded-md border border-[#324d67]">
                                  <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                  <span className="text-white font-bold text-xs">{product.rating || 0}</span>
                                  <span className="text-gray-500 text-[10px]">({product.review_count || 0})</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-opacity-10 border ${
                                    product.status === "APPROVED"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                      : product.status === "PENDING_APPROVAL"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : product.status === "REJECTED"
                                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${
                                      product.status === "APPROVED" ? "bg-emerald-500" : product.status === "PENDING_APPROVAL" ? "bg-yellow-500" : product.status === "REJECTED" ? "bg-red-500" : "bg-gray-500"
                                    }`}
                                  ></span>
                                  {product.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    product.published ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                  }`}
                                >
                                  {product.published ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary transition-all" title="Edit produk">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button onClick={() => handleDelete(product)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all" title="Hapus produk">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={10} className="p-12 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-[#1a2633] flex items-center justify-center mb-2">
                                  <span className="material-symbols-outlined text-3xl opacity-50">inventory_2</span>
                                </div>
                                <p className="text-lg font-medium text-white">Tidak ada produk ditemukan</p>
                                <p className="text-sm">Silakan buat produk baru untuk memulai</p>
                                <button onClick={handleAdd} className="mt-4 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[20px]">add</span>
                                  Tambah Produk
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && <div className="flex justify-between items-center bg-card-dark rounded-xl border border-white/5 p-4">{renderPagination()}</div>}
              </>
            )}
          </div>
          {/* Modals */}
          <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} product={selectedProduct} />
          <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} title="Hapus Produk" message="Apakah Anda yakin ingin menghapus produk" itemName={selectedProduct?.name} />
        </main>
      </AdminLayout>
    </>
  );
}
