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
                  {user.nombre.split(' ')[0]}
                </span>
              )}
            </Link>
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
