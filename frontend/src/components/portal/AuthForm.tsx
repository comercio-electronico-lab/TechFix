'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Key, CheckCircle, AlertCircle, Wrench, ShieldCheck, Activity } from 'lucide-react';

export default function AuthForm() {
  const { login, register, error, setError } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');

  // Local errors
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    if (!email || !password) {
      setValidationError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (!isLoginTab && (!nombre || !username)) {
      setValidationError('Por favor completa todos los datos de perfil.');
      return;
    }

    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(nombre, username, email, password);
      }
    } catch (e: any) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex bg-background dark:bg-slate-950 transition-colors duration-300 font-body-md">
      
      {/* Panel Izquierdo: Branding Visual (Oculto en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between text-white relative overflow-hidden border-r border-outline-variant/10 dark:border-slate-900">
        
        {/* Decoraciones de fondo glassmorphic */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-400/20 shadow-inner">
            <Wrench className="w-4.5 h-4.5 text-sky-400 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">TechFix Lab</span>
            <span className="block text-[9px] text-sky-400 font-semibold tracking-widest uppercase">Engineered Quality</span>
          </div>
        </div>

        {/* Center: Propuesta de valor */}
        <div className="my-auto max-w-md space-y-8 z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Calibración y Diagnóstico de <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Siguiente Nivel</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registra tu inventario tecnológico personal para acceder a planes de garantía digital, agendar diagnósticos de laboratorio y monitorear reparaciones en tiempo real con total transparencia.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/15 shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Monitoreo Quirúrgico en Tiempo Real</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">Observa cada etapa del diagnóstico, desde la microsoldadura hasta las pruebas de estrés.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/15 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Garantías Digitales Resguardadas</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">Administra los tokens criptográficos de garantía de tus reparaciones sin papeles.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-500 z-10 flex justify-between">
          <span>© 2026 TechFix Inc. Todos los derechos reservados.</span>
          <span className="font-mono">v1.2.0 (Stable)</span>
        </div>
      </div>

      {/* Panel Derecho: Formulario (Principal) */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-surface-bright dark:bg-slate-950 transition-colors">
        <div className="max-w-md w-full mx-auto space-y-7">
          
          {/* Header del Formulario */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              {isLoginTab ? 'Acceder al Portal Técnico' : 'Crear tu Cuenta TechFix'}
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2">
              {isLoginTab 
                ? 'Introduce tus credenciales para administrar tus dispositivos.' 
                : 'Registra tus datos de perfil para crear tu inventario de equipos.'}
            </p>
          </div>

          {/* Selector de Pestaña */}
          <div className="bg-surface dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-1.5 rounded-xl flex gap-1 shadow-sm">
            <button
              onClick={() => { setIsLoginTab(true); setError(null); setValidationError(null); }}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isLoginTab 
                  ? 'bg-primary dark:bg-sky-600 text-on-primary dark:text-white shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-slate-850'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setError(null); setValidationError(null); }}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isLoginTab 
                  ? 'bg-primary dark:bg-sky-600 text-on-primary dark:text-white shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-slate-850'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Alertas de error */}
          {(validationError || error) && (
            <div className="p-3 bg-error-container/10 dark:bg-red-950/20 border border-error-container/30 dark:border-red-900/30 text-error-container dark:text-red-400 rounded-lg text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-normal">{validationError || error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-on-surface-variant/40" />
                    <input
                      type="text" required placeholder="Ej: Carlos G."
                      value={nombre} onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded px-3 py-2 pl-9 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Usuario (Login)</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-3.5 h-3.5 text-on-surface-variant/40" />
                    <input
                      type="text" required placeholder="Ej: carlos_gonzalez"
                      value={username} onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded px-3 py-2 pl-9 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-on-surface-variant/40" />
                <input
                  type="email" required placeholder="Ej: carlos@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded px-3 py-2 pl-9 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Contraseña</label>
                {isLoginTab && (
                  <span className="text-[10px] text-primary dark:text-sky-400 font-bold hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-on-surface-variant/40" />
                <input
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded px-3 py-2 pl-9 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-2.5 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 dark:shadow-sky-500/10"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLoginTab ? (
                'Iniciar Sesión'
              ) : (
                'Registrar Cuenta'
              )}
            </button>
          </form>



        </div>
      </div>

    </div>
  );
}
