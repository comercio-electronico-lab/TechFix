import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import CheckoutPagoClient from '@/components/checkout/CheckoutPagoClient';

export default function CheckoutPago() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md font-medium">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="payment" />
          <CheckoutPagoClient />
        </div>
      </main>
    </>
  );
}
