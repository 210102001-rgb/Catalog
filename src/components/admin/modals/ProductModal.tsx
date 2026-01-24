import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';

interface Product {
    id?: number;
    name: string;
    image: string;
    type: string;
    location: string;
    price: string;
    status: string;
    impressions: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
    const isEdit = !!product;
    const [formData, setFormData] = useState<Product>({
        name: '',
        image: '',
        type: 'Digital',
        location: '',
        price: '',
        status: 'Aktif',
        impressions: ''
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                image: '',
                type: 'Digital',
                location: '',
                price: '',
                status: 'Aktif',
                impressions: ''
            });
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Produk</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        placeholder="Contoh: Billboard Tol Jagorawi"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Foto Produk</label>
                    <div className="flex items-center gap-4">
                        <div className="relative size-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-slate-400">image</span>
                            )}
                        </div>
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setFormData(prev => ({ ...prev, image: url }));
                                    }
                                }}
                            />
                            <div className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                Pilih File
                            </div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipe</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        >
                            <option value="Digital">Digital</option>
                            <option value="Statis">Statis</option>
                            <option value="LED">LED</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        >
                            <option value="Aktif">Aktif</option>
                            <option value="Terbatas">Terbatas</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        placeholder="Contoh: Jakarta Selatan"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Harga (per bulan)</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Contoh: Rp 25jt/bulan"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Impressions (est)</label>
                        <input
                            type="text"
                            name="impressions"
                            value={formData.impressions}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Contoh: 500k"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        {isEdit ? 'Simpan Perubahan' : 'Buat Produk'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
