"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import CartDropdown from '@/components/cart/CartDropdown';

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Reparaciones', href: '/reparaciones' },
    { name: 'Nosotros', href: '/nosotros' },
  ];

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return "/auth";
    if (user.rol === "Admin") return "/admin/dashboard";
    if (user.rol === "Técnico") return "/tecnico/dashboard";
    return "/cliente/dashboard";
  };

  return (
    <header className="fixed top-0 w-full h-[72px] bg-primary border-b border-outline-variant/20 shadow-sm z-50">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-full">
        <div className="flex items-center gap-stack-md">
          <Link href="/" className="font-h2 text-[32px] text-white">
            TechFix
          </Link>
          <nav className="hidden md:flex items-center gap-gutter ml-stack-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`transition-colors duration-200 font-bold ${
                    isActive 
                      ? 'text-secondary-container border-b-2 border-secondary-container pb-1' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-stack-md">
          <div className="relative hidden lg:block">
            <input 
              className="bg-primary-container border border-outline/30 text-white rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-secondary-container focus:outline-none placeholder:text-white/40"
              placeholder="Buscar componentes..."
              type="text"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-white/60" />
          </div>
          <div className="flex items-center gap-4 text-white">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:text-secondary-container transition-colors focus:outline-none p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-300" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            {!mounted && (
              <div className="w-8 h-8" />
            )}
            <CartDropdown />
            <Link 
              href={getDashboardLink()} 
              className="hover:text-secondary-container transition-colors flex items-center gap-1.5"
              title={isAuthenticated ? `Mi Perfil: ${user?.nombre}` : "Iniciar Sesión"}
            >
              <User className="w-6 h-6" />
              {isAuthenticated && user && (
                <span className="hidden sm:inline text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
