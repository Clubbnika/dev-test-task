'use client';

import { EmojiRain } from '@/components/EmojiRain';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import type { ProductType } from '@/app/shared/types/product';

const getAllProducts = async () => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  return data;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const { cart, addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleDescription = (productId: number) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  const isProductInCart = (product: ProductType) => {
    return cart.some((item) => item.id === product.id);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  const handleProductClick = (product: ProductType) => {
    const slug = generateSlug(product.title);
    router.push(`/products/${slug}`);
  };

  return (
    <div>
      <EmojiRain />
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-6">Products</h1>
        {loading && <p className="text-white/50">Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const discountedPrice = product.price * (1 - product.discountPercentage / 100);

              return (
                <div
                  key={product.id}
                  className="border border-white/30 p-6 rounded-lg shadow-lg text-white flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-auto rounded-md mb-4"
                    />
                    <h2
                      className="text-xl font-semibold cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.title}
                    </h2>
                    <p
                      className={`text-xs mt-2 text-white/40 ${
                        expandedProductId === product.id ? 'line-clamp-none' : 'line-clamp-2'
                      }`}
                    >
                      {product.description}
                    </p>
                    <button
                      className="text-white/40 underline text-xs"
                      onClick={() => toggleDescription(product.id)}
                    >
                      {expandedProductId === product.id ? 'Read less' : 'Read more'}
                    </button>
                  </div>
                  <div className="flex justify-between mt-4 items-center">
                    <p className="mt-1 text-[#78a068]/60 text-sm">Rating: {product.rating} ★</p>
                    <div className="flex flex-col items-end">
                      {product.discountPercentage > 0 && (
                        <p className="text-sm line-through text-white/50">${product.price.toFixed(2)}</p>
                      )}
                      <p className="text-xl font-bold">
                        ${discountedPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className={`p-2 mt-2.5 rounded-lg transition-all duration-300 ease-in-out ${
                      isProductInCart(product)
                        ? 'bg-transparent text-white border-2 border-white/40 hover:bg-transparent hover:border-[#78a068] hover:text-[#78a068]'
                        : 'bg-white text-black hover:bg-[#78a068] hover:text-white'
                    }`}
                  >
                    {isProductInCart(product) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;