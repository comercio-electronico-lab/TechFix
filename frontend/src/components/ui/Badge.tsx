import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    neutral: "bg-surface-container-high text-on-surface-variant border-outline-variant/30",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
