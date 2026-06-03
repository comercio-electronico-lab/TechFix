"use client";

import React from 'react';
import RepairsHeader from './repairs/RepairsHeader';
import RepairsLoading from './repairs/RepairsLoading';
import RepairsEmpty from './repairs/RepairsEmpty';
import RepairsList from './repairs/RepairsList';

interface Repair {
  id: string;
  device?: { brand: string; model: string };
  status: string;
  diagnosis_final: string;
  created_at: string;
  final_price?: number;
}

interface RepairsSectionProps {
  repairs: Repair[];
  loading: boolean;
}

const RepairsSection = ({ repairs, loading }: RepairsSectionProps) => {
  return (
    <div className="space-y-6">
      <RepairsHeader />

      {loading && <RepairsLoading />}

      {!loading && repairs.length === 0 && <RepairsEmpty />}

      {!loading && repairs.length > 0 && <RepairsList repairs={repairs} />}
    </div>
  );
};

export default RepairsSection;
