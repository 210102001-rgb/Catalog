import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { showErrorAlert } from "../../../utils/swalConfig";

interface Order {
  id?: number;
  uuid?: string;
  order_number?: string;
  user_id?: number;
  total_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  currency?: string;
  status?: string;
  payment_method?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  shipping_address?: string;
  billing_address?: string;
  // Frontend display properties
  client?: string;
  location?: string;
  duration?: string;
  amount?: string;
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
    client: "",
    location: "",
    duration: "",
    status: "PENDING",
    amount: "",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        client: order.client || "",
        location: order.location || "",
        duration: order.duration || "",
        status: order.status || "PENDING",
        amount: order.amount || "",
      });
    } else {
      setFormData({
        client: "",
        location: "",
        duration: "",
        status: "PENDING",
        amount: "",
      });
    }
  }, [order, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for API submission - map to database field names
    const orderData: any = {
      status: formData.status,
      notes: formData.notes || "",
      shipping_address: formData.location || "",
      billing_address: formData.location || "",
    };

    // Add amount fields if they exist
    if (formData.amount) {
      const amountValue = parseFloat(formData.amount.replace(/[^\d.]/g, ""));
      if (!isNaN(amountValue)) {
        orderData.total_amount = amountValue;
        orderData.final_amount = amountValue;
      }
    }

    try {
      // Call the onSave function which will handle API call
      onSave(orderData);
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      await showErrorAlert("Gagal Menyimpan Pesanan", "Gagal menyimpan pesanan. Silakan coba lagi.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit Pesanan ${order?.order_number || order?.id}` : "Tambah Pesanan Baru"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="order-client" className="text-sm font-medium text-slate-300">
            Klien
          </label>
          <input
            id="order-client"
            type="text"
            name="client"
            value={formData.client || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            placeholder="Nama Perusahaan"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="order-location" className="text-sm font-medium text-slate-300">
            Lokasi
          </label>
          <input
            id="order-location"
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
            placeholder="Contoh: Bundaran HI"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="order-duration" className="text-sm font-medium text-slate-300">
              Durasi
            </label>
            <input
              id="order-duration"
              type="text"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              placeholder="Contoh: 30 Hari"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="order-amount" className="text-sm font-medium text-slate-300">
              Total Harga
            </label>
            <input
              id="order-amount"
              type="text"
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              placeholder="Contoh: Rp 45.000.000"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="order-status" className="text-sm font-medium text-slate-300">
            Status
          </label>
          <select
            id="order-status"
            name="status"
            value={formData.status || "PENDING"}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            {isEdit ? "Simpan Perubahan" : "Buat Pesanan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
