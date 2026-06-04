import React from 'react';
import { Package } from 'lucide-react';

interface SummaryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  image: string;
}

interface DetailedOrderSummaryProps {
  items: SummaryItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}

const DetailedOrderSummary: React.FC<DetailedOrderSummaryProps> = ({ 
  items, 
  subtotal, 
  shipping, 
  tax 
}) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border border-outline-variant/10">
      <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
        <Package className="text-secondary w-6 h-6" />
        Resumen del Pedido
      </h2>
      <div className="divide-y divide-outline-variant/20">
        {items.map((item) => (
          <div key={item.id} className="py-6 flex gap-6">
            <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden shrink-0 border border-outline-variant/10">
              <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
            </div>
            <div className="grow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-primary text-lg">{item.name}</h3>
                <span className="font-bold text-primary">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-on-surface-variant text-sm mt-1">{item.description}</p>
              <div className="mt-3">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-primary uppercase">Cant: {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-outline-variant/30 space-y-3">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Envío (Express)</span>
          <span>${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Impuestos</span>
          <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10 mt-4">
          <span className="text-xl font-bold text-primary">Total</span>
          <span className="text-3xl font-bold text-secondary">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailedOrderSummary;
