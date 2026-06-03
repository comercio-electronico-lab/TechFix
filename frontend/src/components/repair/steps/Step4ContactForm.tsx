'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Calendar, Clock, MapPin, Upload, X, Camera, ArrowRight } from 'lucide-react';
import { MOCK_DEVICE_IMAGE } from '@/data/mock/mockDeviceImage';

interface Step4Props {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isSubmitting: boolean;
  appointmentDate: string;
  appointmentTime: string;
  selectedBranch: string;
  failurePhoto: string | null;
  isAuthenticated?: boolean;
  onChange: (field: 'clientName' | 'clientEmail' | 'clientPhone' | 'serialNumber' | 'deviceModel' | 'appointmentDate' | 'appointmentTime' | 'selectedBranch', value: string) => void;
  setFailurePhoto: (photo: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-700 rounded-lg px-4 py-2.5 pl-10 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-colors';

const selectClass = 
  'w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-700 rounded-lg px-4 py-2.5 pl-10 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-colors';

export function DiagnosticStep4({
  clientName,
  clientEmail,
  clientPhone,
  isSubmitting,
  appointmentDate,
  appointmentTime,
  selectedBranch,
  failurePhoto,
  isAuthenticated = false,
  onChange,
  setFailurePhoto,
  onSubmit
}: Step4Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedPhoto, setLoadedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!failurePhoto && !loadedPhoto) {
      setFailurePhoto(MOCK_DEVICE_IMAGE);
      setLoadedPhoto(MOCK_DEVICE_IMAGE);
    } else if (failurePhoto) {
      setLoadedPhoto(failurePhoto);
    }
  }, [failurePhoto, loadedPhoto, setFailurePhoto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFailurePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFailurePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          Programa tu cita en laboratorio
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Completa la información para agendar tu cita de reparación en el laboratorio.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-outline-variant/60 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
        
        <div className="mb-4">
          <h3 className="text-sm font-black text-primary dark:text-sky-400 uppercase tracking-wider">
            1. Datos de Contacto
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
              Nombre Completo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Juan Pérez"
                value={clientName}
                onChange={(e) => !isAuthenticated && onChange('clientName', e.target.value)}
                readOnly={isAuthenticated}
                className={`${inputClass} ${isAuthenticated ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 cursor-not-allowed opacity-75' : ''}`}
              />
              <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
              Número de Celular / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+51 987 654 321"
                value={clientPhone}
                onChange={(e) => onChange('clientPhone', e.target.value)}
                className={inputClass}
              />
              <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="juan.perez@example.com"
              value={clientEmail}
              onChange={(e) => !isAuthenticated && onChange('clientEmail', e.target.value)}
              readOnly={isAuthenticated}
              className={`${inputClass} ${isAuthenticated ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 cursor-not-allowed opacity-75' : ''}`}
            />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <h3 className="text-sm font-black text-primary dark:text-sky-400 uppercase tracking-wider">
            2. Agendamiento de la Cita
          </h3>
        </div>

        {/* Sucursal */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Sucursal / Laboratorio
          </label>
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => onChange('selectedBranch', e.target.value)}
              className={selectClass}
            >
              <option value="Laboratorio Central - Miraflores">Laboratorio Central - Miraflores (Atención Completa)</option>
              <option value="Sucursal Norte - San Isidro">Sucursal Norte - San Isidro</option>
              <option value="Sucursal Sur - Santiago de Surco">Sucursal Sur - Santiago de Surco</option>
            </select>
            <MapPin className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
              Fecha de la Cita
            </label>
            <div className="relative">
              <input 
                type="date" 
                required 
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate} 
                onChange={(e) => onChange('appointmentDate', e.target.value)}
                className={inputClass} 
              />
              <Calendar className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Hora */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
              Rango de Hora
            </label>
            <div className="relative">
              <select
                required
                value={appointmentTime}
                onChange={(e) => onChange('appointmentTime', e.target.value)}
                className={selectClass}
              >
                <option value="">-- Seleccionar Hora --</option>
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
              </select>
              <Clock className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-black text-primary dark:text-sky-400 uppercase tracking-wider border-b border-outline-variant/20 dark:border-slate-800/80 pt-4 pb-2">
          3. Subir Foto del Dispositivo (Opcional)
        </h3>

        {/* Foto de la Falla */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Evidencia Física del Fallo
          </label>
          
          {loadedPhoto ? (
            <div className="relative rounded-xl overflow-hidden border border-outline-variant dark:border-slate-800 h-44 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              <img
                src={loadedPhoto}
                alt="Falla de dispositivo"
                className="h-full object-contain"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-3 right-3 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-650 transition-colors shadow"
                title="Eliminar Foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/60 dark:border-slate-800 rounded-xl p-8 text-center cursor-pointer hover:border-primary dark:hover:border-sky-500 bg-slate-50/40 dark:bg-slate-950/20 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-650 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-on-surface dark:text-slate-350">
                Arrastra o haz clic para subir imagen de la falla
              </span>
              <span className="text-[10px] text-on-surface-variant dark:text-slate-500">
                PNG, JPG o JPEG de hasta 5MB.
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary dark:bg-sky-600 hover:bg-primary/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow uppercase tracking-wider mt-4"
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
              Generar Diagnóstico y agendar cita
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

