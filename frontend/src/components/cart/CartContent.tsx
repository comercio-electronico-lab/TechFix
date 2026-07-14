"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItemRow from '@/components/cart/CartItemRow';
import EmptyCart from '@/components/cart/EmptyCart';
import CartSummary from '@/components/cart/CartSummary';

export default function CartContent() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  // Misma fórmula que ShippingForm/CreditCardForm (18% IGV/IVA, envío $10
  // salvo compras > $500 o carrito vacío) para que el total coincida con
  // lo que se cobra realmente en el checkout.
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
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
          shipping={shipping}
          tax={tax}
          total={total}
          disableCheckout={items.length === 0}
        />
      </aside>
    </div>
  );
}
