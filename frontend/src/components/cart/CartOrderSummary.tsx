import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartOrderSummaryProps {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  disableCheckout: boolean;
}

export default function CartOrderSummary({ itemCount, subtotal, tax, total, disableCheckout }: CartOrderSummaryProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-slate-950/30 border border-outline-variant/20 dark:border-slate-800 sticky top-[96px] transition-colors">
      <h2 className="text-2xl font-bold text-primary dark:text-sky-400 mb-6 border-b border-outline-variant/10 dark:border-slate-850 pb-4">Resumen del Pedido</h2>
      <div className="space-y-4 mb-8 text-on-surface-variant dark:text-slate-400">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} artículos)</span>
          <span className="font-semibold text-on-surface dark:text-slate-200">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span className="text-secondary dark:text-sky-450 font-bold">GRATIS</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos estimados</span>
          <span className="font-semibold text-on-surface dark:text-slate-200">${tax.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t border-outline-variant/10 dark:border-slate-850 flex justify-between items-center">
          <span className="text-xl font-bold text-primary dark:text-sky-400">Total</span>
          <span className="text-3xl font-bold text-primary dark:text-sky-400 font-mono">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-8">
        <label className="block text-[12px] font-bold text-on-surface-variant dark:text-slate-450 mb-2 uppercase tracking-wider">CÓDIGO PROMO</label>
        <div className="flex gap-2">
          <input 
            className="flex-grow bg-white dark:bg-slate-950 border border-outline dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-secondary focus:border-secondary dark:focus:ring-sky-500/50 outline-none text-sm text-on-surface dark:text-white" 
            placeholder="Ingresar código" 
            type="text"
          />
          <Button variant="primary" className="px-4 py-2">Aplicar</Button>
        </div>
      </div>

      <Link href="/checkout/envio">
        <Button variant="secondary" className="w-full py-4 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6" disabled={disableCheckout}>
          Proceder al Pago
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-sm">
          <ShieldCheck className="w-5 h-5 text-secondary dark:text-sky-450" />
          <span>Pago seguro encriptado SSL</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-sm">
          <Truck className="w-5 h-5 text-secondary dark:text-sky-450" />
          <span>Entrega técnica rápida y confiable</span>
        </div>
      </div>
    </div>
  );
}
