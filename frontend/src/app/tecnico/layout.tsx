"use client";

import React from 'react';
import TecnicoSidebar from '@/components/layout/TecnicoSidebar';
import TecnicoNavbar from '@/components/layout/TecnicoNavbar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.rol !== "Técnico") {
        router.push("/auth");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || user?.rol !== "Técnico") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-background transition-colors duration-300">
      <TecnicoNavbar />
      <TecnicoSidebar />
      <main className="ml-64 pt-18 min-h-screen">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
