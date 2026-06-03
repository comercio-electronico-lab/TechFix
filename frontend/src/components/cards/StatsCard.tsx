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
  color?: 'primary' | 'secondary' | 'accent' | 'amber' | 'blue' | 'green';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon: Icon, color = 'primary' }) => {
  const iconColors = {
    primary: "bg-primary-container text-secondary-container",
    secondary: "bg-secondary-container/20 text-secondary",
    accent: "bg-accent/10 text-accent",
    amber: "bg-amber-500/10 text-amber-500",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
        {trend ? (
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-black text-primary dark:text-white">{value}</p>
            <div className={`flex items-center gap-0.5 text-xs font-bold mb-1 ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUpward ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}%
            </div>
          </div>
        ) : (
          <p className="text-3xl font-black text-primary dark:text-white mt-1">{value}</p>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${iconColors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatsCard;
