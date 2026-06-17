'use client';

import React, { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar/DashboardSidebar';
import { Icon } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [dateStr, setDateStr] = useState('Cargando fecha...');

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setDateStr(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  const adminName = user?.nombre || 'Parker Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[var(--color-border)] bg-white sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[var(--color-muted)]">
            <Icon name="Menu" size={24} className="lg:hidden" />
            <span className="text-sm font-medium">{dateStr}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[var(--color-muted)] hover:bg-[var(--color-accent)] rounded-lg transition-colors relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{adminName}</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1 uppercase font-black tracking-widest">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold">
                {adminInitial}
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
