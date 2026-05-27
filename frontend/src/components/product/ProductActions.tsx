"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [config, setConfig] = useState('2TB SSD');

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // We add the item 'quantity' times, or if your context supports quantity, pass it.
    // Assuming addItem just adds one or handles existing, we'll loop for simplicity if quantity isn't supported, 
    // or ideally your cart context should support quantity. For now, matching original logic.
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: `${product.name} (${config})`,
        price: product.price,
        image: product.image,
        description: product.description,
        tags: ['En Stock']
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SELECCIONAR CONFIGURACIÓN</label>
        <div className="flex gap-2">
          <button 
            onClick={() => setConfig('2TB SSD')}
            className={`border px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              config === '2TB SSD' 
                ? 'border-2 border-secondary-container bg-surface-container-low text-on-secondary-container' 
                : 'border-outline text-on-surface-variant hover:border-secondary-container'
            }`}
          >
            2TB SSD
          </button>
          <button 
            onClick={() => setConfig('4TB SSD')}
            className={`border px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              config === '4TB SSD' 
                ? 'border-2 border-secondary-container bg-surface-container-low text-on-secondary-container' 
                : 'border-outline text-on-surface-variant hover:border-secondary-container'
            }`}
          >
            4TB SSD
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center border border-outline-variant rounded-lg">
          <button onClick={handleDecrease} className="px-4 py-3 hover:bg-surface-container-low transition-colors"><Minus className="w-4 h-4" /></button>
          <span className="px-4 font-bold">{quantity}</span>
          <button onClick={handleIncrease} className="px-4 py-3 hover:bg-surface-container-low transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
        <Button 
          onClick={handleAddToCart}
          variant="secondary" 
          className="flex-1 py-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Añadir al Carrito
        </Button>
      </div>
    </>
  );
}
