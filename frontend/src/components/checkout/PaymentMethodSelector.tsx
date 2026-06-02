import React from 'react';
import { CreditCard, Wallet, Landmark } from 'lucide-react';

export type PaymentMethod = 'card' | 'paypal' | 'transfer';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onSelect }) => {
  const methods = [
    { id: 'card' as const, label: 'Tarjeta', icon: CreditCard },
    { id: 'paypal' as const, label: 'PayPal', icon: Wallet },
    { id: 'transfer' as const, label: 'Transferencia', icon: Landmark },
  ];

  return (
    <section className="mb-stack-lg">
      <h2 className="text-[24px] font-bold text-on-surface mb-stack-sm">Elige el método de pago</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-sm">
        {methods.map((method) => {
          const Icon = method.icon;
          const isActive = selected === method.id;
          return (
            <div 
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`
                border-2 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer shadow-sm transition-all
                ${isActive 
                  ? 'border-secondary bg-surface-container-low scale-[1.02]' 
                  : 'border-outline-variant hover:border-secondary bg-white'
                }
              `}
            >
              <Icon className={`w-10 h-10 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
              <span className={`font-bold ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {method.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PaymentMethodSelector;
