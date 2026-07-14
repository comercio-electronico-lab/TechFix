"use client";

import React from 'react';
import { LayoutDashboard, Wrench, Package, Clock } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarUserSection from './SidebarUserSection';
import SidebarNav from './SidebarNav';

const TecnicoSidebar = () => {
  const links = [
    { name: 'Dashboard', href: '/tecnico/dashboard', icon: LayoutDashboard },
    { name: 'Reparaciones', href: '/tecnico/reparaciones', icon: Wrench },
    { name: 'Inventario', href: '/tecnico/inventario', icon: Package },
    { name: 'Historial', href: '/tecnico/historial', icon: Clock },
  ];

  return (
    <aside className="fixed left-0 top-[72px] h-[calc(100%-72px)] flex flex-col p-4 border-r border-outline-variant dark:border-outline/20 bg-surface-container-low dark:bg-[#070d19] w-64 shadow-md z-40">
      <SidebarHeader
        title="TechFix Team"
        subtitle="Panel del Técnico"
        bgColor="bg-primary"
      />

      <SidebarNav links={links} className="flex-1" />

      <SidebarUserSection role="Técnico" notificationColor="bg-amber-500" />
    </aside>
  );
};

export default TecnicoSidebar;
