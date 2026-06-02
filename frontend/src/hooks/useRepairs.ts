'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClientRepairsAction, getClientWarrantiesAction, scheduleRepairAction } from '@/app/actions';

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

  const fetchRepairsAndWarranties = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setRepairs([]);
      setWarranties([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch repairs via Server Action
      const repairsData = await getClientRepairsAction(token);
      // Fetch warranties via Server Action
      const warrantiesData = await getClientWarrantiesAction(token);

      setRepairs(repairsData || []);
      setWarranties(warrantiesData || []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error al recuperar tus reparaciones o certificados.');
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchRepairsAndWarranties();
  }, [fetchRepairsAndWarranties]);

  const scheduleRepair = async (input: ScheduleRepairInput): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!token) return { success: false, error: 'No autenticado' };

    try {
      const data = await scheduleRepairAction(token, input);
      await fetchRepairsAndWarranties(); // Recargar datos
      return { success: true, data };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Error al agendar la reparación' };
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
