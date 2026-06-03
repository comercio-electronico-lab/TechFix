import React from 'react';
import { IIconProps } from '@/interfaces/components';
import { icons } from 'lucide-react';

export const Icon = ({ name, size = 24, color = 'currentColor', className = '' }: IIconProps) => {
  // @ts-expect-error - Lucide icons map access
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return <span className={className} style={{ width: size, height: size, display: 'inline-block' }} />;
  }

  return (
    <LucideIcon 
      color={color} 
      size={size} 
      className={className} 
    />
  );
};
