import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PillarCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  iconColor = 'text-sky-500 dark:text-sky-400' 
}) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-sky-500/40 dark:hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg">
      <div className="space-y-6">
        <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-on-surface dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PillarCard;
