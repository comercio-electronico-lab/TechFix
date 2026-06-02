import React from 'react';
import { Search } from 'lucide-react';

export const NavbarSearch: React.FC = () => {
  return (
    <div className="relative hidden lg:block">
      <input 
        className="bg-primary-container border border-outline/30 text-white rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-secondary-container focus:outline-none placeholder:text-white/40"
        placeholder="Buscar componentes..."
        type="text"
      />
      <Search className="absolute right-3 top-2.5 w-5 h-5 text-white/60" />
    </div>
  );
};

export default NavbarSearch;
