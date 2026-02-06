import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { showSuccessAlert, showErrorAlert } from "../../../utils/swalConfig";

interface Product {
  id?: number;
  uuid?: string;
  name: string;
  slug?: string;
  description?: string;
  images?: string[];
  type: string;
  location: string;
  latitude?: number;
  longitude?: number;
  size_width?: number;
  size_height?: number;
  illumination?: boolean;
  visibility?: string;
  price: string;
  price_daily?: number;
  price_weekly?: number;
  price_monthly?: number;
  price_yearly?: number;
  stock_quantity?: number;
  status: string;
  impressions: string;
  published?: boolean;
  featured?: boolean;
  specifications?: any;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void; // Changed to any to handle FormData
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const isEdit = !!product;
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    images: [],
    type: "Digital",
    location: "",
    latitude: undefined,
    longitude: undefined,
    size_width: undefined,
    size_height: undefined,
    illumination: false,
    visibility: "DAYTIME",
    price: "",
    price_daily: 0,
    price_weekly: 0,
    price_monthly: 0,
    price_yearly: 0,
    stock_quantity: 1,
    status: "DRAFT",
    impressions: "",
    published: false,
    featured: false,
    specifications: {},
  });

  // State to hold the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setPreviewUrl(product.images && product.images.length > 0 ? product.images[0] : null);
    } else {
      setFormData({
        name: "",
        description: "",
        images: [],
        type: "Digital",
        location: "",
        latitude: undefined,
        longitude: undefined,
        size_width: undefined,
        size_height: undefined,
        illumination: false,
        visibility: "DAYTIME",
        price: "",
        price_daily: 0,
        price_weekly: 0,
        price_monthly: 0,
        price_yearly: 0,
        stock_quantity: 1,
        status: "DRAFT",
        impressions: "",
        published: false,
        featured: false,
        specifications: {},
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // Handle numeric inputs
    if (name.includes("price") || name.includes("size") || name.includes("stock")) {
      const numValue = value === "" ? undefined : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));

      // Auto calculate prices
      if (name === "price_daily" && numValue) {
        setFormData((prev) => ({
          ...prev,
          price_weekly: numValue * 7,
          price_monthly: numValue * 30,
          price_yearly: numValue * 365,
        }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Clean up the preview URL when component unmounts or file changes
      return () => URL.revokeObjectURL(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      await showErrorAlert("Validasi Gagal!", "Nama produk harus diisi");
      return;
    }

    if (!formData.location.trim()) {
      await showErrorAlert("Validasi Gagal!", "Lokasi harus diisi");
      return;
    }

    if (!formData.price_daily || formData.price_daily <= 0) {
      await showErrorAlert("Validasi Gagal!", "Harga harian harus diisi dan lebih besar dari 0");
      return;
    }

    // Create a FormData object to handle file upload along with other form data
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description || formData.name);
    submitData.append("location", formData.location);
    submitData.append("price_daily", formData.price_daily.toString());
    submitData.append("price_weekly", (formData.price_weekly || formData.price_daily * 7).toString());
    submitData.append("price_monthly", (formData.price_monthly || formData.price_daily * 30).toString());
    submitData.append("price_yearly", (formData.price_yearly || formData.price_daily * 365).toString());
    submitData.append("type", formData.type);
    submitData.append("status", formData.status);
    submitData.append("visibility", formData.visibility || "DAYTIME");
    submitData.append("impressions", formData.impressions);
    submitData.append("published", formData.published ? "true" : "false");
    submitData.append("featured", formData.featured ? "true" : "false");

    if (formData.latitude) submitData.append("latitude", formData.latitude.toString());
    if (formData.longitude) submitData.append("longitude", formData.longitude.toString());
    if (formData.size_width) submitData.append("size_width", formData.size_width.toString());
    if (formData.size_height) submitData.append("size_height", formData.size_height.toString());
    submitData.append("illumination", formData.illumination ? "true" : "false");
    submitData.append("stock_quantity", (formData.stock_quantity || 1).toString());

    if (selectedFile) {
      submitData.append("image", selectedFile);
    } else if (formData.images && formData.images.length > 0) {
      submitData.append("existingImage", formData.images[0]);
    }

    // Pass the FormData object to onSave and wait for it to complete
    await onSave(submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Produk" : "Tambah Produk Baru"}>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Informasi Dasar</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium text-slate-300">
                Nama Produk *
              </label>
              <input
                type="text"
                id="product-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="Contoh: Billboard Tol Jagorawi"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product-description" className="text-sm font-medium text-slate-300">
                Deskripsi
              </label>
              <textarea
                id="product-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="Deskripsikan produk secara detail..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product-image-upload" className="text-sm font-medium text-slate-300">
                Foto Produk
              </label>
              <div className="flex items-center gap-4">
                <div className="relative size-24 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden bg-slate-800">
                  {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-400">image</span>}
                </div>
                <label className="cursor-pointer" htmlFor="product-image-upload">
                  <input type="file" id="product-image-upload" accept="image/*" className="hidden" onChange={handleFileChange} aria-label="Upload product image" />
                  <div className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors">
                    Pilih File
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Specifications */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Lokasi & Spesifikasi</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="product-location" className="text-sm font-medium text-slate-300">
                Lokasi *
              </label>
              <input
                type="text"
                id="product-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="Contoh: Jakarta Selatan"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium text-slate-300">
                Koordinat (Latitude)
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude || ""}
                onChange={handleChange}
                step="0.000001"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="-6.2088"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium text-slate-300">
                Koordinat (Longitude)
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude || ""}
                onChange={handleChange}
                step="0.000001"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="106.8456"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="size-width" className="text-sm font-medium text-slate-300">
                Ukuran Lebar (cm)
              </label>
              <input
                type="number"
                id="size-width"
                name="size_width"
                value={formData.size_width || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="size-height" className="text-sm font-medium text-slate-300">
                Ukuran Tinggi (cm)
              </label>
              <input
                type="number"
                id="size-height"
                name="size_height"
                value={formData.size_height || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock-quantity" className="text-sm font-medium text-slate-300">
                Stok Tersedia
              </label>
              <input
                type="number"
                id="stock-quantity"
                name="stock_quantity"
                value={formData.stock_quantity || 1}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input type="checkbox" name="illumination" checked={formData.illumination || false} onChange={handleChange} id="illumination-checkbox" className="rounded text-primary focus:ring-primary" />
            <label htmlFor="illumination-checkbox" className="text-sm text-slate-300">
              Memiliki pencahayaan (illuminated)
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Harga</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price-daily" className="text-sm font-medium text-slate-300">
                Harga Harian (Rp) *
              </label>
              <input
                type="number"
                id="price-daily"
                name="price_daily"
                value={formData.price_daily || ""}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="100000"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price-weekly" className="text-sm font-medium text-slate-300">
                Harga Mingguan (Rp)
              </label>
              <input
                type="number"
                id="price-weekly"
                name="price_weekly"
                value={formData.price_weekly || (formData.price_daily ? formData.price_daily * 7 : "")}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="700000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price-monthly" className="text-sm font-medium text-slate-300">
                Harga Bulanan (Rp)
              </label>
              <input
                type="number"
                id="price-monthly"
                name="price_monthly"
                value={formData.price_monthly || (formData.price_daily ? formData.price_daily * 30 : "")}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="3000000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price-yearly" className="text-sm font-medium text-slate-300">
                Harga Tahunan (Rp)
              </label>
              <input
                type="number"
                id="price-yearly"
                name="price_yearly"
                value={formData.price_yearly || (formData.price_daily ? formData.price_daily * 365 : "")}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                placeholder="36500000"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Pengaturan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="product-type" className="text-sm font-medium text-slate-300">
                Tipe Produk
              </label>
              <select
                id="product-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              >
                <option value="Digital">Digital</option>
                <option value="Statis">Statis</option>
                <option value="LED">LED</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="visibility" className="text-sm font-medium text-slate-300">
                Visibilitas
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              >
                <option value="DAYTIME">Siang Hari</option>
                <option value="NIGHTTIME">Malam Hari</option>
                <option value="ALWAYSON">Selalu Aktif</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="product-status" className="text-sm font-medium text-slate-300">
                Status Produk
              </label>
              <select
                id="product-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Menunggu Persetujuan</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
                <option value="ARCHIVED">Diarsipkan</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="published" checked={formData.published || false} onChange={handleChange} id="published-checkbox" className="rounded text-primary focus:ring-primary" />
              <label htmlFor="published-checkbox" className="text-sm text-slate-300">
                Publikasikan produk (akan terlihat oleh pelanggan)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} id="featured-checkbox" className="rounded text-primary focus:ring-primary" />
              <label htmlFor="featured-checkbox" className="text-sm text-slate-300">
                Jadikan produk unggulan (featured)
              </label>
            </div>
          </div>
        </div>

        {/* Impressions */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Statistik</h3>

          <div className="space-y-2">
            <label htmlFor="impressions" className="text-sm font-medium text-slate-300">
              Estimasi Impressions/Minggu
            </label>
            <input
              type="text"
              id="impressions"
              name="impressions"
              value={formData.impressions}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
              placeholder="Contoh: 500k"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-slate-900 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            {isEdit ? "Simpan Perubahan" : "Buat Produk"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
