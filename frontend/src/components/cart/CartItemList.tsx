import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CartItem } from '@/context/CartContext';
import CartItemRow from './CartItemRow';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartItemList({ items, onUpdateQuantity, onRemoveItem }: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-outline-variant/10 dark:border-slate-800 shadow-sm transition-colors">
        <ShoppingBag className="w-16 h-16 text-outline-variant dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary dark:text-sky-400">Tu carrito está vacío</h3>
        <p className="text-on-surface-variant dark:text-slate-400 mt-2 mb-8 font-body-md">Parece que aún no has añadido nada a tu carrito.</p>
        <Link href="/catalogo">
          <Button variant="primary">Ir al Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-stack-md">
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}

      {/* Add More Items CTA */}
      <div className="border-2 border-dashed border-outline-variant dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
        <ShoppingBag className="w-12 h-12 text-primary dark:text-sky-400 mb-4" />
        <h3 className="text-2xl font-bold text-primary dark:text-sky-400">¿Necesitas más piezas?</h3>
        <p className="text-on-surface-variant dark:text-slate-400 mb-6 font-body-md">Continúa comprando componentes o servicios de reparación.</p>
        <Link href="/catalogo" className="text-secondary dark:text-sky-450 font-bold hover:underline">
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}
