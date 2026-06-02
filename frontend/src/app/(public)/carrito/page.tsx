"use client";

import { useCart } from '@/context/CartContext';
import CartItemList from '@/components/cart/CartItemList';
import CartOrderSummary from '@/components/cart/CartOrderSummary';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 py-stack-lg transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter py-stack-md">
        {/* Cart Header */}
        <div className="mb-stack-lg">
          <h1 className="font-h1 text-[48px] font-bold text-primary dark:text-sky-400 leading-[1.2] tracking-[-0.02em]">Tu Carrito de Compras</h1>
          <p className="text-on-surface-variant dark:text-slate-400 font-body-lg mt-2">Revisa tus artículos antes de proceder al pago seguro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-8">
            <CartItemList
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </section>

          {/* Order Summary Column */}
          <aside className="lg:col-span-4">
            <CartOrderSummary
              itemCount={itemCount}
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
