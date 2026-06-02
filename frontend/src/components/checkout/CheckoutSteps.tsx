import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Envío', href: '/checkout/envio' },
    { id: 2, label: 'Pago', href: '/checkout/pago' },
    { id: 3, label: 'Revisión', href: '#' },
  ];

  return (
    <nav className="mb-stack-lg flex items-center gap-2 text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <span className={`${
            currentStep === step.id ? 'text-primary' : 
            currentStep > step.id ? 'text-secondary' : 'opacity-50'
          }`}>
            {step.id < 10 ? `0${step.id}` : step.id} {step.label}
          </span>
          {index < steps.length - 1 && (
            <ChevronRight className={`w-4 h-4 ${currentStep <= step.id ? 'opacity-50' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CheckoutSteps;
