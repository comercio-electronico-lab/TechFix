import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ConfirmationHeroProps {
  orderNumber: string;
}

const ConfirmationHero: React.FC<ConfirmationHeroProps> = ({ orderNumber }) => {
  return (
    <section className="bg-surface-container-low py-stack-lg border-b border-outline-variant/10">
      <div className="max-w-200 mx-auto px-gutter text-center">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-stack-md shadow-lg shadow-secondary/20">
          <CheckCircle className="text-white w-12 h-12" />
        </div>
        <h1 className="text-[48px] font-bold text-primary mb-stack-sm leading-tight">¡Pedido Confirmado!</h1>
        <p className="text-lg text-on-surface-variant max-w-150 mx-auto">
          Gracias por elegir TechFix. Tu pedido ha sido procesado con éxito y nuestros ingenieros están preparando tu paquete para el despacho.
        </p>
        <div className="mt-8 inline-block px-6 py-3 bg-white rounded-xl border border-outline-variant shadow-sm">
          <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Número de Pedido:</span>
          <span className="text-lg font-bold text-primary ml-2">{orderNumber}</span>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationHero;
