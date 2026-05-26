"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Truck, CreditCard, Lock, ChevronRight, Info } from 'lucide-react';

export default function CheckoutEnvio() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          {/* Step Indicator */}
          <div className="mb-stack-lg flex justify-center">
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white mb-2 shadow-sm">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">CARRITO</span>
              </div>
              <div className="h-px bg-outline-variant flex-1 mb-6"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mb-2 shadow-lg ring-4 ring-primary-container/20">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">ENVÍO</span>
              </div>
              <div className="h-px bg-outline-variant flex-1 mb-6"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline mb-2">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">PAGO</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Left Column: Shipping Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/20 pb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold text-primary">Información de Envío</h1>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="NOMBRE COMPLETO" placeholder="Ej: Juan Pérez" />
                    <Input label="TELÉFONO" placeholder="+51 999 999 999" />
                  </div>
                  
                  <Input label="DIRECCIÓN" placeholder="Calle, número, departamento" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="CIUDAD" placeholder="Ej: Lima" />
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-primary uppercase tracking-tight">ESTADO / PROVINCIA</label>
                      <select className="w-full bg-white border border-outline-variant/50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-secondary transition-all">
                        <option>Seleccionar...</option>
                        <option>Lima</option>
                        <option>Arequipa</option>
                        <option>Cusco</option>
                      </select>
                    </div>
                    <Input label="CÓDIGO POSTAL" placeholder="15047" />
                  </div>
                  
                  <div className="pt-6 border-t border-outline-variant/20 flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-secondary border-outline rounded focus:ring-secondary cursor-pointer" id="save_info" />
                    <label htmlFor="save_info" className="text-sm text-on-surface-variant cursor-pointer">Guardar esta información para futuras órdenes</label>
                  </div>
                  
                  <div className="flex justify-between items-center pt-8">
                    <Link href="/carrito" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold">
                      Volver al Carrito
                    </Link>
                    <Link href="/checkout/pago">
                      <Button variant="secondary" className="px-8 py-4 shadow-md hover:brightness-110 flex items-center gap-2">
                        Continuar al Pago
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="lg:col-span-4">
              <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 sticky top-24">
                <h2 className="text-xl font-bold text-primary mb-6">Resumen del Pedido</h2>
                
                {/* Order Items */}
                <div className="space-y-6 mb-8 border-b border-outline-variant/30 pb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded border border-outline-variant/30 p-1 shrink-0">
                      <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCme1LzT9AXzHJXVxI5EFN5w9j06dYDACPwB8-LmhhLRQJwW-Jlwpept_IP8lZzjIlEPY1Ml2F59hwMSA4v382MJX92OIiCDEZetihjy65cPRjYWxvsh6B0ZRMjCxQnOJhll-49cg57ThSnBRjS5iCWB_kIm3S2xVO0yZwXj1jiIGvrw1FVKVkOVXnNZjYKdYj1KgyI8i1UklA0Q-p1_xTjS4monl27SBNTcwyiveD-bd3DovvmiX6iXe4G3C0RBekH-mdm-jIXhGQ" alt="Ryzen 9" />
                    </div>
                    <div className="grow">
                      <p className="font-bold text-on-surface leading-tight line-clamp-1">Ryzen 9 7950X Processor</p>
                      <p className="text-xs text-on-surface-variant">Cant: 1</p>
                      <p className="text-primary font-bold">$549.00</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-on-surface-variant text-sm">
                    <span>Subtotal</span>
                    <span>$738.98</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-sm">
                    <span>Envío</span>
                    <span className="text-secondary font-bold">GRATIS</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-sm">
                    <span>Impuestos est.</span>
                    <span>$59.12</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-outline-variant/10 mt-3">
                    <span>Total</span>
                    <span>$798.10</span>
                  </div>
                </div>

                <div className="mt-8 bg-white/50 p-4 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">¿NECESITAS AYUDA?</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Llama a nuestros técnicos expertos al 1-800-TECH-FIX para asistencia.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
