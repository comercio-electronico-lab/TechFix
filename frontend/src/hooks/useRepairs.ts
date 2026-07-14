'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClientRepairsAction, getClientWarrantiesAction, scheduleRepairAction } from '@/actions';
import { IRepair } from '@/interfaces/domain';

// Extendemos IRepair para incluir campos específicos de la orden si es necesario
export interface RepairOrder extends IRepair {
  pig_session_id?: string;
  notes?: string;
}

export interface Warranty {
  id: string;
  repair_id: string;
  device_id: string;
  device?: {
    brand: string;
    model: string;
    serial_number: string;
  };
  warranty_token: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status?: string;
  repair_order?: RepairOrder;
  warranty_days?: number;
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

      // Cast para compatibilidad (En una API real el mapeo se haría en la Action)
      setRepairs((repairsData as unknown as RepairOrder[]) || []);
      setWarranties(warrantiesData || []);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al recuperar tus reparaciones';
      console.error(e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchRepairsAndWarranties();
  }, [fetchRepairsAndWarranties]);

  const scheduleRepair = async (input: ScheduleRepairInput): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    if (!token) return { success: false, error: 'No autenticado' };

    try {
      const data = await scheduleRepairAction(token, input);
      await fetchRepairsAndWarranties(); // Recargar datos
      return { success: true, data };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al agendar la reparación';
      console.error(e);
      return { success: false, error: errorMessage };
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
