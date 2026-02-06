import { useState, useEffect } from "react";
import Head from "next/head";
import ProductCard from "../components/ProductCard";

interface Product {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  images?: string[];
  image?: string;
  visibility: string;
  status: string;
  location: string;
  price_daily?: number;
  size_width?: number;
  size_height?: number;
  impressions?: number;
  rating?: number;
}

export default function Katalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/customer/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Head>
        <title>Katalog Produk - ReklameKu</title>
      </Head>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Katalog Produk</h1>
        <button className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Tambah Produk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              type={product.visibility}
              status={product.status}
              statusColor={getStatusColor(product.status)}
              image={product.images && product.images.length > 0 ? product.images[0] : product.image}
              description={product.description || ""}
              impressions={`${product.impressions || 0}/hari`}
              size={`${product.size_width || 0}m x ${product.size_height || 0}m`}
              location={product.location}
              price={`Rp ${product.price_daily?.toLocaleString() || 0}`}
              rating={product.rating || 0}
              onSelect={() => console.log("Selected:", product.name)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>Tidak ada produk tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for status coloring
function getStatusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "PENDING_APPROVAL":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "DRAFT":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-green-500/10 text-green-500 border-green-500/20";
  }
}
