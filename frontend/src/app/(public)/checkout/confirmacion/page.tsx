import Navbar from '@/components/layout/Navbar';
import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import CheckoutConfirmacionClient from '@/components/checkout/CheckoutConfirmacionClient';
import { DEFAULT_ORDER } from '@/mock/orders';

export default function CheckoutConfirmacion() {
  return (
    <>
      <Navbar />
      <main className="pt-18 pb-section-padding bg-background text-on-background font-body-md font-medium">
        <ConfirmationHero orderNumber={DEFAULT_ORDER.orderNumber} />

        <section className="max-w-container-max mx-auto px-gutter mt-stack-lg">
          <CheckoutConfirmacionClient defaultOrder={DEFAULT_ORDER} />
        </section>
      </main>
    </>
  );
}
