'use client';

import { useState } from 'react';
import { CustomerDevice } from '@/types';

const AVATAR_URLS = {
  mac: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7SCbXC7X9DTJc09AiI7-DOk0euMyGnDeLG3HTa8SilNBSfEITuoAYyqh5IvRGTip2E0nzmyru26nyt3ama8q8zpoSpg3osrZAgUxKaNqLknD7DkJLXkNBBJr-KA5mqzbGBvwqQiK1DwI71h07mTxdOULcUU6MnCNlYH7ybDJwcrgukoIDeYfTHwA2s0a9CILgIGKPMn476RF7vtvTf-AWVEgNBtAAOGe8xxCuQid8HWcCNxqsWil4xAv8lmHMW-PVJj0JPrSca9_',
  other: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJbsxZYM-Q-iUazYn9janOEsVbVQXh0ImXh5rkHiCmzn9pmIe2t25MpF_3XHAQYh8Xf_XFK890Ab_iMSUCyXBrKFJMWp03mu1GI_uaK6EMrK0vSFm3CDaLvPlam61lX5jYM2q-RAci9J70cr_DDYJM0AQHgQxRrh2ObbiMhm3am_szZ7Og4fIbv0Vh_SN7HfIbIckxLrqnr36bYkFzdJeVJryoFEkotuig18bqE60k71HdZt0lnXLM13MxT5YAUBQOp6I-uvyXeAy',
};

const INITIAL_DEVICES: CustomerDevice[] = [
  {
    id: 'dev-1',
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    specs: 'M2 Max',
    serialNumber: 'C02XG543JGH7',
    purchaseDate: 'Oct 12, 2023',
    status: 'Active Warranty',
    image: AVATAR_URLS.mac,
  },
  {
    id: 'dev-2',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    specs: '256GB',
    serialNumber: 'F18L3J8K0W2Q',
    purchaseDate: 'Jan 05, 2023',
    status: 'Out of Warranty',
    inService: true,
    image: AVATAR_URLS.other,
  },
];

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
  const [devices, setDevices] = useState<CustomerDevice[]>(INITIAL_DEVICES);
  const [activeTab, setActiveTab] = useState<PortalTab>('Devices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDevice, setNewDevice] = useState<NewDeviceForm>(EMPTY_DEVICE_FORM);

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.brand || !newDevice.model || !newDevice.serialNumber) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const isMac =
        newDevice.model.toLowerCase().includes('mac') ||
        newDevice.brand.toLowerCase() === 'apple';

      const device: CustomerDevice = {
        id: `dev-${devices.length + 1}`,
        brand: newDevice.brand,
        model: newDevice.model,
        specs: newDevice.specs || 'N/A',
        serialNumber: newDevice.serialNumber.toUpperCase(),
        purchaseDate: newDevice.purchaseDate || 'Just now',
        status: newDevice.status,
        image: isMac ? AVATAR_URLS.mac : AVATAR_URLS.other,
      };

      setDevices(prev => [...prev, device]);
      setIsModalOpen(false);
      setNewDevice(EMPTY_DEVICE_FORM);
    }, 1200);
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
