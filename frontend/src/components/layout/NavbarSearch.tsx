"use client";

import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';

interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NavbarSearch = forwardRef<HTMLInputElement, NavbarSearchProps>(({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onSubmit
}, ref) => {
  return (
    <div className={`absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-gutter flex items-center gap-4 transition-all duration-300 ${
      isOpen 
        ? 'opacity-100 translate-y-0 pointer-events-auto' 
        : 'opacity-0 -translate-y-2 pointer-events-none'
    }`}>
      <form onSubmit={onSubmit} className="flex-1 flex items-center bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-full px-4 py-1.5">
        <Search className="w-4 h-4 text-slate-450 dark:text-slate-500 shrink-0 mr-2" />
        <input 
          ref={ref}
          type="text"
          placeholder="Buscar repuestos, herramientas, tutoriales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-slate-950 dark:text-slate-100 focus:outline-none text-xs font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-555"
        />
      </form>
      <button 
        type="button"
        onClick={onClose}
        className="text-[10px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  );
});

NavbarSearch.displayName = 'NavbarSearch';

export default NavbarSearch;
