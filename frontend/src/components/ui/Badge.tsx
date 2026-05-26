import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-surface-container-high text-on-surface-variant border-outline-variant/30",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
