'use client';

import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  User, 
  Cpu, 
  Wrench, 
  ShoppingBag, 
  Sparkles,
  ShieldCheck,
  History,
  TrendingUp
} from 'lucide-react';

/** ─── Shared card button ─────────────────────────────────── */
interface SelectionCardProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
  disabled?: boolean;
}

export function SelectionCard({ isSelected, onClick, icon: Icon, label, description, disabled = false }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative p-6 text-left border rounded-xl transition-all duration-350 flex flex-col gap-4 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 ${
        disabled
          ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
          : isSelected
            ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-2 ring-primary/20 dark:ring-sky-500/20'
            : 'bg-white dark:bg-slate-900 border-outline-variant/60 dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        disabled
          ? 'bg-slate-105 text-slate-400 dark:bg-slate-850 dark:text-slate-650'
          : isSelected
            ? 'bg-primary text-white dark:bg-sky-500 dark:text-slate-950'
            : 'bg-slate-100 text-primary dark:bg-slate-800 dark:text-sky-400 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-on-surface dark:text-slate-100">{label}</h3>
          {disabled && (
            <span className="text-[9px] font-extrabold uppercase bg-slate-150 dark:bg-slate-800 text-on-surface-variant/70 dark:text-slate-450 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-750 tracking-wider">
              Pronto
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">{description}</p>
      </div>
    </button>
  );
}

/** ─── Step 1: Device Type ────────────────────────────────── */
interface Step1Props {
  currentDevice: string | null;
  onSelect: (device: string) => void;
}

const DEVICE_OPTIONS = [
  { type: 'Smartphone', icon: Smartphone, label: 'Teléfono Móvil', desc: 'Soporte premium para iPhone, Samsung Galaxy, Xiaomi y más.', disabled: false },
  { type: 'Laptop', icon: Laptop, label: 'Computadora Portátil', desc: 'Ingeniería experta para MacBook Pro/Air, Dell XPS, HP y Lenovo.', disabled: false },
  { type: 'Tablet', icon: Tablet, label: 'Tableta Gráfica/Móvil', desc: 'Reparación especializada de iPad Pro/Air y Samsung Galaxy Tab.', disabled: true },
  { type: 'Desktop', icon: Monitor, label: 'PC de Escritorio', desc: 'Diagnóstico en PCs de alto rendimiento, iMacs y estaciones de trabajo.', disabled: true },
];

export function DiagnosticStep1({ currentDevice, onSelect }: Step1Props) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Qué dispositivo deseas diagnosticar?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona la categoría de tu equipo para inicializar las pruebas lógicas y de hardware correspondientes.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {DEVICE_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.type}
            isSelected={currentDevice === opt.type}
            onClick={() => !opt.disabled && onSelect(opt.type)}
            icon={opt.icon}
            label={opt.label}
            description={opt.desc}
            disabled={opt.disabled}
          />
        ))}
      </div>
    </div>
  );
}

/** ─── Step 2: Dynamic Question ───────────────────────────── */
interface Step2Props {
  currentNode: any;
  options: any[];
  symptomPath: string[];
  onSelect: (optionNode: any) => void;
}

export function DiagnosticStep2({ currentNode, options, symptomPath, onSelect }: Step2Props) {
  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 dark:border-sky-500/20 border-t-primary dark:border-t-sky-500 animate-spin" />
        <p className="text-sm font-semibold text-on-surface-variant dark:text-slate-400">
          Cargando árbol de decisión técnico...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-primary/20 dark:border-sky-500/20 uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Asistente Inteligente
        </span>
        <h1 className="text-2xl md:text-[34px] font-bold text-on-surface dark:text-white tracking-tight leading-snug max-w-2xl mx-auto">
          {currentNode.question_text}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400 max-w-lg mx-auto">
          Responde según el comportamiento actual de tu dispositivo para identificar la causa raíz.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 max-w-2xl mx-auto">
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C...
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className="group p-5 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-xl hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 cursor-pointer"
            >
              <div className="flex items-center gap-4 pr-4">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 text-xs font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950 group-hover:border-transparent transition-all">
                  {letter}
                </span>
                <span className="text-sm md:text-base font-semibold text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                  {opt.answer_option}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-on-surface-variant/40 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-sky-400 group-hover:translate-x-1.5 transition-all flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Symptom Path History Tracker */}
      {symptomPath && symptomPath.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-outline-variant/30 dark:border-slate-800/60 shadow-inner">
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">
            <History className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> Historial de Diagnóstico
          </span>
          <div className="flex flex-col gap-2">
            {symptomPath.map((step, idx) => {
              const [q, a] = step.split(' → ');
              return (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 dark:bg-sky-500/40 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-on-surface-variant/60 dark:text-slate-500">{q}:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-slate-350">{a}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** ─── Step 4: Contact Form ───────────────────────────────── */
interface Step4Props {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isSubmitting: boolean;
  onChange: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-700 rounded px-4 py-2.5 pl-10 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-colors';

export function DiagnosticStep4({ clientName, clientEmail, clientPhone, isSubmitting, onChange, onSubmit }: Step4Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Falla Identificada
        </span>
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          Ingresa tus datos de contacto
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Guardaremos el reporte y generaremos un ticket técnico para reservar tu diagnóstico prioritario en nuestro laboratorio.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-outline-variant/60 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Nombre Completo
          </label>
          <div className="relative">
            <input type="text" required placeholder="Juan Pérez"
              value={clientName} onChange={(e) => onChange('clientName', e.target.value)}
              className={inputClass} />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Correo Electrónico
          </label>
          <div className="relative">
            <input type="email" required placeholder="juan.perez@example.com"
              value={clientEmail} onChange={(e) => onChange('clientEmail', e.target.value)}
              className={inputClass} />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Número de Celular / WhatsApp
          </label>
          <div className="relative">
            <input type="tel" required placeholder="+51 987 654 321"
              value={clientPhone} onChange={(e) => onChange('clientPhone', e.target.value)}
              className={inputClass} />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary dark:bg-sky-600 hover:bg-primary/95 text-white rounded text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardando pre-evaluación...
            </>
          ) : (
            <>
              Guardar Reporte y Crear Ticket
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/** ─── Step 5: Dynamic Final Confirmation & Cross-Sell ───────── */
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
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                {symptomPath.map((step, idx) => {
                  const [q, a] = step.split(' → ');
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
                        <p className="text-[10px] text-on-surface-variant/80 dark:text-slate-455 line-clamp-1 mt-0.5 leading-normal">
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
              <AlertCircle className="w-8 h-8 text-slate-450 dark:text-slate-600 mx-auto" />
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
