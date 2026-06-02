"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.rol === 'Admin') {
        router.push('/admin/dashboard');
      } else if (user.rol === 'Técnico') {
        router.push('/tecnico/dashboard');
      } else {
        router.push('/cliente/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader 
        icon={Sparkles}
        title="Crear Cuenta"
        description="Regístrate para solicitar reparaciones rápidas y administrar tus equipos"
      />

      <RegisterForm />

      <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
        <p className="text-sm text-on-surface-variant">
          ¿Ya tienes una cuenta?
          <Link
            href="/auth/login"
            className="ml-2 text-secondary font-bold hover:underline cursor-pointer focus:outline-none"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
