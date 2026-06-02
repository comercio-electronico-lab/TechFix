"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Truck, Mail, BellRing, Printer, Home, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';

export default function CheckoutConfirmacion() {
  // Estado para la orden simulada
  const [order, setOrder] = useState({
    orderNumber: 'TF-9284-00129X',
    total: 140.39,
    subtotal: 129.99,
    tax: 10.40,
    paymentMethod: 'card'
  });

  // Datos de contacto y envío guardados
  const [contact, setContact] = useState({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' });
  const [shipping, setShipping] = useState({ address: '123 Science Lab Way', city: 'Silicon Valley', state: 'CA', zipCode: '94025' });

  useEffect(() => {
    const savedOrder = localStorage.getItem('checkout_order');
    const contactData = localStorage.getItem('checkout_contact');
    const shippingData = localStorage.getItem('checkout_shipping');
    
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Error parsing order", e);
      }
    }
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-background dark:bg-slate-950 min-h-screen flex flex-col font-body-md antialiased transition-colors duration-300">
      
      <CheckoutHeader status="confirmed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full px-4 md:px-8">
        
        {/* Success Banner */}
        <section className="bg-surface-container-low dark:bg-slate-900/40 rounded-xl p-8 border border-outline-variant/40 dark:border-slate-800 text-center mb-8 shadow-sm">
          <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle className="text-emerald-500 dark:text-emerald-400 w-10 h-10" />
          </div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your payment was successful and your order has been received. Our expert technicians are preparing your precision kit for shipment.
          </p>
          <div className="mt-6 inline-flex flex-col sm:flex-row gap-2 justify-center items-center px-4 py-2.5 bg-surface dark:bg-slate-950 rounded-lg border border-outline-variant/50 dark:border-slate-800">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">Order Reference:</span>
            <span className="text-sm font-bold text-primary dark:text-sky-400">{order.orderNumber}</span>
          </div>
        </section>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery & Summary */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Delivery Details */}
            <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
              <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white mb-4 flex items-center gap-2.5">
                <Truck className="text-primary dark:text-sky-400 w-5 h-5" />
                Delivery details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider text-[10px]">Shipping Address</h3>
                  <p className="font-semibold text-on-surface dark:text-slate-200 text-sm mt-1">{contact.firstName} {contact.lastName}</p>
                  <p className="text-on-surface-variant dark:text-slate-400 mt-1 leading-normal">
                    {shipping.address}<br />
                    {shipping.city}, {shipping.state} {shipping.zipCode}
                  </p>
                </div>

                <div className="space-y-1 bg-surface-container-low dark:bg-slate-950 p-4 rounded-lg border border-primary/5 dark:border-slate-850">
                  <h3 className="font-bold text-primary dark:text-sky-400 uppercase tracking-wider text-[10px]">Estimated Delivery</h3>
                  <p className="text-lg font-bold text-on-surface dark:text-white mt-1">Thursday, Jun 4</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5 leading-normal">Shipped via TechFix Precision Logistics Express</p>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
              <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white mb-4">
                Receipt Summary
              </h2>
              
              <div className="space-y-3 pt-2 border-t border-outline-variant/10 dark:border-slate-850">
                <div className="flex justify-between text-xs text-on-surface-variant dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant dark:text-slate-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${order.tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-outline-variant/30 dark:border-slate-800 pt-4 mt-2">
                  <span className="font-bold text-sm text-on-surface dark:text-white">Amount Charged</span>
                  <span className="font-bold text-xl text-primary dark:text-sky-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions / Next Steps */}
            <div className="bg-primary dark:bg-sky-950 text-on-primary dark:text-sky-100 rounded-lg p-6 shadow-md border border-primary/20">
              <h2 className="font-headline-md text-lg font-bold mb-4">What's Next?</h2>
              
              <ul className="space-y-4 mb-8 text-xs leading-normal">
                <li className="flex gap-3">
                  <Mail className="shrink-0 w-4 h-4 text-primary-fixed-dim" />
                  <span>A copy of this receipt has been emailed to <span className="font-bold text-white">{contact.email}</span>.</span>
                </li>
                <li className="flex gap-3">
                  <BellRing className="shrink-0 w-4 h-4 text-primary-fixed-dim" />
                  <span>You'll receive a shipping notification with your tracking link as soon as your kit leaves our lab.</span>
                </li>
              </ul>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={handlePrint}
                  className="w-full py-2.5 bg-white dark:bg-slate-900 text-primary dark:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-xs rounded transition-colors uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>
                <Link 
                  href="/"
                  className="w-full py-2.5 bg-primary-container hover:bg-primary-container/90 text-white dark:text-slate-950 font-bold text-xs rounded transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" /> Return to Catalog
                </Link>
              </div>
            </div>

            {/* Quality Seal */}
            <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 border-l-4 border-l-primary dark:border-l-sky-500 shadow-sm transition-colors">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="text-primary dark:text-sky-400 shrink-0 w-5 h-5 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-on-surface dark:text-white text-sm">TechFix Quality Seal</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">
                    This order is protected by our standard 12-month parts and labor warranty. Should you need any installation guidance, our certified tech support team is available 24/7.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
