'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { scheduleRepairAction } from '@/actions';

export default function AuthPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { isAuthenticated, loading, user, token, login, register, error, setError } = useAuth();
  const { items: cartItems } = useCart();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [documentType, setDocumentType] = useState('DNI');
  const [documentId, setDocumentId] = useState('');
  const [teléfono, setTeléfono] = useState('');
  const [dirección, setDirección] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated && user && token) {
      const processPendingRepair = async () => {
        const pendingRepair = localStorage.getItem('techfix_pending_repair');
        if (pendingRepair && user.role === 'cliente') {
          try {
            const repairData = JSON.parse(pendingRepair);
            await scheduleRepairAction(token, repairData);
            localStorage.removeItem('techfix_pending_repair');
          } catch (repairError) {
            console.error('Error scheduling pending repair:', repairError);
          }
        }
      };

      processPendingRepair();

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'tecnico') {
          router.push('/tecnico/dashboard');
        } else {
          router.push('/cliente/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, user, token, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    if (isLoginTab) {
      if (!email || !password) {
        setValidationError('Por favor completa todos los campos requeridos.');
        return;
      }
      if (password.length < 6) {
        setValidationError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    } else {
      if (!nombre || !email || !password || !teléfono || !documentId || !dirección || !ciudad) {
        setValidationError('Por favor completa todos los campos requeridos.');
        return;
      }
      if (password.length < 6) {
        setValidationError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(nombre, email, password);
      }
    } catch (e: any) {
      // Error is handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (isLogin: boolean) => {
    setIsLoginTab(isLogin);
    setError(null);
    setValidationError(null);
    
    setEmail('');
    setPassword('');
    setNombre('');
    setDocumentType('DNI');
    setDocumentId('');
    setTeléfono('');
    setDirección('');
    setCiudad('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto space-y-7">
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

      <div className="bg-surface dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-1.5 rounded-xl flex gap-1 shadow-sm">
        <button
          onClick={() => handleTabChange(true)}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            isLoginTab
              ? 'bg-primary dark:bg-sky-600 text-on-primary dark:text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-slate-850'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => handleTabChange(false)}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            !isLoginTab
              ? 'bg-primary dark:bg-sky-600 text-on-primary dark:text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-slate-850'
          }`}
        >
          Registrarse
        </button>
      </div>

      {(validationError || error) && (
        <div className="p-3 bg-error-container/10 dark:bg-red-950/20 border border-error-container/30 dark:border-red-900/30 text-error-container dark:text-red-400 rounded-lg text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-normal">{validationError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginTab && (
          <>
            <Input
              label="Nombre Completo"
              placeholder="Ej: Carlos García"
              icon={User}
              iconPosition="left"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tipo de Documento</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUT">RUT</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <Input
                label="Número de Documento"
                placeholder="12345678"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                required
              />
            </div>

            <Input
              label="Teléfono"
              type="tel"
              placeholder="+51 999 888 777"
              value={teléfono}
              onChange={(e) => setTeléfono(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Dirección"
                placeholder="Av. Principal 123"
                value={dirección}
                onChange={(e) => setDirección(e.target.value)}
                required
              />
              <Input
                label="Ciudad"
                placeholder="Lima"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="Ej: carlos@example.com"
          icon={Mail}
          iconPosition="left"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          iconPosition="left"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full rounded-xl py-3.5 mt-4"
        >
          {isLoginTab ? 'Iniciar Sesión' : 'Registrar Cuenta'}
        </Button>
      </form>
    </div>
  );
}
