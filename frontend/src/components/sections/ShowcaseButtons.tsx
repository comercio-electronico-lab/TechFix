'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface ShowcaseButtonsProps {
  product: {
    id: string;
    name: string;
    price?: number;
    image?: string;
    description?: string;
    status?: string;
    category?: string | { name: string };
  };
}

export const ShowcaseButtons: React.FC<ShowcaseButtonsProps> = ({ product }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image || '',
      description: product.description || '',
      tags: [
        product.status || '', 
        typeof product.category === 'object' ? product.category.name : (product.category || '')
      ]
    });
    router.push('/carrito');
  };

  return (
    <div className="flex justify-center items-center gap-3 pt-2">
      <Link href={`/catalogo/${product.id}`}>
        <button className="bg-[#0071e3] btn-sweep text-white hover:bg-[#0077ed] text-sm font-normal px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95">
          Más información
        </button>
      </Link>
      <button 
        onClick={handleBuy}
        className="border border-[#0071e3] btn-sweep text-[#0071e3] bg-transparent hover:bg-[#0071e3] hover:text-white text-sm font-normal px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95"
      >
        Comprar
      </button>
    </div>
  );
};

export default ShowcaseButtons;
