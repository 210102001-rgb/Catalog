import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';
import ProductModal from '../../components/admin/modals/ProductModal';
import DeleteModal from '../../components/admin/modals/DeleteModal';

export default function AdminProducts() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Billboard Digital Tol Jagorawi', image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?auto=format&fit=crop&q=80&w=200', type: 'Digital', location: 'Jakarta Timur', price: 'Rp 32jt/bulan', status: 'Aktif', impressions: '450k' },
        { id: 2, name: 'Billboard Bundaran HI', image: 'https://images.unsplash.com/photo-1549435090-678b3a93729e?auto=format&fit=crop&q=80&w=200', type: 'Statis', location: 'Jakarta Pusat', price: 'Rp 125jt/bulan', status: 'Aktif', impressions: '850k' },
        { id: 3, name: 'LED Screen Sudirman', image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=200', type: 'LED', location: 'Jakarta Selatan', price: 'Rp 18jt/bulan', status: 'Terbatas', impressions: '210k' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Semua');

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Handlers
    const handleAdd = () => {
        setSelectedProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleDelete = (product: any) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleSaveProduct = (formData: any) => {
        if (selectedProduct) {
            // Edit: Merge formData with existing product data to preserve properties not in formData (like image if not changed)
            setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...formData } : p));
        } else {
            // Add
            setProducts([...products, { ...formData, id: products.length + 1 }]);
        }
    };

    const confirmDelete = () => {
        if (selectedProduct) {
            setProducts(products.filter(p => p.id !== selectedProduct.id));
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Gambar", "Nama Produk", "Tipe", "Lokasi", "Harga", "Impressions", "Status"];
        const rows = products.map(p => [p.id, p.image, p.name, p.type, p.location, p.price, p.impressions, p.status]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_produk_reklame.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'Semua' || product.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <>
            <Head>
                <title>Kelola Produk - ReklameKu</title>
            </Head>
            <AdminLayout activePage="products">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Kelola Produk">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-card-dark border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full md:w-auto px-4 py-2 bg-card-dark border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                            >
                                <option value="Semua">Semua Tipe</option>
                                <option value="Digital">Digital</option>
                                <option value="Statis">Statis</option>
                                <option value="LED">LED</option>
                            </select>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExport}
                                    className="flex-1 md:flex-none px-4 py-2 bg-card-dark hover:bg-surface-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    Export
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
                                            <th className="p-4">Gambar</th>
                                            <th className="p-4">Nama Produk</th>
                                            <th className="p-4">Tipe</th>
                                            <th className="p-4">Lokasi</th>
                                            <th className="p-4">Harga</th>
                                            <th className="p-4">Impressions</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-white font-medium">#{product.id}</td>
                                                <td className="p-4">
                                                    <div className="h-10 w-16 bg-slate-700 rounded overflow-hidden flex items-center justify-center">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-slate-500">image</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-white font-semibold group-hover:text-primary transition-colors">{product.name}</td>
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{product.type}</span>
                                                </td>
                                                <td className="p-4 text-text-secondary">{product.location}</td>
                                                <td className="p-4 text-white font-medium">{product.price}</td>
                                                <td className="p-4 text-text-secondary">{product.impressions}/minggu</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                        <span className={`size-1.5 rounded-full ${product.status === 'Aktif' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 rounded-lg hover:bg-primary/20 text-text-secondary hover:text-primary transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
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
                    <ProductModal
                        isOpen={isProductModalOpen}
                        onClose={() => setIsProductModalOpen(false)}
                        onSave={handleSaveProduct}
                        product={selectedProduct}
                    />

                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        title="Hapus Produk"
                        message="Apakah Anda yakin ingin menghapus produk ini?"
                        itemName={selectedProduct?.name}
                    />
                </main>
            </AdminLayout>
        </>
    );
}
