"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Settings, 
  ChevronRight
} from 'lucide-react';

const TecnicoSidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard Técnico', href: '/tecnico/dashboard', icon: LayoutDashboard },
    { name: 'Mis Reparaciones', href: '/tecnico/dashboard', icon: Wrench },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 pt-22 border-r border-outline-variant dark:border-outline/20 bg-surface-container-low dark:bg-[#070d19] w-64 shadow-md z-40">
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-primary dark:text-white leading-tight">TechFix Team</h2>
            <p className="text-[10px] text-on-surface-variant opacity-70 uppercase font-bold tracking-tighter">Panel del Técnico</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={idx}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-secondary text-white font-bold shadow-lg shadow-secondary/20 scale-[1.02]' 
                  : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant/70'}`} />
              <span className="text-sm">{link.name}</span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/30 dark:border-outline/10 text-center text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">
        Área Técnica TechFix
      </div>
    </aside>
  );
};

export default TecnicoSidebar;
