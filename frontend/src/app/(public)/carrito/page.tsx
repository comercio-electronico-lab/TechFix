"use client";

import Button from '@/components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background py-stack-lg">
      <div className="max-w-container-max mx-auto px-gutter py-stack-md">
        {/* Cart Header */}
        <div className="mb-stack-lg">
          <h1 className="font-h1 text-[48px] font-bold text-primary leading-[1.2] tracking-[-0.02em]">Tu Carrito de Compras</h1>
          <p className="text-on-surface-variant font-body-lg mt-2">Revisa tus artículos antes de proceder al pago seguro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-8 space-y-stack-md">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-6 items-center border border-outline-variant/10">
                  <div className="w-full md:w-32 h-32 bg-surface-container-low rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="grow w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{item.name}</h3>
                        <p className="text-on-surface-variant text-sm mt-1 line-clamp-1">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags?.map(tag => (
                            <span key={tag} className="bg-surface-container-high text-on-secondary-container px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center border border-outline rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-2 hover:bg-surface-container-low transition-colors text-primary"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-bold text-primary">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-2 hover:bg-surface-container-low transition-colors text-primary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-error flex items-center gap-1 hover:underline font-bold text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-outline-variant/10 shadow-sm">
                <ShoppingBag className="w-16 h-16 text-outline-variant mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary">Tu carrito está vacío</h3>
                <p className="text-on-surface-variant mt-2 mb-8">Parece que aún no has añadido nada a tu carrito.</p>
                <Link href="/catalogo">
                  <Button variant="primary">Ir al Catálogo</Button>
                </Link>
              </div>
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
            <div className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/20 sticky top-[96px]">
              <h2 className="text-2xl font-bold text-primary mb-6 border-b border-outline-variant/10 pb-4">Resumen del Pedido</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} artículos)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Envío</span>
                  <span className="text-secondary font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Impuestos estimados</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-[12px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">CÓDIGO PROMO</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-grow bg-white border border-outline rounded-lg px-3 py-2 focus:ring-secondary focus:border-secondary outline-none" 
                    placeholder="Ingresar código" 
                    type="text"
                  />
                  <Button variant="primary" className="px-4 py-2">Aplicar</Button>
                </div>
              </div>

              <Link href="/checkout/envio">
                <Button variant="secondary" className="w-full py-4 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6" disabled={items.length === 0}>
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <span>Pago seguro encriptado SSL</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <Truck className="w-5 h-5 text-secondary" />
                  <span>Entrega técnica rápida y confiable</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
