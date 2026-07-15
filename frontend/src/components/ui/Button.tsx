import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'secondary' | 'outline-white' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  leftIcon,
  rightIcon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-10 py-4 text-lg",
    icon: "p-3",
  };

  const variants = {
    primary: "bg-secondary text-white hover:brightness-110 shadow-sm",
    accent: "bg-accent text-white hover:brightness-110 shadow-sm",
    secondary: "bg-primary text-white hover:brightness-110 shadow-sm",
    outline: "border-2 border-primary/20 text-primary hover:bg-primary/5",
    "outline-white": "border-2 border-white/30 text-white hover:bg-white/10",
    ghost: "text-on-surface-variant hover:bg-surface-container transition-colors",
    danger: "bg-error text-white hover:brightness-110 shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {Icon && <Icon className="w-5 h-5" />}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;