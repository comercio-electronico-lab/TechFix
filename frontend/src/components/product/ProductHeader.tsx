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
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-surface-container-high text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">EN STOCK</span>
        <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">SKU: {sku}</span>
      </div>
      <h1 className="text-[48px] font-bold text-primary mb-2 leading-tight">{name}</h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-secondary-container">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <StarHalf className="w-4 h-4 fill-current" />
        </div>
        <span className="text-on-surface-variant text-sm">({reviews} reseñas)</span>
      </div>
      <div className="text-[32px] font-bold text-primary">${price.toFixed(2)}</div>
    </div>
  );
}
