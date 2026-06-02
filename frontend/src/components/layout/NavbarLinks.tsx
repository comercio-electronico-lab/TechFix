import React from 'react';
import Link from 'next/link';

interface NavLink {
  name: string;
  href: string;
}

interface NavbarLinksProps {
  links: NavLink[];
  pathname: string;
}

export const NavbarLinks: React.FC<NavbarLinksProps> = ({ links, pathname }) => {
  return (
    <nav className="hidden md:flex items-center gap-gutter ml-stack-lg">
      {links.map((link) => {
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
  );
};

export default NavbarLinks;
