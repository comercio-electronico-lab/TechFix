'use client';

import React from 'react';
import { useDiagnosticFlow, REPAIR_COST_ESTIMATES } from '@/hooks/useDiagnosticFlow';
import DiagnosticStepper from '@/components/repair/DiagnosticStepper';
import {
  DiagnosticStep1,
  DiagnosticStep2,
  DiagnosticStep3,
  DiagnosticStep4,
  DiagnosticStep5,
} from '@/components/repair/DiagnosticSteps';

export default function AsistenteDiagnostico() {
  const {
    state,
    isSubmitting,
    ticketId,
    detailsList,
    handleBack,
    handleSubmit,
    setDeviceType,
    setIssueCategory,
    setIssueDetail,
    setClientField,
  } = useDiagnosticFlow();

  const costEstimate = state.issueCategory
    ? REPAIR_COST_ESTIMATES[state.issueCategory]
    : '$39.00 - $220.00';

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-gutter bg-surface-bright dark:bg-slate-950 transition-colors duration-300 flex justify-center">
      <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
        
        <DiagnosticStepper
          currentStep={state.step}
          onBack={handleBack}
        />

        <div className="w-full">
          {state.step === 1 && (
            <DiagnosticStep1
              currentDevice={state.deviceType}
              onSelect={setDeviceType}
            />
          )}

          {state.step === 2 && (
            <DiagnosticStep2
              currentCategory={state.issueCategory}
              onSelect={setIssueCategory}
            />
          )}

          {state.step === 3 && (
            <DiagnosticStep3
              issueCategory={state.issueCategory}
              currentDetail={state.issueDetail}
              detailsList={detailsList}
              onSelect={setIssueDetail}
            />
          )}

          {state.step === 4 && (
            <DiagnosticStep4
              clientName={state.clientName}
              clientEmail={state.clientEmail}
              clientPhone={state.clientPhone}
              isSubmitting={isSubmitting}
              onChange={setClientField}
              onSubmit={handleSubmit}
            />
          )}

          {state.step === 5 && ticketId && (
            <DiagnosticStep5
              ticketId={ticketId}
              deviceType={state.deviceType}
              issueCategory={state.issueCategory}
              issueDetail={state.issueDetail}
              clientName={state.clientName}
              costEstimate={costEstimate}
            />
          )}
        </div>

      </div>
    </div>
  );
}
