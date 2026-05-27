"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CreditCard, Wallet, Landmark, Lock, ChevronRight, ShieldCheck, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function CheckoutPago() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          {/* Breadcrumbs / Progress */}
          <nav className="mb-stack-lg flex items-center gap-2 text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
            <span className="text-secondary">01 Envío</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary">02 Pago</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="opacity-50">03 Revisión</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Main Checkout Section */}
            <div className="lg:col-span-8">
              <h1 className="text-[48px] font-bold text-primary mb-stack-md leading-tight">Pago Seguro</h1>
              
              {/* Payment Method Selection */}
              <section className="mb-stack-lg">
                <h2 className="text-[24px] font-bold text-on-surface mb-stack-sm">Elige el método de pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-sm">
                  {/* Credit Card Option (Active) */}
                  <div className="border-2 border-secondary bg-surface-container-low rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer shadow-sm transition-all scale-[1.02]">
                    <CreditCard className="text-secondary w-10 h-10" />
                    <span className="font-bold text-on-surface">Tarjeta</span>
                  </div>
                  {/* PayPal Option */}
                  <div className="border border-outline-variant hover:border-secondary bg-white rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all">
                    <Wallet className="text-on-surface-variant w-10 h-10" />
                    <span className="font-bold text-on-surface-variant">PayPal</span>
                  </div>
                  {/* Bank Transfer Option */}
                  <div className="border border-outline-variant hover:border-secondary bg-white rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all">
                    <Landmark className="text-on-surface-variant w-10 h-10" />
                    <span className="font-bold text-on-surface-variant">Transferencia</span>
                  </div>
                </div>
              </section>

              {/* Credit Card Form */}
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-primary">Información de la Tarjeta</h3>
                  <div className="flex gap-2">
                    <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant">VISA</div>
                    <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant">MC</div>
                  </div>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <Input label="NOMBRE DEL TITULAR" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div>
                    <Input label="NÚMERO DE TARJETA" placeholder="0000 0000 0000 0000" icon={Lock} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="FECHA DE EXPIRACIÓN" placeholder="MM / YY" />
                    <Input label="CVV / CVC" placeholder="***" type="password" icon={Info} />
                  </div>
                  
                  <div className="flex items-center gap-3 py-4">
                    <input type="checkbox" className="w-5 h-5 text-secondary border-outline-variant rounded focus:ring-secondary cursor-pointer" id="save_card" />
                    <label htmlFor="save_card" className="text-sm text-on-surface-variant cursor-pointer">Guardar detalles para futuras compras técnicas</label>
                  </div>
                  
                  <Link href="/checkout/confirmacion">
                    <Button variant="secondary" className="w-full py-5 text-xl flex justify-center items-center gap-2 shadow-lg">
                      <CheckCircle className="w-6 h-6" />
                      COMPLETAR COMPRA — $1,429.98
                    </Button>
                  </Link>
                </form>
              </div>

              {/* Security Badges */}
              <div className="mt-stack-lg flex flex-wrap justify-center items-center gap-stack-lg opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">ENCRIPTACIÓN SSL 256-BIT</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">CUMPLIMIENTO PCI-DSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">PROTECCIÓN CONTRA FRAUDE</span>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-surface-container-low p-8 rounded-xl sticky top-25 border border-outline-variant/20">
                <h3 className="text-2xl font-bold mb-6 text-primary">Resumen del Pedido</h3>
                
                {/* Item List */}
                <div className="space-y-4 mb-6 border-b border-outline-variant/30 pb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg border border-outline-variant/20 overflow-hidden shrink-0 p-1">
                      <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5VDF1iqgHHiirSy34phQ6vlgZACGME4HIvoTFX0EvWaPA6uSQGrnHPeZJ0lkjl43I3ivvu3fmgLw4rH0vGseXm-UN-QsSdvLHFf3tmoRZbum_6FqaSo85p0497gzY4obB2CwbeYI16wtMTQEgjb6t9Mmb5rQbdwlGBIKbr-cRauQVVugWFQQcNMzSHVku74bF3urcY6Gw5gid6n0x0SdhnJ_hQyv2lGGfleZ2IeInObENS1m-l0mHAP-ccVtowJNNsm6hyWaGLXM" alt="GPU" />
                    </div>
                    <div className="grow">
                      <p className="font-bold text-on-surface leading-tight line-clamp-1">NVIDIA RTX 4080 Super</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">CANT: 1</p>
                      <p className="font-bold text-secondary mt-1">$1,199.99</p>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$1,379.98</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Envío (Express)</span>
                    <span className="text-secondary font-bold">$25.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Impuestos est.</span>
                    <span>$25.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-primary/10 pt-4 mb-6">
                  <span className="text-xl font-bold text-primary">Total</span>
                  <span className="text-3xl font-bold text-secondary">$1,429.98</span>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 text-center">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">SOPORTE TÉCNICO GRATUITO INCLUIDO</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
