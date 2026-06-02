'use client';

import { useState, useEffect } from 'react';
import { CustomerDevice } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { mockDevices } from '@/mock/devices';

export type PortalTab = 'Devices' | 'Purchases' | 'Repairs';

export interface NewDeviceForm {
  brand: string;
  model: string;
  specs: string;
  serialNumber: string;
  purchaseDate: string;
  status: 'Active Warranty' | 'Out of Warranty';
}

const EMPTY_DEVICE_FORM: NewDeviceForm = {
  brand: '',
  model: '',
  specs: '',
  serialNumber: '',
  purchaseDate: '',
  status: 'Active Warranty',
};

const MAC_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7SCbXC7X9DTJc09AiI7-DOk0euMyGnDeLG3HTa8SilNBSfEITuoAYyqh5IvRGTip2E0nzmyru26nyt3ama8q8zpoSpg3osrZAgUxKaNqLknD7DkJLXkNBBJr-KA5mqzbGBvwqQiK1DwI71h07mTxdOULcUU6MnCNlYH7ybDJwcrgukoIDeYfTHwA2s0a9CILgIGKPMn476RF7vtvTf-AWVEgNBtAAOGe8xxCuQid8HWcCNxqsWil4xAv8lmHMW-PVJj0JPrSca9_';
const OTHER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJbsxZYM-Q-iUazYn9janOEsVbVQXh0ImXh5rkHiCmzn9pmIe2t25MpF_3XHAQYh8Xf_XFK890Ab_iMSUCyXBrKFJMWp03mu1GI_uaK6EMrK0vSFm3CDaLvPlam61lX5jYM2q-RAci9J70cr_DDYJM0AQHgQxRrh2ObbiMhm3am_szZ7Og4fIbv0Vh_SN7HfIbIckxLrqnr36bYkFzdJeVJryoFEkotuig18bqE60k71HdZt0lnXLM13MxT5YAUBQOp6I-uvyXeAy';

export interface UseCustomerPortalReturn {
  devices: CustomerDevice[];
  activeTab: PortalTab;
  isModalOpen: boolean;
  isSubmitting: boolean;
  newDevice: NewDeviceForm;
  setActiveTab: (tab: PortalTab) => void;
  setIsModalOpen: (open: boolean) => void;
  setNewDevice: React.Dispatch<React.SetStateAction<NewDeviceForm>>;
  handleRegisterDevice: (e: React.FormEvent) => void;
}

export function useCustomerPortal(): UseCustomerPortalReturn {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<CustomerDevice[]>([]);
  const [activeTab, setActiveTab] = useState<PortalTab>('Devices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDevice, setNewDevice] = useState<NewDeviceForm>(EMPTY_DEVICE_FORM);

  // Cargar dispositivos mock
  useEffect(() => {
    if (isAuthenticated) {
      setDevices(mockDevices);
    }
  }, [isAuthenticated]);

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.brand || !newDevice.model || !newDevice.serialNumber) return;

    setIsSubmitting(true);

    // Simular envío al servidor
    setTimeout(() => {
      const newDeviceData: CustomerDevice = {
        id: Math.random().toString(36).substr(2, 9),
        brand: newDevice.brand,
        model: newDevice.model,
        specs: newDevice.specs,
        serialNumber: newDevice.serialNumber,
        purchaseDate: newDevice.purchaseDate,
        status: newDevice.status,
        inService: false,
        image: newDevice.brand.toLowerCase() === 'apple' ? MAC_IMAGE : OTHER_IMAGE,
      };

      setDevices((prev) => [...prev, newDeviceData]);
      setIsModalOpen(false);
      setNewDevice(EMPTY_DEVICE_FORM);
      setIsSubmitting(false);
    }, 500);
  };

  return {
    devices,
    activeTab,
    isModalOpen,
    isSubmitting,
    newDevice,
    setActiveTab,
    setIsModalOpen,
    setNewDevice,
    handleRegisterDevice,
  };
}
