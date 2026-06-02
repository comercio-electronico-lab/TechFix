import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

interface CheckoutOrderSummaryProps {
  items: CheckoutItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function CheckoutOrderSummary({ items, subtotal, tax, total }: CheckoutOrderSummaryProps) {
  return (
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
                <div className="font-semibold text-xs text-on-surface dark:text-slate-200 shrink-0 font-mono">
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
              <div className="font-label-md text-label-md text-on-surface dark:text-slate-200 font-mono">$129.99</div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 border-t border-outline-variant/30 dark:border-slate-800 pt-4 mb-6 text-xs text-on-surface-variant dark:text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-on-surface dark:text-slate-200 font-mono">${subtotal > 0 ? subtotal.toFixed(2) : "129.99"}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-semibold text-on-surface dark:text-slate-200 font-mono">${subtotal > 0 ? tax.toFixed(2) : "10.40"}</span>
          </div>
        </div>

        {/* Final Total */}
        <div className="flex justify-between items-center border-t border-outline-variant/30 dark:border-slate-800 pt-4 mb-6">
          <span className="font-bold text-sm text-on-surface dark:text-white">Total</span>
          <span className="font-bold text-xl text-primary dark:text-sky-400 font-mono">${subtotal > 0 ? total.toFixed(2) : "140.39"}</span>
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
  );
}
