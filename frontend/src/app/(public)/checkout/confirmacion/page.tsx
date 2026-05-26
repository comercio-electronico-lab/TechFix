"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, BellRing, Printer, Home, ShieldCheck } from 'lucide-react';

export default function CheckoutConfirmacion() {
  return (
    <>
      <Navbar />
      <main className="pt-18 pb-section-padding bg-background text-on-background font-body-md">
        {/* Success Hero Section */}
        <section className="bg-surface-container-low py-stack-lg border-b border-outline-variant/10">
          <div className="max-w-200 mx-auto px-gutter text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-stack-md shadow-lg shadow-secondary/20">
              <CheckCircle className="text-white w-12 h-12" />
            </div>
            <h1 className="text-[48px] font-bold text-primary mb-stack-sm leading-tight">¡Pedido Confirmado!</h1>
            <p className="text-lg text-on-surface-variant max-w-150 mx-auto">
              Gracias por elegir TechFix. Tu pedido ha sido procesado con éxito y nuestros ingenieros están preparando tu paquete para el despacho.
            </p>
            <div className="mt-8 inline-block px-6 py-3 bg-white rounded-xl border border-outline-variant shadow-sm">
              <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Número de Pedido:</span>
              <span className="text-lg font-bold text-primary ml-2">#TF-9284-00129X</span>
            </div>
          </div>
        </section>

        {/* Order Summary & Delivery Details */}
        <section className="max-w-container-max mx-auto px-gutter mt-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Left: Detailed Summary */}
            <div className="lg:col-span-8 space-y-stack-md">
              {/* Order Items Card */}
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                  <Package className="text-secondary w-6 h-6" />
                  Resumen del Pedido
                </h2>
                <div className="divide-y divide-outline-variant/20">
                  {/* Item 1 */}
                  <div className="py-6 flex gap-6">
                    <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden shrink-0 border border-outline-variant/10">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC14gKNs7nGkDsKpwsDrNPklufxPNjMl5NMvl-aFi0GyA82T4TYTKuJtEfsX8WHldlKMR38M8fwWQPxTaoeOp1-Rgz0-asfa3JKJMO9ZTRhXauItUMi1soVqZRbJAn5pNkdADfzmN3IgW0cUcGyu3eJoz3T_0U75hRBvBeciWC9U_IRV-vRowFoQ6uSOpvzCWyXfrqqPtg-jybmS0keXw-QTx9pz8EXYnC5w2KxxkhwStf1uU_msqTy7FATRjQiKsWn7WZJBRikIIk" alt="Ryzen Kit" />
                    </div>
                    <div className="grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-primary text-lg">Pro-Series Ryzen Thermal Kit</h3>
                        <span className="font-bold text-primary">$89.99</span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">Solución de Enfriamiento Grado Industrial</p>
                      <div className="mt-3">
                        <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-primary uppercase">Cant: 1</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-outline-variant/30 space-y-3">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$214.49</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Envío (Express)</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Impuestos (8%)</span>
                    <span>$17.16</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10 mt-4">
                    <span className="text-xl font-bold text-primary">Total</span>
                    <span className="text-3xl font-bold text-secondary">$246.65</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Tracking */}
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border border-outline-variant/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <h3 className="text-[12px] font-bold text-secondary uppercase tracking-widest">Dirección de Entrega</h3>
                    <p className="text-primary font-bold text-lg">Jameson Carter</p>
                    <p className="text-on-surface-variant leading-relaxed">
                      4821 Tech Boulevard, Suite 400<br/>
                      Silicon Valley, CA 94025<br/>
                      Estados Unidos
                    </p>
                  </div>
                  <div className="space-y-4 bg-surface-container-low p-6 rounded-xl border border-secondary/10">
                    <h3 className="text-[12px] font-bold text-secondary uppercase tracking-widest">Entrega Estimada</h3>
                    <div className="flex items-center gap-4">
                      <Truck className="text-secondary w-10 h-10" />
                      <div>
                        <p className="text-primary font-bold text-xl">Jueves, 12 Dic</p>
                        <p className="text-on-surface-variant text-sm">Enviado vía TechFix Express</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="lg:col-span-4 space-y-stack-md">
              <div className="bg-primary text-white rounded-xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Siguientes Pasos</h2>
                <ul className="space-y-6 mb-10">
                  <li className="flex gap-4">
                    <Mail className="text-secondary-container shrink-0 w-6 h-6" />
                    <span className="text-sm opacity-90">Hemos enviado un correo de confirmación con tu factura a j.carter@example.com</span>
                  </li>
                  <li className="flex gap-4">
                    <BellRing className="text-secondary-container shrink-0 w-6 h-6" />
                    <span className="text-sm opacity-90">Recibirás una notificación en cuanto tus partes salgan de nuestro almacén.</span>
                  </li>
                </ul>
                <div className="space-y-4">
                  <Button variant="secondary" className="w-full py-4 flex items-center justify-center gap-2 shadow-lg">
                    <Printer className="w-5 h-5" />
                    Imprimir Recibo
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full py-4 flex items-center justify-center gap-2 mt-4">
                      <Home className="w-5 h-5" />
                      Volver al Inicio
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border-l-4 border-secondary">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-secondary shrink-0 w-6 h-6" />
                  <div>
                    <h4 className="font-bold text-primary text-lg">Garantía TechFix</h4>
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                      Este pedido está cubierto por nuestra garantía de 12 meses "Engineered Quality". Soporte experto a un clic si necesitas ayuda con la instalación.
                    </p>
                    <a href="#" className="text-secondary font-bold text-sm inline-block mt-4 hover:underline">Leer Política de Garantía</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
