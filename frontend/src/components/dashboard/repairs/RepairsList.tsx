"use client";

import React from 'react';
import RepairCard from './RepairCard';

interface Repair {
  id: string;
  device?: { brand: string; model: string };
  status: string;
  diagnosis_final: string;
  created_at: string;
  final_price?: number;
}

interface RepairsListProps {
  repairs: Repair[];
}

const RepairsList = ({ repairs }: RepairsListProps) => {
  return (
    <div className="space-y-8">
      {repairs.map((repair) => (
        <RepairCard key={repair.id} repair={repair} />
      ))}
    </div>
  );
};

export default RepairsList;
