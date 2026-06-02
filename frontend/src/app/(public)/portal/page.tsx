'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Plus, Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useCustomerPortal } from '@/hooks/useCustomerPortal';
import { useAuth } from '@/context/AuthContext';
import PortalSidebar from '@/components/portal/PortalSidebar';
import DevicesTab from '@/components/portal/DevicesTab';
import RegisterDeviceModal from '@/components/portal/RegisterDeviceModal';
import AuthForm from '@/components/portal/AuthForm';

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
  const { isAuthenticated, loading } = useAuth();
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
    return <AuthForm />;
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
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center py-12">
                <div className="p-4 bg-primary/5 dark:bg-sky-500/5 rounded-full inline-block mb-3 border border-outline-variant/10">
                  <ShieldCheck className="w-8 h-8 text-primary dark:text-sky-400" />
                </div>
                <h3 className="font-bold text-base text-on-surface dark:text-white">Historial de Pedidos</h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Tu historial de compras de repuestos OEM y componentes de hardware. Actualmente no registras pedidos.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Repairs' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-surface dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 border-b border-outline-variant/20 dark:border-slate-800 pb-4 mb-4">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface dark:text-white">
                    Servicio Activo: #TKT-1002
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-on-surface-variant dark:text-slate-500 block mb-0.5 uppercase tracking-wider text-[9px] font-bold">DISPOSITIVO</span>
                      <span className="font-bold text-on-surface dark:text-slate-200">iPhone 14 Pro</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant dark:text-slate-500 block mb-0.5 uppercase tracking-wider text-[9px] font-bold">ETAPA</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">En Diagnóstico</span>
                    </div>
                  </div>
                  <div className="bg-surface dark:bg-slate-950 p-4 rounded border border-outline-variant/10 dark:border-slate-850 flex flex-col gap-2 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-primary dark:text-sky-400 font-bold uppercase tracking-widest text-[9px]">REPORTE DE DIAGNÓSTICO DE LABORATORIO</span>
                      <p className="text-on-surface-variant dark:text-slate-400 leading-normal">
                        El dispositivo ha sido ingresado exitosamente a nuestros bancos de diagnóstico. Los ingenieros de hardware están revisando los flex del display y el módulo táctil.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/20 dark:border-slate-800 mt-1 flex justify-between items-center">
                      <Link
                        href="/reparaciones/seguimiento?ticket=TFX-8924-M&brand=Apple&device=iPhone 14 Pro&specs=256GB&serial=F18L3J8K0W2Q"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-sky-400 hover:underline uppercase tracking-wider"
                      >
                        Monitorear en Tiempo Real <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
