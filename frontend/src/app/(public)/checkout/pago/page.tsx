"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowRight, ArrowLeft, CreditCard, Wallet, Landmark, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';

export default function CheckoutPago() {
  const { items, subtotal, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();

  // Estados de pago
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    saveCard: false
  });

  // Datos guardados del paso anterior
  const [contact, setContact] = useState({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' });
  const [shipping, setShipping] = useState({ address: '123 Science Lab Way', city: 'Silicon Valley', state: 'CA', zipCode: '94025' });

  useEffect(() => {
    const contactData = localStorage.getItem('checkout_contact');
    const shippingData = localStorage.getItem('checkout_shipping');
    if (contactData) {
      try {
        setContact(JSON.parse(contactData));
      } catch (e) {
        console.error("Error parsing contact", e);
      }
    }
    if (shippingData) {
      try {
        setShipping(JSON.parse(shippingData));
      } catch (e) {
        console.error("Error parsing shipping", e);
      }
    }
  }, []);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!cardData.cardName || !cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCvv) {
        alert("Por favor completa los detalles de tu tarjeta de crédito.");
        return;
      }
    }
    
    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body = {
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
        },
        shipping: {
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zipCode: shipping.zipCode,
        },
        payment_method: paymentMethod,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar total y número de orden real en localStorage
        localStorage.setItem('checkout_order', JSON.stringify({
          orderNumber: data.orderNumber,
          total: data.total,
          subtotal: data.subtotal,
          tax: data.tax,
          paymentMethod: paymentMethod,
          reference: data.reference,
        }));

        // Vaciar el carrito
        clearCart();
        
        // Navegar a la página de confirmación
        router.push('/checkout/confirmacion');
      } else {
        alert(data.error || 'Error al procesar el pago. Por favor intente de nuevo.');
      }
    } catch (error) {
      console.error('Error durante el checkout:', error);
      alert('Error de conexión con el servidor de pagos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background dark:bg-slate-950 min-h-screen flex flex-col font-body-md antialiased transition-colors duration-300">
      
      <CheckoutHeader status="checkout" />

      {/* Main Layout */}
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Checkout Steps */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
              Checkout
            </h1>
            
            <form onSubmit={handleCompletePurchase} className="space-y-6">
              
              {/* Step 1: Contact Information (Completed) */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white flex items-center gap-3">
                    <span className="bg-emerald-500 dark:bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Contact Information
                  </h2>
                  <Link href="/checkout/envio" className="text-xs font-semibold text-primary dark:text-sky-400 hover:underline">
                    Edit
                  </Link>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 ml-9">
                  {contact.firstName} {contact.lastName} — {contact.email}
                </p>
              </div>

              {/* Step 2: Shipping Details (Completed) */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white flex items-center gap-3">
                    <span className="bg-emerald-500 dark:bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Shipping Details
                  </h2>
                  <Link href="/checkout/envio" className="text-xs font-semibold text-primary dark:text-sky-400 hover:underline">
                    Edit
                  </Link>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 ml-9">
                  {shipping.address}, {shipping.city}, {shipping.state} {shipping.zipCode}
                </p>
              </div>

              {/* Step 3: Payment Method (Active) */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-3">
                    <span className="bg-primary dark:bg-sky-500 text-on-primary dark:text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">3</span>
                    Payment Method
                  </h2>
                </div>

                {/* Tab Selectors */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-1 ring-primary dark:ring-sky-500' 
                        : 'border-outline-variant dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 bg-surface dark:bg-slate-950'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${paymentMethod === 'card' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`}>Card</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('paypal')}
                    className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-1 ring-primary dark:ring-sky-500' 
                        : 'border-outline-variant dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 bg-surface dark:bg-slate-950'
                    }`}
                  >
                    <Wallet className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${paymentMethod === 'paypal' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`}>PayPal</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('bank')}
                    className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank' 
                        ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-1 ring-primary dark:ring-sky-500' 
                        : 'border-outline-variant dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 bg-surface dark:bg-slate-950'
                    }`}
                  >
                    <Landmark className={`w-6 h-6 ${paymentMethod === 'bank' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${paymentMethod === 'bank' ? 'text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-400'}`}>Transfer</span>
                  </div>
                </div>

                {/* Sub Forms */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="cardName">Cardholder Name</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="cardName" 
                        placeholder="Jane Doe" 
                        required 
                        type="text"
                        value={cardData.cardName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="cardNumber">Card Number</label>
                      <div className="relative">
                        <input 
                          className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded pl-10 pr-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                          id="cardNumber" 
                          placeholder="0000 0000 0000 0000" 
                          required 
                          type="text"
                          value={cardData.cardNumber}
                          onChange={handleInputChange}
                        />
                        <Lock className="w-4 h-4 text-on-surface-variant/60 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="cardExpiry">Expiration Date</label>
                        <input 
                          className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                          id="cardExpiry" 
                          placeholder="MM / YY" 
                          required 
                          type="text"
                          value={cardData.cardExpiry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="cardCvv">CVV / CVC</label>
                        <input 
                          className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                          id="cardCvv" 
                          placeholder="***" 
                          required 
                          type="password"
                          maxLength={4}
                          value={cardData.cardCvv}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="saveCard"
                        checked={cardData.saveCard}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-outline-variant dark:border-slate-700 text-primary dark:text-sky-500 bg-surface dark:bg-slate-950 focus:ring-primary dark:focus:ring-sky-500 cursor-pointer transition-colors" 
                      />
                      <label htmlFor="saveCard" className="text-xs text-on-surface-variant dark:text-slate-400 cursor-pointer select-none">
                        Save card details for future technical purchases securely
                      </label>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-surface dark:bg-slate-950 p-6 rounded-lg border border-outline-variant dark:border-slate-800 text-center space-y-3">
                    <Wallet className="w-8 h-8 text-primary dark:text-sky-400 mx-auto" />
                    <p className="text-xs text-on-surface dark:text-slate-300">You will be redirected to PayPal's secure gateway to log in and approve payment details.</p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-surface dark:bg-slate-950 p-6 rounded-lg border border-outline-variant dark:border-slate-800 text-center space-y-3">
                    <Landmark className="w-8 h-8 text-primary dark:text-sky-400 mx-auto" />
                    <p className="text-xs text-on-surface dark:text-slate-300">Transfer payment directly to TechFix Corporate bank accounts. Order will ship once verification is complete.</p>
                  </div>
                )}
              </div>

              {/* Button Row */}
              <div className="flex justify-between items-center pt-4">
                <Link href="/checkout/envio" className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-sky-400 hover:text-secondary dark:hover:text-sky-300 transition-colors uppercase tracking-wider group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Shipping
                </Link>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary dark:bg-sky-600 hover:bg-primary-container dark:hover:bg-sky-500 text-on-primary dark:text-white rounded text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow dark:hover:shadow-sky-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <>Complete Purchase <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <CheckoutOrderSummary 
            items={items}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />

        </div>
      </main>
    </div>
  );
}
