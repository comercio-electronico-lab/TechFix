'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSegmentedDiagnosticFlow } from '@/hooks/useSegmentedDiagnosticFlow';
import { useAuth } from '@/context/AuthContext';
import {
  Step1_DeviceType,
  Step2_Brand,
  Step3_Model,
  Step4_Damage,
  Step6_AIDiagnostic,
  Step7_Results,
  DiagnosticStep5,
} from '@/components/repair/DiagnosticSteps';

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

      {/* Step 1 */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Step1_DeviceType
            selectedType={selectedDeviceType}
            onSelect={(type) => {
              setSelectedDeviceType(type);
              nextStep();
            }}
          />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && selectedDeviceType && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Step2_Brand
            deviceType={selectedDeviceType}
            selectedBrand={selectedBrand}
            onSelect={(brand) => {
              setSelectedBrand(brand);
              nextStep();
            }}
            onBack={prevStep}
          />
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && selectedDeviceType && selectedBrand && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Step3_Model
            deviceType={selectedDeviceType}
            brand={selectedBrand}
            selectedModel={selectedModel}
            onSelect={(model) => {
              setSelectedModel(model);
              nextStep();
            }}
            onBack={prevStep}
          />
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && selectedDeviceType && selectedBrand && selectedModel && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Step4_Damage
            deviceType={selectedDeviceType}
            brand={selectedBrand}
            model={selectedModel}
            damageDescription={damageDescription}
            onDamageDescriptionChange={setDamageDescription}
            onContinue={nextStep}
            onBack={prevStep}
          />
        </div>
      )}

      {/* Step 5: IA Diagnostic */}
      {step === 5 && selectedDeviceType && selectedBrand && selectedModel && diagnosticMode === 'ia' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        </div>
      )}

      {/* Step 6: Results */}
      {step === 6 && selectedModel && selectedBrand && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {diagnosis ? (
            <Step7_Results
              model={selectedModel}
              brand={selectedBrand}
              diagnosis={diagnosis}
              minPrice={estimatedMinPrice}
              maxPrice={estimatedMaxPrice}
              recommendedProducts={recommendedProducts}
              onContinue={nextStep}
              onBack={prevStep}
            />
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-sky-400 mx-auto"></div>
              <p className="text-slate-500 dark:text-slate-400 mt-4">Generando diagnóstico...</p>
            </div>
          )}
        </div>
      )}

      {/* Step 8: Confirmation */}
      {step === 8 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {diagnosis && selectedModel && selectedBrand && selectedDeviceType ? (
            <DiagnosticStep5
              ticketId={`TKT-${Date.now()}`}
              deviceType={selectedDeviceType}
              terminalNode={{ preliminary_result: diagnosis, estimated_min: estimatedMinPrice, estimated_max: estimatedMaxPrice }}
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
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-sky-400 mx-auto"></div>
              <p className="text-slate-500 dark:text-slate-400 mt-4">Cargando confirmación...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
