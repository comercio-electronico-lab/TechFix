"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  bgColor?: string;
}

const SidebarHeader = ({
  icon: Icon,
  title,
  subtitle,
  bgColor = 'bg-secondary'
}: SidebarHeaderProps) => {
  return (
    <div className="mb-6 px-4 pt-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-primary dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-[10px] text-on-surface-variant opacity-70 uppercase font-bold tracking-tighter">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
