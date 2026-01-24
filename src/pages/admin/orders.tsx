import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';
import OrderModal from '../../components/admin/modals/OrderModal';
import DeleteModal from '../../components/admin/modals/DeleteModal';

export default function AdminOrders() {
    const [orders, setOrders] = useState([
        { id: '#ORD-7742', client: 'Nike Indonesia', location: 'Bundaran HI, Jakarta', duration: '30 Hari', status: 'Aktif', statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dotColor: 'bg-emerald-500', amount: 'Rp 45.000.000' },
        { id: '#ORD-7741', client: 'Coca-Cola', location: 'Tol Jagorawi KM 4', duration: '15 Hari', status: 'Menunggu', statusColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', dotColor: 'bg-yellow-500', amount: 'Rp 12.500.000' },
        { id: '#ORD-7740', client: 'Shopee', location: 'Sudirman, Jakarta', duration: '7 Hari', status: 'Terjadwal', statusColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dotColor: 'bg-blue-500', amount: 'Rp 8.200.000' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');

    // Modal States
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

    const handleSaveOrder = (formData: any) => {
        if (selectedOrder) {
            // Update status color based on new status
            let newStatusColor = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            let newDotColor = 'bg-slate-500';

            switch (formData.status) {
                case 'Aktif':
                    newStatusColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                    newDotColor = 'bg-emerald-500';
                    break;
                case 'Menunggu':
                    newStatusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                    newDotColor = 'bg-yellow-500';
                    break;
                case 'Terjadwal':
                    newStatusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    newDotColor = 'bg-blue-500';
                    break;
                case 'Selesai':
                    newStatusColor = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
                    newDotColor = 'bg-gray-500';
                    break;
                case 'Dibatalkan':
                    newStatusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                    newDotColor = 'bg-red-500';
                    break;
            }

            setOrders(orders.map(o => o.id === selectedOrder.id ? {
                ...o,
                ...formData,
                statusColor: newStatusColor,
                dotColor: newDotColor
            } : o));
        } else {
            // Add New - Determine colors
            let newStatusColor = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            let newDotColor = 'bg-slate-500';

            switch (formData.status) {
                case 'Aktif':
                    newStatusColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                    newDotColor = 'bg-emerald-500';
                    break;
                case 'Menunggu':
                    newStatusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                    newDotColor = 'bg-yellow-500';
                    break;
                case 'Terjadwal':
                    newStatusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    newDotColor = 'bg-blue-500';
                    break;
                case 'Selesai':
                    newStatusColor = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
                    newDotColor = 'bg-gray-500';
                    break;
                case 'Dibatalkan':
                    newStatusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                    newDotColor = 'bg-red-500';
                    break;
            }

            // Generate simple ID
            const newId = `#ORD-${7743 + orders.length}`;
            setOrders([...orders, {
                ...formData,
                id: newId,
                statusColor: newStatusColor,
                dotColor: newDotColor
            }]);
        }
    };

    const confirmDelete = () => {
        if (selectedOrder) {
            setOrders(orders.filter(o => o.id !== selectedOrder.id));
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Client", "Location", "Duration", "Status", "Amount"];
        const rows = orders.map(o => [o.id, o.client, o.location, o.duration, o.status, o.amount]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_pesanan.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'Semua' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head>
                <title>Kelola Pesanan - ReklameKu</title>
            </Head>
            <AdminLayout activePage="orders">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Kelola Pesanan">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Cari ID/Klien..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-card-dark border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full md:w-auto px-4 py-2 bg-card-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Menunggu">Menunggu</option>
                                <option value="Terjadwal">Terjadwal</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                            <button
                                onClick={handleExport}
                                className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Export
                            </button>
                            <button
                                onClick={handleAdd}
                                className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Buat Pesanan
                            </button>
                        </div>
                    </Header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                            <th className="p-4">ID Pesanan</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Lokasi</th>
                                            <th className="p-4">Durasi</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Jumlah</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">{order.id}</td>
                                                <td className="p-4 text-white font-semibold group-hover:text-primary transition-colors">{order.client}</td>
                                                <td className="p-4 text-text-secondary">{order.location}</td>
                                                <td className="p-4 text-text-secondary">{order.duration}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.statusColor}`}>
                                                        <span className={`size-1.5 rounded-full ${order.dotColor}`}></span>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-white font-medium">{order.amount}</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(order)}
                                                        className="p-2 rounded-lg hover:bg-primary/20 text-text-secondary hover:text-primary transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order)}
                                                        className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Modals */}
                    <OrderModal
                        isOpen={isOrderModalOpen}
                        onClose={() => setIsOrderModalOpen(false)}
                        onSave={handleSaveOrder}
                        order={selectedOrder}
                    />

                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        title="Hapus Pesanan"
                        message="Apakah Anda yakin ingin menghapus data pesanan ini? Tindakan ini tidak dapat dibatalkan."
                        itemName={selectedOrder?.id}
                    />
                </main>
            </AdminLayout >
        </>
    );
}
