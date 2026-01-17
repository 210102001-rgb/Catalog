import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export default function Katalog() {
  // Sample product data - replace with actual data fetching
  const products = [
    {
      id: '1',
      name: 'Baliho 3x6m',
      price: 5000000,
      description: 'Baliho ukuran besar untuk promosi outdoor',
      image: '/images/baliho.jpg'
    },
    // Add more sample products as needed
  ];

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
