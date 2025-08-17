'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { EmojiRain } from '@/components/EmojiRain';
import Link from 'next/link';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, promoCode, setPromoCode, discount, applyPromoCode, promoError, setPromoError } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (promoError) {
      const timer = setTimeout(() => {
        setPromoError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [promoError, setPromoError]);

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.price * (1 - item.discountPercentage / 100);
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const totalWithPromoDiscount = total - discount;

  if (cart.length === 0 && !loading) {
    return <p className="text-white text-center">Your cart is empty.</p>;
  }

  if (loading) {
    return <p className="text-white text-center">Cart is loading...</p>;
  }

  return (
    <>
      <EmojiRain />
      <div className="container mx-auto px-4 py-8 max-w-6xl mb-10">
        <div className="flex items-center mb-6">
          <h1 className="text-4xl font-bold text-white ml-4">Your Cart</h1>
          <h2 className="text-sm text-white/50 ml-auto mr-4 mt-6">{cart.length} items</h2>
        </div>
        <div className="border-1 border-white/30 p-6 rounded-lg shadow-lg">
          <ul className="space-y-4">
            {cart.map((item) => {
              const itemPriceAfterDiscount = item.price * (1 - item.discountPercentage / 100);
              return (
                <li key={item.id} className="flex justify-between items-center text-white">
                  <div className="flex items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-xs p-1 mr-4"
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-baseline gap-2">
                          <p className="text-sm">
                            ${(itemPriceAfterDiscount * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-white/50">
                              (each: ${itemPriceAfterDiscount.toFixed(2)})
                            </p>
                          )}
                          {item.discountPercentage > 0 && (
                            <p className="text-xs text-white/50 line-through">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-[#222222] rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-white hover:text-white font-bold text-l disabled:text-white/30"
                        >
                            -
                        </button>
                        <p className="w-10 text-center">{item.quantity}</p>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-white hover:text-white font-bold text-lg"
                        >
                            +
                        </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/50 text-xl pr-8 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <h2 className="text-white font-bold">Promo:</h2>
            <div className="flex items-center space-x-4 mt-3">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                }}
                className="text-white border-1 border-white/20 p-3 rounded-lg w-full"
              />
              <button
                onClick={() => applyPromoCode(promoCode)}
                className="bg-white text-black font-bold p-3 rounded-lg hover:bg-[#78a068]"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-red-400 mt-2 text-sm">{promoError}</p>
            )}
          </div>

          <div className={`mt-15 pt-4 flex justify-between items-center ${discount > 0 ? 'text-white/50 text-sm' : 'text-white text-2xl font-bold'}`}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <>
              <div className="mt-2 flex justify-between items-center text-white/50 text-sm">
                <span>Promo discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-white font-bold text-2xl">
                <span>Total with discount:</span>
                <span>${totalWithPromoDiscount.toFixed(2)}</span>
              </div>
            </>
          )}

          <Link href='/modal' className="justify-end flex mt-2.5">
            <button
              className="rounded-lg p-3 w-full font-bold mt-3 transition-all duration-300 ease-in-out bg-white text-black hover:bg-[#78a068]"
            >
              BUY
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPage;