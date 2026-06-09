import React from 'react';
import { ICardProps } from '@/interfaces/components';

export const Card = ({ children, className = '', title, footer }: ICardProps) => {
  return (
    <div className={`bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/60 dark:border-slate-800/80 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-outline-variant/50 dark:border-slate-800">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-surface-dim dark:bg-slate-950 border-t border-outline-variant/50 dark:border-slate-800">
          {footer}
        </div>
      )}
    </div>
  );
};
