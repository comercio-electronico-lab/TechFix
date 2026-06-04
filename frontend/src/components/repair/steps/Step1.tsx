'use client';
import { Step1_DeviceType } from '@/components/repair/DiagnosticSteps';

interface Props {
  selected: string | null;
  onSelect: (type: string) => void;
}

export function Step1({ selected, onSelect }: Props) {
  return <Step1_DeviceType selectedType={selected} onSelect={onSelect} />;
}
