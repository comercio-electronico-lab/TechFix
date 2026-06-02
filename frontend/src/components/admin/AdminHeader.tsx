import React from 'react';

interface AdminHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

export default function AdminHeader({ title, description, icon: Icon, children }: AdminHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-outline-variant/30 dark:border-slate-850 transition-colors">
      <div className="flex gap-3 items-center">
        {Icon && <Icon className="w-6 h-6 text-primary dark:text-sky-400 shrink-0" />}
        <div>
          <h1 className="text-xl md:text-[32px] font-bold text-primary dark:text-white tracking-tight leading-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children && (
        <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end items-center">
          {children}
        </div>
      )}
    </header>
  );
}
