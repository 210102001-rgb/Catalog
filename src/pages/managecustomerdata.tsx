import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth } from "@/hooks/useAuth";
import Layout from "../../components/Layout";

interface CustomerData {
  id: number;
  user_id: number;
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  npwp_number?: string;
  npwp_file?: string;
  ktp_number?: string;
  ktp_file?: string;
  bank_account?: string;
  bank_name?: string;
  verification_status: string;
  verified_by?: number;
  verified_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status: string;
  };
}

export default function ManageCustomerData() {
  const { user, loading } = useAuth();
  const [customerDataList, setCustomerDataList] = useState<CustomerData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedData, setSelectedData] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user, filters]);

  const fetchCustomerData = async () => {
    try {
      setLoadingData(true);
      const queryParams = new URLSearchParams({
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/customer-data?${queryParams}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerDataList(data.data || []);
      } else {
        console.error("Failed to fetch customer data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleVerify = async (id: number, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/customer-data/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          approved: approve,
          reason: approve ? "" : "Document tidak lengkap atau tidak valid",
        }),
      });

      if (response.ok) {
        alert(approve ? "Data berhasil disetujui" : "Data berhasil ditolak");
        setIsModalOpen(false);
        setSelectedData(null);
        fetchCustomerData();
      } else {
        alert("Gagal memproses verifikasi");
      }
    } catch (error) {
      console.error("Error verifying customer data:", error);
      alert("Terjadi kesalahan saat memproses verifikasi");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Menunggu Verifikasi",
      },
      APPROVED: {
        bg: "bg-green-100 text-green-800 border-green-200",
        text: "Terverifikasi",
      },
      REJECTED: {
        bg: "bg-red-100 text-red-800 border-red-200",
        text: "Ditolak",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Silakan login terlebih dahulu</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Manage Customer Data - ReklameKu</title>
      </Head>
      <Layout>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Customer</h1>
            <p className="text-gray-600">Kelola verifikasi data customer yang mendaftar</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Cari nama atau email customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="PENDING">Menunggu Verifikasi</option>
                  <option value="APPROVED">Terverifikasi</option>
                  <option value="REJECTED">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loadingData ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Perusahaan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NPWP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerDataList.length > 0 ? (
                      customerDataList.map((data) => (
                        <tr key={data.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{data.user.name}</div>
                              <div className="text-sm text-gray-500">{data.user.email}</div>
                              {data.user.phone && (
                                <div className="text-sm text-gray-500">{data.user.phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{data.company_name || "-"}</div>
                            {data.company_address && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">{data.company_address}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{data.npwp_number || "-"}</div>
                            {data.npwp_file && (
                              <div className="text-xs text-blue-600">
                                <a href={data.npwp_file} target="_blank" rel="noopener noreferrer">
                                  Lihat File
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(data.verification_status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(data.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedData(data);
                                setIsModalOpen(true);
                              }}
                              className="text-primary hover:text-blue-600 mr-3"
                            >
                              Detail
                            </button>
                            {data.verification_status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleVerify(data.id, true)}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleVerify(data.id, false)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          Tidak ada data customer yang ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Modal */}
          {isModalOpen && selectedData && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Detail Data Customer
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Data Pribadi</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Nama:</strong> {selectedData.user.name}</div>
                              <div><strong>Email:</strong> {selectedData.user.email}</div>
                              <div><strong>Phone:</strong> {selectedData.user.phone || "-"}</div>
                              <div><strong>Status Akun:</strong> {selectedData.user.status}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Data Perusahaan</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Nama Perusahaan:</strong> {selectedData.company_name || "-"}</div>
                              <div><strong>Alamat:</strong> {selectedData.company_address || "-"}</div>
                              <div><strong>Telepon:</strong> {selectedData.company_phone || "-"}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">NPWP</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Nomor:</strong> {selectedData.npwp_number || "-"}</div>
                              {selectedData.npwp_file && (
                                <div>
                                  <strong>File:</strong> 
                                  <a href={selectedData.npwp_file} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                                    Lihat NPWP
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">KTP</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Nomor:</strong> {selectedData.ktp_number || "-"}</div>
                              {selectedData.ktp_file && (
                                <div>
                                  <strong>File:</strong> 
                                  <a href={selectedData.ktp_file} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                                    Lihat KTP
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Data Bank</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Bank:</strong> {selectedData.bank_name || "-"}</div>
                              <div><strong>No. Rekening:</strong> {selectedData.bank_account || "-"}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Verifikasi</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Status:</strong> {getStatusBadge(selectedData.verification_status)}</div>
                              <div><strong>Tanggal Submit:</strong> {new Date(selectedData.created_at).toLocaleDateString("id-ID")}</div>
                              {selectedData.verified_at && (
                                <div><strong>Tanggal Verifikasi:</strong> {new Date(selectedData.verified_at).toLocaleDateString("id-ID")}</div>
                              )}
                              {selectedData.rejected_reason && (
                                <div><strong>Alasan Penolakan:</strong> {selectedData.rejected_reason}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    {selectedData.verification_status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleVerify(selectedData.id, true)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleVerify(selectedData.id, false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}