"use client";

import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Sun, Moon, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

interface SidebarUserSectionProps {
  role: string;
  notificationColor?: string;
}

const SidebarUserSection = ({
  role,
  notificationColor = 'bg-secondary'
}: SidebarUserSectionProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="px-4 py-3 bg-surface-container-high dark:bg-white/5 rounded-xl border border-outline-variant/20 space-y-3">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <UserCircle className="w-10 h-10 text-on-surface-variant/70 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{role}</p>
          <p className="text-sm font-medium truncate">{user?.nombre}</p>
        </div>
      </div>

      {/* Settings & Notifications */}
      <div className="flex gap-2 items-center justify-center border-t border-outline-variant/20 pt-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex-1 p-2 hover:bg-white/10 dark:hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center"
          title="Tema"
        >
          {mounted ? (
            theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        <button
          className="flex-1 p-2 hover:bg-white/10 dark:hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center relative"
          title="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          <span className={`absolute top-1 right-1 w-2 h-2 ${notificationColor} rounded-full border border-primary`}></span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 text-white transition-all rounded-lg px-4 py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default SidebarUserSection;
