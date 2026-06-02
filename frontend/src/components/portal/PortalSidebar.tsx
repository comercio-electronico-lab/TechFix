'use client';

import React from 'react';
import Link from 'next/link';
import { Laptop, ShoppingBag, Wrench, LogOut } from 'lucide-react';
import { PortalTab } from '@/hooks/useCustomerPortal';

interface PortalSidebarProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
}

const NAV_ITEMS: { tab: PortalTab; icon: React.ElementType; label: string }[] = [
  { tab: 'Devices', icon: Laptop, label: 'Mis Equipos' },
  { tab: 'Purchases', icon: ShoppingBag, label: 'Mis Compras' },
  { tab: 'Repairs', icon: Wrench, label: 'Mis Reparaciones' },
];

export default function PortalSidebar({ activeTab, onTabChange }: PortalSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface dark:bg-slate-900 border-r border-outline-variant/40 dark:border-slate-800 p-4 shrink-0 transition-colors">
      
      {/* Perfil */}
      <div className="flex items-center gap-4 mb-8 px-2 mt-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container dark:bg-slate-800 shrink-0 border border-outline-variant/35 dark:border-slate-700">
          <img
            alt="Customer Profile Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0UEDyYFZRhkV1tfOUGdJZUt84g5tOj3_KlrvAt2ne8Pa0gtGXvUiT4K0lIwJ1VvBURRAfuNo2Mo_yh-oTK2sjFd0G8BaLf6MFC6Dnyixy-4QeMX9_QXZLmlx-GrKCc4MpfPEN-wlUPJtCxuRo6hNDQghcXF83upDo_yGMasAOACvCd0Nk42yQJy2AQPiwuGdSm7l17M_R2r4-Zuia3zRPwon5U5KCG4FNQofvQIS90pwWJ4Pcj7fSzlXNs39uF9_6M9HWXNJZ8xZQ"
          />
        </div>
        <div>
          <h4 className="font-bold text-sm text-primary dark:text-sky-400 leading-snug">Portal del Cliente</h4>
          <p className="text-[10px] text-on-surface-variant dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Carlos Pérez</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1.5 flex-1 font-semibold text-xs uppercase tracking-wider">
        {NAV_ITEMS.map(({ tab, icon: Icon, label }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer active:opacity-80 ${
                isActive
                  ? 'bg-secondary-container dark:bg-sky-950 text-on-secondary-container dark:text-sky-300 font-bold border-l-4 border-primary dark:border-sky-500 shadow-sm'
                  : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-primary dark:text-sky-400" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="mt-auto pt-4 border-t border-outline-variant/30 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-error dark:hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}
