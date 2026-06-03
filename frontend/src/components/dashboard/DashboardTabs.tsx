"use client";

import React from 'react';
import {
  User as UserIcon,
  Smartphone,
  Calendar,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

type TabKey = 'equipos' | 'reparaciones' | 'compras' | 'garantias' | 'perfil';

interface DashboardTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { key: 'equipos' as const, label: 'Mis Dispositivos', icon: Smartphone },
    { key: 'reparaciones' as const, label: 'Mis Reparaciones', icon: Calendar },
    { key: 'compras' as const, label: 'Mis Compras', icon: ShoppingBag },
    { key: 'garantias' as const, label: 'Garantías', icon: ShieldCheck },
    { key: 'perfil' as const, label: 'Mi Información', icon: UserIcon }
  ];

  return (
    <div className="bg-surface-container-low dark:bg-slate-900/60 p-1.5 rounded-2xl flex flex-wrap gap-1.5 border border-outline-variant/10 shadow-sm max-w-max">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const TabIcon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-xs md:text-sm cursor-pointer ${
              isActive
                ? 'bg-secondary text-white shadow-md scale-[1.02]'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
            }`}
          >
            <TabIcon className="w-4.5 h-4.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DashboardTabs;
