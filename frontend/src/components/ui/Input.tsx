import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-bold text-primary uppercase tracking-tight">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full bg-white border border-outline-variant/50 rounded-lg px-4 py-3 
            focus:ring-2 focus:ring-secondary focus:border-secondary outline-none 
            transition-all placeholder:text-on-surface-variant/40
            ${Icon ? 'pr-12' : ''}
            ${error ? 'border-error ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {Icon && (
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
        )}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
};

export default Input;
