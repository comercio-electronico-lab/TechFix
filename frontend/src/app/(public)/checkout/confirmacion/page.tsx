"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import DetailedOrderSummary from '@/components/checkout/DetailedOrderSummary';
import DeliveryDetailsCard from '@/components/checkout/DeliveryDetailsCard';
import NextStepsCard from '@/components/checkout/NextStepsCard';
import WarrantyCard from '@/components/checkout/WarrantyCard';

export default function CheckoutConfirmacion() {
  const orderData = {
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
    subtotal: 214.49,
    shipping: 15.00,
    tax: 17.16
  };

  return (
    <>
      <Navbar />
      <main className="pt-18 pb-section-padding bg-background text-on-background font-body-md">
        <ConfirmationHero orderNumber={orderData.orderNumber} />

        <section className="max-w-container-max mx-auto px-gutter mt-stack-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-stack-md">
              <DetailedOrderSummary 
                items={orderData.items}
                subtotal={orderData.subtotal}
                shipping={orderData.shipping}
                tax={orderData.tax}
              />
              
              <DeliveryDetailsCard 
                clientName={orderData.clientName}
                address={orderData.address}
                estimatedDate={orderData.estimatedDate}
                courier={orderData.courier}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-stack-md">
              <NextStepsCard email={orderData.email} />
              <WarrantyCard />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
