import React from 'react';
import { Laptop, Smartphone } from 'lucide-react';

interface DeviceSelectorProps {
  onSelect: (type: 'Laptop' | 'Smartphone') => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <button
        onClick={() => onSelect('Laptop')}
        className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all cursor-pointer group text-center flex flex-col items-center justify-center gap-4"
      >
        <div className="p-4 bg-secondary-container/10 rounded-2xl group-hover:scale-110 transition-transform">
          <Laptop className="w-12 h-12 text-secondary" />
        </div>
        <div>
          <h3 className="text-primary dark:text-white font-bold text-xl mb-1">Reparar Laptop</h3>
          <p className="text-xs text-on-surface-variant max-w-xs">Diagnóstico para pantallas, encendido, baterías, recalentamientos y más.</p>
        </div>
      </button>

      <button
        onClick={() => onSelect('Smartphone')}
        className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all cursor-pointer group text-center flex flex-col items-center justify-center gap-4"
      >
        <div className="p-4 bg-secondary-container/10 rounded-2xl group-hover:scale-110 transition-transform">
          <Smartphone className="w-12 h-12 text-secondary" />
        </div>
        <div>
          <h3 className="text-primary dark:text-white font-bold text-xl mb-1">Reparar Smartphone</h3>
          <p className="text-xs text-on-surface-variant max-w-xs">Diagnóstico de pantallas mojadas o rotas, fallos de carga, baterías y sensores.</p>
        </div>
      </button>
    </div>
  );
};

export default DeviceSelector;
