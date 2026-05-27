"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminMetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent' | 'tertiary';
  description?: string;
  progress?: number;
}

const AdminMetricCard: React.FC<AdminMetricCardProps> = ({ 
  label, 
  value, 
  trend, 
  icon: Icon, 
  color = 'primary',
  description,
  progress
}) => {
  const colorStyles = {
    primary: "bg-primary-container/10 text-primary",
    secondary: "bg-secondary-container/20 text-secondary",
    accent: "bg-accent/10 text-accent",
    tertiary: "bg-tertiary-fixed-dim/20 text-tertiary",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10 group hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
        {trend && (
          <span className={`text-[12px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
            trend.isUpward ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend.isUpward ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{label}</h3>
        <p className="text-3xl font-bold text-on-background">{value}</p>
        {description && <p className="text-sm text-on-surface-variant mt-2">{description}</p>}
      </div>

      {progress !== undefined && (
        <div className="mt-4 pt-4 border-t border-outline-variant/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">Cumplimiento</span>
            <span className="text-[10px] font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div 
              className="bg-secondary h-full rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMetricCard;
