'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosticFlow } from '@/hooks/useDiagnosticFlow';
import { useAuth } from '@/context/AuthContext';
import {
  DiagnosticStep1,
  DiagnosticStep2,
  DiagnosticStep4,
  DiagnosticStep5,
} from '@/components/repair/DiagnosticSteps';

export default function AsistenteDiagnosticoClient() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const {
    step,
    deviceType,
    currentNode,
    options,
    symptomPath,
    suggestedProducts,
    clientName,
    clientEmail,
    clientPhone,
    isSubmitting,
    ticketId,
    terminalNode,
    serialNumber,
    deviceModel,
    appointmentDate,
    appointmentTime,
    selectedBranch,
    failurePhoto,
    handleBack,
    selectOption,
    handleSubmit,
    setDeviceType,
    setClientField,
    setFailurePhoto,
  } = useDiagnosticFlow();

  useEffect(() => {
    if (!loading && step === 4 && !isAuthenticated) {
      router.push('/auth?redirect=/reparaciones');
    }
  }, [step, isAuthenticated, loading, router]);

  return (
    <div className="w-full">
      {step === 1 && (
        <DiagnosticStep1
          currentDevice={deviceType}
          serialNumber={serialNumber}
          deviceModel={deviceModel}
          onSelect={setDeviceType}
          onFieldChange={setClientField}
        />
      )}

      {step === 2 && (
        <DiagnosticStep2
          currentNode={currentNode}
          options={options}
          symptomPath={symptomPath}
          onSelect={selectOption}
        />
      )}

      {step === 4 && isAuthenticated && (
        <DiagnosticStep4
          clientName={clientName}
          clientEmail={clientEmail}
          clientPhone={clientPhone}
          isSubmitting={isSubmitting}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          selectedBranch={selectedBranch}
          failurePhoto={failurePhoto}
          isAuthenticated={isAuthenticated}
          onChange={setClientField}
          setFailurePhoto={setFailurePhoto}
          onSubmit={handleSubmit}
        />
      )}

      {step === 5 && ticketId && (
        <DiagnosticStep5
          ticketId={ticketId}
          deviceType={deviceType}
          terminalNode={terminalNode}
          symptomPath={symptomPath}
          suggestedProducts={suggestedProducts}
          clientName={clientName}
          serialNumber={serialNumber}
          deviceModel={deviceModel}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          selectedBranch={selectedBranch}
          failurePhoto={failurePhoto}
        />
      )}
    </div>
  );
}
