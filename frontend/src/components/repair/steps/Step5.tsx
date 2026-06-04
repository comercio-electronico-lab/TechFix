'use client';
import { Step6_AIDiagnostic } from '@/components/repair/DiagnosticSteps';

interface DiagnosticResult {
  diagnosis?: string;
  estimated_min_price?: number;
  estimated_max_price?: number;
  recommended_products?: any[];
  [key: string]: any;
}

interface Props {
  deviceType: string;
  brand: string;
  model: string;
  damageDescription: string;
  onComplete: (result: DiagnosticResult) => void;
  onBack: () => void;
}

export function Step5({ deviceType, brand, model, damageDescription, onComplete, onBack }: Props) {
  return (
    <Step6_AIDiagnostic
      deviceType={deviceType}
      brand={brand}
      model={model}
      damageDescription={damageDescription}
      onDiagnosisComplete={(_sessionId, result) => onComplete(result)}
      onBack={onBack}
    />
  );
}
