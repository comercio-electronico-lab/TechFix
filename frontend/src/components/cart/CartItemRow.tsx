import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-6 items-center border border-outline-variant/10">
      <div className="w-full md:w-32 h-32 bg-surface-container-low rounded-lg overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="grow w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-primary">{item.name}</h3>
            {item.description && (
              <p className="text-on-surface-variant text-sm mt-1 line-clamp-1">{item.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags?.map(tag => (
                <span key={tag} className="bg-surface-container-high text-on-secondary-container px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">${(item.price || 0).toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center border border-outline rounded-lg overflow-hidden">
            <button 
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="px-3 py-2 hover:bg-surface-container-low transition-colors text-primary cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-bold text-primary">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="px-3 py-2 hover:bg-surface-container-low transition-colors text-primary cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => onRemove(item.id)}
            className="text-error flex items-center gap-1 hover:underline font-bold text-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
