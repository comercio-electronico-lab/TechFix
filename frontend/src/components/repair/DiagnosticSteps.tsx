'use client';

import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor, Eye, BatteryWarning, Cpu, Wrench } from 'lucide-react';
import { DeviceType, IssueCategory } from '@/hooks/useDiagnosticFlow';

/** ─── Shared card button ─────────────────────────────────── */
interface SelectionCardProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
}

export function SelectionCard({ isSelected, onClick, icon: Icon, label, description }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-6 bg-white dark:bg-slate-900 text-left border rounded-xl hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all duration-300 flex flex-col gap-4 shadow-sm hover:shadow ${
        isSelected
          ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-2 ring-primary/20 dark:ring-sky-500/20'
          : 'border-outline-variant/60 dark:border-slate-800'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        isSelected
          ? 'bg-primary text-white dark:bg-sky-500 dark:text-slate-950'
          : 'bg-slate-100 text-primary dark:bg-slate-800 dark:text-sky-400 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-on-surface dark:text-slate-100 mb-1">{label}</h3>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">{description}</p>
      </div>
    </button>
  );
}

/** ─── Step 1: Device Type ────────────────────────────────── */
interface Step1Props {
  currentDevice: DeviceType | null;
  onSelect: (device: DeviceType) => void;
}

const DEVICE_OPTIONS: { type: DeviceType; icon: React.ElementType; label: string; desc: string }[] = [
  { type: 'Smartphone', icon: Smartphone, label: 'Teléfono Móvil', desc: 'Soporte premium para iPhone, Samsung Galaxy, Xiaomi y más.' },
  { type: 'Laptop', icon: Laptop, label: 'Computadora Portátil', desc: 'Ingeniería experta para MacBook Pro/Air, Dell XPS, HP y Lenovo.' },
  { type: 'Tablet', icon: Tablet, label: 'Tableta Gráfica/Móvil', desc: 'Reparación especializada de iPad Pro/Air y Samsung Galaxy Tab.' },
  { type: 'Desktop', icon: Monitor, label: 'Computadora de Escritorio', desc: 'Diagnóstico en PCs de alto rendimiento, iMacs y estaciones de trabajo.' },
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
            onClick={() => onSelect(opt.type)}
            icon={opt.icon}
            label={opt.label}
            description={opt.desc}
          />
        ))}
      </div>
    </div>
  );
}

/** ─── Step 2: Issue Category ─────────────────────────────── */
interface Step2Props {
  currentCategory: IssueCategory | null;
  onSelect: (cat: IssueCategory) => void;
}

const ISSUE_OPTIONS: { cat: IssueCategory; icon: React.ElementType; label: string; desc: string }[] = [
  { cat: 'Display', icon: Eye, label: 'Pantalla o Display', desc: 'Vidrio trizado, píxeles quemados, falla de retroiluminación o táctil dañado.' },
  { cat: 'Battery', icon: BatteryWarning, label: 'Batería y Energía', desc: 'No enciende, descarga rápida, falla en el puerto de carga o batería hinchada.' },
  { cat: 'Performance', icon: Cpu, label: 'Rendimiento y S.O.', desc: 'Congelamiento, lentitud extrema, bucles en el logo o fallas del procesador/RAM.' },
  { cat: 'Physical', icon: Wrench, label: 'Físico o Componentes', desc: 'Daño por agua/líquidos, botones rotos, fallas de audio, micrófono o WiFi.' },
];

export function DiagnosticStep2({ currentCategory, onSelect }: Step2Props) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Qué síntoma presenta tu dispositivo?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona la falla principal para que podamos preparar los repuestos e instrumentos de medición adecuados.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {ISSUE_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.cat}
            isSelected={currentCategory === opt.cat}
            onClick={() => onSelect(opt.cat)}
            icon={opt.icon}
            label={opt.label}
            description={opt.desc}
          />
        ))}
      </div>
    </div>
  );
}

/** ─── Step 3: Issue Detail ───────────────────────────────── */
interface Step3Props {
  issueCategory: IssueCategory | null;
  currentDetail: string | null;
  detailsList: string[];
  onSelect: (detail: string) => void;
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  Display: 'Pantalla',
  Battery: 'Batería',
  Performance: 'Rendimiento',
  Physical: 'Físico',
};

export function DiagnosticStep3({ issueCategory, currentDetail, detailsList, onSelect }: Step3Props) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        {issueCategory && (
          <span className="inline-block bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 dark:border-sky-500/20 uppercase tracking-wider">
            Detalles sobre {CATEGORY_LABELS[issueCategory]}
          </span>
        )}
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Cuál de estos detalles describe mejor la falla?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona la opción de la lista para mapear el costo y preparar el instrumental técnico necesario.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {detailsList.map((detail) => {
          const isSelected = currentDetail === detail;
          return (
            <button
              key={detail}
              onClick={() => onSelect(detail)}
              className={`group p-5 bg-white dark:bg-slate-900 border rounded-xl hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 ${
                isSelected
                  ? 'border-primary dark:border-sky-500 bg-primary/5 dark:bg-sky-500/5 ring-2 ring-primary/20 dark:ring-sky-500/20 font-semibold'
                  : 'border-outline-variant/60 dark:border-slate-800'
              }`}
            >
              <span className="text-sm font-semibold text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                {detail}
              </span>
              <svg className="w-5 h-5 text-on-surface-variant/40 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>
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
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          Ingresa tus datos de contacto
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Generaremos un ticket técnico instantáneo para reservar tu diagnóstico prioritario en nuestro laboratorio.
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
              Procesando Diagnóstico...
            </>
          ) : (
            <>
              Generar Ticket Técnico
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

/** ─── Step 5: Confirmation ───────────────────────────────── */
interface Step5Props {
  ticketId: string;
  deviceType: string | null;
  issueCategory: IssueCategory | null;
  issueDetail: string | null;
  clientName: string;
  costEstimate: string;
}

export function DiagnosticStep5({ ticketId, deviceType, issueCategory, issueDetail, clientName, costEstimate }: Step5Props) {
  return (
    <div className="max-w-xl mx-auto space-y-10 text-center">
      <div className="space-y-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center mb-2 animate-bounce">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-on-surface dark:text-white tracking-tight">
          ¡Diagnóstico Inicial Completado!
        </h1>
        <p className="text-base text-on-surface-variant dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Hemos generado tu pre-evaluación y reservado un cupo prioritario de reparación en nuestro laboratorio de alta ingeniería.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-outline-variant/60 dark:border-slate-800 shadow-lg text-left relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 dark:bg-sky-500/5 rounded-bl-full flex items-center justify-center opacity-70">
          <svg className="w-6 h-6 text-primary dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        <div className="space-y-5">
          <div className="border-b border-outline-variant/30 dark:border-slate-800/60 pb-4">
            <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-widest block mb-1">
              TICKET DE EVALUACIÓN
            </span>
            <h2 className="text-2xl font-mono font-bold text-on-surface dark:text-white select-all">
              {ticketId}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5">DISPOSITIVO</span>
              <span className="font-bold text-on-surface dark:text-slate-200">{deviceType}</span>
            </div>
            <div>
              <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5">FALLA REPORTADA</span>
              <span className="font-bold text-on-surface dark:text-slate-200">{issueCategory}</span>
            </div>
            <div className="col-span-2 border-t border-outline-variant/20 dark:border-slate-800/20 pt-2.5">
              <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5">SÍNTOMA DETALLADO</span>
              <span className="font-bold text-on-surface dark:text-slate-200 leading-normal block">{issueDetail}</span>
            </div>
            <div className="col-span-2 border-t border-outline-variant/20 dark:border-slate-800/20 pt-2.5">
              <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5">TITULAR</span>
              <span className="font-bold text-on-surface dark:text-slate-200">{clientName}</span>
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-sky-500/5 border border-primary/10 dark:border-sky-500/10 p-4 rounded-lg flex items-center justify-between text-sm mt-2">
            <div>
              <span className="text-xs text-on-surface-variant dark:text-slate-400 block">COSTO ESTIMADO</span>
              <span className="text-base font-bold text-primary dark:text-sky-400">{costEstimate}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface-variant dark:text-slate-400 block">DIAGNÓSTICO LAB</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">GRATUITO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de retorno */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`/reparaciones/resumen?ticket=${ticketId}&device=${deviceType}&category=${issueCategory}&detail=${issueDetail}`}
          className="px-6 py-3 bg-primary dark:bg-sky-600 hover:bg-primary/90 dark:hover:bg-sky-500 text-white rounded text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
        >
          Ver Informe de Diagnóstico
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/" className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-800 rounded text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer">
          Volver al Inicio
        </a>
        <a href="/catalogo" className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-800 rounded text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer">
          Explorar Repuestos
        </a>
      </div>
    </div>
  );
}
