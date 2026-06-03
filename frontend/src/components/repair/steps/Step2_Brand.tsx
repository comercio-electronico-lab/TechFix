'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

interface Step2Props {
  deviceType: string;
  selectedBrand: string | null;
  onSelect: (brand: string) => void;
  onBack: () => void;
}

interface Brand {
  key: string;
  name: string;
}

export function Step2_Brand({ deviceType, selectedBrand, onSelect, onBack }: Step2Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/catalog/devices/${deviceType}/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data = await response.json();
        setBrands(data.brands || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [deviceType]);

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-300">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-sky-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-10">
        <div className="text-center text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary dark:text-sky-400 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Cuál es la marca?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona el fabricante de tu dispositivo.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {brands.map((brand) => (
          <button
            key={brand.key}
            onClick={() => onSelect(brand.key)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-center ${
              selectedBrand === brand.key
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-400/10 text-primary dark:text-sky-400'
                : 'border-outline-variant/40 dark:border-slate-800 bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 hover:border-primary dark:hover:border-sky-400'
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>
    </div>
  );
}
