'use client';

import React, { useEffect } from 'react';
import ClienteSidebar from '@/components/layout/ClienteSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'cliente')) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <p className="text-sm font-semibold">Verificando credenciales...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'cliente') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <p className="text-sm font-semibold text-red-500">Acceso denegado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-background transition-colors duration-300">
      <ClienteSidebar />
      <main className="ml-64 min-h-screen">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
