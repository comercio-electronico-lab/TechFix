'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya dio su consentimiento
    const consent = localStorage.getItem('techfix_cookie_consent');
    if (!consent) {
      setShowBanner(true);
      // Opcional: Bloquear almacenamiento local / cookies de seguimiento externas aquí
      // (por ejemplo, desactivar Google Analytics antes del consentimiento)
      if (typeof window !== 'undefined') {
        (window as any).gtag_enable_tracking = false;
      }
    } else if (consent === 'accepted') {
      if (typeof window !== 'undefined') {
        (window as any).gtag_enable_tracking = true;
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('techfix_cookie_consent', 'accepted');
    if (typeof window !== 'undefined') {
      (window as any).gtag_enable_tracking = true;
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('techfix_cookie_consent', 'declined');
    if (typeof window !== 'undefined') {
      (window as any).gtag_enable_tracking = false;
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 transition-all duration-300 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 flex items-center justify-center shrink-0 border border-primary/20 dark:border-sky-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface dark:text-white tracking-tight">
                Control de Privacidad y Cookies
              </h3>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia de diagnóstico, personalizar la publicidad de repuestos y analizar el tráfico de forma segura bajo la Ley N° 29733 (Perú) y GDPR.
            </p>
          </div>
        </div>

        <div className="text-[10px] text-on-surface-variant dark:text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>
            Puedes leer nuestra{' '}
            <Link 
              href="/privacidad" 
              className="text-primary dark:text-sky-400 hover:underline font-semibold"
            >
              Política de Privacidad
            </Link>{' '}
            y{' '}
            <Link 
              href="/terminos" 
              className="text-primary dark:text-sky-400 hover:underline font-semibold"
            >
              Términos de Servicio
            </Link>.
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 bg-primary dark:bg-sky-600 hover:bg-primary/95 dark:hover:bg-sky-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            Aceptar Todo
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2 bg-transparent border border-outline-variant/65 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
