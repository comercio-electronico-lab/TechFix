import React from 'react';
import Link from 'next/link';

// Contenedor principal de la rejilla (grid)
export const MegaMenuLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
    {children}
  </div>
);

// Título de la sección en formato pequeño y en mayúsculas
export const MegaMenuSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
    {children}
  </span>
);

// Enlace grande y destacado estilo Premium
export const MegaMenuLargeLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-secondary dark:hover:text-sky-400 transition-colors block py-0.5"
  >
    {children}
  </Link>
);

// Enlace normal para las columnas secundarias
export const MegaMenuRegularLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-950 dark:hover:text-white transition-colors block"
  >
    {children}
  </Link>
);

// Tarjeta lateral de Call-to-Action (CTA)
interface MegaMenuCtaCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export const MegaMenuCtaCard: React.FC<MegaMenuCtaCardProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
}) => (
  <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between">
    <div>
      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
        {title}
      </h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
    <Link 
      href={buttonHref} 
      className="text-[10px] font-black text-secondary dark:text-sky-400 uppercase tracking-widest hover:underline mt-4 block"
    >
      {buttonText}
    </Link>
  </div>
);
