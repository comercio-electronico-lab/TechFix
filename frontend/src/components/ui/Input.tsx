import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  iconPosition = 'right',
  leftIcon,
  rightIcon,
  error,
  className = '',
  ...props
}) => {
  const showLeft = leftIcon || (Icon && iconPosition === 'left');
  const showRight = rightIcon || (Icon && iconPosition === 'right');

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider mb-1 text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20
            rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary
            focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40
            ${showLeft ? 'pl-11' : ''}
            ${showRight ? 'pr-11' : ''}
            ${error ? 'border-error ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {showLeft && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5 flex items-center justify-center">
            {leftIcon || (Icon && <Icon className="w-5 h-5" />)}
          </span>
        )}
        {showRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5 flex items-center justify-center">
            {rightIcon || (Icon && <Icon className="w-5 h-5" />)}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
};

export default Input;
