import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  disableCheckout: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  itemsCount,
  subtotal,
  shipping,
  tax,
  total,
  disableCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    alert(`Código de promoción "${promoCode}" aplicado con éxito (simulado).`);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/20 sticky top-[96px]">
      <h2 className="text-2xl font-bold text-primary mb-6 border-b border-outline-variant/10 pb-4">
        Resumen del Pedido
      </h2>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Envío</span>
          {shipping === 0 ? (
            <span className="text-secondary font-bold">GRATIS</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
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

      {/* Promo Code Form */}
      <form onSubmit={handleApplyPromo} className="mb-8">
        <label htmlFor="promo-input" className="block text-[12px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
          CÓDIGO PROMO
        </label>
        <div className="flex gap-2">
          <input 
            id="promo-input"
            className="flex-grow bg-white border border-outline rounded-lg px-3 py-2 focus:ring-secondary focus:border-secondary outline-none text-primary" 
            placeholder="Ingresar código" 
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button type="submit" variant="primary" className="px-4 py-2">
            Aplicar
          </Button>
        </div>
      </form>

      <Link href={disableCheckout ? '#' : '/checkout/envio'} className={disableCheckout ? 'pointer-events-none' : ''}>
        <Button 
          variant="secondary" 
          className="w-full py-4 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6" 
          disabled={disableCheckout}
        >
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
  );
};

export default CartSummary;
