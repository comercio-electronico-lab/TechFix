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
    if (!loading && step === 6 && !isAuthenticated) {
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

      {/* Step 5: Diagnostic Mode Selection */}
      {step === 5 && selectedDeviceType && selectedBrand && selectedModel && damageDescription && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight">
              ¿Cómo deseas diagnosticar?
            </h1>
            <p className="text-base text-on-surface-variant dark:text-slate-400">
              Puedes usar nuestro árbol de decisión (PIG) o diagnóstico por IA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => {
                setDiagnosticMode('pig');
                nextStep();
              }}
              className="p-6 rounded-xl border-2 border-outline-variant/40 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary dark:hover:border-sky-400 transition-all text-center space-y-2"
            >
              <h3 className="font-bold text-on-surface dark:text-white">Árbol de Decisión</h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">Preguntas guiadas paso a paso</p>
            </button>
            <button
              onClick={() => {
                setDiagnosticMode('ia');
                nextStep();
              }}
              className="p-6 rounded-xl border-2 border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-400/10 text-primary dark:text-sky-400 transition-all text-center space-y-2 font-semibold"
            >
              <h3 className="font-bold">Diagnóstico por IA ✨</h3>
              <p className="text-sm">Análisis inteligente inmediato</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 6: AI Diagnostic Questions */}
      {step === 6 && diagnosticMode === 'ia' && selectedDeviceType && selectedBrand && selectedModel && (
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
      {step === 7 && diagnosis && selectedModel && selectedBrand && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        </div>
      )}

      {/* Step 8: Contact & Confirmation */}
      {step >= 8 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p>Paso {step} - Confirmación de reparación</p>
          <p className="text-sm mt-2">Dispositivo: {selectedModel} ({selectedBrand})</p>
          <p className="text-sm">Diagnóstico completado ✓</p>
        </div>
      )}
    </div>
  );
}
