"use client";

import React from 'react';
import { Smartphone, Wrench, Settings, ShoppingBag, Shield, User } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarUserSection from './SidebarUserSection';
import SidebarNav from './SidebarNav';

const ClienteSidebar = () => {
  const links = [
    { name: 'Mis Dispositivos', href: '/cliente/dashboard?section=dispositivos', icon: Smartphone },
    { name: 'Mis Reparaciones', href: '/cliente/dashboard?section=reparaciones', icon: Wrench },
    { name: 'Mis Compras', href: '/cliente/dashboard?section=compras', icon: ShoppingBag },
    { name: 'Garantías', href: '/cliente/dashboard?section=garantias', icon: Shield },
    { name: 'Mi Información', href: '/cliente/dashboard?section=informacion', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 border-r border-outline-variant dark:border-outline/20 bg-surface-container-low dark:bg-[#070d19] w-64 shadow-md z-40">
      <SidebarHeader
        icon={Settings}
        title="TechFix Lab"
        subtitle="Portal del Cliente"
        bgColor="bg-secondary"
      />

      <SidebarNav links={links} className="flex-1" />

      <SidebarUserSection role="Cliente" notificationColor="bg-secondary" />
    </aside>
  );
};

export default ClienteSidebar;
