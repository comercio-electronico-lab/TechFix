'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

interface Step3Props {
  deviceType: string;
  brand: string;
  selectedModel: string | null;
  onSelect: (model: string) => void;
  onBack: () => void;
}

export function Step3_Model({ deviceType, brand, selectedModel, onSelect, onBack }: Step3Props) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/catalog/devices/${deviceType}/brands/${brand}/models`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        setModels(data.models || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [deviceType, brand]);

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
          ¿Cuál es el modelo?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona tu modelo específico.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {models.map((model) => (
          <button
            key={model}
            onClick={() => onSelect(model)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-left ${
              selectedModel === model
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-400/10 text-primary dark:text-sky-400'
                : 'border-outline-variant/40 dark:border-slate-800 bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 hover:border-primary dark:hover:border-sky-400'
            }`}
          >
            {model}
          </button>
        ))}
      </div>
    </div>
  );
}
