"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/perfil');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (isRegister) {
      // Registro
      if (!nombre || !email || !loginUsername || !password) {
        setErrorMsg('Todos los campos son requeridos');
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres');
        setSubmitting(false);
        return;
      }

      const res = await register(nombre, email, loginUsername, password);
      if (res.success) {
        setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
        setIsRegister(false); // Cambiar a login
        setPassword('');
      } else {
        setErrorMsg(res.error || 'Ocurrió un error en el registro');
      }
    } else {
      // Inicio de Sesión
      if (!email || !password) {
        setErrorMsg('Por favor completa todos los campos');
        setSubmitting(false);
        return;
      }

      const res = await login(email, password);
      if (res.success) {
        router.push('/perfil');
      } else {
        setErrorMsg(res.error || 'Correo o contraseña incorrectos');
      }
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
      {/* Background glowing blur effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-secondary-container/10 rounded-2xl mb-4 border border-secondary-container/20">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-primary dark:text-white font-h2 mb-2">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido de nuevo'}
            </h2>
            <p className="text-sm text-on-surface-variant/80 dark:text-on-surface-variant">
              {isRegister 
                ? 'Regístrate para solicitar reparaciones rápidas y administrar tus equipos'
                : 'Accede para gestionar tus citas, reparaciones y ver tus dispositivos'
              }
            </p>
          </div>

          {errorMsg && (
            <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-secondary-container/20 border border-secondary/30 text-secondary dark:text-secondary-container rounded-xl p-4 mb-6 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 pl-11 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                      placeholder="Juan Pérez García"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                    Nombre de Usuario (Login)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 pl-11 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                      placeholder="juan_perez"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/40" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 pl-11 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/40" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 pl-11 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 mt-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  {isRegister ? 'Registrarme' : 'Iniciar Sesión'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
            <p className="text-sm text-on-surface-variant">
              {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta aún?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="ml-2 text-secondary font-bold hover:underline cursor-pointer focus:outline-none"
              >
                {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
