"use client";

import React from 'react';
import WarrantyCertificateCard from '@/components/repair/WarrantyCertificateCard';

interface Warranty {
  id: string;
  warranty_token: string;
  start_date: string;
  end_date: string;
  device?: { brand: string; model: string; serial_number: string };
}

interface WarrantiesListProps {
  warranties: Warranty[];
}

const WarrantiesList = ({ warranties }: WarrantiesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {warranties.map((warranty) => {
        const devLabel = warranty.device ? `${warranty.device.brand} ${warranty.device.model}` : 'Dispositivo';
        return (
          <div key={warranty.id} className="space-y-2">
            <div className="px-1 text-xs font-bold text-on-surface-variant">Equipo: {devLabel} (S/N: {warranty.device?.serial_number})</div>
            <WarrantyCertificateCard
              token={warranty.warranty_token}
              startDate={warranty.start_date}
              endDate={warranty.end_date}
            />
          </div>
        );
      })}
    </div>
  );
};

export default WarrantiesList;
