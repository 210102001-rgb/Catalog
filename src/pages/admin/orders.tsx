import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import OrderModal from "../../components/admin/modals/OrderModal";
import DeleteModal from "../../components/admin/modals/DeleteModal";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Modal States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");
        if (response.ok) {
          const data = await response.json();
          // Convert API response to match the UI format
          const formattedOrders = data.orders.map((order: any) => ({
            ...order,
            id: order.order_number || `ORD-${order.id}`,
            client: order.user?.name || "Unknown Client",
            location: order.shipping_address || "Location not set",
            duration: `${Math.floor((new Date(order.end_date).getTime() - new Date(order.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`,
            status: order.status,
            amount: `Rp ${order.final_amount?.toLocaleString("id-ID")}`,
            statusColor: getStatusColorClass(order.status),
            dotColor: getStatusDotColor(order.status),
          }));
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper functions for status styling
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

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-emerald-500";
      case "PENDING":
      case "CONFIRMED":
        return "bg-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "CANCELLED":
        return "bg-red-500";
      case "SHIPPED":
        return "bg-indigo-500";
      case "REFUNDED":
        return "bg-gray-500";
      default:
        return "bg-slate-500";
    }
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDelete = (order: any) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleSaveOrder = async (formData: any) => {
    try {
      if (selectedOrder) {
        // Update existing order
        const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();

          // Update the order in the local state
          setOrders(
            orders.map((o) =>
              o.id === selectedOrder.id
                ? {
                    ...o,
                    ...formData,
                    statusColor: getStatusColorClass(formData.status),
                    dotColor: getStatusDotColor(formData.status),
                  }
                : o
            )
          );

          setIsOrderModalOpen(false);
        } else {
          throw new Error("Failed to update order");
        }
      } else {
        // Create new order - in a real implementation, this would be handled by the API
        // For now, we'll add it to the local state
        const newOrder = {
          ...formData,
          id: `ORD-${Date.now()}`,
          statusColor: getStatusColorClass(formData.status),
          dotColor: getStatusDotColor(formData.status),
        };

        setOrders([...orders, newOrder]);
        setIsOrderModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      await showErrorAlert("Gagal Menyimpan Pesanan", "Gagal menyimpan pesanan. Silakan coba lagi.");
    }
  };

  const confirmDelete = async () => {
    if (selectedOrder) {
      try {
        const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setOrders(orders.filter((o) => o.id !== selectedOrder.id));
          setIsDeleteModalOpen(false);
        } else {
          throw new Error("Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        await showErrorAlert("Gagal Menghapus Pesanan", "Gagal menghapus pesanan. Silakan coba lagi.");
      }
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Client", "Location", "Duration", "Status", "Amount"];
    const rows = filteredOrders.map((o) => [o.id, o.client, o.location, o.duration, o.status, o.amount]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_pesanan_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "Semua" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout activePage="orders">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Kelola Pesanan - ReklameKu</title>
      </Head>
      <AdminLayout activePage="orders">
        <main className="flex-1 flex flex-col min-h-0 bg-background-dark overflow-hidden">
          <Header title="Kelola Pesanan">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar - Desktop */}
              <div className="relative hidden md:block w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

               {/* Filter Status */}
               <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-3 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
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
                <span className="hidden sm:inline">Buat</span>
              </button>
            </div>

            {/* Mobile Search - Below Header */}
            <div className="md:hidden mt-4 w-full">
               <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </Header>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a2633] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#324d67]">
                      <th className="p-4 pl-6">ID Pesanan</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Lokasi</th>
                      <th className="p-4">Durasi</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Jumlah</th>
                      <th className="p-4 text-center pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#324d67] text-sm">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#2a3f55] transition-colors group">
                          <td className="p-4 pl-6 text-white font-medium">{order.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {order.client.charAt(0)}
                              </div>
                              <span className="text-white font-medium group-hover:text-primary transition-colors">{order.client}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400">{order.location}</td>
                          <td className="p-4 text-gray-400 bg-opacity-50 font-mono text-xs">
                             <span className="px-2 py-1 rounded bg-[#1a2633] border border-[#324d67]">{order.duration}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-opacity-10 ${order.statusColor}`}>
                              <span className={`size-1.5 rounded-full ${order.dotColor}`}></span>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right text-white font-medium tracking-tight font-mono">{order.amount}</td>
                          <td className="p-4 pr-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleEdit(order)} className="p-2 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary transition-all">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button onClick={() => handleDelete(order)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-500">
                           <div className="flex flex-col items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-4xl opacity-20">inbox</span>
                              <p>Tidak ada pesanan ditemukan</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modals */}
          <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} onSave={handleSaveOrder} order={selectedOrder} />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Hapus Pesanan"
            message="Apakah Anda yakin ingin menghapus data pesanan ini? Tindakan ini tidak dapat dibatalkan."
            itemName={selectedOrder?.id}
          />
        </main>
      </AdminLayout>
    </>
  );
}
