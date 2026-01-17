import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function StandardProduct() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('3x6');
  const [selectedMaterial, setSelectedMaterial] = useState('flexy');

  const product = {
    id: 'PROD-001',
    name: 'Baliho Standard',
    description: 'Baliho dengan kualitas tinggi untuk kebutuhan promosi outdoor Anda. Tahan cuaca dan tahan lama dengan cetakan yang tajam dan warna yang cerah.',
    price: 5000000,
    images: [
      '/images/baliho-1.jpg',
      '/images/baliho-2.jpg',
      '/images/baliho-3.jpg',
    ],
    sizes: [
      { id: '3x6', name: '3m x 6m' },
      { id: '4x8', name: '4m x 8m' },
      { id: '5x10', name: '5m x 10m' },
    ],
    materials: [
      { id: 'flexy', name: 'Flexy China', price: 5000000 },
      { id: 'flexy-premium', name: 'Flexy Premium', price: 6000000 },
      { id: 'vinyl', name: 'Vinyl', price: 5500000 },
    ],
    features: [
      'Tahan cuaca hingga 1 tahun',
      'Cetakan high resolution',
      'Pemasangan termasuk tiang',
      'Gratis desain sederhana'
    ]
  };

  const currentMaterial = product.materials.find(m => m.id === selectedMaterial) || product.materials[0];
  const totalPrice = currentMaterial.price * quantity;

  const handleAddToCart = () => {
    // Add to cart logic
    router.push('/cart');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{product.name} - ReklameKu</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 dark:text-white">
                Rp {currentMaterial.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 dark:text-gray-300 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Ukuran</h3>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    className={`border rounded-md py-2 px-3 text-sm font-medium ${
                      selectedSize === size.id
                        ? 'border-transparent bg-primary text-white'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Material</h3>
              <div className="mt-2 space-y-2">
                {product.materials.map((material) => (
                  <div
                    key={material.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedMaterial === material.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedMaterial(material.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{material.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rp {material.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      {selectedMaterial === material.id && (
                        <span className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Fitur</h3>
              <ul className="mt-2 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex items-center">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <div className="ml-4 flex-1">
                <button
                  type="button"
                  className="w-full bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={handleAddToCart}
                >
                  <span className="material-symbols-outlined mr-2">shopping_cart</span>
                  Tambah ke Keranjang (Rp {totalPrice.toLocaleString('id-ID')})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="mt-16">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Detail Produk</h2>

          <div className="mt-4 space-y-6">
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Baliho ini cocok untuk berbagai keperluan promosi seperti grand opening, event, atau kampanye pemasaran jangka panjang. 
              Dibuat dengan material berkualitas tinggi yang tahan terhadap cuaca ekstrem dan sinar UV, 
              sehingga warna tetap cerah dan tidak mudah pudar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
