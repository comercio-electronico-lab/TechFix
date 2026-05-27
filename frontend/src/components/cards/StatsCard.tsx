import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon: Icon, color = 'primary' }) => {
  const iconColors = {
    primary: "bg-primary-container text-secondary-container",
    secondary: "bg-secondary-container/20 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUpward ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-[32px] font-bold text-primary mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
