'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useCustomerPortal } from '@/hooks/useCustomerPortal';
import { useAuth } from '@/context/AuthContext';
import PortalSidebar from '@/components/portal/PortalSidebar';
import DevicesTab from '@/components/portal/DevicesTab';
import RegisterDeviceModal from '@/components/portal/RegisterDeviceModal';
import RepairsTab from '@/components/portal/RepairsTab';
import PurchasesTab from '@/components/portal/PurchasesTab';

const TAB_LABELS: Record<string, string> = {
  Devices: 'Equipos Registrados',
  Purchases: 'Mis Compras',
  Repairs: 'Mis Reparaciones',
};

const TAB_DESCRIPTIONS: Record<string, string> = {
  Devices: 'Monitorea y administra tus dispositivos de hardware. Selecciona un equipo para solicitar asistencia técnica o ver su historial de servicio.',
  Purchases: 'Realiza el seguimiento de tus pedidos de componentes o repuestos OEM de alto rendimiento.',
  Repairs: 'Revisa en tiempo real el estado de tus equipos bajo calibración, mantenimiento o microsoldadura en nuestros laboratorios.',
};

export default function CustomerPortal() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const {
    devices,
    activeTab,
    isModalOpen,
    isSubmitting,
    newDevice,
    setActiveTab,
    setIsModalOpen,
    setNewDevice,
    handleRegisterDevice,
  } = useCustomerPortal();

  // Redirección automática si el usuario es Admin o Técnico
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.rol?.toLowerCase();
      if (userRole === 'admin' || userRole === 'tecnico' || userRole === 'técnico') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  // Leer tab desde query param en la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'Devices' || tabParam === 'Purchases' || tabParam === 'Repairs') {
        setActiveTab(tabParam);
      }
    }
  }, [setActiveTab]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-background dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary dark:border-sky-500 border-t-transparent rounded-full animate-spin text-primary dark:text-sky-500" />
          <p className="text-xs text-on-surface-variant dark:text-slate-400 font-semibold animate-pulse">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  return (
    <div className="bg-background dark:bg-slate-950 min-h-[calc(100vh-72px)] flex font-body-md antialiased transition-colors duration-300">

      {/* Sidebar */}
      <PortalSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Área principal */}
      <main className="flex-grow overflow-y-auto bg-surface-bright dark:bg-slate-950 flex flex-col relative transition-colors">

        {/* Header de sección */}
        <header className="px-6 md:px-8 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/35 dark:border-slate-850 bg-surface/90 dark:bg-slate-950/90 sticky top-0 z-10 backdrop-blur-md transition-colors">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface dark:text-white tracking-tight">
              {TAB_LABELS[activeTab]}
            </h1>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
              {TAB_DESCRIPTIONS[activeTab]}
            </p>
          </div>

          {activeTab === 'Devices' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Dispositivo
            </button>
          )}
        </header>

        {/* Contenido de tabs */}
        <div className="px-6 md:px-8 py-6 flex-1">

          {activeTab === 'Devices' && (
            <DevicesTab devices={devices} onAddDevice={() => setIsModalOpen(true)} />
          )}

          {activeTab === 'Purchases' && (
            <PurchasesTab />
          )}

          {activeTab === 'Repairs' && (
            <RepairsTab />
          )}

        </div>
      </main>

      {/* Modal de registro de dispositivo */}
      <RegisterDeviceModal
        isOpen={isModalOpen}
        newDevice={newDevice}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onChange={setNewDevice}
        onSubmit={handleRegisterDevice}
      />

    </div>
  );
}
