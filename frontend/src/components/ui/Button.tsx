import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'secondary';
  icon?: LucideIcon;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-stack-lg py-4 rounded-lg font-button text-button transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90",
    accent: "bg-accent text-white hover:bg-accent/90",
    secondary: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-white/30 text-white hover:bg-white/10",
    ghost: "text-on-surface-variant hover:bg-surface-container transition-colors",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {children}
          {Icon && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};

export default Button;