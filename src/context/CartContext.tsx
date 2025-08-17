'use client';

import type { ProductType } from '@/app/shared/types/product';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface CartItem extends ProductType {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  promoCode: string;
  discount: number;
  total: number;
  promoError: string;
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  applyPromoCode: (code: string) => void;
  setPromoCode: (code: string) => void;
  setPromoError: (error: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.price * (1 - item.discountPercentage / 100);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const total = subtotal - discount;

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = (product: ProductType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  
  const updateQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const applyPromoCode = (code: string) => {
    setPromoError('');
    setDiscount(0);

    if (code === 'DISCOUNT10') {
      setDiscount(subtotal * 0.1);
    } else if (code === 'DISCOUNT30') {
      setDiscount(subtotal * 0.3);
    } else {
      setPromoError('Promo code is invalid.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        promoCode,
        discount,
        total,
        promoError,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        setPromoCode,
        setPromoError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};