'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutEnvioClient() {
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
  );
}
