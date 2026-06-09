import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from "@/actions/catalog";
import ProductCard from "@/components/cards/ProductCard";

import Container from '../ui/Container';

const FeaturedProducts = async () => {
  const products = await getProducts();
  
  return (
    <Container as="section" className="py-4">
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant/20 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface dark:text-white tracking-tight">Componentes Destacados</h2>
          <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Los repuestos de alto rendimiento más ordenados por laboratorios técnicos.</p>
        </div>
        <Link href="/catalogo" className="text-xs font-bold text-secondary dark:text-sky-400 flex items-center gap-1 hover:underline uppercase tracking-wider">
          Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProducts;
