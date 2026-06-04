'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSegmentedDiagnosticFlow } from '@/hooks/useSegmentedDiagnosticFlow';
import { useAuth } from '@/context/AuthContext';
import { Step1 } from '@/components/repair/steps/Step1';
import { Step2 } from '@/components/repair/steps/Step2';
import { Step3 } from '@/components/repair/steps/Step3';
import { Step4 } from '@/components/repair/steps/Step4';
import { Step5 } from '@/components/repair/steps/Step5';
import { Step6 } from '@/components/repair/steps/Step6';
import { Step7 } from '@/components/repair/steps/Step7';

export default function DiagnosticFlow() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const {
    step,
    nextStep,
    prevStep,
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
    if (user) {
      setClientName(user.name);
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

      {step === 1 && <Step1 selected={selectedDeviceType} onSelect={(t) => { setSelectedDeviceType(t); nextStep(); }} />}

      {step === 2 && selectedDeviceType && <Step2 deviceType={selectedDeviceType} selected={selectedBrand} onSelect={(b) => { setSelectedBrand(b); nextStep(); }} onBack={prevStep} />}

      {step === 3 && selectedDeviceType && selectedBrand && <Step3 deviceType={selectedDeviceType} brand={selectedBrand} selected={selectedModel} onSelect={(m) => { setSelectedModel(m); nextStep(); }} onBack={prevStep} />}

      {step === 4 && selectedDeviceType && selectedBrand && selectedModel && damageDescription !== undefined && (
        <div className="space-y-4">
          <Step4 description={damageDescription} onChange={setDamageDescription} onBack={prevStep} />
          <button onClick={nextStep} className="w-full px-6 py-3 bg-primary dark:bg-sky-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all">
            Continuar
          </button>
        </div>
      )}

      {step === 5 && selectedDeviceType && selectedBrand && selectedModel && diagnosticMode === 'ia' && (
        <Step5
          deviceType={selectedDeviceType}
          brand={selectedBrand}
          model={selectedModel}
          damageDescription={damageDescription}
          onComplete={(result) => {
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
        <Step6 model={selectedModel} brand={selectedBrand} diagnosis={diagnosis} minPrice={estimatedMinPrice} maxPrice={estimatedMaxPrice} products={recommendedProducts} onContinue={nextStep} onBack={prevStep} />
      )}

      {step === 8 && (
        <Step7 diagnosis={diagnosis} model={selectedModel} brand={selectedBrand} deviceType={selectedDeviceType} minPrice={estimatedMinPrice} maxPrice={estimatedMaxPrice} products={recommendedProducts} />
      )}
    </div>
  );
}
