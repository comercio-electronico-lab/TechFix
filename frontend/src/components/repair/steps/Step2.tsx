'use client';
import { Step2_Brand } from '@/components/repair/DiagnosticSteps';

interface Props {
  deviceType: string;
  selected: string | null;
  onSelect: (brand: string) => void;
  onBack: () => void;
}

export function Step2({ deviceType, selected, onSelect, onBack }: Props) {
  return (
    <Step2_Brand
      deviceType={deviceType}
      selectedBrand={selected}
      onSelect={onSelect}
      onBack={onBack}
    />
  );
}
