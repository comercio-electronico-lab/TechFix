"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import CartDropdown from '@/components/cart/CartDropdown';
import MegaMenuCatalog from './MegaMenuCatalog';
import MegaMenuRepairs from './MegaMenuRepairs';
import MegaMenuNosotros from './MegaMenuNosotros';
import NavbarBrand from './NavbarBrand';
import NavbarSearch from './NavbarSearch';
import NavbarMobileMenu from './NavbarMobileMenu';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'catalogo' | 'reparaciones' | 'nosotros' | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar menús al cambiar de página
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Enfocar buscador al abrirlo
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: 'Catálogo', href: '/catalogo', id: 'catalogo' },
    { name: 'Reparaciones', href: '/reparaciones', id: 'reparaciones' },
    { name: 'Nosotros', href: '/nosotros', id: 'nosotros' },
  ];

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return "/auth";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "tecnico") return "/tecnico/dashboard";
    return "/cliente/dashboard";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMouseEnterLink = (linkId: string | undefined) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    if (linkId === 'catalogo' || linkId === 'reparaciones' || linkId === 'nosotros') {
      setActiveDropdown(linkId as 'catalogo' | 'reparaciones' | 'nosotros');
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeaveLink = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const handleMouseEnterDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full h-14 border-b z-50 transition-all duration-300 ${
          activeDropdown 
            ? 'bg-surface dark:bg-[#020816] border-slate-200/60 dark:border-slate-900/80 shadow-md' 
            : 'bg-white/70 dark:bg-[#020816]/75 backdrop-blur-md border-slate-200/50 dark:border-slate-900/60'
        }`}
        onMouseLeave={handleMouseLeaveLink}
      >
        <div className="max-w-container-max mx-auto px-gutter h-full flex items-center justify-between relative">
          
          {/* LOGO & BRAND */}
          <NavbarBrand 
            isHidden={isSearchOpen || isMenuOpen} 
            onMouseEnter={() => handleMouseEnterLink(undefined)} 
          />

          {/* ENLACES DE NAVEGACIÓN DESKTOP */}
          <nav className={`hidden md:flex items-center gap-gutter transition-all duration-300 ${
            isSearchOpen ? 'opacity-0 scale-95 pointer-events-none w-0' : 'opacity-100 scale-100'
          }`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => handleMouseEnterLink(link.id)}
                  className={`transition-all duration-200 font-semibold text-[11px] uppercase tracking-widest py-4 ${
                    isActive 
                      ? 'text-secondary dark:text-sky-400' 
                      : 'text-slate-650 dark:text-slate-355 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          {/* BUSCADOR DE ESCRITORIO EXPANDIBLE */}
          <NavbarSearch 
            ref={searchInputRef}
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSubmit={handleSearchSubmit} 
          />

          {/* MENÚ DE ACCIONES */}
          <div className="flex items-center gap-3.5 text-slate-700 dark:text-slate-200">
            
            {/* Botón Lupa */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`hidden md:flex hover:text-slate-955 dark:hover:text-sky-400 transition-all duration-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer ${
                isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
              }`}
              onMouseEnter={() => handleMouseEnterLink(undefined)}
              aria-label="Buscar"
            >
              <Search className="w-4.5 h-4.5 text-slate-650 dark:text-slate-355" />
            </button>

            {/* Alternador de Tema */}
            <div className={`${isSearchOpen ? 'hidden md:block opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-300`}>
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hover:text-slate-955 dark:hover:text-sky-400 transition-colors focus:outline-none p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => handleMouseEnterLink(undefined)}
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4.5 h-4.5 text-yellow-400" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-slate-600" />
                  )}
                </button>
              )}
            </div>

            {/* Carrito */}
            <div className={`${isSearchOpen ? 'hidden md:block opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-300`} onMouseEnter={() => handleMouseEnterLink(undefined)}>
              <CartDropdown />
            </div>

            {/* Enlace Perfil */}
            <div className={`${isSearchOpen ? 'hidden md:block opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-300`}>
              <Link 
                href={getDashboardLink()} 
                className="hover:text-slate-955 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                onMouseEnter={() => handleMouseEnterLink(undefined)}
                title={isAuthenticated ? `Mi Perfil: ${user?.nombre}` : "Iniciar Sesión"}
              >
                <User className="w-4.5 h-4.5 text-slate-650 dark:text-slate-300" />
                {isAuthenticated && user && (
                  <span className="hidden lg:inline text-[9px] font-black bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user.nombre.split(' ')[0]}
                  </span>
                )}
              </Link>
            </div>

            {/* Menú Móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer relative z-50"
              aria-label="Menú principal"
            >
              <div className="w-4.5 flex flex-col gap-1.5">
                <span className={`h-0.5 w-full bg-slate-800 dark:bg-white transition-all duration-350 rounded-full transform origin-center ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`} />
                <span className={`h-0.5 w-full bg-slate-800 dark:bg-white transition-all duration-350 rounded-full transform origin-center ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* MEGA MENUS MODULARES */}
        <MegaMenuCatalog 
          isOpen={activeDropdown === 'catalogo'} 
          onMouseEnter={handleMouseEnterDropdown} 
          onMouseLeave={handleMouseLeaveLink} 
        />
        <MegaMenuRepairs 
          isOpen={activeDropdown === 'reparaciones'} 
          onMouseEnter={handleMouseEnterDropdown} 
          onMouseLeave={handleMouseLeaveLink} 
        />
        <MegaMenuNosotros 
          isOpen={activeDropdown === 'nosotros'} 
          onMouseEnter={handleMouseEnterDropdown} 
          onMouseLeave={handleMouseLeaveLink} 
        />

        {/* PANEL DE NAVEGACIÓN MÓVIL DESPLEGABLE */}
        <NavbarMobileMenu 
          isOpen={isMenuOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onSubmitSearch={handleSearchSubmit} 
          navLinks={navLinks} 
        />
      </header>

      {/* CAPA DE DESENFOQUE DETRÁS DEL NAVBAR */}
      <div 
        className={`fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md z-30 transition-all duration-300 ${
          activeDropdown 
            ? 'opacity-100 pointer-events-auto shadow-2xl' 
            : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={handleMouseLeaveLink}
      />
    </>
  );
};

export default Navbar;
