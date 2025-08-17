'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/app/shared/types/product';

const getProductBySlug = async (slug: string): Promise<ProductType | null> => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  return (
    data.products.find(
      (product: ProductType) => product.title.toLowerCase().replace(/\s+/g, '-') === slug
    ) || null
  );
};

const ProductPage = () => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const { addToCart, cart } = useCart();
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        try {
          const data = await getProductBySlug(slug as string);
          setProduct(data);
        } catch (err) {
          setError('Failed to fetch product details');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [slug]);

  const isProductInCart = (product: ProductType | null) => {
    if (!product) return false;
    return cart.some((item) => item.id === product.id);
  };

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!product) {
    return <p className="text-white text-center">Product not found.</p>;
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const originalPrice = product.price.toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl text-white">
      <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="w-full h-auto rounded-lg shadow-lg" 
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-2xl font-bold">
                Price: ${discountedPrice}
              </p>
              {product.discountPercentage > 0 && (
                <p className="text-white/50 line-through">
                  ${originalPrice}
                </p>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-[#78a068] font-bold text-sm ml-2">
                  - {product.discountPercentage.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-[#78a068] text-lg mb-4">
              Rating: {product.rating.toFixed(2)} ★
            </p>

            <p className="text-white/60 text-sm tracking-wide mb-2">
              Category: <span className="text-white font-semibold">{product.category}</span>
            </p>
            
            <p className="text-white/80 mb-4">
              Brand: <span className="text-white font-semibold">{product.brand}</span>
            </p>
            <p className="text-white/80 mb-4">
              Stock: <span className="text-white font-semibold">{product.stock} units</span>
            </p>
            
            <p className="text-white/80 mb-4">
              Warranty Information: <span className="text-white font-semibold">{product.warrantyInformation}</span>
            </p>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className={`p-3 mt-4 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out w-full
              ${isProductInCart(product)
                ? 'bg-transparent text-white border-2 border-white/40 hover:border-[#78a068] hover:text-[#78a068]'
                : 'bg-white text-black hover:bg-[#78a068] hover:text-white'
              }`}
          >
            {isProductInCart(product) ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-white/20 pt-8">
        <h2 className="text-2xl font-bold mb-2">Description</h2>
        <p className="text-white/80 leading-relaxed">
          {product.description}
        </p>

        {product.reviews && product.reviews.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {product.reviews.map((review, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{review.reviewerName}</p>
                            <p className="text-sm text-white/50">{review.rating} / 5</p>
                        </div>
                        <p className="text-white/80">{review.comment}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;