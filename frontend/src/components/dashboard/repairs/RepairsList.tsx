"use client";

import React from 'react';
import RepairCard from './RepairCard';
import { ClientRepair } from '@/mock/repairs';

interface RepairsListProps {
  repairs: ClientRepair[];
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
