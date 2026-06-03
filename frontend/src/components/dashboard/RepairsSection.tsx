"use client";

import React from 'react';
import RepairsHeader from './repairs/RepairsHeader';
import RepairsLoading from './repairs/RepairsLoading';
import RepairsEmpty from './repairs/RepairsEmpty';
import RepairsList from './repairs/RepairsList';
import { ClientRepair } from '@/mock/repairs';

interface RepairsSectionProps {
  repairs: ClientRepair[];
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
