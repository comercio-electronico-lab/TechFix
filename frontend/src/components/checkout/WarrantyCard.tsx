import React from 'react';
import { ShieldCheck } from 'lucide-react';

const WarrantyCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border-l-4 border-secondary">
      <div className="flex items-start gap-4">
        <ShieldCheck className="text-secondary shrink-0 w-6 h-6" />
        <div>
          <h4 className="font-bold text-primary text-lg">Garantía TechFix</h4>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Este pedido está cubierto por nuestra garantía de 12 meses "Engineered Quality". Soporte experto a un clic si necesitas ayuda con la instalación.
          </p>
          <a href="#" className="text-secondary font-bold text-sm inline-block mt-4 hover:underline">Leer Política de Garantía</a>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCard;
