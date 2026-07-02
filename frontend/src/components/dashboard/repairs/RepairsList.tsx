"use client";

import React from 'react';
import RepairCard from './RepairCard';
import { ClientRepair } from '@/interfaces/domain';

interface RepairsListProps {
  repairs: ClientRepair[];
  onRefresh?: () => void;
}

const RepairsList = ({ repairs, onRefresh }: RepairsListProps) => {
  return (
    <div className="space-y-8">
      {repairs.map((repair) => (
        <RepairCard key={repair.id} repair={repair} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

export default RepairsList;
