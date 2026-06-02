'use client';

import React from 'react';

interface SelectionCardProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
  disabled?: boolean;
}

export function SelectionCard({ 
  isSelected, 
  onClick, 
  icon: Icon, 
  label, 
  description, 
  disabled = false 
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative p-6 text-left border rounded-xl transition-all duration-300 flex flex-col gap-4 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 ${
        disabled
          ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
          : isSelected
            ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-2 ring-primary/20 dark:ring-sky-500/20'
            : 'bg-white dark:bg-slate-900 border-outline-variant/60 dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        disabled
          ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-650'
          : isSelected
            ? 'bg-primary text-white dark:bg-sky-500 dark:text-slate-950'
            : 'bg-slate-100 text-primary dark:bg-slate-800 dark:text-sky-400 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-on-surface dark:text-slate-100">{label}</h3>
          {disabled && (
            <span className="text-[9px] font-extrabold uppercase bg-slate-200 dark:bg-slate-800 text-on-surface-variant/70 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-250 dark:border-slate-700 tracking-wider">
              Pronto
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">{description}</p>
      </div>
    </button>
  );
}
