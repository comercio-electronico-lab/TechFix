'use client';

import React from 'react';
import { useDiagnosticFlow } from '@/hooks/useDiagnosticFlow';
import DiagnosticStepper from '@/components/repair/DiagnosticStepper';
import {
  DiagnosticStep1,
  DiagnosticStep2,
  DiagnosticStep4,
  DiagnosticStep5,
} from '@/components/repair/DiagnosticSteps';

export default function AsistenteDiagnostico() {
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
    handleBack,
    selectOption,
    handleSubmit,
    setDeviceType,
    setClientField,
    terminalNode,
  } = useDiagnosticFlow();

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-gutter bg-surface-bright dark:bg-slate-950 transition-colors duration-300 flex justify-center">
      <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
        
        <DiagnosticStepper
          currentStep={step}
          onBack={handleBack}
        />

        <div className="w-full">
          {step === 1 && (
            <DiagnosticStep1
              currentDevice={deviceType}
              onSelect={setDeviceType}
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

          {step === 4 && (
            <DiagnosticStep4
              clientName={clientName}
              clientEmail={clientEmail}
              clientPhone={clientPhone}
              isSubmitting={isSubmitting}
              onChange={setClientField}
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
            />
          )}
        </div>

      </div>
    </div>
  );
}
