'use client';

import React, { useState, ChangeEvent } from 'react';
import { ProductCard } from '@/components/features/catalog/ProductCard';
import { Input, Icon } from '@/components/ui';
import { IProduct } from '@/interfaces/domain';

interface ICatalogViewProps {
  initialProducts: IProduct[];
}

export const CatalogView = ({ initialProducts }: ICatalogViewProps) => {
  const [search, setSearch] = useState('');

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight italic">Catálogo de Productos</h1>
          <p className="text-[var(--color-muted)]">Todo lo que necesitas para tu setup tecnológico.</p>
        </div>
        <div className="w-full md:w-72">
          <Input 
            placeholder="Buscar productos..." 
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            leftIcon={<Icon name="Search" size={18} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={(p) => console.log('Added to cart:', p)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-[var(--color-background)] rounded-2xl border-2 border-dashed border-[var(--color-border)]">
          <Icon name="PackageSearch" size={48} className="mx-auto mb-4 text-[var(--color-muted)]" />
          <p className="text-xl font-medium">No se encontraron productos</p>
          <p className="text-[var(--color-muted)]">Prueba con otros términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};
