import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";

interface Customer {
  id?: number;
  uuid?: string;
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  status?: string;
  orders?: number;
  spent?: number;
  created_at?: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: any) => void;
  customer: Customer | null;
}

export default function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const isEdit = !!customer;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    phone: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        company_name: customer.company_name || "",
        phone: customer.phone || "",
        status: customer.status || "ACTIVE",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        company_name: "",
        phone: "",
        status: "ACTIVE",
      });
    }
  }, [customer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Customer" : "Tambah Customer"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="customer-name" className="text-sm font-medium text-slate-300">
            Nama Lengkap *
          </label>
          <input
            id="customer-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            required
            aria-label="Nama lengkap customer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-email" className="text-sm font-medium text-slate-300">
            Email *
          </label>
          <input
            id="customer-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            required
            aria-label="Email customer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-company" className="text-sm font-medium text-slate-300">
            Nama Perusahaan
          </label>
          <input
            id="customer-company"
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            placeholder="Opsional"
            aria-label="Nama perusahaan customer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-phone" className="text-sm font-medium text-slate-300">
            Nomor Telepon
          </label>
          <input
            id="customer-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            placeholder="Opsional"
            aria-label="Nomor telepon customer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-status" className="text-sm font-medium text-slate-300">
            Status
          </label>
          <select
            id="customer-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            aria-label="Status customer"
          >
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Non-Aktif</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            {isEdit ? "Simpan Perubahan" : "Tambah Customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
