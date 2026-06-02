'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-slate-950/30 flex flex-col md:flex-row gap-6 items-center border border-outline-variant/10 dark:border-slate-800 transition-colors">

      {/* Imagen */}
      <div className="w-full md:w-32 h-32 bg-surface-container-low dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Detalles */}
      <div className="grow w-full">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/catalogo/${item.id}`}>
              <h3 className="text-lg font-bold text-primary dark:text-sky-400 hover:underline leading-snug line-clamp-2">
                {item.name}
              </h3>
            </Link>
            <p className="text-on-surface-variant dark:text-slate-400 text-sm mt-1 line-clamp-1">
              {item.description}
            </p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container-high dark:bg-slate-800 text-on-secondary-container dark:text-slate-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-outline-variant/10 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Precio por unidad */}
          <p className="text-xl font-bold text-primary dark:text-sky-400 shrink-0">
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-outline-variant/10 dark:border-slate-800/60">
          {/* Selector de cantidad */}
          <div className="flex items-center border border-outline dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="px-3 py-2 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors text-primary dark:text-sky-400 cursor-pointer"
              aria-label="Reducir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-bold text-primary dark:text-sky-400 min-w-[40px] text-center select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="px-3 py-2 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors text-primary dark:text-sky-400 cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal + Eliminar */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-on-surface dark:text-slate-300 hidden sm:block">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-error flex items-center gap-1 hover:underline font-bold text-sm cursor-pointer transition-colors"
              aria-label={`Eliminar ${item.name}`}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
