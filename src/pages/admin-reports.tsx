import { useState } from 'react';
import Head from 'next/head';

type ReportData = {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
};

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample report data
  const reportData: ReportData[] = [
    { month: 'Jan', revenue: 25000000, orders: 45, customers: 32 },
    { month: 'Feb', revenue: 32000000, orders: 52, customers: 41 },
    { month: 'Mar', revenue: 28000000, orders: 48, customers: 36 },
    { month: 'Apr', revenue: 35000000, orders: 58, customers: 47 },
    { month: 'Mei', revenue: 42000000, orders: 63, customers: 52 },
    { month: 'Jun', revenue: 38000000, orders: 55, customers: 45 },
  ];

  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = reportData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = reportData.reduce((sum, item) => sum + item.customers, 0);

  return (
    <div className="p-6">
      <Head>
        <title>Laporan & Rekap - ReklameKu</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Laporan & Rekap</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800"
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pendapatan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +12% dari bulan lalu
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pesanan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +8% dari bulan lalu
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pelanggan Baru</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalCustomers}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +15% dari bulan lalu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ringkasan Pendapatan</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">
              Ekspor
            </button>
          </div>
        </div>
        <div className="h-80">
          {/* Placeholder for chart */}
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500">Grafik pendapatan akan ditampilkan di sini</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pesanan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#ORD-1001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">15 Jan 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Rp 5.250.000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Selesai
                  </span>
                </td>
              </tr>
              {/* More rows would go here */}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <a href="/manage" className="text-sm text-primary hover:text-blue-700">
            Lihat Semua Pesanan
          </a>
        </div>
      </div>
    </div>
  );
}
