'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-surface dark:bg-slate-900 rounded-xl border border-outline-variant/40 dark:border-slate-800 shadow-2xl w-full ${maxWidth} overflow-hidden relative transition-colors`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center bg-surface-container-low dark:bg-slate-950/40">
          <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface dark:text-white flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant/60 dark:text-slate-500 hover:text-error dark:hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
