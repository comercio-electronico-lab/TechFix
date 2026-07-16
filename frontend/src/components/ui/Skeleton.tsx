import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Bloque con brillo animado para estados de carga; reemplaza a los spinners genéricos. */
const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-md bg-slate-200 dark:bg-slate-800 ${className}`} aria-hidden="true" />
);

export default Skeleton;
