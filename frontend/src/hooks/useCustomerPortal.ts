'use client';

import { useState, useEffect, useCallback } from 'react';
import { ICustomerDevice } from '@/interfaces/domain';
import { useAuth } from '@/context/AuthContext';
import { getCustomerDevicesList } from '@/actions';

export type PortalTab = 'Devices' | 'Purchases' | 'Repairs';

export interface NewDeviceForm {
  brand: string;
  model: string;
  specs: string;
  serialNumber: string;
  purchaseDate: string;
  status: 'Active Warranty' | 'Out of Warranty';
}

const EMPTY_DEVICE_FORM: NewDeviceForm = { brand: '', model: '', specs: '', serialNumber: '', purchaseDate: '', status: 'Active Warranty' };

export function useCustomerPortal() {
  const { token, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<ICustomerDevice[]>([]);
  const [activeTab, setActiveTab] = useState<PortalTab>('Devices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDevice, setNewDevice] = useState<NewDeviceForm>(EMPTY_DEVICE_FORM);

  const fetchDevices = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getCustomerDevicesList(token);
      setDevices(data as unknown as ICustomerDevice[]);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) fetchDevices();
  }, [isAuthenticated, fetchDevices]);

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Dispositivo registrado profesionalmente!');
      setIsModalOpen(false);
      setIsSubmitting(false);
      setNewDevice(EMPTY_DEVICE_FORM);
    }, 600);
  };

  return {
    devices, activeTab, isModalOpen, isSubmitting, newDevice,
    setActiveTab, setIsModalOpen, setNewDevice, handleRegisterDevice,
  };
}
