"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, 
  Smartphone, 
  Plus, 
  Check, 
  AlertTriangle,
  FolderOpen,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import DeviceCard from '@/components/cards/DeviceCard';
import DeviceModal from '@/components/ui/DeviceModal';
import { Device, mockDevices } from '@/mock/devices';
import { 
  getClientRepairsAction, 
  getClientWarrantiesAction, 
  scheduleRepairAction 
} from '@/app/actions';
import RepairTimeline, { TimelineStep } from '@/components/repair/RepairTimeline';
import WarrantyCertificateCard from '@/components/repair/WarrantyCertificateCard';
import Link from 'next/link';

export default function ClienteDashboard() {
  const { user, token, updateProfile } = useAuth();

  // Tabs: 'equipos' | 'reparaciones' | 'compras' | 'garantias' | 'perfil'
  const [activeTab, setActiveTab] = useState<'equipos' | 'reparaciones' | 'compras' | 'garantias' | 'perfil'>('equipos');

  // Perfil state
  const [nombre, setNombre] = useState('');
  const [login, setLogin] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Devices CRUD state
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deviceError, setDeviceError] = useState('');
  const [deviceSubmitting, setDeviceSubmitting] = useState(false);

  // Dynamic States
  const [repairs, setRepairs] = useState<any[]>([]);
  const [repairsLoading, setRepairsLoading] = useState(false);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [warrantiesLoading, setWarrantiesLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  // Sync profile values & process pending repairs
  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setLogin(user.login);
    }
  }, [user]);

  // Procesa reservas pendientes de diagnóstico e inicializa carga
  useEffect(() => {
    const checkPendingRepair = async () => {
      if (!token) return;
      
      const pendingRepair = localStorage.getItem('techfix_pending_repair');
      if (pendingRepair) {
        try {
          const parsed = JSON.parse(pendingRepair);
          await scheduleRepairAction(token, parsed);
          alert('¡Tu pre-diagnóstico pendiente ha sido reservado y agendado automáticamente en nuestro taller con tus datos de cliente!');
          localStorage.removeItem('techfix_pending_repair');
          // Cambiar a la pestaña de reparaciones para ver el ticket
          setActiveTab('reparaciones');
        } catch (e) {
          console.error("Error al procesar reserva automática:", e);
        }
      }
    };

    checkPendingRepair();
    fetchDevices();
    loadLastOrder();
  }, [token]);

  // Trigger data loading depending on active tab
  useEffect(() => {
    if (activeTab === 'reparaciones') {
      fetchRepairs();
    } else if (activeTab === 'garantias') {
      fetchWarranties();
    }
  }, [activeTab, token]);

  const loadLastOrder = () => {
    const savedOrder = localStorage.getItem('techfix_last_order');
    if (savedOrder) {
      try {
        setLastOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Load user devices (Mock)
  const fetchDevices = async () => {
    setDevicesLoading(true);
    setTimeout(() => {
      if (devices.length === 0) {
        setDevices(mockDevices);
      }
      setDevicesLoading(false);
    }, 600);
  };

  const fetchRepairs = async () => {
    if (!token) return;
    setRepairsLoading(true);
    try {
      const data = await getClientRepairsAction(token);
      setRepairs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRepairsLoading(false);
    }
  };

  const fetchWarranties = async () => {
    if (!token) return;
    setWarrantiesLoading(true);
    try {
      const data = await getClientWarrantiesAction(token);
      setWarranties(data);
    } catch (e) {
      console.error(e);
    } finally {
      setWarrantiesLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileSubmitting(true);

    const res = await updateProfile(nombre, login);
    if (res.success) {
      setProfileSuccess('Perfil actualizado con éxito');
    } else {
      setProfileError(res.error || 'Error al actualizar el perfil');
    }
    setProfileSubmitting(false);
  };

  const handleOpenCreateModal = () => {
    setEditingDevice(null);
    setDeviceError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (device: Device) => {
    setEditingDevice(device);
    setDeviceError('');
    setShowModal(true);
  };

  const handleSaveDevice = async (formData: {
    brand: string;
    model: string;
    serial_number: string;
    device_type: string;
    purchase_date: string;
  }) => {
    setDeviceError('');
    setDeviceSubmitting(true);

    setTimeout(() => {
      if (editingDevice) {
        setDevices(prev => prev.map(d => d.id === editingDevice.id ? { ...d, ...formData } : d));
      } else {
        const newDevice: Device = {
          id: `DEV-00${devices.length + 1}`,
          ...formData
        };
        setDevices(prev => [...prev, newDevice]);
      }
      setShowModal(false);
      setDeviceSubmitting(false);
    }, 600);
  };

  const handleDeleteDevice = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) return;
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  // Mapeador de estados para el timeline de Geek Squad
  const getTimelineSteps = (status: string, notes: string, date: string): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      { id: 1, title: 'Orden Recibida', description: 'El pre-diagnóstico ha sido recibido y el dispositivo está en cola para inspección.', status: 'completed', date },
      { id: 2, title: 'En Revisión y Diagnóstico', description: 'Nuestros técnicos están revisando la placa base y probando componentes OEM.', status: 'pending' },
      { id: 3, title: 'Reparaciones en Curso', description: 'Se realiza la microsoldadura o recambio de piezas aprobadas.', status: 'pending' },
      { id: 4, title: 'Listo para Entrega', description: 'El equipo superó las pruebas de rendimiento y está listo para ser recogido.', status: 'pending' },
    ];

    if (status === 'in_review' || status === 'repairing') {
      baseSteps[1].status = 'active';
      baseSteps[1].detailedInfo = notes || 'Se están verificando fallas de corriente y componentes de energía.';
    } else if (status === 'waiting_parts') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'active';
      baseSteps[2].detailedInfo = 'Orden pausada temporalmente en espera de componentes de importación.';
    } else if (status === 'ready') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'active';
      baseSteps[3].detailedInfo = 'Reparación completada con éxito. Se iniciaron pruebas de calibración y estrés de 24 horas.';
    } else if (status === 'delivered') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'completed';
    }

    return baseSteps;
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-primary dark:text-white font-h1 font-bold">Panel Personal</h1>
        <p className="text-sm text-on-surface-variant">Bienvenido de nuevo, {user?.nombre}. Administra tus equipos, monitorea reparaciones y consulta tus garantías.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b border-outline-variant/20 pb-1">
        <button
          onClick={() => setActiveTab('equipos')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
            activeTab === 'equipos' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mis Dispositivos
        </button>
        <button
          onClick={() => setActiveTab('reparaciones')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
            activeTab === 'reparaciones' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Mis Reparaciones
        </button>
        <button
          onClick={() => setActiveTab('compras')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
            activeTab === 'compras' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Mis Compras
        </button>
        <button
          onClick={() => setActiveTab('garantias')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
            activeTab === 'garantias' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Garantías
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-xs md:text-sm ${
            activeTab === 'perfil' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Mi Información
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Pestaña: Mi Información */}
        {activeTab === 'perfil' && (
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm">
            <h3 className="text-primary dark:text-white mb-6 font-h3 font-bold">Detalles de Mi Perfil</h3>
            
            {profileSuccess && (
              <div className="bg-secondary-container/20 border border-secondary/30 text-secondary dark:text-secondary-container rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
                <Check className="w-5 h-5 shrink-0" />
                {profileSuccess}
              </div>
            )}
            
            {profileError && (
              <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-slate-900/60 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-outline/10 text-on-surface-variant rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  value={user?.email || ''}
                />
                <span className="text-[11px] text-on-surface-variant/70 mt-1 block">
                  El correo electrónico no puede ser modificado por seguridad.
                </span>
              </div>

              <button
                type="submit"
                disabled={profileSubmitting}
                className="bg-secondary hover:bg-secondary/95 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {profileSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Pestaña: Mis Equipos */}
        {activeTab === 'equipos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm">
              <div>
                <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Mis Dispositivos</h3>
                <p className="text-xs text-on-surface-variant">Registra tus equipos para agilizar tus cotizaciones y reparaciones futuras.</p>
              </div>
              <button 
                onClick={handleOpenCreateModal}
                className="bg-secondary hover:bg-secondary/95 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Registrar Equipo</span>
              </button>
            </div>

            {devicesLoading ? (
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mb-4"></div>
                <p className="text-on-surface-variant font-bold text-sm">Cargando tus equipos...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-16 text-center rounded-2xl flex flex-col items-center justify-center border-dashed border-outline-variant/30">
                <FolderOpen className="w-16 h-16 text-on-surface-variant/40 mb-4 animate-pulse-subtle" />
                <h4 className="text-primary dark:text-white font-bold mb-1">Aún no tienes equipos registrados</h4>
                <p className="text-xs text-on-surface-variant mb-6 max-w-sm">Registra tus laptops, PCs o smartphones para llevar un seguimiento de sus mantenimientos.</p>
                <button 
                  onClick={handleOpenCreateModal}
                  className="bg-secondary hover:bg-secondary/95 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-sm text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Registrar Mi Primer Equipo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {devices.map((device) => (
                  <DeviceCard 
                    key={device.id} 
                    device={device}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteDevice}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pestaña: Mis Reparaciones (Timeline de Taller) */}
        {activeTab === 'reparaciones' && (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm">
              <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Monitoreo de Reparaciones</h3>
              <p className="text-xs text-on-surface-variant">Sigue en tiempo real el progreso de calibración, microsoldadura y recambio de piezas de tus equipos.</p>
            </div>

            {repairsLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : repairs.length === 0 ? (
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-16 text-center rounded-2xl flex flex-col items-center justify-center border-dashed">
                <FolderOpen className="w-14 h-14 text-on-surface-variant/40 mb-3" />
                <h4 className="text-primary dark:text-white font-bold mb-1">No tienes órdenes de reparación activas</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mb-6">Si tu equipo está fallando, completa nuestro pre-diagnóstico interactivo.</p>
                <Link href="/reparaciones" className="bg-secondary hover:bg-secondary/95 text-white px-5 py-3 rounded-xl font-bold text-xs">
                  Iniciar Diagnóstico
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {repairs.map((repair) => {
                  const deviceLabel = repair.device ? `${repair.device.brand} ${repair.device.model}` : 'Dispositivo';
                  const steps = getTimelineSteps(repair.status, repair.diagnosis_final, repair.created_at);
                  
                  return (
                    <div key={repair.id} className="bg-white/70 dark:bg-slate-900 border border-outline-variant/15 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/10 dark:border-slate-800/80 pb-4 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-secondary dark:text-sky-400 font-mono">ID DE TICKET: {repair.id}</span>
                          <h4 className="text-base font-black text-on-background">{deviceLabel}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Costo Final Estimado</span>
                          <span className="text-sm font-mono font-black text-primary dark:text-sky-400">${(repair.final_price || 0).toFixed(2)} USD</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <RepairTimeline steps={steps} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pestaña: Mis Compras (Historial de Catálogo) */}
        {activeTab === 'compras' && (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm">
              <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Historial de Pedidos</h3>
              <p className="text-xs text-on-surface-variant">Revisa los componentes de hardware y repuestos que has adquirido.</p>
            </div>

            {!lastOrder ? (
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-16 text-center rounded-2xl flex flex-col items-center justify-center border-dashed">
                <ShoppingBag className="w-14 h-14 text-on-surface-variant/40 mb-3" />
                <h4 className="text-primary dark:text-white font-bold mb-1">Aún no tienes compras registradas</h4>
                <p className="text-xs text-on-surface-variant mb-6">Visita nuestro catálogo de hardware premium OEM.</p>
                <Link href="/catalogo" className="bg-secondary hover:bg-secondary/95 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1">
                  Ver Catálogo de Componentes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/15 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-outline-variant/10 dark:border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">COMPRA COMPLETA</span>
                    <h4 className="text-base font-black text-on-background">Pedido #{lastOrder.orderId || 'ORD-9912'}</h4>
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">Fecha: {lastOrder.fecha || new Date().toISOString().split('T')[0]}</span>
                </div>

                <div className="space-y-4">
                  {lastOrder.items && lastOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-on-background">{item.name}</span>
                        <span className="text-on-surface-variant ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-mono text-on-background font-bold">${(item.price * item.quantity).toFixed(2)} USD</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-outline-variant/10 dark:border-slate-800 pt-4 flex justify-between items-center font-bold text-sm">
                    <span className="text-on-surface-variant">Total Pagado:</span>
                    <span className="text-primary dark:text-sky-400 font-mono text-base">${(lastOrder.total || lastOrder.subtotal || 0).toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-800 dark:text-emerald-400">Entrega y Facturación Procesada</p>
                    <p className="text-on-surface-variant mt-0.5">El comprobante fiscal y los certificados de garantía correspondientes han sido emitidos.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pestaña: Mis Garantías */}
        {activeTab === 'garantias' && (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm">
              <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Certificados de Garantía Activos</h3>
              <p className="text-xs text-on-surface-variant">Consulta la cobertura oficial de TechCare asociada a tus equipos reparados u ordenados.</p>
            </div>

            {warrantiesLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : warranties.length === 0 ? (
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-16 text-center rounded-2xl flex flex-col items-center justify-center border-dashed">
                <ShieldCheck className="w-14 h-14 text-on-surface-variant/40 mb-3 animate-pulse" />
                <h4 className="text-primary dark:text-white font-bold mb-1">No hay certificados de garantía activos</h4>
                <p className="text-xs text-on-surface-variant max-w-sm">Los certificados se generan automáticamente al entregar un equipo reparado o adquirir componentes seleccionados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warranties.map((warranty) => {
                  const devLabel = warranty.device ? `${warranty.device.brand} ${warranty.device.model}` : 'Dispositivo';
                  return (
                    <div key={warranty.id} className="space-y-2">
                      <div className="px-1 text-xs font-bold text-on-surface-variant">Equipo: {devLabel} (S/N: {warranty.device?.serial_number})</div>
                      <WarrantyCertificateCard 
                        token={warranty.warranty_token}
                        startDate={warranty.start_date}
                        endDate={warranty.end_date}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <DeviceModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveDevice}
        editingDevice={editingDevice}
        error={deviceError}
        isLoading={deviceSubmitting}
      />
    </div>
  );
}

