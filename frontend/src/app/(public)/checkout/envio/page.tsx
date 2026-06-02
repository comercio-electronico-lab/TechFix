"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutEnvio() {
  const orderData = {
    items: [
      {
        id: '1',
        name: 'Ryzen 9 7950X Processor',
        quantity: 1,
        price: 549.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCme1LzT9AXzHJXVxI5EFN5w9j06dYDACPwB8-LmhhLRQJwW-Jlwpept_IP8lZzjIlEPY1Ml2F59hwMSA4v382MJX92OIiCDEZetihjy65cPRjYWxvsh6B0ZRMjCxQnOJhll-49cg57ThSnBRjS5iCWB_kIm3S2xVO0yZwXj1jiIGvrw1FVKVkOVXnNZjYKdYj1KgyI8i1UklA0Q-p1_xTjS4monl27SBNTcwyiveD-bd3DovvmiX6iXe4G3C0RBekH-mdm-jIXhGQ'
      }
    ],
    subtotal: 738.98,
    shipping: 0,
    tax: 59.12
  };

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="shipping" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Main Checkout Section */}
            <div className="lg:col-span-8">
              <ShippingForm />
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
