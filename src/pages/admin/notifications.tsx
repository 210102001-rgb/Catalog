import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  order?: {
    id: number;
    order_number: string;
  };
}

export default function AdminNotifications() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state for creating notifications
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    user_id: "",
    title: "",
    message: "",
    type: "SYSTEM_ALERT",
  });

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, currentPage, searchQuery, filterType]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchQuery) params.append("search", searchQuery);
      if (filterType !== "all") params.append("type", filterType);

      const response = await fetch(`/api/admin/notifications?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        const result = await response.json();
        await fetchNotifications();
        setIsCreateModalOpen(false);
        setCreateForm({
          user_id: "",
          title: "",
          message: "",
          type: "SYSTEM_ALERT",
        });
        await showSuccessAlert("Berhasil", "Notifikasi berhasil dibuat");
      } else {
        const errorData = await response.json();
        await showErrorAlert("Error", errorData.error || "Gagal membuat notifikasi");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      await showErrorAlert("Error", "Gagal membuat notifikasi");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        await fetchNotifications();
        await showSuccessAlert("Berhasil", "Notifikasi berhasil dihapus");
      } else {
        const errorData = await response.json();
        await showErrorAlert("Error", errorData.error || "Gagal menghapus notifikasi");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      await showErrorAlert("Error", "Gagal menghapus notifikasi");
    }
  };

  const getTimeDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          Menampilkan {Math.min((currentPage - 1) * 10 + 1, totalItems)}-{Math.min(currentPage * 10, totalItems)} dari {totalItems} notifikasi
        </span>
        <div className="flex items-center gap-1">{pages}</div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <AdminLayout activePage="notifications">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="notifications">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Manajemen Notifikasi - ReklameKu</title>
      </Head>
      <AdminLayout activePage="notifications">
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
          <Header title="Manajemen Notifikasi" className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50">
            <div className="space-y-3 md:space-y-4">
              {/* Breadcrumb - Hidden on mobile */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-400 font-normal">Dashboard</span>
                <span className="text-gray-600">/</span>
                <span className="text-white font-medium">Manajemen Notifikasi</span>
              </nav>
              
              {/* Title Section - Mobile Optimized */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <div>
                  <h1 className="admin-title-mobile">
                    Manajemen Notifikasi
                  </h1>
                  <p className="text-sm text-gray-400 mt-1 font-normal">
                    Kelola dan kirim notifikasi ke customer
                  </p>
                </div>
                
                {/* Action Button - Mobile First */}
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 h-8 md:h-9 bg-blue-600 border border-blue-600 rounded-md text-xs md:text-sm font-medium text-white hover:bg-blue-700 hover:border-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="md:inline">Buat Notifikasi</span>
                  </button>
                </div>
              </div>

              {/* Search Bar - Mobile First Design */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari notifikasi berdasarkan judul atau konten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-300"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filters - Mobile Horizontal Scroll */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-shrink-0 h-9 px-3 bg-gray-800 border border-gray-600 rounded-md text-sm text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  aria-label="Filter tipe notifikasi"
                >
                  <option value="all">Tipe</option>
                  <option value="ORDER_STATUS">Order Status</option>
                  <option value="PAYMENT_STATUS">Payment Status</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="SYSTEM_ALERT">System Alert</option>
                </select>

                {/* Clear Filters */}
                {(searchQuery || filterType !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                    }}
                    className="flex-shrink-0 px-3 py-2 h-9 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Results Counter - Bottom Right on Mobile */}
              <div className="flex items-center justify-end">
                <div className="text-xs md:text-sm text-gray-400">
                  Showing notifications
                </div>
              </div>
            </div>
          </Header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                          <th className="p-4">ID</th>
                          <th className="p-4">User</th>
                          <th className="p-4">Judul</th>
                          <th className="p-4">Tipe</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Tanggal</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <tr key={notification.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-white font-medium">#{notification.id}</td>
                              <td className="p-4">
                                <div>
                                  <div className="text-white font-semibold">{notification.user.name}</div>
                                  <div className="text-xs text-text-secondary">{notification.user.email}</div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="text-white font-medium">{notification.title}</div>
                                  <div className="text-xs text-text-secondary truncate max-w-xs">{notification.message}</div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{notification.type}</span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    notification.read ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  }`}
                                >
                                  <span className={`size-1.5 rounded-full ${notification.read ? "bg-green-500" : "bg-yellow-500"}`}></span>
                                  {notification.read ? "Dibaca" : "Belum Dibaca"}
                                </span>
                              </td>
                              <td className="p-4 text-text-secondary">{getTimeDisplay(notification.created_at)}</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteNotification(notification.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-all" title="Hapus notifikasi">
                                  <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-text-secondary">
                              <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-slate-500">notifications</span>
                                <p>Tidak ada notifikasi ditemukan</p>
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

          {/* Create Notification Modal */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card-dark rounded-xl border border-white/5 w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-bold">Buat Notifikasi Baru</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-text-secondary hover:text-white">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <form onSubmit={handleCreateNotification} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">User ID *</label>
                    <input
                      type="number"
                      value={createForm.user_id}
                      onChange={(e) => setCreateForm({ ...createForm, user_id: e.target.value })}
                      className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Masukkan ID user"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Judul *</label>
                    <input
                      type="text"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Judul notifikasi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Pesan *</label>
                    <textarea
                      value={createForm.message}
                      onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Isi notifikasi"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tipe</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                      aria-label="Pilih tipe notifikasi"
                    >
                      <option value="SYSTEM_ALERT">System Alert</option>
                      <option value="ORDER_STATUS">Order Status</option>
                      <option value="PAYMENT_STATUS">Payment Status</option>
                      <option value="PROMOTION">Promotion</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-200 bg-card-dark border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                      Batal
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors">
                      Buat Notifikasi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </AdminLayout>
    </>
  );
}
