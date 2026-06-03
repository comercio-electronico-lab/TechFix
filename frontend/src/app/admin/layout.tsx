import React from 'react';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar/DashboardSidebar';
import { Icon } from '@/components/ui';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[var(--color-border)] bg-white sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[var(--color-muted)]">
            <Icon name="Menu" size={24} className="lg:hidden" />
            <span className="text-sm font-medium">miércoles, 3 de junio de 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[var(--color-muted)] hover:bg-[var(--color-accent)] rounded-lg transition-colors relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Parker Admin</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-1 uppercase font-black tracking-widest">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold">
                P
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
