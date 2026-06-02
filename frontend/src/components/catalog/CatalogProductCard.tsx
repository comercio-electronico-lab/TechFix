'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Ban, AlertTriangle, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface CatalogProductCardProps {
  product: Product;
}

export default function CatalogProductCard({ product }: CatalogProductCardProps) {
  const { addItem } = useCart();

  const isOutOfStock = product.status === 'Out of Stock';
  const isLowStock = product.status === 'Low Stock';
  const isLimited = product.status === 'Limited Edition';

  return (
    <article
      className={`group flex flex-col bg-white dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800/80 rounded-lg overflow-hidden hover:border-primary dark:hover:border-sky-500/80 transition-colors duration-200 shadow-sm hover:shadow-md dark:hover:shadow-sky-500/5 ${isOutOfStock ? 'opacity-85 dark:opacity-75 grayscale-[0.2]' : ''}`}
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-white dark:bg-slate-950/40 p-4 border-b border-outline-variant/50 dark:border-slate-800/40 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95 group-hover:scale-105 transition-transform duration-500 select-none"
        />

        {/* Badge de estado */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-error-container text-on-error-container px-2.5 py-1 rounded-xl font-label-sm text-xs font-semibold border border-error-container select-none uppercase tracking-wide">
              Sin Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-xl font-label-sm text-xs font-semibold border border-amber-200 dark:border-amber-900/60 select-none uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Poco Stock
            </span>
          ) : isLimited ? (
            <span className="bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-xl font-label-sm text-xs font-semibold border border-purple-200 dark:border-purple-900/60 select-none uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Especial
            </span>
          ) : (
            <span className="bg-surface-container-high dark:bg-slate-800 text-primary dark:text-sky-400 px-2.5 py-1 rounded-xl font-label-sm text-xs font-semibold border border-outline-variant/30 select-none uppercase tracking-wide">
              En Stock
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4 bg-white dark:bg-slate-900">
        <div>
          <span className="font-label-sm text-xs font-semibold text-on-surface-variant dark:text-slate-500 block mb-1">
            SKU: {product.sku}
          </span>
          <Link href={`/catalogo/${product.id}`}>
            <h3 className="font-body-md text-sm font-semibold text-on-surface dark:text-slate-200 leading-snug line-clamp-2 hover:text-primary dark:hover:text-sky-400 transition-colors cursor-pointer duration-200">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-on-surface-variant/75 dark:text-slate-400 line-clamp-2 mt-1 leading-normal">
            {product.description}
          </p>
        </div>

        {/* Precio + Acción */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/10 dark:border-slate-800/30">
          <span className={`text-xl font-bold tracking-tight font-mono ${isOutOfStock ? 'text-on-surface-variant/40 dark:text-slate-500' : 'text-primary dark:text-sky-400'}`}>
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {isOutOfStock ? (
            <button
              disabled
              className="bg-surface-variant dark:bg-slate-800 text-on-surface-variant/50 dark:text-slate-600 h-10 w-10 rounded flex items-center justify-center cursor-not-allowed border border-outline-variant/10 dark:border-slate-800"
              aria-label="Sin stock"
            >
              <Ban className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                tags: [product.status]
              })}
              className="bg-primary hover:bg-primary-container text-on-primary h-10 w-10 rounded flex items-center justify-center transition-colors shadow-sm hover:shadow dark:hover:shadow-sky-500/20 cursor-pointer active:scale-95"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
