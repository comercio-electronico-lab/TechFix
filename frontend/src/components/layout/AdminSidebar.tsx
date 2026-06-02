"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  Ticket,
  ChevronRight,
  Truck
} from 'lucide-react';

const AdminSidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Órdenes', href: '/admin/ordenes', icon: ShoppingCart },
    { name: 'Inventario', href: '/admin/inventario', icon: Package },
    { name: 'Proveedores', href: '/admin/proveedores', icon: Truck },
    { name: 'Citas', href: '/admin/citas', icon: Calendar },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart3 },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 pt-22 border-r border-outline-variant bg-surface-container-low w-64 shadow-md z-40">
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-primary leading-tight">TechFix Pro</h2>
            <p className="text-[10px] text-on-surface-variant opacity-70 uppercase font-bold tracking-tighter">Enterprise Repair Mgmt</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-secondary text-white font-bold shadow-lg shadow-secondary/20 scale-[1.02]' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant/70'}`} />
              <span className="text-sm">{link.name}</span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/30">
        <button className="w-full bg-primary text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-sm">
          <Ticket className="w-4 h-4" />
          Support Ticket
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
