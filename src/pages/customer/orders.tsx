import React, { useState, useEffect } from "react";
import Head from "next/head";
import CustomerLayout from "../../components/customer/CustomerLayout";
import OrderDetailModal from "../../components/customer/modals/OrderDetailModal";
import EditOrderModal from "../../components/customer/modals/EditOrderModal";
import CancelOrderModal from "../../components/customer/modals/CancelOrderModal";
import InvoiceModal from "../../components/customer/modals/InvoiceModal";
import NewOrderModal from "../../components/customer/modals/NewOrderModal";
import CheckoutModal from "../../components/customer/modals/CheckoutModal";
import { useAuth } from "../../hooks/useAuth";

type StatusFilter = "all" | "in_progress" | "completed" | "pending" | "cancelled";

export default function CustomerOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Fetch orders from API
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/customer/orders", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const formattedOrders = data.orders.map((order: any) => ({
            ...order,
            id: order.order_number || `ORD-${order.id}`,
            name: order.order_items?.[0]?.product?.name || "Product Name",
            location: order.shipping_address || order.order_items?.[0]?.product?.location || "Location not set",
            type: order.order_items?.[0]?.product?.type || "Product Type",
            duration: order.start_date && order.end_date ? `${Math.floor((new Date(order.end_date).getTime() - new Date(order.start_date).getTime()) / (1000 * 60 * 60 * 24))} Hari` : "N/A",
            price: `Rp ${order.final_amount?.toLocaleString("id-ID")}`,
            status: order.status,
            image: order.order_items?.[0]?.product?.images?.[0] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
            statusColor: getStatusColorClass(order.status),
          }));
          setOrders(formattedOrders);
          setFilteredOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Apply filters when search or status filter changes
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id?.toLowerCase().includes(lowerQuery) ||
        o.name?.toLowerCase().includes(lowerQuery) ||
        o.location?.toLowerCase().includes(lowerQuery)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "in_progress":
          filtered = filtered.filter(o => ["IN_PROGRESS", "SHIPPED"].includes(o.status));
          break;
        case "completed":
          filtered = filtered.filter(o => ["COMPLETED", "DELIVERED"].includes(o.status));
          break;
        case "pending":
          filtered = filtered.filter(o => ["PENDING", "CONFIRMED"].includes(o.status));
          break;
        case "cancelled":
          filtered = filtered.filter(o => o.status === "CANCELLED");
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  // Helper function for status styling
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING":
      case "CONFIRMED":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "SHIPPED":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "REFUNDED":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const handleAction = (order: any, type: "detail" | "edit" | "cancel" | "invoice") => {
    setSelectedOrder(order);
    if (type === "detail") setIsDetailOpen(true);
    if (type === "edit") setIsEditOpen(true);
    if (type === "cancel") setIsCancelOpen(true);
    if (type === "invoice") setIsInvoiceOpen(true);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsNewOrderOpen(false);
    setIsCheckoutOpen(true);
  };

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Semua Status" },
    { key: "in_progress", label: "Sedang Berjalan" },
    { key: "pending", label: "Perlu Tindakan" },
    { key: "completed", label: "Selesai" },
  ];

  if (authLoading) {
    return (
      <CustomerLayout activePage="orders" title="Riwayat Pesanan">
        <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">Pesanan Saya</h1>
                <p className="text-[#92adc9] text-base md:text-lg">Kelola dan pantau status pesanan papan reklame secara real-time.</p>
              </div>
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
      <CustomerLayout activePage="orders" title="Riwayat Pesanan">
        <main className="flex-1 flex flex-col relative bg-background-dark text-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-8">
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
        <title>Pesanan Saya - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="orders" title="Riwayat Pesanan">
        <main className="flex-1 flex flex-col relative bg-background-dark text-white p-6 md:p-8 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl font-bold tracking-tight">Pesanan Saya</h1>
                <p className="text-gray-400 text-base">Kelola dan pantau status pesanan papan reklame secara real-time.</p>
              </div>
              <button
                onClick={() => setIsNewOrderOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Pesan Baru</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Pesanan", value: filteredOrders.length.toString(), icon: "shopping_bag", color: "primary" },
                { label: "Sedang Berjalan", value: filteredOrders.filter((o: any) => ["IN_PROGRESS", "SHIPPED"].includes(o.status)).length.toString(), icon: "play_circle", color: "emerald" },
                { label: "Perlu Tindakan", value: filteredOrders.filter((o: any) => ["PENDING", "CONFIRMED"].includes(o.status)).length.toString(), icon: "pending_actions", color: "yellow" },
                { label: "Total Investasi", value: `Rp ${(filteredOrders.reduce((sum, order) => sum + (parseFloat(order.price.replace(/[^\d.]/g, "")) || 0), 0) / 1000000).toFixed(0)}M`, icon: "payments", color: "emerald" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-card-dark border border-white/5 rounded-xl p-5 flex flex-col gap-2 shadow-sm hover:bg-[#1a2b3c] transition-colors group">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                    <span className={`material-symbols-outlined text-${stat.color}-500 text-[20px] group-hover:scale-110 transition-transform`}>{stat.icon}</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#1a2633] border border-white/5 p-4 rounded-xl shadow-sm">
              <div className="flex-1 relative w-full max-w-lg">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input
                  className="w-full pl-12 pr-10 py-2.5 rounded-lg bg-[#111a22] border border-white/5 text-sm text-white outline-none focus:ring-1 focus:ring-primary placeholder-gray-500"
                  placeholder="Cari ID pesanan, nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide" role="group" aria-label="Filter status pesanan">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      statusFilter === filter.key
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    aria-label={`Tampilkan ${filter.label}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4 pb-20">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-primary/30 transition-all">
                        <div className="flex items-start gap-5">
                          <div
                            className="size-20 md:size-24 rounded-lg bg-cover bg-center shrink-0 border border-[#324d67]"
                            style={{ backgroundImage: `url('${order.images && order.images.length > 0 ? order.images[0] : order.image || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"}')` }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-white text-lg font-bold truncate group-hover:text-primary transition-colors">{order.name}</h3>
                              <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${order.statusColor}`}>
                                <span className="size-1.5 rounded-full bg-current"></span>
                                {order.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                              <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-0.5">ID Transaksi</p>
                                <p className="text-white text-sm font-medium font-mono">{order.id}</p>
                              </div>
                              <div className="hidden sm:block">
                                <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-0.5">Periode Sewa</p>
                                <p className="text-white text-sm font-medium">
                                  {order.start_date && order.end_date ? new Date(order.start_date).toLocaleDateString("id-ID") + " - " + new Date(order.end_date).toLocaleDateString("id-ID") : "Period not set"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-0.5">Total Harga</p>
                                <p className="text-white text-sm font-bold font-mono">{order.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Group */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#324d67]">
                          <button
                            onClick={() => handleAction(order, "detail")}
                            className="flex-1 lg:flex-none h-10 px-4 bg-[#1a2633] hover:bg-[#233648] text-gray-300 hover:text-white rounded-lg border border-[#324d67] transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Detail</span>
                          </button>
                          <button
                            onClick={() => handleAction(order, "invoice")}
                            className="flex-1 lg:flex-none h-10 px-4 bg-[#1a2633] hover:bg-[#233648] text-gray-300 hover:text-white rounded-lg border border-[#324d67] transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Invoice</span>
                          </button>
                          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                            <button
                              onClick={() => handleAction(order, "edit")}
                               className="flex-1 lg:flex-none h-10 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 hover:text-emerald-400 rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit_note</span>
                              <span className="text-xs font-bold uppercase tracking-wider">Edit</span>
                            </button>
                          )}
                          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                            <button
                              onClick={() => handleAction(order, "cancel")}
                              className="flex-1 lg:flex-none h-10 w-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg border border-red-500/20 transition-all flex items-center justify-center"
                              title="Batalkan Pesanan"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          )}
                        </div>
                    </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#92adc9]">
                  <p className="text-lg">Tidak ada pesanan yang ditemukan</p>
                  <p className="text-sm mt-2">Coba ubah filter atau kata pencarian</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </CustomerLayout>

      <OrderDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} order={selectedOrder} />
      <EditOrderModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} order={selectedOrder} />
      <CancelOrderModal isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} order={selectedOrder} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
      <NewOrderModal isOpen={isNewOrderOpen} onClose={() => setIsNewOrderOpen(false)} onSelectProduct={handleSelectProduct} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} product={selectedProduct} />
    </>
  );
}
