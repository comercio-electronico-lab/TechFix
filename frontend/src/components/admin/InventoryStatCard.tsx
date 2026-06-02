'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  subLabel?: string;
  badge?: React.ReactNode;
  accentColor?: 'primary' | 'warning' | 'error';
}

export default function InventoryStatCard({ label, value, subLabel, badge, accentColor = 'primary' }: StatCardProps) {
  const accentMap = {
    primary: {
      hover: 'hover:border-primary dark:hover:border-sky-500',
      bg: 'bg-primary/5 dark:bg-sky-500/5',
      text: 'text-on-surface dark:text-white',
    },
    warning: {
      hover: 'hover:border-amber-500',
      bg: 'bg-amber-500/5',
      text: 'text-amber-600 dark:text-amber-400',
    },
    error: {
      hover: 'hover:border-error',
      bg: 'bg-red-500/5',
      text: 'text-error',
    },
  };

  const styles = accentMap[accentColor];

  return (
    <div className={`bg-surface-container-low dark:bg-slate-950/40 border border-outline-variant/40 dark:border-slate-800 p-5 rounded-xl shadow-sm relative overflow-hidden group ${styles.hover} transition-colors duration-300`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${styles.bg} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-105`} />
      <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-end gap-3 mt-3">
        <span className={`text-3xl font-bold leading-none font-mono ${styles.text}`}>
          {value}
        </span>
        {subLabel && (
          <span className="text-[10px] text-primary dark:text-sky-400 font-bold mb-1">{subLabel}</span>
        )}
        {badge}
      </div>
    </div>
  );
}
