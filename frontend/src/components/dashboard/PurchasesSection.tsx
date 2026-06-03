"use client";

import React from 'react';
import PurchasesHeader from './purchases/PurchasesHeader';
import PurchasesEmpty from './purchases/PurchasesEmpty';
import OrderCard from './purchases/OrderCard';

interface Order {
  orderId?: string;
  fecha?: string;
  items?: Array<{ id: string; name: string; quantity: number; price: number }>;
  total?: number;
  subtotal?: number;
}

interface PurchasesSectionProps {
  lastOrder: Order | null;
}

const PurchasesSection = ({ lastOrder }: PurchasesSectionProps) => {
  return (
    <div className="space-y-6">
      <PurchasesHeader />

      {!lastOrder ? (
        <PurchasesEmpty />
      ) : (
        <OrderCard order={lastOrder} />
      )}
    </div>
  );
};

export default PurchasesSection;
