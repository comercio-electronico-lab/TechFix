import React from 'react';
import { IButtonProps } from '@/interfaces/components';

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: IButtonProps) => {
  // Mapeo de estilos base usando variables de CSS (Tailwind V4 style)
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
    secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90',
    outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)]',
    ghost: 'hover:bg-[var(--color-accent)]',
    danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
    success: 'bg-[var(--color-success)] text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="mr-2 animate-spin">...</span>}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
