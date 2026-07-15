"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  tags?: string[];
}

export type NewCartItem = Omit<CartItem, 'quantity'>;

interface CartContextType {
  items: CartItem[];
  addItem: (product: NewCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  lastAddedItem?: CartItem;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | undefined>();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('techfix_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('techfix_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: NewCartItem) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newItem: CartItem;

      if (existing) {
        newItem = { ...existing, quantity: existing.quantity + 1 };
        return prev.map(item =>
          item.id === product.id ? newItem : item
        );
      }
      newItem = { ...product, quantity: 1 };
      return [...prev, newItem];
    });

    setLastAddedItem({ ...product, quantity: 1 });
    setTimeout(() => setLastAddedItem(undefined), 600);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, lastAddedItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
