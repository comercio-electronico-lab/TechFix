'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface RepairOrder {
  id: string;
  user_id: string;
  device_id: string;
  device?: {
    id: string;
    brand: string;
    model: string;
    serial_number: string;
    specs: string;
    status: string;
  };
  pig_session_id?: string;
  appointment_datetime: string;
  status: string; // pending, in_review, waiting_parts, repairing, ready, delivered, canceled
  diagnosis_final?: string;
  final_price?: number;
  notes?: string;
  created_at: string;
}

export interface Warranty {
  id: string;
  repair_id: string;
  user_id: string;
  device_id: string;
  device?: {
    brand: string;
    model: string;
    serial_number: string;
  };
  repair_order?: RepairOrder;
  warranty_days: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  warranty_token: string;
}

export interface ScheduleRepairInput {
  device_id: string;
  pig_session_id?: string;
  appointment_datetime: string;
  notes?: string;
}

export function useRepairs() {
  const { token, isAuthenticated } = useAuth();
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchRepairsAndWarranties = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setRepairs([]);
      setWarranties([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch repairs
      const repairsRes = await fetch(`${API_URL}/api/repairs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch warranties
      const warrantiesRes = await fetch(`${API_URL}/api/warranties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (repairsRes.ok && warrantiesRes.ok) {
        const repairsData = await repairsRes.json();
        const warrantiesData = await warrantiesRes.json();
        setRepairs(repairsData || []);
        setWarranties(warrantiesData || []);
      } else {
        setError('Error al recuperar tus reparaciones o certificados.');
      }
    } catch (e) {
      console.error(e);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, isAuthenticated]);

  useEffect(() => {
    fetchRepairsAndWarranties();
  }, [fetchRepairsAndWarranties]);

  const scheduleRepair = async (input: ScheduleRepairInput): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!token) return { success: false, error: 'No autenticado' };

    try {
      const res = await fetch(`${API_URL}/api/repairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchRepairsAndWarranties(); // Recargar datos
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Error al agendar la reparación' };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  };

  return {
    repairs,
    warranties,
    loading,
    error,
    refetch: fetchRepairsAndWarranties,
    scheduleRepair,
  };
}
