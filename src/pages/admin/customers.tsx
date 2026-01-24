import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';
import CustomerModal from '../../components/admin/modals/CustomerModal';
import DeleteModal from '../../components/admin/modals/DeleteModal';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Mike Ross', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', email: 'mike@company.com', orders: 3, spent: 'Rp 65.500.000', status: 'Aktif' },
        { id: 2, name: 'Sarah Connor', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', email: 'sarah@business.com', orders: 5, spent: 'Rp 125.000.000', status: 'Aktif' },
        { id: 3, name: 'David Kim', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', email: 'david@startup.com', orders: 1, spent: 'Rp 18.000.000', status: 'Pending' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');

    // Modal States
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const handleAdd = () => {
        setSelectedCustomer(null);
        setIsCustomerModalOpen(true);
    };

    const handleEdit = (customer: any) => {
        setSelectedCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleDelete = (customer: any) => {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const handleSaveCustomer = (formData: any) => {
        if (selectedCustomer) {
            setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, ...formData } : c));
        } else {
            // New Customer
            const newCustomer = {
                ...formData,
                id: customers.length + 1,
                orders: 0,
                spent: 'Rp 0'
            };
            setCustomers([...customers, newCustomer]);
        }
    };

    const confirmDelete = () => {
        if (selectedCustomer) {
            setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Nama", "Email", "Total Pesanan", "Total Pengeluaran", "Status"];
        const rows = customers.map(c => [c.id, c.name, c.email, c.orders, c.spent, c.status]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_customer.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'Semua' || customer.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head>
                <title>Data Customer - ReklameKu</title>
            </Head>
            <AdminLayout activePage="customers">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Data Customer">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Cari nama/email..."
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
                                <option value="Semua">Semua Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Pending">Pending</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                            </select>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExport}
                                    className="flex-1 md:flex-none px-4 py-2 bg-card-dark hover:bg-surface-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    CSV
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 md:flex-none px-4 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    Tambah
                                </button>
                            </div>
                        </div>
                    </Header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Nama</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4 text-center">Total Pesanan</th>
                                            <th className="p-4 text-right">Total Pengeluaran</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {filteredCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">#{customer.id}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                                                            {customer.image ? (
                                                                <img src={customer.image} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                                                            )}
                                                        </div>
                                                        <span className="text-white font-semibold group-hover:text-primary transition-colors">{customer.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-text-secondary">{customer.email}</td>
                                                <td className="p-4 text-center text-white font-medium">{customer.orders}</td>
                                                <td className="p-4 text-right text-white font-medium">{customer.spent}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${customer.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                        <span className={`size-1.5 rounded-full ${customer.status === 'Aktif' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                                                        {customer.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className="p-2 rounded-lg hover:bg-primary/20 text-text-secondary hover:text-primary transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer)}
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
                    <CustomerModal
                        isOpen={isCustomerModalOpen}
                        onClose={() => setIsCustomerModalOpen(false)}
                        onSave={handleSaveCustomer}
                        customer={selectedCustomer}
                    />

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
