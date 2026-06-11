import React from 'react';
import Link from 'next/link';
import { getProducts } from "@/actions/catalog";
import { ScrollReveal } from '../ui';

export const AppleProductShowcase = async () => {
  // Fetch products dynamically from the catalog
  const products = await getProducts();
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-background max-w-container-max mx-auto px-gutter py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProducts.map((product, index) => {
          // Rule: First 2 products are White cards, next 2 products are Black cards
          const isDark = index >= 2;
          const delays = ['0', '100', '200', '300'] as const;
          const delay = delays[index % delays.length];

          return (
            <ScrollReveal 
              key={product.id} 
              variant="fade-up" 
              delay={delay}
              className="w-full"
            >
              <div 
                className={`relative h-[480px] md:h-[540px] rounded-[24px] overflow-hidden flex flex-col justify-between items-center pt-12 pb-6 px-6 transition-all duration-500 hover:scale-[1.005] shadow-md ${
                  isDark 
                    ? 'bg-[#000000] text-white border border-slate-900' 
                    : 'bg-[#f5f5f7] text-[#1d1d1f] border border-slate-200/50 dark:bg-[#061533] dark:text-[#f8fafc] dark:border-slate-800'
                }`}
              >
                {/* Header Text Area */}
                <div className="text-center z-10 max-w-[85%] space-y-3">
                  <h3 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                    {product.name}
                  </h3>
                  <p className={`text-sm md:text-base font-normal leading-relaxed px-2 ${isDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-350'}`}>
                    {product.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center items-center gap-3 pt-2">
                    <Link href={`/catalogo/${product.id}`}>
                      <button className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-sm font-normal px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95">
                        Más información
                      </button>
                    </Link>
                    <Link href="/carrito">
                      <button className="border border-[#0071e3] text-[#0071e3] bg-transparent hover:bg-[#0071e3] hover:text-white text-sm font-normal px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95">
                        Comprar
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Centered Image Area */}
                <div className="w-full flex justify-center items-end h-[240px] md:h-[280px] mt-4 z-0 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-[100%] max-w-[85%] object-contain select-none pointer-events-none transform transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default AppleProductShowcase;
