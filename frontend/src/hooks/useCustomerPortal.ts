'use client';

import { useState, useEffect } from 'react';
import { CustomerDevice } from '@/types';
import { useAuth } from '@/context/AuthContext';

const AVATAR_URLS = {
  mac: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7SCbXC7X9DTJc09AiI7-DOk0euMyGnDeLG3HTa8SilNBSfEITuoAYyqh5IvRGTip2E0nzmyru26nyt3ama8q8zpoSpg3osrZAgUxKaNqLknD7DkJLXkNBBJr-KA5mqzbGBvwqQiK1DwI71h07mTxdOULcUU6MnCNlYH7ybDJwcrgukoIDeYfTHwA2s0a9CILgIGKPMn476RF7vtvTf-AWVEgNBtAAOGe8xxCuQid8HWcCNxqsWil4xAv8lmHMW-PVJj0JPrSca9_',
  other: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJbsxZYM-Q-iUazYn9janOEsVbVQXh0ImXh5rkHiCmzn9pmIe2t25MpF_3XHAQYh8Xf_XFK890Ab_iMSUCyXBrKFJMWp03mu1GI_uaK6EMrK0vSFm3CDaLvPlam61lX5jYM2q-RAci9J70cr_DDYJM0AQHgQxRrh2ObbiMhm3am_szZ7Og4fIbv0Vh_SN7HfIbIckxLrqnr36bYkFzdJeVJryoFEkotuig18bqE60k71HdZt0lnXLM13MxT5YAUBQOp6I-uvyXeAy',
};

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
  const { token, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<CustomerDevice[]>([]);
  const [activeTab, setActiveTab] = useState<PortalTab>('Devices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDevice, setNewDevice] = useState<NewDeviceForm>(EMPTY_DEVICE_FORM);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Cargar dispositivos del backend
  useEffect(() => {
    async function fetchDevices() {
      if (!isAuthenticated || !token) {
        setDevices([]);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((d: any) => ({
            id: d.id,
            brand: d.brand,
            model: d.model,
            specs: d.specs || 'N/A',
            serialNumber: d.serial_number,
            purchaseDate: d.purchase_date
              ? new Date(d.purchase_date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A',
            status: d.status || 'Active Warranty',
            inService: d.in_service || false,
            image:
              d.model.toLowerCase().includes('mac') || d.brand.toLowerCase() === 'apple'
                ? AVATAR_URLS.mac
                : AVATAR_URLS.other,
          }));
          setDevices(mapped);
        }
      } catch (e) {
        console.error('Error al cargar dispositivos del servidor:', e);
      }
    }
    fetchDevices();
  }, [token, isAuthenticated, API_URL]);

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.brand || !newDevice.model || !newDevice.serialNumber || !token) return;

    setIsSubmitting(true);

    try {
      // Intentar convertir la fecha de compra a formato YYYY-MM-DD
      let formattedDate = new Date().toISOString().split('T')[0];
      if (newDevice.purchaseDate) {
        const parsed = Date.parse(newDevice.purchaseDate);
        if (!isNaN(parsed)) {
          formattedDate = new Date(parsed).toISOString().split('T')[0];
        }
      }

      const res = await fetch(`${API_URL}/api/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand: newDevice.brand,
          model: newDevice.model,
          specs: newDevice.specs || 'N/A',
          serial_number: newDevice.serialNumber.toUpperCase(),
          purchase_date: formattedDate,
          status: newDevice.status,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        const mapped: CustomerDevice = {
          id: d.id,
          brand: d.brand,
          model: d.model,
          specs: d.specs || 'N/A',
          serialNumber: d.serial_number,
          purchaseDate: d.purchase_date
            ? new Date(d.purchase_date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A',
          status: d.status || 'Active Warranty',
          inService: d.in_service || false,
          image:
            d.model.toLowerCase().includes('mac') || d.brand.toLowerCase() === 'apple'
              ? AVATAR_URLS.mac
              : AVATAR_URLS.other,
        };

        setDevices((prev) => [...prev, mapped]);
        setIsModalOpen(false);
        setNewDevice(EMPTY_DEVICE_FORM);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error al registrar el dispositivo.');
      }
    } catch (error) {
      console.error('Error al registrar dispositivo:', error);
      alert('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
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
