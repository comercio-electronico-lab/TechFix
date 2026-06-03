import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

const EmptyCart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-12 text-center border border-outline-variant/10 shadow-sm">
      <ShoppingBag className="w-16 h-16 text-outline-variant mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-primary">Tu carrito está vacío</h3>
      <p className="text-on-surface-variant mt-2 mb-8">Parece que aún no has añadido nada a tu carrito.</p>
      <Link href="/catalogo">
        <Button variant="primary">Ir al Catálogo</Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
