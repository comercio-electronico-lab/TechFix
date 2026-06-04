'use client';
import { DiagnosticStep5 } from '@/components/repair/DiagnosticSteps';

interface Props {
  diagnosis: string;
  model: string;
  brand: string;
  deviceType: string;
  minPrice?: number;
  maxPrice?: number;
  products?: any[];
}

export function Step7({ diagnosis, model, brand, deviceType, minPrice, maxPrice, products = [] }: Props) {
  return (
    <>
      {diagnosis && model && brand && deviceType ? (
        <DiagnosticStep5
          ticketId={`TKT-${Date.now()}`}
          deviceType={deviceType}
          terminalNode={{ preliminary_result: diagnosis, estimated_min: minPrice, estimated_max: maxPrice }}
          symptomPath={[]}
          suggestedProducts={products}
          clientName=""
          serialNumber=""
          deviceModel={model}
          appointmentDate={new Date().toISOString().split('T')[0]}
          appointmentTime="09:00"
          selectedBranch="Laboratorio Central"
          failurePhoto={null}
        />
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-sky-400 mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">Cargando confirmación...</p>
        </div>
      )}
    </>
  );
}
