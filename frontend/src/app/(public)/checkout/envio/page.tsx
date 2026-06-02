"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutEnvio() {
  const { items, subtotal } = useCart();
  const router = useRouter();

  // Estados de datos de contacto y envío
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    saveInfo: false
  });

  const tax = subtotal * 0.08;
  const shipping = 0.00; // Envío gratis
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    // Guardar información en localStorage para simular persistencia
    localStorage.setItem('checkout_contact', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    }));
    localStorage.setItem('checkout_shipping', JSON.stringify({
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode
    }));
    // Navegar al paso de pago
    router.push('/checkout/pago');
  };

  return (
    <div className="bg-background dark:bg-slate-950 min-h-screen flex flex-col font-body-md antialiased transition-colors duration-300">
      
      {/* TopNavBar (Transactional mode - simplified) */}
      <header className="bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant dark:border-slate-800 shadow-sm h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop left-0 right-0">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center px-4 md:px-8">
          <div className="font-headline-md text-2xl font-bold text-primary dark:text-sky-400 select-none tracking-tight">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              TechFix
            </Link>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
            <Lock className="w-4 h-4 text-primary dark:text-sky-400" />
            <span className="font-semibold text-xs uppercase tracking-wider">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Checkout Steps */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
              Checkout
            </h1>
            
            <form onSubmit={handleContinue} className="space-y-6">
              
              {/* Step 1: Contact Information */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-3">
                    <span className="bg-primary dark:bg-sky-500 text-on-primary dark:text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">1</span>
                    Contact Information
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="firstName">First Name</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="firstName" 
                        placeholder="Jane" 
                        required 
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="lastName">Last Name</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="lastName" 
                        placeholder="Doe" 
                        required 
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="email">Email Address</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="email" 
                        placeholder="jane.doe@example.com" 
                        required 
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="phone">Phone Number</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="phone" 
                        placeholder="+1 (555) 000-0000" 
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Details */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-3">
                    <span className="bg-primary dark:bg-sky-500 text-on-primary dark:text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">2</span>
                    Shipping Details
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="address">Address</label>
                    <input 
                      className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                      id="address" 
                      placeholder="123 Science Lab Way, Suite 101" 
                      required 
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="city">City</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="city" 
                        placeholder="Silicon Valley" 
                        required 
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="state">State / Province</label>
                      <select 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 cursor-pointer font-medium"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" className="dark:bg-slate-900">Select...</option>
                        <option value="CA" className="dark:bg-slate-900">California</option>
                        <option value="NY" className="dark:bg-slate-900">New York</option>
                        <option value="TX" className="dark:bg-slate-900">Texas</option>
                        <option value="FL" className="dark:bg-slate-900">Florida</option>
                        <option value="Lima" className="dark:bg-slate-900">Lima</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400" htmlFor="zipCode">Zip Code</label>
                      <input 
                        className="w-full bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-800 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-200"
                        id="zipCode" 
                        placeholder="94025" 
                        required 
                        type="text"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-outline-variant dark:border-slate-700 text-primary dark:text-sky-500 bg-surface dark:bg-slate-950 focus:ring-primary dark:focus:ring-sky-500 cursor-pointer transition-colors" 
                    />
                    <label htmlFor="saveInfo" className="text-xs text-on-surface-variant dark:text-slate-400 cursor-pointer select-none">
                      Save this information for faster checkout next time
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method (Locked) */}
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 opacity-50 cursor-not-allowed transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-xl font-bold text-on-surface dark:text-white flex items-center gap-3 select-none">
                    <span className="bg-surface-variant dark:bg-slate-800 text-on-surface-variant/60 dark:text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">3</span>
                    Payment Method
                  </h2>
                </div>
              </div>

              {/* Button Row */}
              <div className="flex justify-between items-center pt-4">
                <Link href="/carrito" className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-sky-400 hover:text-secondary dark:hover:text-sky-300 transition-colors uppercase tracking-wider group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Cart
                </Link>
                
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-primary dark:bg-sky-600 hover:bg-primary-container dark:hover:bg-sky-500 text-on-primary dark:text-white rounded text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow dark:hover:shadow-sky-500/20"
                >
                  Continue to Shipping
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
              <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-6 border-b border-outline-variant/30 dark:border-slate-800 pb-4">
                Order Summary
              </h3>
              
              {/* Order Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 pb-2 border-b border-outline-variant/10 dark:border-slate-800/30 last:border-b-0">
                      <div className="w-14 h-14 bg-surface dark:bg-slate-950 rounded border border-outline-variant/30 dark:border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95" 
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-xs text-on-surface dark:text-slate-200 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant/75 dark:text-slate-400 mt-0.5">
                          Cant: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold text-xs text-on-surface dark:text-slate-200 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-surface-container-low dark:bg-slate-950 rounded border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img 
                        alt="Laptop repair parts" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGa-hV7dxmLQqQyGJPQrVSmvy0MLGhAvSQeoYMZ8MbiFz9uibnsjpwPreLHT2etDvJGOl4q8KKG4c4A5puiRO3aceZ5d_1XHjqVduF6VIqSTJfZeDPWoRET7cxyc_Zf8IwLwd-_sLeyqpyAy76oWq9QhY4_DzN88a32XCzRXr9ltQ49CExh42RRJIfIeNWeUFiD9gDi1MCEJlJWEuXn5eIMnHmzh-Y7USQdzH1NjOsc77c98ulv2VOMbXXsUD4wRSEsvIdz2MubFfX"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-label-md text-label-md text-on-surface dark:text-slate-200">Screen Replacement Kit</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-slate-400">Model X Pro</p>
                    </div>
                    <div className="font-label-md text-label-md text-on-surface dark:text-slate-200">$129.99</div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-outline-variant/30 dark:border-slate-800 pt-4 mb-6 text-xs text-on-surface-variant dark:text-slate-450">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${subtotal > 0 ? subtotal.toFixed(2) : "129.99"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${subtotal > 0 ? tax.toFixed(2) : "10.40"}</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center border-t border-outline-variant/30 dark:border-slate-800 pt-4 mb-6">
                <span className="font-bold text-sm text-on-surface dark:text-white">Total</span>
                <span className="font-bold text-xl text-primary dark:text-sky-400">${subtotal > 0 ? total.toFixed(2) : "140.39"}</span>
              </div>

              {/* Transactional Security Badges */}
              <div className="pt-2 border-t border-outline-variant/20 dark:border-slate-800/40 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-on-surface-variant/80 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> 256-bit SSL Encrypted
                </div>
                
                <div className="bg-surface-container-low dark:bg-slate-950/60 p-4 rounded border border-primary/10 dark:border-slate-800 flex flex-col gap-1.5 transition-colors">
                  <div className="flex items-center gap-1.5 text-primary dark:text-sky-400">
                    <span className="font-bold text-[9px] uppercase tracking-widest">ASSISTANCE INCLUDED</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-normal">
                    Call our expert technicians at <span className="font-bold text-primary dark:text-sky-400">1-800-TECH-FIX</span> for any order support or technical questions.
                  </p>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
