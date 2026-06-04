'use client';

import React from 'react';
import Image from 'next/image';
import { IProductCardProps } from '@/interfaces/components';
import { Card, Button, Icon } from '@/components/ui';

export const ProductCard = ({ product, onAddToCart }: IProductCardProps) => {
  return (
    <Card className="flex flex-col h-full group">
      <div className="relative aspect-square overflow-hidden rounded-md mb-4 bg-[var(--color-background)]">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white font-bold uppercase tracking-wider">Agotado</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <span className="text-xs text-[var(--color-muted)] mb-1 uppercase tracking-tight">
          {product.category.name}
        </span>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--color-muted)] line-clamp-3 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-[var(--color-primary)]">
            ${product.price.toLocaleString()}
          </span>
          <Button 
            size="sm" 
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product)}
            leftIcon={<Icon name="ShoppingCart" size={16} />}
          >
            Añadir
          </Button>
        </div>
      </div>
    </Card>
  );
};
