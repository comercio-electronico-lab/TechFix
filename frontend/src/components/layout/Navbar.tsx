"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Reparaciones', href: '/reparaciones' },
    { name: 'Nosotros', href: '/nosotros' },
  ];

  return (
    <header className="fixed top-0 w-full h-18 bg-primary border-b border-outline-variant/20 shadow-sm z-50">
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
...

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
            <ThemeToggle />
            <Link href="/carrito" className="hover:text-secondary-container transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/portal" className="hover:text-secondary-container transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
