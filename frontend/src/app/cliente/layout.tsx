"use client";

import React from 'react';
import ClienteSidebar from '@/components/layout/ClienteSidebar';
import ClienteNavbar from '@/components/layout/ClienteNavbar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.rol !== "Cliente") {
        router.push("/login");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || user?.rol !== "Cliente") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-background transition-colors duration-300">
      <ClienteNavbar />
      <ClienteSidebar />
      <main className="ml-64 pt-18 min-h-screen">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
