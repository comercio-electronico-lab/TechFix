"use client";

import React from 'react';
import { Laptop, Monitor, Smartphone, Cpu, Hash, Calendar, Edit2, Trash2 } from 'lucide-react';

interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  device_type: string;
  purchase_date: string | null;
}

interface DeviceCardProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onEdit, onDelete }) => {
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop':
        return <Laptop className="w-8 h-8 text-secondary" />;
      case 'desktop':
      case 'pc':
        return <Monitor className="w-8 h-8 text-secondary" />;
      case 'smartphone':
      case 'phone':
      case 'celular':
        return <Smartphone className="w-8 h-8 text-secondary" />;
      default:
        return <Cpu className="w-8 h-8 text-secondary" />;
    }
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-secondary-container/10 rounded-xl border border-secondary-container/20">
            {getDeviceIcon(device.device_type)}
          </div>
          <span className="text-[10px] bg-secondary-container/15 text-secondary dark:text-secondary-container font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-secondary-container/10">
            {device.device_type}
          </span>
        </div>
        <h4 className="text-primary dark:text-white font-bold mb-1">
          {device.brand} {device.model}
        </h4>
        
        <div className="space-y-2 mt-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-on-surface-variant/60" />
            <span>S/N: <strong className="text-on-background">{device.serial_number}</strong></span>
          </div>
          {device.purchase_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-on-surface-variant/60" />
              <span>Compra: <strong className="text-on-background">{device.purchase_date.substring(0, 10)}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-outline-variant/10 dark:border-outline/10 pt-4 mt-6">
        <button 
          onClick={() => onEdit(device)}
          className="p-2 border border-outline-variant/30 hover:border-secondary hover:text-secondary text-on-surface-variant hover:bg-secondary/5 rounded-lg transition-all cursor-pointer"
          title="Editar Equipo"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(device.id)}
          className="p-2 border border-error/15 hover:border-error hover:text-error text-on-surface-variant hover:bg-error/5 rounded-lg transition-all cursor-pointer"
          title="Eliminar Equipo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
