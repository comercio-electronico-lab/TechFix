'use client';
import { Step7_Results } from '@/components/repair/DiagnosticSteps';

interface Props {
  model: string;
  brand: string;
  diagnosis: string;
  minPrice?: number;
  maxPrice?: number;
  products?: any[];
  onContinue: () => void;
  onBack: () => void;
}

export function Step6({ model, brand, diagnosis, minPrice, maxPrice, products = [], onContinue, onBack }: Props) {
  return (
    <>
      {diagnosis ? (
        <Step7_Results
          model={model}
          brand={brand}
          diagnosis={diagnosis}
          minPrice={minPrice}
          maxPrice={maxPrice}
          recommendedProducts={products}
          onContinue={onContinue}
          onBack={onBack}
        />
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-sky-400 mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">Generando diagnóstico...</p>
        </div>
      )}
    </>
  );
}
