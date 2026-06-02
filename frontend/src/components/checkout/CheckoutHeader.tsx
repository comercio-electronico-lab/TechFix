import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';

interface CheckoutHeaderProps {
  status?: 'checkout' | 'confirmed';
}

export default function CheckoutHeader({ status = 'checkout' }: CheckoutHeaderProps) {
  return (
    <header className="bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant dark:border-slate-800 shadow-sm h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop left-0 right-0 transition-colors">
      <div className="max-w-container-max mx-auto w-full flex justify-between items-center px-4 md:px-8">
        <div className="font-headline-md text-2xl font-bold text-primary dark:text-sky-400 select-none tracking-tight">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            TechFix
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'checkout' ? (
            <>
              <Lock className="w-4 h-4 text-primary dark:text-sky-400 animate-pulse" />
              <span className="font-semibold text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                Secure Checkout
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Order Confirmed
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
