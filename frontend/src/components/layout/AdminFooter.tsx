import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="py-8 border-t border-outline-variant/10 mt-stack-lg bg-white/50 dark:bg-transparent">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Infraestructura Segura © 2026 TechFix
          </p>
        </div>
        <div className="flex gap-6 opacity-60">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
            Logs de Auditoría
          </a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
            Soporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
