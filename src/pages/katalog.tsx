import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export default function Katalog() {
  // Sample product data - replace with actual data fetching
  const products = [
    {
      id: '1',
      name: 'Baliho 3x6m',
      type: 'BALIHO',
      status: 'TERSEDIA',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800',
      description: 'Baliho ukuran besar untuk promosi outdoor',
      impressions: '50k/minggu',
      size: '3m x 6m',
      location: 'Jakarta Pusat',
      price: 'Rp 5.000.000',
      rating: 4.8
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
          <ProductCard 
            key={product.id}
            name={product.name}
            type={product.type}
            status={product.status}
            statusColor={product.statusColor}
            image={product.image}
            description={product.description}
            impressions={product.impressions}
            size={product.size}
            location={product.location}
            price={product.price}
            rating={product.rating}
            onSelect={() => console.log('Selected:', product.name)}
          />
        ))}
      </div>
    </div>
  );
}
