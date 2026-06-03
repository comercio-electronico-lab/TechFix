"use client";

import React from 'react';
import { LayoutDashboard, Wrench, Settings } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarUserSection from './SidebarUserSection';
import SidebarNav from './SidebarNav';

const TecnicoSidebar = () => {
  const links = [
    { name: 'Dashboard Técnico', href: '/tecnico/dashboard', icon: LayoutDashboard },
    { name: 'Mis Reparaciones', href: '/tecnico/dashboard', icon: Wrench },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 border-r border-outline-variant dark:border-outline/20 bg-surface-container-low dark:bg-[#070d19] w-64 shadow-md z-40">
      <SidebarHeader
        icon={Wrench}
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
