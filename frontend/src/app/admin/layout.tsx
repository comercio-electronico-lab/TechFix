"use client";

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.rol !== "Admin") {
        router.push("/auth");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || user?.rol !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminNavbar />
      <AdminSidebar />
      <main className="ml-64 pt-18 min-h-screen transition-all duration-300">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
        
        {/* Admin Footer Decoration */}
        <footer className="py-8 border-t border-outline-variant/10 mt-stack-lg bg-white/50">
          <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Infraestructura Segura © 2026 TechFix</p>
            </div>
            <div className="flex gap-6 opacity-60">
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Logs de Auditoría</a>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Soporte Técnico</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
