import React from 'react';
import { IBadgeProps } from '@/interfaces/components';

export const Badge = ({ children, variant = 'neutral' }: IBadgeProps) => {
  const variants = {
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]}`}>
      {children}
    </span>
  );
};
