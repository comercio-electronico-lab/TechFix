import React from 'react';

interface CalendarSyncFooterProps {
  onPrev: () => void;
  onNext: () => void;
  syncMessage?: string;
}

export default function CalendarSyncFooter({ 
  onPrev, 
  onNext, 
  syncMessage = 'Sincronizado con el calendario de Google for Work' 
}: CalendarSyncFooterProps) {
  return (
    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10 transition-colors">
      <div className="flex justify-between items-center px-4">
        <p className="text-xs text-on-surface-variant">{syncMessage}</p>
        <div className="flex gap-2">
          <button 
            onClick={onPrev}
            className="px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
          >
            Anterior
          </button>
          <button 
            onClick={onNext}
            className="px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/20 cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
