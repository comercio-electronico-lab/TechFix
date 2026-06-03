'use client';

import React from 'react';
import { IMetricCardProps } from '@/interfaces/components';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export const MetricCard = ({ stat }: IMetricCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{stat.label}</p>
          <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
          
          {stat.change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon name={stat.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
              <span>{stat.change > 0 ? `+${stat.change}` : stat.change}%</span>
              <span className="text-[var(--color-muted)] font-normal">vs mes pasado</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl text-[var(--color-primary)]">
          <Icon name={stat.icon} size={28} />
        </div>
      </div>
    </Card>
  );
};
