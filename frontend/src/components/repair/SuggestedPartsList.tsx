import React from 'react';

export interface SuggestedPart {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface SuggestedPartsListProps {
  parts: SuggestedPart[];
  addedParts: string[];
  onAddPart: (part: SuggestedPart) => void;
}

export default function SuggestedPartsList({ parts, addedParts, onAddPart }: SuggestedPartsListProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-semibold text-on-surface dark:text-slate-100 mb-2 tracking-tight">
          Componentes Recomendados
        </h3>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1 leading-normal font-body-md">
          Si cuentas con experiencia técnica avanzada, estas son las refacciones OEM certificadas necesarias para completar la labor tú mismo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parts.map((part) => {
          const isAlreadyAdded = addedParts.includes(part.id);
          
          return (
            <div 
              key={part.id} 
              className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-4 flex gap-4 items-center hover:border-primary dark:hover:border-sky-500 hover:shadow-sm transition-all duration-300"
            >
              {/* Miniatura del Componente */}
              <div className="w-20 h-20 bg-surface-container-low dark:bg-slate-950/40 rounded-md flex-shrink-0 flex items-center justify-center p-1 overflow-hidden border border-outline-variant dark:border-slate-800">
                <img 
                  src={part.image} 
                  alt={part.name} 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95 select-none" 
                />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm text-on-surface dark:text-slate-200 line-clamp-1 leading-snug">
                  {part.name}
                </h4>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 mb-2 line-clamp-1">
                  {part.description}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-base text-primary dark:text-sky-400 font-mono">
                    ${part.price.toFixed(2)}
                  </span>
                  
                  {isAlreadyAdded ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-900/60">
                      Agregado
                    </span>
                  ) : (
                    <button 
                      onClick={() => onAddPart(part)}
                      className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-slate-950 px-3 py-1 rounded text-xs font-semibold transition-all active:scale-[0.96] cursor-pointer"
                    >
                      Añadir Pedido
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
