"use client";

import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Phone, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t border-outline-variant/20 mt-auto">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
        <div className="space-y-6">
          <h3 className="text-2xl font-h2 font-bold text-primary">TechFix</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Expertos en hardware de alto nivel y servicios de reparación profesional con precisión de ingeniería.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-all text-primary">
              <Globe className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-all text-primary">
              <Mail className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-all text-primary">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-bold text-primary mb-6 uppercase tracking-[0.15em]">Navegación</h4>
          <ul className="space-y-4 text-on-surface-variant">
            <li><Link href="/catalogo" className="hover:text-secondary transition-colors">Catálogo de Hardware</Link></li>
            <li><Link href="/reparaciones" className="hover:text-secondary transition-colors">Servicios Técnicos</Link></li>
            <li><Link href="/nosotros" className="hover:text-secondary transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-secondary transition-colors">Panel Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-bold text-primary mb-6 uppercase tracking-[0.15em]">Soporte</h4>
          <ul className="space-y-4 text-on-surface-variant">
            <li><a href="#" className="hover:text-secondary transition-colors">Estado de Reparación</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Garantía Extendida</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Términos de Servicio</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Privacidad</a></li>
          </ul>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl border border-secondary-container/10">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-secondary w-6 h-6" />
            <h4 className="text-[12px] font-bold text-primary uppercase tracking-widest">Calidad Garantizada</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Todos nuestros componentes cuentan con certificación de autenticidad y 12 meses de garantía técnica.
          </p>
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <p className="text-[10px] text-on-surface-variant font-medium">© 2026 TechFix Engineered Quality.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
