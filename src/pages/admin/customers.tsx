import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import CustomerModal from "../../components/admin/modals/CustomerModal";
import DeleteModal from "../../components/admin/modals/DeleteModal";
import { useAuth } from "../../hooks/useAuth";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

interface Customer {
  id: number;
  uuid: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  orders: number;
  spent: number;
  createdAt: string;
}

export default function AdminCustomers() {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user, currentPage, searchQuery, filterStatus]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchQuery) params.append("search", searchQuery);
      if (filterStatus !== "Semua") params.append("status", filterStatus);

      const response = await fetch(`/api/admin/customers?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCustomer = async (formData: any) => {
    try {
      let response;

      if (selectedCustomer) {
        // Update existing customer
        response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      } else {
        // Create new customer
        response = await fetch("/api/admin/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const result = await response.json();
        await fetchCustomers(); // Refresh the list
        setIsCustomerModalOpen(false);
        await showSuccessAlert("Berhasil", result.message);
      } else {
        // Read the response body once and store it
        const errorText = await response.text();
        let errorMessage = "Failed to save customer";

        // Only parse JSON if response text is not empty
        if (errorText.trim()) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
            console.error("Response status:", response.status);
            console.error("Response text:", errorText);
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } else {
          // Handle empty response body
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        await showErrorAlert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      await showErrorAlert("Error", "Failed to save customer");
    }
  };

  const confirmDelete = async () => {
    if (selectedCustomer) {
      try {
        const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          await fetchCustomers(); // Refresh the list
          setIsDeleteModalOpen(false);
          await showSuccessAlert("Berhasil", "Customer deleted successfully");
        } else {
          try {
            const errorData = await response.json();
            await showErrorAlert("Error", errorData.error || "Failed to delete customer");
          } catch (e) {
            await showErrorAlert("Error", "Failed to delete customer");
          }
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        await showErrorAlert("Error", "Failed to delete customer");
      }
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Nama", "Email", "Perusahaan", "Telepon", "Total Pesanan", "Total Pengeluaran", "Status"];
    const rows = customers.map((c) => [c.id, c.name, c.email, c.company, c.phone, c.orders, `Rp ${c.spent.toLocaleString("id-ID")}`, c.status]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_customer_${new Date().toISOString().split("T")[0]}.csv`);
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
          Menampilkan {Math.min((currentPage - 1) * 10 + 1, totalItems)}-{Math.min(currentPage * 10, totalItems)} dari {totalItems} customer
        </span>
        <div className="flex items-center gap-1">{pages}</div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <AdminLayout activePage="customers">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="customers">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Data Customer - ReklameKu</title>
      </Head>
      <AdminLayout activePage="customers">
        <main className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
          <Header title="Data Customer">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar - Desktop */}
              <div className="relative hidden md:block w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari customer..."
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
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Non-Aktif</option>
                  <option value="PENDING">Pending</option>
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

            {/* Mobile Search - Below Header */}
            <div className="md:hidden mt-4 w-full">
               <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Cari customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1a2633] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
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
                <div className="card overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1a2633] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#324d67]">
                          <th className="p-4 pl-6">ID</th>
                          <th className="p-4">Nama</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Perusahaan</th>
                          <th className="p-4">Telepon</th>
                          <th className="p-4 text-center">Total Pesanan</th>
                          <th className="p-4 text-right">Total Pengeluaran</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center pr-6">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#324d67] text-sm">
                        {customers.length > 0 ? (
                          customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-[#2a3f55] transition-colors group">
                              <td className="p-4 pl-6 text-white font-medium">#{customer.id}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-8 rounded-full bg-[#1a2633] border border-[#324d67] overflow-hidden flex items-center justify-center text-primary font-bold">
                                    {customer.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-white font-semibold group-hover:text-primary transition-colors">{customer.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-400">{customer.email}</td>
                              <td className="p-4 text-gray-400">{customer.company || "-"}</td>
                              <td className="p-4 text-gray-400">{customer.phone}</td>
                              <td className="p-4 text-center text-white font-medium">
                                <span className="inline-block px-2 py-0.5 rounded bg-[#1a2633] border border-[#324d67] text-xs">
                                  {customer.orders}
                                </span>
                              </td>
                              <td className="p-4 text-right text-white font-mono tracking-tight font-medium">Rp {customer.spent.toLocaleString("id-ID")}</td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-opacity-10 ${
                                    customer.status === "ACTIVE"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                      : customer.status === "PENDING"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                  }`}
                                >
                                  <span className={`size-1.5 rounded-full ${customer.status === "ACTIVE" ? "bg-emerald-500" : customer.status === "PENDING" ? "bg-yellow-500" : "bg-gray-500"}`}></span>
                                  {customer.status === "ACTIVE" ? "Aktif" : customer.status === "PENDING" ? "Pending" : "Non-Aktif"}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleEdit(customer)} className="p-2 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary transition-all" title="Edit customer">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button onClick={() => handleDelete(customer)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all" title="Hapus customer">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-12 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-[#1a2633] flex items-center justify-center mb-2">
                                  <span className="material-symbols-outlined text-3xl opacity-50">group</span>
                                </div>
                                <p className="text-lg font-medium text-white">Tidak ada customer ditemukan</p>
                                <p className="text-sm">Silakan tambah customer baru untuk memulai</p>
                                <button onClick={handleAdd} className="mt-4 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[20px]">add</span>
                                  Tambah Customer
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
          <CustomerModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} onSave={handleSaveCustomer} customer={selectedCustomer} />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Hapus Customer"
            message="Apakah Anda yakin ingin menghapus data customer ini?"
            itemName={selectedCustomer?.name}
          />
        </main>
      </AdminLayout>
    </>
  );
}
