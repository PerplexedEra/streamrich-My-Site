'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/ui/audio-player';
import { Icons } from '@/components/icons';
import { useCart } from '@/contexts/cart-context';
import { toast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  category: 'BEATS' | 'PRESETS' | 'SOFTWARE' | 'SAMPLE_PACK' | 'MIDI' | 'OTHER';
  inStock: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<'BEATS' | 'PRESETS' | 'SOFTWARE'>('BEATS');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.category === activeTab || 
    (activeTab === 'BEATS' && product.category === 'BEATS') ||
    (activeTab === 'PRESETS' && product.category === 'PRESETS') ||
    (activeTab === 'SOFTWARE' && product.category === 'SOFTWARE')
  );
  
  const categories = [
    { id: 'BEATS', name: 'Beats' },
    { id: 'PRESETS', name: 'Presets' },
    { id: 'SOFTWARE', name: 'Software' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Store</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          High-quality digital products for music creators
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'BEATS' | 'PRESETS' | 'SOFTWARE')}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative group">
                <img
                  src={product.imageUrl || '/images/placeholder-product.svg'}
                  alt={product.name}
                  className={`h-full w-full object-cover ${product.category === 'BEATS' ? 'group-hover:opacity-50 transition-opacity duration-300' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-product.svg';
                  }}
                />
                {product.category === 'BEATS' && product.fileUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                    <AudioPlayer 
                      src={product.fileUrl} 
                      className="w-4/5"
                      showControls={true}
                      autoPlay={false}
                    />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.imageUrl
                      });
                      toast({
                        title: 'Added to cart',
                        description: `${product.name} has been added to your cart.`,
                      });
                    }}
                  >
                    <Icons.shoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Icons.loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-12">
              <Icons.alertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading products</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {error}
              </p>
            </div>
          ) : (
            <div className="col-span-3 text-center py-12">
              <Icons.package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No {activeTab} found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Check back later for new {activeTab}.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
