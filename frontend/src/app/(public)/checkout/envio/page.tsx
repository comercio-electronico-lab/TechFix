import Navbar from '@/components/layout/Navbar';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgressBar';
import CheckoutEnvioClient from '@/components/checkout/CheckoutEnvioClient';

export default function CheckoutEnvio() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background text-on-background font-body-md font-medium">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <CheckoutProgressBar currentStep="shipping" />
          <CheckoutEnvioClient />
        </div>
      </main>
    </>
  );
}
