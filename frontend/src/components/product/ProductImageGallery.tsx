'use client';

import React, { useState } from 'react';

interface ProductImageGalleryProps {
  productName: string;
  productImage: string;
}

export default function ProductImageGallery({ productName, productImage }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-slate-950/30 border border-outline-variant/10 dark:border-slate-800 aspect-4/3 flex items-center justify-center p-8 transition-colors">
        <img className="w-full h-full object-contain" src={productImage} alt={productName} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`bg-white dark:bg-slate-900 rounded-lg border ${
              i === activeIndex 
                ? 'border-secondary dark:border-sky-500 ring-1 ring-secondary dark:ring-sky-500' 
                : 'border-outline-variant/20 dark:border-slate-800'
            } p-2 aspect-square cursor-pointer hover:border-secondary dark:hover:border-sky-500 transition-colors`}
          >
            <img className="w-full h-full object-cover opacity-50 dark:opacity-40" src={productImage} alt={`Vista ${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
