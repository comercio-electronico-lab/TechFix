'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSegmentedDiagnosticFlow } from '@/hooks/useSegmentedDiagnosticFlow';
import { useAuth } from '@/context/AuthContext';
import { Step1_DeviceType, Step2_Brand, Step3_Model, Step4_Damage, Step6_AIDiagnostic, Step7_Results, DiagnosticStep5 } from '@/components/repair/DiagnosticSteps';

export default function DiagnosticFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading, user } = useAuth();
  const {
    step,
    nextStep,
    prevStep,
    goToStep,
    selectedDeviceType,
    setSelectedDeviceType,
    selectedBrand,
    setSelectedBrand,
    selectedModel,
    setSelectedModel,
    damageDescription,
    setDamageDescription,
    diagnosticMode,
    setDiagnosticMode,
    setClientName,
    setClientEmail,
    diagnosis,
    estimatedMinPrice,
    estimatedMaxPrice,
    recommendedProducts,
    setDiagnosis,
    setRecommendedProducts,
    setEstimatedMinPrice,
    setEstimatedMaxPrice,
    progress,
  } = useSegmentedDiagnosticFlow();

  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam && !selectedDeviceType) {
      setSelectedDeviceType(typeParam);
      goToStep(2);
    }
  }, [searchParams, selectedDeviceType, setSelectedDeviceType, goToStep]);

  useEffect(() => {
    if (user) {
      setClientName(user.nombre);
      setClientEmail(user.email);
    }
  }, [user, setClientName, setClientEmail]);

  useEffect(() => {
    if (!diagnosticMode) {
      setDiagnosticMode('ia');
    }
  }, []);

  useEffect(() => {
    if (diagnosis && step === 5) {
      nextStep();
    }
  }, [diagnosis, step, nextStep]);

  useEffect(() => {
    if (!loading && step === 5 && !isAuthenticated) {
      router.push('/auth?redirect=/reparaciones');
    }
  }, [isAuthenticated, loading, step, router]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-8">
      {/* Progress bar */}
      <div className="h-1 bg-linear-to-r from-primary to-primary dark:from-sky-400 dark:to-sky-500" style={{ width: `${progress}%` }} />

      {step === 1 && <Step1_DeviceType selectedType={selectedDeviceType} onSelect={(t) => { setSelectedDeviceType(t); nextStep(); }} />}

      {step === 2 && selectedDeviceType && <Step2_Brand deviceType={selectedDeviceType} selectedBrand={selectedBrand} onSelect={(b) => { setSelectedBrand(b); nextStep(); }} onBack={prevStep} />}

      {step === 3 && selectedDeviceType && selectedBrand && <Step3_Model deviceType={selectedDeviceType} brand={selectedBrand} selectedModel={selectedModel} onSelect={(m) => { setSelectedModel(m); nextStep(); }} onBack={prevStep} />}

      {step === 4 && selectedDeviceType && selectedBrand && selectedModel && (
        <div className="space-y-4">
          <Step4_Damage description={damageDescription} onChange={setDamageDescription} onBack={prevStep} />
          <button onClick={nextStep} className="w-full px-6 py-3 bg-primary dark:bg-sky-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all">
            Continuar
          </button>
        </div>
      )}

      {step === 5 && selectedDeviceType && selectedBrand && selectedModel && diagnosticMode === 'ia' && (
        <Step6_AIDiagnostic
          deviceType={selectedDeviceType}
          brand={selectedBrand}
          model={selectedModel}
          damageDescription={damageDescription}
          onDiagnosisComplete={(_sessionId, result) => {
            if (result.diagnosis) setDiagnosis(result.diagnosis);
            if (result.estimated_min_price) setEstimatedMinPrice(result.estimated_min_price);
            if (result.estimated_max_price) setEstimatedMaxPrice(result.estimated_max_price);
            if (result.recommended_products) setRecommendedProducts(result.recommended_products);
            nextStep();
          }}
          onBack={prevStep}
        />
      )}

      {step === 6 && selectedModel && selectedBrand && (
        <>
          {diagnosis ? (
            <Step7_Results model={selectedModel} brand={selectedBrand} diagnosis={diagnosis} minPrice={estimatedMinPrice} maxPrice={estimatedMaxPrice} recommendedProducts={recommendedProducts} onContinue={nextStep} onBack={prevStep} />
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-sky-400 mx-auto"></div>
              <p className="text-slate-500 dark:text-slate-400 mt-4">Generando diagnóstico...</p>
            </div>
          )}
        </>
      )}

      {step === 7 && diagnosis && selectedModel && selectedBrand && selectedDeviceType && (
        <DiagnosticStep5
          ticketId={`TKT-${Date.now()}`}
          deviceType={selectedDeviceType}
          brand={selectedBrand}
          terminalNode={{ preliminary_result: diagnosis, estimated_min: estimatedMinPrice || 0, estimated_max: estimatedMaxPrice || 0 }}
          symptomPath={[]}
          suggestedProducts={recommendedProducts || []}
          clientName=""
          serialNumber=""
          deviceModel={selectedModel}
          appointmentDate={new Date().toISOString().split('T')[0]}
          appointmentTime="09:00"
          selectedBranch="Laboratorio Central"
          failurePhoto={null}
        />
      )}
    </div>
  );
}
