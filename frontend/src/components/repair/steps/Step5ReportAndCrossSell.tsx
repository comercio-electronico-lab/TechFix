'use client';

import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Check, 
  History, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

interface Step5Props {
  ticketId: string;
  deviceType: string | null;
  terminalNode: any;
  symptomPath: string[];
  suggestedProducts: any[];
  clientName: string;
}

export function DiagnosticStep5({ 
  ticketId, 
  deviceType, 
  terminalNode, 
  symptomPath, 
  suggestedProducts, 
  clientName 
}: Step5Props) {
  
  // Formatear el precio estimado
  const minVal = terminalNode?.estimated_min || 0;
  const maxVal = terminalNode?.estimated_max || 0;
  const formattedEstimate = minVal > 0 
    ? `$${minVal.toFixed(2)} - $${maxVal.toFixed(2)} USD`
    : 'Evaluación de Laboratorio Requerida';

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Exito Header */}
      <div className="space-y-3 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center mb-2 shadow-sm animate-bounce">
          <svg className="w-8 h-8 animate-pulse animate-duration-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface dark:text-white tracking-tight">
          ¡Pre-Diagnóstico Completado!
        </h1>
        <p className="text-base text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Hola <span className="font-bold text-primary dark:text-sky-400">{clientName}</span>, hemos analizado con éxito el comportamiento técnico de tu equipo y reservado una orden de prioridad en nuestro taller central.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Ticket Ficha Técnica - Left Column */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/65 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Ticket */}
          <div className="bg-primary/5 dark:bg-sky-500/5 px-6 py-5 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-widest block mb-0.5">
                FICHA DE EVALUACIÓN
              </span>
              <h2 className="text-xl font-mono font-black text-on-surface dark:text-white tracking-tight select-all">
                {ticketId}
              </h2>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Listo en Lab
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Campos de Resumen */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-semibold">
              <div>
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5 uppercase tracking-wider font-extrabold text-[10px]">
                  TIPO DE DISPOSITIVO
                </span>
                <span className="text-base font-bold text-on-surface dark:text-slate-200 flex items-center gap-1.5">
                  {deviceType === 'Laptop' ? <Laptop className="w-4 h-4 text-slate-400" /> : <Smartphone className="w-4 h-4 text-slate-400" />}
                  {deviceType}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5 uppercase tracking-wider font-extrabold text-[10px]">
                  ESTADO DE TICKET
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Activo (Prioritario)
                </span>
              </div>
              <div className="col-span-2 border-t border-outline-variant/20 dark:border-slate-800/20 pt-4">
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-1 uppercase tracking-wider font-extrabold text-[10px]">
                  DIAGNÓSTICO PRELIMINAR
                </span>
                <span className="text-base font-black text-primary dark:text-sky-400 bg-primary/5 dark:bg-sky-500/5 px-3 py-2 rounded-lg border border-primary/10 dark:border-sky-500/10 leading-snug block">
                  {terminalNode?.preliminary_result || 'Falla de Hardware'}
                </span>
              </div>
            </div>

            {/* Fila de Costo Estimado */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/30 dark:border-slate-850 p-4.5 rounded-xl flex items-center justify-between text-sm">
              <div>
                <span className="text-[10px] font-extrabold text-on-surface-variant/70 dark:text-slate-400 uppercase tracking-widest block mb-0.5">
                  PRESUPUESTO ESTIMADO
                </span>
                <span className="text-lg font-black text-on-surface dark:text-white">
                  {formattedEstimate}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">
                  DIAGNÓSTICO EN TIENDA
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  GRATIS
                </span>
              </div>
            </div>

            {/* Recorrido Histórico */}
            <div className="border-t border-outline-variant/20 dark:border-slate-800/20 pt-5 space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-on-surface-variant/75 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> SECUENCIA DE SÍNTOMAS REPORTADOS
              </h4>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-outline-variant/20 dark:border-slate-800/40">
                {symptomPath.map((stepStr, idx) => {
                  const [q, a] = stepStr.split(' → ');
                  return (
                    <div key={idx} className="flex gap-2 text-xs leading-normal">
                      <span className="text-slate-400 dark:text-slate-650 font-mono font-bold select-none">{idx + 1}.</span>
                      <div className="text-on-surface-variant dark:text-slate-400">
                        <span className="opacity-75">{q}:</span>{' '}
                        <span className="font-extrabold text-on-surface dark:text-slate-200">{a}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Repuestos Cross-Sell Sugeridos - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-sky-400 uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4" /> Repuestos Recomendados
            </span>
            <h3 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              Componentes Recomendados
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">
              Adquiere el repuesto original hoy mismo para acelerar la reparación de tu dispositivo en el taller.
            </p>
          </div>

          {suggestedProducts && suggestedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {suggestedProducts.map((product) => {
                const hasStock = product.status !== 'Out of Stock';
                return (
                  <div 
                    key={product.id}
                    className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl p-4 flex gap-4 hover:shadow-md hover:border-primary dark:hover:border-sky-500 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Imagen Repuesto */}
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-outline-variant/20 dark:border-slate-850">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=300&auto=format&fit=crop';
                        }}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Ficha Repuesto */}
                    <div className="flex flex-col justify-between flex-grow min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-wider truncate uppercase">
                            SKU: {product.sku}
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                            hasStock 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {hasStock ? 'Disponible' : 'Sin Stock'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 mt-0.5 truncate leading-tight group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant/80 dark:text-slate-450 line-clamp-1 mt-0.5 leading-normal">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50 dark:border-slate-850">
                        <span className="text-sm font-black text-primary dark:text-sky-400">
                          ${product.price.toFixed(2)} USD
                        </span>
                        <a 
                          href={`/catalogo?search=${product.sku}`}
                          className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-sky-400 hover:text-primary-dark dark:hover:text-sky-300 transition-colors uppercase tracking-wider"
                        >
                          Comprar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-outline-variant/60 dark:border-slate-800 rounded-xl p-8 text-center space-y-2 bg-slate-50/40 dark:bg-slate-900/10">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <h4 className="text-xs font-bold text-on-surface dark:text-slate-350">No hay repuestos directos</h4>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-500 leading-normal max-w-xs mx-auto">
                Esta falla requiere diagnóstico manual avanzado. Nuestros técnicos buscarán el componente exacto una vez ingreses tu equipo en el laboratorio.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Botones de Retorno final */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant/20 dark:border-slate-800/40 pt-8">
        <a href="/catalogo" className="px-6 py-3 bg-primary dark:bg-sky-600 hover:bg-primary/90 dark:hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow cursor-pointer">
          <ShoppingBag className="w-4 h-4" /> Ir a Catálogo de Repuestos
        </a>
        <a href="/" className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}
