import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Phone, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#020816] py-16 border-t border-slate-200/60 dark:border-slate-900/60 mt-auto transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <svg className="w-6.5 h-6.5 text-secondary dark:text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="3" />
              <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
              <path d="M12 9a3 3 0 1 0 3 3c0-.83-.34-1.58-.88-2.12L16 8M8 16l1.88-1.88" />
            </svg>
            <h3 className="text-2xl font-h2 font-black tracking-tight">TechFix</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
            Expertos en hardware de alto nivel y servicios de reparación profesional con precisión de ingeniería.
          </p>
          <div className="flex gap-3">
            <button className="w-9 h-9 rounded-full border border-slate-250 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-350 cursor-pointer">
              <Globe className="w-4.5 h-4.5" />
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-250 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-350 cursor-pointer">
              <Mail className="w-4.5 h-4.5" />
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-250 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-350 cursor-pointer">
              <Phone className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Navegación</h4>
          <ul className="space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-slate-400">
            <li><Link href="/catalogo" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Catálogo de Hardware</Link></li>
            <li><Link href="/reparaciones" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Servicios Técnicos</Link></li>
            <li><Link href="/nosotros" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Panel Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Soporte</h4>
          <ul className="space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-slate-400">
            <li><a href="#" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Estado de Reparación</a></li>
            <li><a href="#" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Garantía Extendida</a></li>
            <li><a href="#" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Términos de Servicio</a></li>
            <li><a href="#" className="hover:text-secondary dark:hover:text-sky-400 transition-colors">Privacidad</a></li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-secondary dark:text-sky-400 w-5 h-5" />
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Calidad Garantizada</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Todos nuestros componentes cuentan con certificación de autenticidad y 12 meses de garantía técnica.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-150 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">© 2026 TechFix Engineered Quality.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
