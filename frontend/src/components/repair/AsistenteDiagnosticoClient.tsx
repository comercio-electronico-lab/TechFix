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
  DiagnosticStep2,
  DiagnosticStep4,
  DiagnosticStep5,
} from '@/components/repair/DiagnosticSteps';

export default function AsistenteDiagnosticoClient() {
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
  }, [step, isAuthenticated, loading, router]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-8">
      {/* Progress bar */}
      <div className="h-1 bg-gradient-to-r from-primary to-primary dark:from-sky-400 dark:to-sky-500" style={{ width: `${progress}%` }} />

      {/* Step 1: Device Type */}
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

      {/* Step 2: Brand Selection */}
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

      {/* Step 3: Model Selection */}
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

      {/* Step 4: Damage Description */}
      {step === 4 && selectedDeviceType && selectedBrand && selectedModel && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Step4_Damage
            description={damageDescription}
            onChange={(desc) => {
              setDamageDescription(desc);
            }}
            onBack={prevStep}
          />
          <button
            onClick={nextStep}
            disabled={!damageDescription.trim()}
            className="mt-8 w-full bg-primary dark:bg-sky-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continuar al Diagnóstico
          </button>
        </div>
      )}

      {/* Step 5: AI Diagnostic Questions */}
      {step === 5 && diagnosticMode === 'ia' && selectedDeviceType && selectedBrand && selectedModel && (
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

      {/* Step 7: Diagnostic Results */}
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

      {/* Step 8: Contact & Confirmation */}
      {/* Step 8: Confirmation & Repair Booking */}
      {step === 8 && diagnosis && selectedModel && selectedBrand && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <DiagnosticStep5
            ticketId={`TKT-${Date.now()}`}
            deviceType={selectedDeviceType}
            terminalNode={{ preliminary_result: diagnosis, estimated_min: estimatedMinPrice, estimated_max: estimatedMaxPrice }}
            symptomPath={[]}
            suggestedProducts={recommendedProducts}
            clientName=""
            serialNumber=""
            deviceModel={selectedModel}
            appointmentDate={new Date().toISOString().split('T')[0]}
            appointmentTime="09:00"
            selectedBranch="Laboratorio Central"
            failurePhoto={null}
          />
        </div>
      )}
    </div>
  );
}
