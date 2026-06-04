import React from 'react';
import { IInputProps } from '@/interfaces/components';

export const Input = ({ label, error, leftIcon, className = '', ...props }: IInputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-[var(--color-muted)]">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            flex h-10 w-full rounded-md border border-[var(--color-border)] 
            bg-transparent px-3 py-2 text-sm ring-offset-background 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-[var(--color-muted)] 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] 
            disabled:cursor-not-allowed disabled:opacity-50
            ${leftIcon ? 'pl-10' : ''}
            ${error ? 'border-[var(--color-danger)]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-[var(--color-danger)]">{error}</span>
      )}
    </div>
  );
};
