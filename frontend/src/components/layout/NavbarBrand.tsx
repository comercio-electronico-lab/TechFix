"use client";

import React from 'react';
import Link from 'next/link';

interface NavbarBrandProps {
  isHidden: boolean;
  onMouseEnter: () => void;
}

const NavbarBrand: React.FC<NavbarBrandProps> = ({ isHidden, onMouseEnter }) => {
  return (
    <div className={`flex items-center transition-all duration-300 ${
      isHidden ? 'opacity-0 scale-95 pointer-events-none w-0' : 'opacity-100 scale-100'
    }`}>
      <Link 
        href="/" 
        className="font-h2 text-xl font-black tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2"
        onMouseEnter={onMouseEnter}
      >
        <svg className="w-5.5 h-5.5 text-secondary dark:text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
          <path d="M12 9a3 3 0 1 0 3 3c0-.83-.34-1.58-.88-2.12L16 8M8 16l1.88-1.88" />
        </svg>
        <span>TechFix</span>
      </Link>
    </div>
  );
};

export default NavbarBrand;
