import React from 'react';
import { Truck } from 'lucide-react';

interface DeliveryDetailsCardProps {
  clientName: string;
  address: string;
  estimatedDate: string;
  courier: string;
}

const DeliveryDetailsCard: React.FC<DeliveryDetailsCardProps> = ({ 
  clientName, 
  address, 
  estimatedDate, 
  courier 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 border border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h3 className="text-[12px] font-bold text-secondary uppercase tracking-widest">Dirección de Entrega</h3>
          <p className="text-primary font-bold text-lg">{clientName}</p>
          <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
            {address}
          </p>
        </div>
        <div className="space-y-4 bg-surface-container-low p-6 rounded-xl border border-secondary/10">
          <h3 className="text-[12px] font-bold text-secondary uppercase tracking-widest">Entrega Estimada</h3>
          <div className="flex items-center gap-4">
            <Truck className="text-secondary w-10 h-10" />
            <div>
              <p className="text-primary font-bold text-xl">{estimatedDate}</p>
              <p className="text-on-surface-variant text-sm">Enviado vía {courier}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsCard;
