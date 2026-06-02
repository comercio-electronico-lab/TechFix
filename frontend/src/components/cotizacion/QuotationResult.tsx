"use client";

import React from 'react';
import { ShieldCheck, TrendingUp, RotateCcw, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PigNode } from './QuotationWizard';
import Button from '../ui/Button';

interface QuotationResultProps {
  resultNode: PigNode;
  onReset: () => void;
}

const QuotationResult: React.FC<QuotationResultProps> = ({ resultNode, onReset }) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col gap-8">
        
        {/* Decorative top lights */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent"></div>

        <div className="text-center">
          <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-4 border border-green-500/20">
            <ShieldCheck className="w-8 h-8 text-green-500 animate-pulse" />
          </div>
          <h2 className="text-primary dark:text-white font-h2 font-bold mb-2">Presupuesto Estimado Listo</h2>
          <p className="text-xs text-on-surface-variant">Nuestro algoritmo determinó el fallo con base en tus respuestas de diagnóstico.</p>
        </div>

        {/* Tarjeta del Diagnóstico */}
        <div className="bg-surface-container-low dark:bg-white/5 p-6 rounded-xl border border-outline-variant/20 dark:border-outline/10">
          <span className="text-[10px] bg-secondary-container/10 text-secondary dark:text-secondary-container font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Fallo Preliminar Detectado
          </span>
          <p className="text-sm font-bold text-on-background mt-3 leading-relaxed">
            {resultNode.preliminary_result}
          </p>
        </div>

        {/* Medidor de Costos Estimados */}
        <div className="bg-white/80 dark:bg-slate-900/60 p-6 rounded-xl border border-outline-variant/10 dark:border-outline/20 flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monto de Reparación Estimado</span>
          
          <div className="flex items-baseline gap-1 mt-2 text-primary dark:text-white">
            <span className="text-xl font-bold">$</span>
            <span className="text-5xl font-black tracking-tighter">
              {resultNode.estimated_min} - {resultNode.estimated_max}
            </span>
            <span className="text-xs text-on-surface-variant font-bold ml-1">USD</span>
          </div>
          
          <div className="w-full max-w-sm mt-4 flex items-center gap-2 text-xs text-on-surface-variant/70 justify-center">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span>*Precios estimativos de repuestos e ingeniería.</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant/15 dark:border-outline/10 pt-6 mt-4">
          <Button
            variant="ghost"
            onClick={onReset}
            icon={RotateCcw}
            className="border border-outline-variant/40 hover:bg-surface-container-low dark:hover:bg-white/5 py-3.5"
          >
            Iniciar Otro Diagnóstico
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/reparaciones')}
            icon={Sparkles}
            className="bg-secondary hover:bg-secondary/95 text-white py-3.5"
          >
            Agendar Cita Técnica
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationResult;
