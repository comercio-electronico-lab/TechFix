"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DeviceModal from '@/components/ui/DeviceModal';
import { Device, mockDevices } from '@/mock/devices';
import {
  getClientRepairsAction,
  getClientWarrantiesAction,
  scheduleRepairAction
} from '@/actions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DevicesSection from '@/components/dashboard/DevicesSection';
import RepairsSection from '@/components/dashboard/RepairsSection';
import PurchasesSection from '@/components/dashboard/PurchasesSection';
import WarrantiesSection from '@/components/dashboard/WarrantiesSection';
import ProfileSection from '@/components/dashboard/ProfileSection';

export default function ClienteDashboardClient() {
  const { user, token, updateProfile } = useAuth();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section') as 'dispositivos' | 'reparaciones' | 'compras' | 'garantias' | 'informacion' | null;

  const getTabFromSection = (section: string | null): 'equipos' | 'reparaciones' | 'compras' | 'garantias' | 'perfil' => {
    switch (section) {
      case 'dispositivos': return 'equipos';
      case 'reparaciones': return 'reparaciones';
      case 'compras': return 'compras';
      case 'garantias': return 'garantias';
      case 'informacion': return 'perfil';
      default: return 'equipos';
    }
  };

  const [activeTab, setActiveTab] = useState<'equipos' | 'reparaciones' | 'compras' | 'garantias' | 'perfil'>(
    getTabFromSection(sectionParam)
  );

  const [nombre, setNombre] = useState('');
  const [teléfono, setTeléfono] = useState('');
  const [dirección, setDirección] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deviceSubmitting, setDeviceSubmitting] = useState(false);

  const [repairs, setRepairs] = useState<any[]>([]);
  const [repairsLoading, setRepairsLoading] = useState(false);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [warrantiesLoading, setWarrantiesLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    if (sectionParam) {
      setActiveTab(getTabFromSection(sectionParam));
    }
  }, [sectionParam]);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setTeléfono(user.teléfono || '');
      setDirección(user.dirección || '');
      setCiudad(user.ciudad || '');
      setDocumentId(user.documentId || '');
    }
  }, [user]);

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

    const res = await updateProfile(nombre);
    if (res.success) {
      setProfileSuccess('Perfil actualizado con éxito');
    } else {
      setProfileError(res.error || 'Error al actualizar el perfil');
    }
    setProfileSubmitting(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    switch (field) {
      case 'nombre':
        setNombre(value);
        break;
      case 'teléfono':
        setTeléfono(value);
        break;
      case 'dirección':
        setDirección(value);
        break;
      case 'ciudad':
        setCiudad(value);
        break;
      case 'documentId':
        setDocumentId(value);
        break;
    }
  };

  const handleOpenCreateModal = () => {
    setEditingDevice(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (device: Device) => {
    setEditingDevice(device);
    setShowModal(true);
  };

  const handleSaveDevice = async (formData: {
    brand: string;
    model: string;
    serial_number: string;
    device_type: string;
    purchase_date: string;
  }) => {
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

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        userName={user?.nombre || ''}
        deviceCount={devices.length}
        activeRepairsCount={repairs.filter(r => r.status !== 'delivered').length}
        warrantiesCount={warranties.length}
      />

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'equipos' && (
          <DevicesSection
            devices={devices}
            loading={devicesLoading}
            onCreateClick={handleOpenCreateModal}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleDeleteDevice}
          />
        )}

        {activeTab === 'reparaciones' && (
          <RepairsSection repairs={repairs} loading={repairsLoading} />
        )}

        {activeTab === 'compras' && (
          <PurchasesSection lastOrder={lastOrder} />
        )}

        {activeTab === 'garantias' && (
          <WarrantiesSection warranties={warranties} loading={warrantiesLoading} />
        )}

        {activeTab === 'perfil' && (
          <ProfileSection
            nombre={nombre}
            teléfono={teléfono}
            dirección={dirección}
            ciudad={ciudad}
            documentId={documentId}
            email={user?.email || ''}
            success={profileSuccess}
            error={profileError}
            submitting={profileSubmitting}
            onChange={handleProfileChange}
            onSubmit={handleUpdateProfile}
          />
        )}
      </div>

      <DeviceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveDevice}
        editingDevice={editingDevice}
        error=""
        isLoading={deviceSubmitting}
      />
    </div>
  );
}
