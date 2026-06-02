"use client";

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import CreditCardForm from '@/components/checkout/CreditCardForm';
import SecurityBadges from '@/components/checkout/SecurityBadges';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutPago() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const orderData = {
    items: [
      {
        id: '1',
        name: 'NVIDIA RTX 4080 Super',
        quantity: 1,
        price: 1199.99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5VDF1iqgHHiirSy34phQ6vlgZACGME4HIvoTFX0EvWaPA6uSQGrnHPeZJ0lkjl43I3ivvu3fmgLw4rH0vGseXm-UN-QsSdvLHFf3tmoRZbum_6FqaSo85p0497gzY4obB2CwbeYI16wtMTQEgjb6t9Mmb5rQbdwlGBIKbr-cRauQVVugWFQQcNMzSHVku74bF3urcY6Gw5gid6n0x0SdhnJ_hQyv2lGGfleZ2IeInObENS1m-l0mHAP-ccVtowJNNsm6hyWaGLXM'
      }
    ],
    subtotal: 1379.98,
    shipping: 25.00,
    tax: 25.00
  };

  const totalAmount = orderData.subtotal + orderData.shipping + orderData.tax;

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="payment" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Main Checkout Section */}
            <div className="lg:col-span-8">
              <h1 className="text-[48px] font-bold text-primary mb-stack-md leading-tight">Pago Seguro</h1>
              
              <PaymentMethodSelector 
                selected={paymentMethod} 
                onSelect={setPaymentMethod} 
              />

              {paymentMethod === 'card' ? (
                <CreditCardForm totalAmount={totalAmount} />
              ) : (
                <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-8 text-center py-12">
                  <p className="text-on-surface-variant font-medium">
                    Redirigiendo a la plataforma de pago segura...
                  </p>
                </div>
              )}

              <SecurityBadges />
            </div>

            {/* Order Summary Sidebar */}
            <OrderSummary 
              items={orderData.items}
              subtotal={orderData.subtotal}
              shipping={orderData.shipping}
              tax={orderData.tax}
            />
          </div>
        </div>
      </main>
    </>
  );
}
