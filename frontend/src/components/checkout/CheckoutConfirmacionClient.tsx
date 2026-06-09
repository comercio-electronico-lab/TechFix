'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DetailedOrderSummary from '@/components/checkout/DetailedOrderSummary';
import DeliveryDetailsCard from '@/components/checkout/DeliveryDetailsCard';
import NextStepsCard from '@/components/checkout/NextStepsCard';
import WarrantyCard from '@/components/checkout/WarrantyCard';
import { useAuth } from '@/context/AuthContext';
import { OrderData } from '@/interfaces/domain';

interface Props {
  defaultOrder: OrderData;
}

export default function CheckoutConfirmacionClient({ defaultOrder }: Props) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState<OrderData>(defaultOrder);

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
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
  );
}
