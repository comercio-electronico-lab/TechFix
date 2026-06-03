'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IProduct } from '@/interfaces/domain';

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
  estimatedMinPrice: number | undefined;
  estimatedMaxPrice: number | undefined;
  recommendedProducts: IProduct[];
  setDiagnosis: (diagnosis: string) => void;
  setEstimatedMinPrice: (price: number) => void;
  setEstimatedMaxPrice: (price: number) => void;
  setRecommendedProducts: (products: IProduct[]) => void;

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
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState('');

  // Results
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [estimatedMinPrice, setEstimatedMinPrice] = useState<number | undefined>();
  const [estimatedMaxPrice, setEstimatedMaxPrice] = useState<number | undefined>();
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);

  // Navigation
  const nextStep = useCallback(() => {
    if (step < TOTAL_STEPS) setStep(prev => prev + 1);
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep(prev => prev - 1);
  }, [step]);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
      setStep(targetStep);
    }
  }, []);

  const progress = (step / TOTAL_STEPS) * 100;

  const reset = useCallback(() => {
    setStep(1);
    setSelectedDeviceType(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setDamageDescription('');
    setDiagnosticMode(null);
    setDiagnosis(null);
    setEstimatedMinPrice(undefined);
    setEstimatedMaxPrice(undefined);
    setRecommendedProducts([]);
  }, []);

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
    estimatedMinPrice,
    estimatedMaxPrice,
    recommendedProducts,
    setDiagnosis,
    setEstimatedMinPrice,
    setEstimatedMaxPrice,
    setRecommendedProducts,
    progress,
    reset,
  };
}
