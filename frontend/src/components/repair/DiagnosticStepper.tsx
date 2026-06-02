import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface DiagnosticStepperProps {
  currentStep: number;
  onBack: () => void;
}

export default function DiagnosticStepper({ currentStep, onBack }: DiagnosticStepperProps) {
  const steps = [
    { number: 1, label: 'Dispositivo' },
    { number: 2, label: 'Categoría' },
    { number: 3, label: 'Detalles' },
    { number: 4, label: 'Contacto' },
    { number: 5, label: 'Resumen' }
  ];

  return (
    <div className="w-full space-y-6 pb-6 border-b border-outline-variant/30 dark:border-slate-800/80 transition-colors">
      <div className="flex justify-between items-center">
        {currentStep > 1 && currentStep < 5 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 transition-colors font-bold text-xs uppercase tracking-wider group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Atrás
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        <span className="text-[10px] font-bold text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-widest">
          {currentStep === 5 ? 'Proceso Completado' : `Paso ${currentStep} de 4`}
        </span>
      </div>

      {/* Stepper Timeline Bar */}
      <div className="relative flex justify-between items-center w-full px-2 sm:px-6">
        {/* Timeline background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-850 -translate-y-1/2 rounded-full -z-10" />
        {/* Timeline progress line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary dark:bg-sky-500 -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm border ${
                  isCompleted 
                    ? 'bg-primary dark:bg-sky-500 border-primary dark:border-sky-500 text-white animate-fade-in' 
                    : isActive 
                      ? 'bg-white dark:bg-slate-900 border-primary dark:border-sky-400 text-primary dark:text-sky-400 ring-4 ring-primary/10 dark:ring-sky-500/10' 
                      : 'bg-white dark:bg-slate-950 border-outline-variant/60 dark:border-slate-800 text-on-surface-variant/50 dark:text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[3px]" />
                ) : (
                  step.number
                )}
              </div>
              <span 
                className={`hidden md:block text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isActive 
                    ? 'text-primary dark:text-sky-400' 
                    : isCompleted 
                      ? 'text-on-surface-variant/80 dark:text-slate-350' 
                      : 'text-on-surface-variant/40 dark:text-slate-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
