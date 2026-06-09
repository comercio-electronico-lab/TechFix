"use client";

import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Calendar,
  BarChart,
  Users,
  Settings,
  Ticket,
} from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarUserSection from './SidebarUserSection';
import SidebarNav from './SidebarNav';

const AdminSidebar = () => {
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Órdenes', href: '/admin/ordenes', icon: ShoppingCart },
    { name: 'Inventario', href: '/admin/inventario', icon: Package },
    { name: 'Citas', href: '/admin/citas', icon: Calendar },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 border-r border-outline-variant bg-surface-container-low w-64 shadow-md z-40">
      <SidebarHeader
        title="TechFix Pro"
        subtitle="Enterprise Repair Mgmt"
        bgColor="bg-primary"
      />

      <SidebarNav links={links} className="flex-1" />

      {/* Support Ticket Button */}
      <div className="pt-4 border-t border-outline-variant/30">
        <button className="w-full bg-primary text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-sm cursor-pointer">
          <Ticket className="w-4 h-4" />
          Support Ticket
        </button>
      </div>

      <SidebarUserSection role="Administrador" notificationColor="bg-error" />
    </aside>
  );
};

export default AdminSidebar;
