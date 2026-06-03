'use client';

import React from 'react';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { Icon } from '@/components/ui';

export const LoginView = () => {
  const handleLoginSuccess = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-[var(--color-primary)] rounded-full text-white">
            <Icon name="User" size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-[var(--color-muted)]">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <div className="flex justify-center">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>

        <div className="text-center text-sm">
          <span className="text-[var(--color-muted)]">¿No tienes una cuenta? </span>
          <a href="/auth/register" className="text-[var(--color-primary)] font-semibold hover:underline">
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
};
