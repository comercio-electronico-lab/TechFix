'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Check, AlertTriangle, ArrowRight } from 'lucide-react';

interface Step3AuthGateProps {
  onSuccess?: () => void;
}

export function Step3AuthGate({ onSuccess }: Step3AuthGateProps) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerLogin, setRegisterLogin] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSubmitting, setRegisterSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor completa todos los campos.');
      setLoginSubmitting(false);
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoginError(err.message || 'Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSubmitting(true);

    if (!registerName || !registerLogin || !registerEmail || !registerPassword) {
      setRegisterError('Por favor completa todos los campos.');
      setRegisterSubmitting(false);
      return;
    }

    try {
      await register(registerName, registerLogin, registerEmail, registerPassword);
      alert('¡Cuenta creada con éxito!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setRegisterError(err.message || 'El correo electrónico ya está registrado.');
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const inputStyle = 
    'w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/75 dark:border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/10 dark:focus:ring-sky-500/10 transition-all';

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-350">
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-on-surface dark:text-white tracking-tight">
          Identificación de Cliente
        </h2>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Para asociar tu pre-diagnóstico y agendar tu cita técnica en el taller, por favor ingresa a tu cuenta o crea una nueva.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Selector de Pestañas */}
        <div className="flex border-b border-outline-variant/25 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
              setRegisterError('');
            }}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-primary dark:border-sky-500 text-primary dark:text-sky-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-on-surface-variant/70 hover:text-on-surface'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setLoginError('');
              setRegisterError('');
            }}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-primary dark:border-sky-500 text-primary dark:text-sky-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-on-surface-variant/70 hover:text-on-surface'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Contenido Formularios */}
        <div className="p-6 md:p-8">
          
          {/* FORMULARIO: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl p-3.5 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={inputStyle}
                  />
                  <Mail className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Contraseña (Cualquier valor para Demo)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={inputStyle}
                  />
                  <Lock className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 bg-primary dark:bg-sky-600 hover:bg-primary/95 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow disabled:opacity-50 cursor-pointer mt-6"
              >
                {loginSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                ) : (
                  <>
                    Ingresar y Continuar Cita
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORMULARIO: REGISTRO */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl p-3.5 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className={inputStyle}
                  />
                  <User className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Nombre de Usuario (Login)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="juanperez"
                    value={registerLogin}
                    onChange={(e) => setRegisterLogin(e.target.value)}
                    className={inputStyle}
                  />
                  <User className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={inputStyle}
                  />
                  <Mail className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  Contraseña (Cualquier valor para Demo)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={inputStyle}
                  />
                  <Lock className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={registerSubmitting}
                className="w-full py-3.5 bg-secondary dark:bg-sky-700 hover:bg-secondary/95 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow disabled:opacity-50 cursor-pointer mt-6"
              >
                {registerSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                ) : (
                  <>
                    Registrar y Continuar Cita
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
