import React from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, shipping, tax }) => {
  const total = subtotal + shipping + tax;

  return (
    <aside className="lg:col-span-4">
      <div className="bg-surface-container-low p-8 rounded-xl sticky top-25 border border-outline-variant/20">
        <h3 className="text-2xl font-bold mb-6 text-primary">Resumen del Pedido</h3>
        
        {/* Item List */}
        <div className="space-y-4 mb-6 border-b border-outline-variant/30 pb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 bg-white rounded-lg border border-outline-variant/20 overflow-hidden shrink-0 p-1">
                <img className="w-full h-full object-contain" src={item.image} alt={item.name} />
              </div>
              <div className="grow">
                <p className="font-bold text-on-surface leading-tight line-clamp-1">{item.name}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">CANT: {item.quantity}</p>
                <p className="font-bold text-secondary mt-1">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Envío (Express)</span>
            <span className="text-secondary font-bold">${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Impuestos est.</span>
            <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-primary/10 pt-4 mb-6">
          <span className="text-xl font-bold text-primary">Total</span>
          <span className="text-3xl font-bold text-secondary">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">SOPORTE TÉCNICO GRATUITO INCLUIDO</p>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
