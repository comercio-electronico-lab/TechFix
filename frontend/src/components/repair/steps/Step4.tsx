'use client';
import { Step4_Damage } from '@/components/repair/DiagnosticSteps';

interface Props {
  description: string;
  onChange: (desc: string) => void;
  onBack: () => void;
}

export function Step4({ description, onChange, onBack }: Props) {
  return (
    <Step4_Damage
      description={description}
      onChange={onChange}
      onBack={onBack}
    />
  );
}
