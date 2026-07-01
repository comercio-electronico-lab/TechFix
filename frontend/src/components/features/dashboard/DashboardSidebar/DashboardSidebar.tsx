'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Inventario', href: '/admin/inventario', icon: 'Package' },
  { label: 'Citas', href: '/admin/citas', icon: 'Calendar' },
  { label: 'Equipos', href: '/admin/dispositivos', icon: 'Smartphone' },
  { label: 'Proveedores', href: '/admin/proveedores', icon: 'Truck' },
  { label: 'Usuarios', href: '/admin/usuarios', icon: 'Users' },
  { label: 'Reportes', href: '/admin/reportes', icon: 'ChartBar' },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const renderContent = (onCloseLink?: () => void) => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-[var(--color-primary)]">
          <Icon name="Zap" size={24} />
          LABORATORIO L1
        </div>
        {onCloseLink && (
          <button onClick={onCloseLink} className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseLink}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20' 
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]'
              }`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <button 
          onClick={() => {
            if (onCloseLink) onCloseLink();
            handleLogout();
          }}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <Icon name="LogOut" size={20} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-white hidden lg:flex flex-col h-screen sticky top-0">
        {renderContent()}
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-64 bg-white flex flex-col h-full shadow-2xl">
            {renderContent(onClose)}
          </aside>
        </div>
      )}
    </>
  );
};
