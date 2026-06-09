"use client";

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
}

interface NavbarMobileMenuProps {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmitSearch: (e: React.FormEvent) => void;
  navLinks: NavLink[];
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  onSubmitSearch,
  navLinks
}) => {
  return (
    <div className={`fixed inset-x-0 top-14 bg-white/95 dark:bg-[#020816]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-900/80 z-40 transition-all duration-500 ease-in-out md:hidden overflow-y-auto ${
      isOpen 
        ? 'opacity-100 translate-y-0 pointer-events-auto h-[calc(100vh-56px)]' 
        : 'opacity-0 -translate-y-4 pointer-events-none h-0'
    }`}>
      <div className="flex flex-col px-gutter py-8 space-y-6">
        <form onSubmit={onSubmitSearch} className="flex items-center bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-450 dark:text-slate-500 mr-2" />
          <input 
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-950 dark:text-slate-100 focus:outline-none text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-550"
          />
        </form>

        <div className="flex flex-col gap-5 border-t border-slate-150 dark:border-slate-900 pt-6">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={link.href}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={`text-lg font-black tracking-tight uppercase hover:text-secondary dark:hover:text-sky-400 transition-all duration-300 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
