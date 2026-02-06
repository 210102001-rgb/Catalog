import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import DateRangeModal from "../../components/admin/modals/DateRangeModal";
import { showInfoAlert, showErrorAlert, showSuccessAlert } from "../../utils/swalConfig";
import { useAuth } from "../../hooks/useAuth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportSummary {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  revenueGrowth: number;
}

interface PopularLocation {
  location: string;
  orders: number;
  percentage: number;
}

interface ProductPerformance {
  type: string;
  totalUnits: number;
  occupancyRate: string;
  revenue: string;
  growth: string;
}

interface ReportData {
  summary: ReportSummary;
  popularLocations: PopularLocation[];
  productPerformance: ProductPerformance[];
}

export default function AdminReports() {
  const { user, loading: authLoading } = useAuth();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleApplyDate = (start: string, end: string) => {
    setDateRange({ start, end });
    // Fetch new data based on date range
    fetchReportData(start, end);
  };

  const fetchReportData = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/admin/reports";
      const params = new URLSearchParams();

      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      if (params.toString()) {
        url += "?" + params.toString();
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else if (response.status === 401) {
        setError("Silakan login terlebih dahulu");
      } else if (response.status === 403) {
        setError("Akses ditolak. Hanya admin yang dapat mengakses laporan.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Gagal memuat data laporan");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Terjadi kesalahan saat memuat data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user]);

  const handleExport = async () => {
    if (!reportData) {
      await showErrorAlert("Error", "Tidak ada data untuk diexport");
      return;
    }

    await showInfoAlert("Membuat Laporan", "Sedang menghasilkan PDF...");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Title Header Background
      doc.setFillColor(19, 127, 236); // Primary Blue
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Title Text
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN REKLAMEKU", 14, 18);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Platform Manajemen Reklame Digital & Fisik", 14, 25);

      // Report Info (Right aligned in header)
      doc.setFontSize(9);
      doc.text(`Dicetak Oleh: ${user?.name || 'Admin'}`, pageWidth - 14, 15, { align: "right" });
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 14, 21, { align: "right" });
      const period = dateRange.start ? `${dateRange.start} s/d ${dateRange.end}` : "30 Hari Terakhir";
      doc.text(`Periode Data: ${period}`, pageWidth - 14, 27, { align: "right" });
      
      // Summary Cards Section
      let currentY = 55;
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.setFont("helvetica", "bold");
      doc.text("Ringkasan Eksekutif", 14, currentY);
      
      // Draw Summary Box
      currentY += 5;
      const boxWidth = (pageWidth - 28) / 4;
      const boxHeight = 25;
      
      // Helper to draw stat
      const drawStat = (x: number, label: string, value: string, color: string = "#000") => {
          doc.setFillColor(248, 249, 250);
          doc.setDrawColor(230, 230, 230);
          doc.roundedRect(x, currentY, boxWidth - 4, boxHeight, 2, 2, 'FD');
          
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(label, x + 5, currentY + 8);
          
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.setFont("helvetica", "bold");
          doc.text(value, x + 5, currentY + 18);
      };

      drawStat(14, "Total Pendapatan", formatCurrency(reportData.summary.totalRevenue));
      drawStat(14 + boxWidth, "Total Pesanan", reportData.summary.totalOrders.toString());
      drawStat(14 + (boxWidth * 2), "Customer Baru", reportData.summary.newCustomers.toString());
      drawStat(14 + (boxWidth * 3), "Pertumbuhan", `${reportData.summary.revenueGrowth >= 0 ? "+" : ""}${reportData.summary.revenueGrowth}%`);

      currentY += 35;

      // Popular Locations Table
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Lokasi Populer", 14, currentY);
      
      const locationsData = reportData.popularLocations.map((loc, index) => [
        { content: (index + 1).toString(), styles: { halign: 'center' } },
        loc.location,
        { content: loc.orders.toString(), styles: { halign: 'right' } },
        { content: `${loc.percentage}%`, styles: { halign: 'right' } },
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [["No", "Lokasi", "Total Pesanan", "Kontribusi"]],
        body: locationsData as any,
        theme: "plain",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 }
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: 14, right: 14 },
      });
      
      // Product Performance Table
      const perfY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Performa Produk & Aset", 14, perfY);
      
      const perfData = reportData.productPerformance.map((prod) => [
        prod.type,
        { content: prod.totalUnits.toString(), styles: { halign: 'right' } },
        { content: prod.occupancyRate, styles: { halign: 'right' } },
        { content: prod.revenue, styles: { halign: 'right' } },
        { content: prod.growth, styles: { halign: 'right', textColor: prod.growth.includes('+') ? [0, 150, 0] : [0, 0, 0] } },
      ]);
      
      autoTable(doc, {
        startY: perfY + 5,
        head: [["Kategori Produk", "Unit Tersewa", "Okupansi", "Revenue", "Tren Growth"]],
        body: perfData as any,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 4, lineColor: [220, 220, 220] },
        headStyles: { fillColor: [19, 127, 236], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: 14, right: 14 },
      });
      
      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`ReklameKu Confidential Report - Hal ${i} dari ${totalPages}`, pageWidth / 2, 285, { align: "center" });
      }
      
      // Save PDF
      const fileName = `Laporan_ReklameKu_${dateRange.start ? dateRange.start.replace(/\//g, "") : "Latest"}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
      await showSuccessAlert("Berhasil", `Laporan berhasil diunduh`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      await showErrorAlert("Error", "Gagal membuat PDF. Silakan coba lagi.");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Initialize with empty data to prevent hydration mismatch
  const displayData = loading || authLoading
    ? {
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          newCustomers: 0,
          revenueGrowth: 0,
        },
        popularLocations: [],
        productPerformance: [],
      }
    : reportData;

  if (authLoading) {
    return (
      <AdminLayout activePage="reports">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="reports">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Laporan & Rekap - ReklameKu</title>
      </Head>
      <AdminLayout activePage="reports">
        <main className="flex-1 flex flex-col min-h-0 bg-background-dark overflow-hidden">
          <Header title="Laporan & Rekap">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setIsDateModalOpen(true)} 
                className="h-10 px-4 bg-[#1a2633] border border-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span className="text-sm">{dateRange.start ? `${dateRange.start} - ${dateRange.end}` : "Pilih Periode"}</span>
              </button>
              
              <button 
                onClick={handleExport} 
                className="h-10 px-4 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span className="text-sm">Download PDF</span>
              </button>
            </div>
          </Header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => fetchReportData()}
                  className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Period Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon="monetization_on"
                title="Total Revenue"
                value={formatCurrency(displayData?.summary.totalRevenue || 0)}
                trend={`${(displayData?.summary.revenueGrowth || 0) >= 0 ? "+" : ""}${displayData?.summary.revenueGrowth || 0}%`}
              />
              <StatCard
                icon="shopping_bag"
                title="Total Pesanan"
                value={(displayData?.summary.totalOrders || 0).toString()}
                trend={`${(displayData?.summary.totalOrders || 0) > 0 ? "+" : ""}${Math.floor((displayData?.summary.totalOrders || 0) / 10)}%`}
              />
              <StatCard
                icon="people"
                title="Customer Baru"
                value={(displayData?.summary.newCustomers || 0).toString()}
                trend={`${(displayData?.summary.newCustomers || 0) > 0 ? "+" : ""}${Math.floor((displayData?.summary.newCustomers || 0) / 5)}%`}
              />
              <StatCard
                icon="trending_up"
                title="Growth Rate"
                value={`${(displayData?.summary.revenueGrowth || 0) >= 0 ? "+" : ""}${displayData?.summary.revenueGrowth || 0}%`}
                trend={`${(displayData?.summary.revenueGrowth || 0) >= 0 ? "+" : ""}${Math.max(0, (displayData?.summary.revenueGrowth || 0) - 2)}%`}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-white text-lg font-bold mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center text-text-secondary border-2 border-dashed border-white/10 rounded-lg">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">bar_chart</span>
                    <p>Chart Visualization Placeholder</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-white text-lg font-bold mb-4">Lokasi Populer</h3>
                <div className="space-y-3">
                  {displayData?.popularLocations && displayData.popularLocations.length > 0 ? (
                    displayData.popularLocations.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-white text-sm font-medium">{item.location}</p>
                          <p className="text-text-secondary text-sm">{item.orders} pesanan</p>
                        </div>
                        <div className="w-full bg-background-dark rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-text-secondary">
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className="card p-6">
              <h3 className="text-white text-lg font-bold mb-4">Performance by Product Type</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                      <th className="p-4">Type</th>
                      <th className="p-4 text-right">Total Units</th>
                      <th className="p-4 text-right">Occupancy Rate</th>
                      <th className="p-4 text-right">Revenue</th>
                      <th className="p-4 text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {displayData?.productPerformance && displayData.productPerformance.length > 0 ? (
                      displayData.productPerformance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-4 text-white font-medium">{item.type}</td>
                          <td className="p-4 text-right text-white">{item.totalUnits}</td>
                          <td className="p-4 text-right text-white">{item.occupancyRate}</td>
                          <td className="p-4 text-right text-white font-medium">{item.revenue}</td>
                          <td className="p-4 text-right text-green-400">{item.growth}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-text-secondary">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {loading && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          <DateRangeModal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} onApply={handleApplyDate} />
        </main>
      </AdminLayout>
    </>
  );
}
