import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';

interface Order {
    id: string;
    client: string;
    location: string;
    duration: string;
    status: string;
    amount: string;
    // Helper props for visuals (not editable here)
    statusColor?: string;
    dotColor?: string;
}

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order) => void;
    order: Order | null;
}

export default function OrderModal({ isOpen, onClose, onSave, order }: OrderModalProps) {
    const isEdit = !!order;
    const [formData, setFormData] = useState<Order>({
        id: '',
        client: '',
        location: '',
        duration: '',
        status: 'Aktif',
        amount: ''
    });

    useEffect(() => {
        if (order) {
            setFormData(order);
        } else {
            setFormData({
                id: '',
                client: '',
                location: '',
                duration: '',
                status: 'Aktif',
                amount: ''
            });
        }
    }, [order, isOpen]);

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
            title={isEdit ? `Edit Pesanan ${order?.id}` : 'Tambah Pesanan Baru'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Klien</label>
                    <input
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        placeholder="Nama Perusahaan"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                        placeholder="Contoh: Bundaran HI"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Durasi</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Contoh: 30 Hari"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Harga</label>
                        <input
                            type="text"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Contoh: Rp 45.000.000"
                            required
                        />
                    </div>
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
                        <option value="Menunggu">Menunggu</option>
                        <option value="Terjadwal">Terjadwal</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
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
                        {isEdit ? 'Simpan Perubahan' : 'Buat Pesanan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
