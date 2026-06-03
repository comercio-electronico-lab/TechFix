"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutEnvio() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { items, subtotal } = useCart();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?redirect=/checkout/envio');
    }
  }, [isAuthenticated, loading, router]);

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-18 min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </main>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md font-medium">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="shipping" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Main Checkout Section */}
            <div className="lg:col-span-8">
              <ShippingForm />
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
