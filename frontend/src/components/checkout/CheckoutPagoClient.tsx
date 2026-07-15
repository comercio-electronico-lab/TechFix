'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import CreditCardForm from '@/components/checkout/CreditCardForm';
import SecurityBadges from '@/components/checkout/SecurityBadges';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { calculateOrderTotals } from '@/lib/pricing';

export default function CheckoutPagoClient() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const { items, subtotal } = useCart();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?redirect=/checkout/pago');
    }
  }, [isAuthenticated, loading, router]);

  const { shipping, tax, total: totalAmount } = calculateOrderTotals(subtotal);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
      {/* Main Checkout Section */}
      <div className="lg:col-span-8">
        <h1 className="text-[48px] font-bold text-primary dark:text-white mb-stack-md leading-tight">
          Pago Seguro
        </h1>

        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {paymentMethod === 'card' ? (
          <CreditCardForm totalAmount={totalAmount} />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 dark:border-slate-800 p-8 text-center py-12">
            <p className="text-on-surface-variant dark:text-slate-400 font-medium">
              Procesando orden con transferencia bancaria / contra entrega...
            </p>
          </div>
        )}

        <SecurityBadges />
      </div>

      {/* Order Summary Sidebar */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
      />
    </div>
  );
}
