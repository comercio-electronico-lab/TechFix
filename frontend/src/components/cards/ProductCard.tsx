"use client";

import React from 'react';
import { Product } from '@/types';
import { IProduct } from '@/interfaces/domain';
import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Button from '../ui/Button';
import { showCartHud } from '@/components/cart/showCartHud';

interface ProductCardProps {
  product: Product | IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-surface dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:border-secondary dark:hover:border-sky-500 transition-all border border-outline-variant/60 dark:border-slate-800/80 group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative rounded-[1.5rem] h-64 overflow-hidden mb-5">
        <Link href={`/catalogo/${product.id}`} className="w-full h-full block">
          <img 
            src={product.image} 
            alt={product.name}
            className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
          />
        </Link>
        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm text-on-surface-variant hover:text-error transition-colors z-10">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow px-2">
        <Link href={`/catalogo/${product.id}`}>
          <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="border border-outline rounded-md px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
          <span className="border border-outline rounded-md px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
            {product.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {product.description}
        </p>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
              PRECIO
            </span>
            <span className="text-2xl font-black text-on-surface">
              S/. {product.price}
            </span>
          </div>

          <Button 
            onClick={() => {
              showCartHud(product.name);
              addItem({
                id: product.id,
                name: product.name,
                price: product.price || 0,
                image: product.image || '',
                description: product.description,
                tags: [product.status || '', typeof product.category === 'object' ? product.category.name : (product.category || '')]
              });
            }}
            variant="primary"
          >
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
