"use client";

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import CreditCardForm from '@/components/checkout/CreditCardForm';
import SecurityBadges from '@/components/checkout/SecurityBadges';
import OrderSummary from '@/components/checkout/OrderSummary';

import { useCart } from '@/context/CartContext';

export default function CheckoutPago() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const { items, subtotal } = useCart();

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const totalAmount = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md font-medium">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="payment" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Main Checkout Section */}
            <div className="lg:col-span-8">
              <h1 className="text-[48px] font-bold text-primary dark:text-white mb-stack-md leading-tight">Pago Seguro</h1>
              
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
        </div>
      </main>
    </>
  );
}
