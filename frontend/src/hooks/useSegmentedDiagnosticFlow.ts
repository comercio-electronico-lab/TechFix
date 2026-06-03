'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface UseSegmentedFlowReturn {
  // Step tracking
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Step 1: Device Type
  selectedDeviceType: string | null;
  setSelectedDeviceType: (type: string) => void;

  // Step 2: Brand
  selectedBrand: string | null;
  setSelectedBrand: (brand: string) => void;

  // Step 3: Model
  selectedModel: string | null;
  setSelectedModel: (model: string) => void;

  // Step 4: Damage Description
  damageDescription: string;
  setDamageDescription: (description: string) => void;

  // Step 5: Diagnostic (PIG/IA)
  diagnosticMode: 'pig' | 'ia' | null;
  setDiagnosticMode: (mode: 'pig' | 'ia') => void;

  // Auth & Contact
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;

  // Results
  diagnosis: string | null;
  recommendedProducts: any[];
  setDiagnosis: (diagnosis: string) => void;
  setRecommendedProducts: (products: any[]) => void;

  // Progress
  progress: number;

  // Reset
  reset: () => void;
}

const TOTAL_STEPS = 8;

export function useSegmentedDiagnosticFlow(): UseSegmentedFlowReturn {
  const { user } = useAuth();

  // Step tracking
  const [step, setStep] = useState(1);

  // Step 1: Device Type
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);

  // Step 2: Brand
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Step 3: Model
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Step 4: Damage Description
  const [damageDescription, setDamageDescription] = useState('');

  // Step 5: Diagnostic Mode
  const [diagnosticMode, setDiagnosticMode] = useState<'pig' | 'ia' | null>(null);

  // Contact info
  const [clientName, setClientName] = useState(user?.nombre || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState('');

  // Results
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Navigation
  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const goToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
      setStep(targetStep);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const reset = () => {
    setStep(1);
    setSelectedDeviceType(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setDamageDescription('');
    setDiagnosticMode(null);
    setDiagnosis(null);
    setRecommendedProducts([]);
  };

  return {
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
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    diagnosis,
    setDiagnosis,
    recommendedProducts,
    setRecommendedProducts,
    progress,
    reset,
  };
}
