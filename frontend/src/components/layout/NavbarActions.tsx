import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavbarActionsProps {
  totalItems: number;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({ totalItems }) => {
  return (
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
  );
};

export default NavbarActions;
