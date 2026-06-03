'use client';

import DiagnosticStepper from './DiagnosticStepper';
import AsistenteDiagnosticoClient from './AsistenteDiagnosticoClient';
import { useDiagnosticFlow } from '@/hooks/useDiagnosticFlow';

export default function ReparacionesWrapper() {
  const { step, handleBack } = useDiagnosticFlow();

  return (
    <>
      <DiagnosticStepper currentStep={step} onBack={handleBack} />
      <AsistenteDiagnosticoClient />
    </>
  );
}
