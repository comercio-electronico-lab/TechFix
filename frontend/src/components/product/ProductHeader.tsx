import { Star, StarHalf } from 'lucide-react';

interface ProductHeaderProps {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  sku: string;
}

export default function ProductHeader({ name, price, rating, reviews, sku }: ProductHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Badges superiores */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
          En Stock
        </span>
        <span className="text-on-surface-variant/70 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest font-mono">
          SKU: {sku}
        </span>
      </div>

      {/* Nombre del Producto */}
      <h1 className="text-3xl md:text-4xl font-black text-on-surface dark:text-white leading-tight tracking-tight">
        {name}
      </h1>

      {/* Reseñas y Estrellas */}
      <div className="flex items-center gap-3">
        <div className="flex text-amber-500">
          <Star className="w-4 h-4 fill-current stroke-[1.5]" />
          <Star className="w-4 h-4 fill-current stroke-[1.5]" />
          <Star className="w-4 h-4 fill-current stroke-[1.5]" />
          <Star className="w-4 h-4 fill-current stroke-[1.5]" />
          <StarHalf className="w-4 h-4 fill-current stroke-[1.5]" />
        </div>
        <span className="text-on-surface-variant/80 dark:text-slate-400 text-xs font-bold font-mono">
          ({reviews} valoraciones de clientes)
        </span>
      </div>

      {/* Precio */}
      <div className="flex items-baseline gap-2 pt-2 border-t border-outline-variant/20 dark:border-outline/10">
        <span className="text-4xl font-black text-primary dark:text-[#00bcff] font-mono leading-none">
          ${price.toFixed(2)}
        </span>
        <span className="text-xs text-on-surface-variant/60 dark:text-slate-500 font-bold uppercase font-mono">
          USD
        </span>
      </div>
    </div>
  );
}

