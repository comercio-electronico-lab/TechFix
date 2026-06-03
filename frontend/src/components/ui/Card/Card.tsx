import React from 'react';
import { ICardProps } from '@/interfaces/components';

export const Card = ({ children, className = '', title, footer }: ICardProps) => {
  return (
    <div className={`bg-white rounded-lg border border-[var(--color-border)] shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-[var(--color-background)] border-t border-[var(--color-border)]">
          {footer}
        </div>
      )}
    </div>
  );
};
