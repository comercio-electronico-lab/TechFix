'use client';
import { Step3_Model } from '@/components/repair/DiagnosticSteps';

interface Props {
  deviceType: string;
  brand: string;
  selected: string | null;
  onSelect: (model: string) => void;
  onBack: () => void;
}

export function Step3({ deviceType, brand, selected, onSelect, onBack }: Props) {
  return (
    <Step3_Model
      deviceType={deviceType}
      brand={brand}
      selectedModel={selected}
      onSelect={onSelect}
      onBack={onBack}
    />
  );
}
