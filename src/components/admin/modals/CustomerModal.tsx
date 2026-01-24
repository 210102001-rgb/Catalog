import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';

interface Customer {
    id?: number;
    name: string;
    image: string;
    email: string;
    status: string;
    orders?: number;
    spent?: string;
}

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Customer) => void;
    customer: Customer | null;
}

export default function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
    const isEdit = !!customer;
    const [formData, setFormData] = useState<Customer>({
        name: '',
        image: '',
        email: '',
        status: 'Aktif'
    });

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        } else {
            setFormData({
                name: '',
                image: '',
                email: '',
                status: 'Aktif'
            });
        }
    }, [customer, isOpen]);

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
            title={isEdit ? 'Edit Customer' : 'Tambah Customer'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Foto Profil</label>
                    <div className="flex items-center gap-4">
                        <div className="relative size-16 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-slate-400">person</span>
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
                                Pilih Foto
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        required
                    />
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
                        <option value="Non-Aktif">Non-Aktif</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                    </select>
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
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Customer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
