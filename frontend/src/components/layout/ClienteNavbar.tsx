"use client";

import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

const ClienteNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter bg-[#022448] text-white h-18 shadow-sm">
      <div className="flex items-center gap-stack-md">
        <span className="text-xl font-bold font-h2">TechFix Lab</span>
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider font-bold">Cliente</span>
      </div>
      
      <div className="flex items-center gap-4">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-white/10 transition-colors rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        )}
        {!mounted && <div className="w-9 h-9" />}

        <button className="p-2 hover:bg-white/10 transition-colors rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-primary"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">CLIENTE ACTIVO</p>
            <p className="text-sm font-medium">{user?.nombre}</p>
          </div>
          <UserCircle className="w-9 h-9 opacity-80" />
          <button 
            onClick={logout}
            className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all rounded-lg cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ClienteNavbar;
