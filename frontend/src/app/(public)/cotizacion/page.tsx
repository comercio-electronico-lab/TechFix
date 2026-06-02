"use client";

import React from 'react';
import DeviceSelector from '@/components/cotizacion/DeviceSelector';
import QuotationWizard from '@/components/cotizacion/QuotationWizard';
import ScanningScreen from '@/components/cotizacion/ScanningScreen';
import QuotationResult from '@/components/cotizacion/QuotationResult';
import { useQuotation } from '@/hooks/useQuotation';

export default function CotizacionPage() {
  const {
    deviceType,
    setDeviceType,
    currentNode,
    options,
    history,
    loading,
    isScanning,
    scanProgress,
    scanText,
    resultNode,
    handleSelectOption,
    handleGoBack,
    handleReset
  } = useQuotation();

  return (
    <div className="min-h-[85vh] py-16 bg-background relative overflow-hidden flex items-center">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-gutter relative z-10 w-full">
        
        {/* Titular Principal */}
        {!isScanning && !resultNode && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold bg-secondary-container/10 text-secondary border border-secondary-container/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Herramienta Interactiva
            </span>
            <h1 className="text-primary dark:text-white mt-4 mb-2 font-h1 font-bold">
              Cotización Instantánea y Guía
            </h1>
            <p className="text-on-surface-variant text-sm">
              Diagnostica tu equipo en tiempo real y obtén un presupuesto de reparación estimativo al instante en pocos y sencillos clics.
            </p>
          </div>
        )}

        {/* 1. SELECCIÓN DE DISPOSITIVO */}
        {!deviceType && !isScanning && !resultNode && (
          <DeviceSelector onSelect={(type) => setDeviceType(type)} />
        )}

        {/* 2. ÁRBOL DE SÍNTOMAS (ASISTENTE WIZARD) */}
        {deviceType && currentNode && !isScanning && !resultNode && (
          <QuotationWizard 
            deviceType={deviceType}
            currentNode={currentNode}
            options={options}
            historyLength={history.length}
            loading={loading}
            onSelectOption={handleSelectOption}
            onGoBack={handleGoBack}
          />
        )}

        {/* 3. PANTALLA DE ESCANEO FUTURISTA */}
        {isScanning && (
          <ScanningScreen scanText={scanText} scanProgress={scanProgress} />
        )}

        {/* 4. RESULTADO FINAL DE DIAGNÓSTICO */}
        {resultNode && (
          <QuotationResult resultNode={resultNode} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
