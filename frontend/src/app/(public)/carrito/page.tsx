"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Modular components
import CartItemRow from '@/components/cart/CartItemRow';
import EmptyCart from '@/components/cart/EmptyCart';
import CartSummary from '@/components/cart/CartSummary';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background py-stack-lg">
      <div className="max-w-container-max mx-auto px-gutter py-stack-md">
        {/* Cart Header */}
        <div className="mb-stack-lg">
          <h1 className="font-h1 text-[48px] font-bold text-primary leading-[1.2] tracking-[-0.02em]">
            Tu Carrito de Compras
          </h1>
          <p className="text-on-surface-variant font-body-lg mt-2">
            Revisa tus artículos antes de proceder al pago seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-8 space-y-stack-md">
            {items.length > 0 ? (
              items.map((item) => (
                <CartItemRow 
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            ) : (
              <EmptyCart />
            )}

            {/* Add More Items CTA */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
              <ShoppingBag className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-primary">¿Necesitas más piezas?</h3>
              <p className="text-on-surface-variant mb-6">Continúa comprando componentes o servicios de reparación.</p>
              <Link href="/catalogo" className="text-secondary font-bold hover:underline">
                Explorar Catálogo
              </Link>
            </div>
          </section>

          {/* Order Summary Column */}
          <aside className="lg:col-span-4">
            <CartSummary 
              itemsCount={totalQuantity}
              subtotal={subtotal}
              tax={tax}
              total={total}
              disableCheckout={items.length === 0}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
