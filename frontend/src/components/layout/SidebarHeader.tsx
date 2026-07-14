"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarHeaderProps {
  icon?: LucideIcon;
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
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-white shrink-0`}>
          {Icon ? (
            <Icon className="w-5 h-5" />
          ) : (
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="3" />
              <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
              <path d="M12 9a3 3 0 1 0 3 3c0-.83-.34-1.58-.88-2.12L16 8M8 16l1.88-1.88" />
            </svg>
          )}
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
