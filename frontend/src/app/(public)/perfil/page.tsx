"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, 
  Smartphone, 
  Plus, 
  LogOut, 
  Check, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import DeviceCard from '@/components/cards/DeviceCard';
import DeviceModal from '@/components/ui/DeviceModal';

interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  device_type: string;
  purchase_date: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const { user, token, logout, updateProfile, isAuthenticated, loading } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Tabs: 'perfil' | 'equipos'
  const [activeTab, setActiveTab] = useState<'perfil' | 'equipos'>('equipos');

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

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Sincronizar campos de perfil
  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setLogin(user.login);
    }
  }, [user]);

  // Cargar dispositivos del backend
  const fetchDevices = async () => {
    if (!token) return;
    setDevicesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/devices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDevices(data || []);
      }
    } catch (e) {
      console.error("Error loading devices", e);
    }
    setDevicesLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDevices();
    }
  }, [isAuthenticated, token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileSubmitting(true);

    const res = await updateProfile(nombre, login);
    if (res.success) {
      setProfileSuccess('Perfil actualizado con éxito');
    } else {
      setProfileError(res.error || 'Error al actualizar perfil');
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

    const payload = {
      brand: formData.brand,
      model: formData.model,
      serial_number: formData.serial_number,
      device_type: formData.device_type,
      purchase_date: formData.purchase_date || undefined
    };

    try {
      let res;
      if (editingDevice) {
        // Actualizar
        res = await fetch(`${API_URL}/api/user/devices/${editingDevice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Registrar
        res = await fetch(`${API_URL}/api/user/devices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setDeviceError(data.error || 'Error al registrar el dispositivo');
      } else {
        setShowModal(false);
        fetchDevices(); // Recargar lista
      }
    } catch (e) {
      setDeviceError('Error al conectar con la API');
    }
    setDeviceSubmitting(false);
  };

  const handleDeleteDevice = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) return;

    try {
      const res = await fetch(`${API_URL}/api/user/devices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDevices();
      } else {
        alert('No se pudo eliminar el equipo');
      }
    } catch (e) {
      console.error("Error deleting device", e);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-16 bg-background relative overflow-hidden">
      {/* Background glowing blur effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-outline-variant/10 pb-8">
          <div>
            <span className="text-xs font-bold bg-secondary-container/10 text-secondary border border-secondary-container/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Portal del Cliente
            </span>
            <h1 className="text-primary dark:text-white mt-3 mb-1 font-h1 font-bold">
              Hola, {user?.nombre}
            </h1>
            <p className="text-on-surface-variant text-sm">
              Administra tus equipos registrados y edita tus datos de acceso.
            </p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-5 py-3 border border-error/20 hover:border-error text-error hover:bg-error-container/10 font-bold rounded-xl transition-all cursor-pointer text-sm"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        {/* Layout de Pestañas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter items-start">
          
          {/* Menú Lateral */}
          <div className="lg:col-span-1 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('equipos')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left cursor-pointer text-sm ${
                activeTab === 'equipos'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Mis Equipos
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left cursor-pointer text-sm ${
                activeTab === 'perfil'
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Mi Información
            </button>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            
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
                
                {/* Cabecera Pestaña */}
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

                {/* Grid de Dispositivos */}
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
        </div>
      </div>

      {/* Modal CRUD de Dispositivos */}
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
