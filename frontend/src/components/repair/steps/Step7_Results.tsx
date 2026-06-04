'use client';

import { ChevronLeft, Package, DollarSign, CheckCircle } from 'lucide-react';
import { IProduct } from '@/interfaces/domain';

interface Step7Props {
  model: string;
  brand: string;
  diagnosis: string;
  minPrice?: number;
  maxPrice?: number;
  recommendedProducts?: IProduct[];
  onContinue: () => void;
  onBack: () => void;
}

export function Step7_Results({
  model,
  brand,
  diagnosis,
  minPrice,
  maxPrice,
  recommendedProducts = [],
  onContinue,
  onBack,
}: Step7Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary dark:text-sky-400 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Diagnóstico */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface dark:text-white">
            Diagnóstico Completado
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {brand} {model}
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-sky-400/10 dark:to-sky-400/5 border-2 border-primary/30 dark:border-sky-400/30 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-primary dark:text-sky-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="font-semibold text-on-surface dark:text-white text-lg">
                {diagnosis}
              </p>
            </div>
          </div>

          {/* Precio estimado */}
          {(minPrice !== undefined || maxPrice !== undefined) && (
            <div className="flex items-center gap-3 pt-4 border-t border-primary/20 dark:border-sky-400/20">
              <DollarSign className="w-5 h-5 text-primary dark:text-sky-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Costo estimado de reparación
                </p>
                <p className="font-bold text-lg text-on-surface dark:text-white">
                  ${minPrice?.toLocaleString()} - ${maxPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Productos recomendados */}
      {recommendedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary dark:text-sky-400" />
            <h2 className="text-xl font-bold text-on-surface dark:text-white">
              Repuestos Recomendados
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedProducts.map((product, idx) => (
              <div
                key={idx}
                className="border-2 border-outline-variant/40 dark:border-slate-800 rounded-lg p-4 space-y-3 hover:border-primary dark:hover:border-sky-400 transition-colors"
              >
                <div>
                  <p className="font-semibold text-on-surface dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {typeof product.category === 'string' ? product.category : product.category.name}
                  </p>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 dark:border-slate-700">
                  <span className="font-bold text-primary dark:text-sky-400">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-outline-variant dark:border-slate-700 rounded-lg font-semibold text-on-surface dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onContinue}
          className="flex-1 px-6 py-3 bg-primary dark:bg-sky-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
