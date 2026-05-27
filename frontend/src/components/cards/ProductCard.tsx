"use client";

import React from 'react';
import Image from 'next/image';
import { Product } from '@/mock/products';
import Button from '../ui/Button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group">
      <Link href={`/catalogo/${product.id}`}>
        <div className="h-56 bg-surface-container-lowest flex items-center justify-center p-stack-md overflow-hidden relative cursor-pointer">
          <img 
            src={product.image} 
            alt={product.name}
            className="group-hover:scale-105 transition-transform duration-500 object-contain h-full w-full"
          />
        </div>
      </Link>
      <div className="p-stack-md">
        <span className="text-[12px] font-bold text-secondary uppercase mb-2 block tracking-wider">
          {product.status}
        </span>
        <Link href={`/catalogo/${product.id}`}>
          <h4 className="font-bold text-primary mb-1 line-clamp-1 hover:text-secondary transition-colors cursor-pointer">{product.name}</h4>
        </Link>
        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-h3 text-[24px] text-primary">${product.price}</span>
          <button 
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              description: product.description,
              tags: [product.status]
            })}
            className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors active:scale-90"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
