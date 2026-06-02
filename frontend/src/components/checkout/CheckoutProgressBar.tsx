import React from 'react';
import { ShoppingCart, Truck, CreditCard } from 'lucide-react';

interface CheckoutProgressBarProps {
  currentStep: 'cart' | 'shipping' | 'payment';
}

const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: 'cart', label: 'CARRITO', icon: ShoppingCart },
    { id: 'shipping', label: 'ENVÍO', icon: Truck },
    { id: 'payment', label: 'PAGO', icon: CreditCard },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['cart', 'shipping', 'payment'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="mb-stack-lg flex justify-center">
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                  ${status === 'completed' ? 'bg-secondary text-white shadow-sm' : ''}
                  ${status === 'current' ? 'bg-primary text-white shadow-lg ring-4 ring-primary-container/20' : ''}
                  ${status === 'pending' ? 'bg-surface-container text-outline' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`
                  text-[10px] font-bold uppercase tracking-widest
                  ${status === 'completed' ? 'text-secondary' : ''}
                  ${status === 'current' ? 'text-primary' : ''}
                  ${status === 'pending' ? 'text-outline' : ''}
                `}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="h-px bg-outline-variant flex-1 mb-6"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgressBar;
