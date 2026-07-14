'use client';

import React, { useEffect } from 'react';
import TecnicoSidebar from '@/components/layout/TecnicoSidebar';
import TecnicoNavbar from '@/components/layout/TecnicoNavbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'tecnico')) {
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

  if (!isAuthenticated || user?.role !== 'tecnico') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <p className="text-sm font-semibold text-red-500">Acceso denegado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-background transition-colors duration-300">
      <TecnicoNavbar />
      <TecnicoSidebar />
      <main className="ml-64 pt-[72px] min-h-screen">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
