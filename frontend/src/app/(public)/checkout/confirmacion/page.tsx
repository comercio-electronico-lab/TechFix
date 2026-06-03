'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import DetailedOrderSummary from '@/components/checkout/DetailedOrderSummary';
import DeliveryDetailsCard from '@/components/checkout/DeliveryDetailsCard';
import NextStepsCard from '@/components/checkout/NextStepsCard';
import WarrantyCard from '@/components/checkout/WarrantyCard';
import { useAuth } from '@/context/AuthContext';

interface OrderData {
  orderNumber: string;
  email: string;
  clientName: string;
  address: string;
  estimatedDate: string;
  courier: string;
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
}

const DEFAULT_ORDER: OrderData = {
  orderNumber: "#TF-9284-00129X",
  email: "j.carter@example.com",
  clientName: "Jameson Carter",
  address: "4821 Tech Boulevard, Suite 400\nSilicon Valley, CA 94025\nEstados Unidos",
  estimatedDate: "Jueves, 12 Dic",
  courier: "TechFix Express",
  items: [
    {
      id: '1',
      name: 'Pro-Series Ryzen Thermal Kit',
      description: 'Solución de Enfriamiento Grado Industrial',
      quantity: 1,
      price: 89.99,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC14gKNs7nGkDsKpwsDrNPklufxPNjMl5NMvl-aFi0GyA82T4TYTKuJtEfsX8WHldlKMR38M8fwWQPxTaoeOp1-Rgz0-asfa3JKJMO9ZTRhXauItUMi1soVqZRbJAn5pNkdADfzmN3IgW0cUcGyu3eJoz3T_0U75hRBvBeciWC9U_IRV-vRowFoQ6uSOpvzCWyXfrqqPtg-jybmS0keXw-QTx9pz8EXYnC5w2KxxkhwStf1uU_msqTy7FATRjQiKsWn7WZJBRikIIk'
    }
  ],
  subtotal: 89.99,
  shipping: 10.00,
  tax: 16.20
};

export default function CheckoutConfirmacion() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState<OrderData>(DEFAULT_ORDER);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?redirect=/checkout/confirmacion');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('techfix_last_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrder(parsed);
      } catch (e) {
        console.error("Error parsing order", e);
      }
    }
  }, []);

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
      <main className="pt-18 pb-section-padding bg-background text-on-background font-body-md font-medium">
        <ConfirmationHero orderNumber={order.orderNumber} />

        <section className="max-w-container-max mx-auto px-gutter mt-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-stack-md">
              <DetailedOrderSummary 
                items={order.items}
                subtotal={order.subtotal}
                shipping={order.shipping}
                tax={order.tax}
              />
              
              <DeliveryDetailsCard 
                clientName={order.clientName}
                address={order.address}
                estimatedDate={order.estimatedDate}
                courier={order.courier}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-stack-md">
              <NextStepsCard email={order.email} />
              <WarrantyCard />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
