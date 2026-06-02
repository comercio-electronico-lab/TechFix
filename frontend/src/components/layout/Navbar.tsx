"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useScroll } from '@/hooks/useScroll';
import NavbarLinks from './NavbarLinks';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const isScrolled = useScroll(10);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Reparaciones', href: '/reparaciones' },
    { name: 'Nosotros', href: '/nosotros' },
  ];

  const isHome = pathname === '/';
  
  const headerClass = isHome
    ? isScrolled
      ? 'bg-primary/95 dark:bg-slate-950/90 dark:backdrop-blur-md border-b border-white/10 dark:border-slate-800/80 shadow-md'
      : 'bg-transparent border-transparent shadow-none'
    : 'bg-primary dark:bg-slate-950/90 dark:backdrop-blur-md border-b border-outline-variant/20 dark:border-slate-800/80 shadow-sm';

  return (
    <header className={`fixed top-0 w-full h-[72px] z-50 transition-all duration-300 ${headerClass}`}>
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-full">
        <div className="flex items-center gap-stack-md">
          <Link href="/" className="font-h2 text-[32px] text-white">
            TechFix
          </Link>
          <NavbarLinks links={navLinks} pathname={pathname} />
        </div>

        <div className="flex items-center gap-stack-md">
          <NavbarSearch />
          <NavbarActions totalItems={totalItems} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
