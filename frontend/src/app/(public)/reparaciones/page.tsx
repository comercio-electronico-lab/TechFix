'use client';

import React from 'react';
import { useDiagnosticFlow, REPAIR_COST_ESTIMATES } from '@/hooks/useDiagnosticFlow';
import DiagnosticHeader from '@/components/repair/DiagnosticHeader';
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
    progressPercentage,
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
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col transition-colors duration-300 font-sans antialiased">

      <DiagnosticHeader
        step={state.step}
        onBack={handleBack}
        progressPercentage={progressPercentage}
      />

      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-4 md:px-8 w-full">
        <div className="max-w-3xl w-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-500">

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
      </main>
    </div>
  );
}
