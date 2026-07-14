'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Simulación de ángulos de cámara usando transformaciones CSS
  const getTransformClass = (index: number) => {
    switch (index) {
      case 1: return 'scale-x-[-1]'; // Vista en espejo (Lateral)
      case 2: return 'rotate-[15deg] scale-90'; // Vista inclinada
      case 3: return 'brightness-90 contrast-110'; // Vista detallada (contraste)
      default: return ''; // Vista frontal estándar
    }
  };

  const getAngleLabel = (index: number) => {
    switch (index) {
      case 1: return 'Lateral';
      case 2: return 'Perspectiva';
      case 3: return 'Macro';
      default: return 'Frontal';
    }
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Contenedor de la Imagen Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0px_10px_30px_rgba(0,0,0,0.4)] border border-outline-variant/35 dark:border-outline/25 aspect-[4/3] flex items-center justify-center p-10 relative group transition-all duration-300">
        
        {/* Badge del Ángulo Activo */}
        <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest bg-slate-100/90 dark:bg-slate-950/90 border border-outline-variant/30 dark:border-outline/25 px-2.5 py-1 rounded-md text-on-surface-variant dark:text-slate-350 shadow-sm backdrop-blur-md">
          Vista: {getAngleLabel(activeTab)}
        </span>

        {/* Imagen principal con la transformación correspondiente al tab activo */}
        <img 
          className={`w-full h-full object-contain transition-all duration-500 ease-out select-none ${getTransformClass(activeTab)}`} 
          src={image} 
          alt={name} 
        />
      </div>

      {/* Miniaturas de selección de ángulo */}
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-2 aspect-square flex items-center justify-center hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isActive 
                  ? 'border-secondary dark:border-[#00bcff] ring-2 ring-secondary/20 dark:ring-[#00bcff]/15 scale-[1.03]' 
                  : 'border-outline-variant/30 dark:border-outline/15 hover:border-secondary-container dark:hover:border-outline/40'
              }`}
            >
              <img 
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-95' : 'opacity-40 group-hover:opacity-75'
                } ${getTransformClass(i)}`} 
                src={image} 
                alt={`Ángulo ${getAngleLabel(i)}`} 
              />
              
              {/* Indicador de barra activa inferior */}
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-secondary dark:bg-[#00bcff]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

