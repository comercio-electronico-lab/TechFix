"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  links: NavLink[];
  className?: string;
}

const SidebarNavContent = ({ links, className = '' }: SidebarNavProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className={`flex-1 space-y-1 ${className}`}>
      {links.map((link) => {
        // Build current URL with query params
        const currentUrl = searchParams.toString()
          ? `${pathname}?${searchParams.toString()}`
          : pathname;

        // Check if link is active
        const isActive = link.href === currentUrl;
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? 'bg-secondary text-white font-bold shadow-lg shadow-secondary/20 scale-[1.02]'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'}
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant/70'}`} />
            <span className="text-sm">{link.name}</span>
            {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
          </Link>
        );
      })}
    </nav>
  );
};

const SidebarNav = (props: SidebarNavProps) => {
  return (
    <Suspense fallback={<nav className={`flex-1 space-y-1 ${props.className || ''}`} />}>
      <SidebarNavContent {...props} />
    </Suspense>
  );
};

export default SidebarNav;
