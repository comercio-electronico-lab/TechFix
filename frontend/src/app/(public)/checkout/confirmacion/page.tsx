import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import CheckoutConfirmacionClient from '@/components/checkout/CheckoutConfirmacionClient';
import { OrderData } from '@/interfaces/domain';

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
  return (
    <>
      <Navbar />
      <main className="pt-18 pb-section-padding bg-background text-on-background font-body-md font-medium">
        <ConfirmationHero orderNumber={DEFAULT_ORDER.orderNumber} />

        <section className="max-w-container-max mx-auto px-gutter mt-stack-lg">
          <Suspense fallback={null}>
            <CheckoutConfirmacionClient defaultOrder={DEFAULT_ORDER} />
          </Suspense>
        </section>
      </main>
    </>
  );
}

