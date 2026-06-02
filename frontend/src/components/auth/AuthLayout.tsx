"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
      {/* Background glowing blur effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-4">
        {/* Navigation buttons */}
        <div className="flex justify-between items-center px-1">
          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary dark:hover:text-sky-400 transition-colors group cursor-pointer bg-transparent border-none outline-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Volver
          </button>
          
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary dark:hover:text-sky-400 transition-colors group"
          >
            <Home className="w-3.5 h-3.5" />
            Inicio
          </Link>
        </div>

        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-xl transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
