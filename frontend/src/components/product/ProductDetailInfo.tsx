import React from 'react';
import { Star, StarHalf, MemoryStick, Cpu, HardDrive, ShieldCheck, Truck, Settings } from 'lucide-react';
import ProductActions from '@/components/product/ProductActions';

interface ProductDetailInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    sku: string;
    rating: number;
    reviews: number;
    image: string;
    specs: {
      processor: string;
      graphics: string;
      ram: string;
      storage: string;
    };
  };
}

export default function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-surface-container-high dark:bg-slate-800 text-on-secondary-container dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-outline-variant/10 dark:border-slate-700">EN STOCK</span>
          <span className="text-on-surface-variant dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">SKU: {product.sku}</span>
        </div>
        <h1 className="text-[48px] font-bold text-primary dark:text-sky-400 mb-2 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-secondary dark:text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <StarHalf className="w-4 h-4 fill-current" />
          </div>
          <span className="text-on-surface-variant dark:text-slate-400 text-sm">({product.reviews} reseñas)</span>
        </div>
        <div className="text-[32px] font-bold text-primary dark:text-sky-400 font-mono">${product.price.toFixed(2)}</div>
      </div>

      <div className="border-y border-outline-variant/20 dark:border-slate-800 py-8 flex flex-col gap-6">
        <p className="text-on-surface-variant dark:text-slate-350 leading-relaxed font-body-md">
          {product.description}
        </p>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-secondary dark:text-sky-400 w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{product.specs.processor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="text-secondary dark:text-sky-400 w-5 h-5 rotate-12" />
            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{product.specs.graphics}</span>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="text-secondary dark:text-sky-400 w-5 h-5" />
            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{product.specs.ram}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="text-secondary dark:text-sky-400 w-5 h-5" />
            <span className="text-sm font-bold text-on-surface dark:text-slate-200">{product.specs.storage}</span>
          </div>
        </div>
      </div>

      <ProductActions product={product} />

      <div className="flex items-center gap-6 text-on-surface-variant dark:text-slate-450 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-secondary dark:text-sky-400" /> Envío Gratis</div>
        <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-secondary dark:text-sky-400" /> 2 Años de Garantía</div>
      </div>
    </div>
  );
}
