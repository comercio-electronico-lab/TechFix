"use client";

import React from 'react';
import WarrantiesHeader from './warranties/WarrantiesHeader';
import WarrantiesLoading from './warranties/WarrantiesLoading';
import WarrantiesEmpty from './warranties/WarrantiesEmpty';
import WarrantiesList from './warranties/WarrantiesList';

interface Warranty {
  id: string;
  warranty_token: string;
  start_date: string;
  end_date: string;
  device?: { brand: string; model: string; serial_number: string };
}

interface WarrantiesSectionProps {
  warranties: Warranty[];
  loading: boolean;
}

const WarrantiesSection = ({ warranties, loading }: WarrantiesSectionProps) => {
  return (
    <div className="space-y-6">
      <WarrantiesHeader />

      {loading && <WarrantiesLoading />}

      {!loading && warranties.length === 0 && <WarrantiesEmpty />}

      {!loading && warranties.length > 0 && <WarrantiesList warranties={warranties} />}
    </div>
  );
};

export default WarrantiesSection;
