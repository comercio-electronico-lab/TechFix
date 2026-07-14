"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { showCartHud } from '@/components/cart/showCartHud';

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

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    showCartHud(product.name);

    // We add the item 'quantity' times, or if your context supports quantity, pass it.
    // Assuming addItem just adds one or handles existing, we'll loop for simplicity if quantity isn't supported,
    // or ideally your cart context should support quantity. For now, matching original logic.
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        tags: ['En Stock']
      });
    }
  };

  return (
    <>
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
