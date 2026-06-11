import React from 'react';
import { getProducts } from "@/actions/catalog";
import { ScrollReveal } from '../ui';
import Container from '../ui/Container';
import ShowcaseButtons from './ShowcaseButtons';

export const AppleProductShowcase = async () => {
  // Fetch products dynamically from the catalog
  const products = await getProducts();
  const displayProducts = products.slice(0, 4);

  return (
    <Container as="section" className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <ShowcaseButtons product={product} />
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
    </Container>
  );
};

export default AppleProductShowcase;
