"use client";

import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

const AdminNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter bg-primary text-white h-[72px] shadow-sm">
      <div className="flex items-center gap-3">
        <svg className="w-5.5 h-5.5 text-secondary-container shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
          <path d="M12 9a3 3 0 1 0 3 3c0-.83-.34-1.58-.88-2.12L16 8M8 16l1.88-1.88" />
        </svg>
        <span className="text-xl font-bold tracking-tight">TechFix Admin</span>
        <div className="hidden md:flex ml-stack-lg items-center bg-white/10 rounded-lg px-4 py-2 w-96 border border-white/20">
          <Search className="w-5 h-5 mr-2 opacity-70" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-white/50 text-white outline-none" 
            placeholder="Buscar reportes, usuarios, órdenes..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 transition-colors rounded-full relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-primary"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">ADMINISTRADOR</p>
            <p className="text-sm font-medium">Alexander Pierce</p>
          </div>
          <UserCircle className="w-9 h-9 opacity-80" />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
