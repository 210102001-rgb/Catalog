import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Order = {
  id: string;
  date: string;
  status: 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
};

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [recentOrders] = useState<Order[]>([
    {
      id: 'ORD-1001',
      date: '15 Jan 2025',
      status: 'diproses',
      total: 5250000,
      items: [
        { name: 'Baliho Standard 3x6m', quantity: 1, price: 5000000, image: '/images/baliho-1.jpg' },
        { name: 'Pemasangan', quantity: 1, price: 250000, image: '/images/installation.jpg' },
      ],
    },
    {
      id: 'ORD-1000',
      date: '5 Jan 2025',
      status: 'selesai',
      total: 2500000,
      items: [
        { name: 'Spanduk 1x3m', quantity: 2, price: 250000, image: '/images/spanduk.jpg' },
      ],
    },
  ]);

  return (
    <div className="p-6">
      <Head>
        <title>Dashboard Pelanggan - ReklameKu</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Halo, John Doe</h1>
        <p className="text-gray-600 dark:text-gray-400">Selamat datang kembali di dashboard Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pesanan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pesanan Selesai</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dalam Proses</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Pesanan Terbaru
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'favorites'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Favorit Saya
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Pesan
          </button>
        </nav>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-surface-dark shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pesanan Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 rounded-md object-cover"
                      src={order.items[0].image}
                      alt={order.items[0].name}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      <Link href={`/customer/orders/${order.id}`} className="hover:text-primary">
                        Pesanan #{order.id}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.date} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      Rp {order.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'selesai'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : order.status === 'diproses'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/customer/orders/${order.id}`}
                  className="text-sm font-medium text-primary hover:text-blue-700"
                >
                  Lihat Detail <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link
            href="/customer/orders"
            className="text-sm font-medium text-primary hover:text-blue-700"
          >
            Lihat Semua Pesanan
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/katalog"
            className="p-4 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                <span className="material-symbols-outlined">add_shopping_cart</span>
              </div>
              <span className="font-medium">Pesan Baru</span>
            </div>
          </Link>
          <Link
            href="/customer/chat"
            className="p-4 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <span className="font-medium">Hubungi Admin</span>
            </div>
          </Link>
          <Link
            href="/customer/orders"
            className="p-4 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <span className="font-medium">Riwayat Pesanan</span>
            </div>
          </Link>
          <Link
            href="/profile"
            className="p-4 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-3">
                <span className="material-symbols-outlined">person</span>
              </div>
              <span className="font-medium">Profil Saya</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
