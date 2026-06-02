"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, 
  Smartphone, 
  Plus, 
  Check, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import DeviceCard from '@/components/cards/DeviceCard';
import DeviceModal from '@/components/ui/DeviceModal';
import { Device, mockDevices } from '@/mock/devices';

export default function ClienteDashboard() {
  const { user, token, updateProfile } = useAuth();

  // Tabs: 'equipos' | 'perfil'
  const [activeTab, setActiveTab] = useState<'equipos' | 'perfil'>('equipos');

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

  // Sync profile values
  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setLogin(user.login);
    }
  }, [user]);

  // Load user devices (Mock)
  const fetchDevices = async () => {
    setDevicesLoading(true);
    // Simular retraso de red
    setTimeout(() => {
      // Si no hay dispositivos en el estado local, cargamos los mocks
      if (devices.length === 0) {
        setDevices(mockDevices);
      }
      setDevicesLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

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

    // Simular retraso de red
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

    // Simular retraso
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-primary dark:text-white font-h1 font-bold">Panel Personal</h1>
        <p className="text-sm text-on-surface-variant">Bienvenido de nuevo, {user?.nombre}. Registra y gestiona tus equipos de soporte.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-4 border-b border-outline-variant/20 pb-1">
        <button
          onClick={() => setActiveTab('equipos')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-sm ${
            activeTab === 'equipos'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mis Dispositivos
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 pb-3 font-bold border-b-2 transition-all cursor-pointer text-sm ${
            activeTab === 'perfil'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-primary dark:hover:text-white'
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
            
            {/* Table Header Action */}
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

            {/* Grid */}
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
