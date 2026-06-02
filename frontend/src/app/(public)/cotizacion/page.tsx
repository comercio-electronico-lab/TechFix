"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Laptop, 
  Smartphone, 
  ChevronRight, 
  RotateCcw, 
  Cpu, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';

interface PigNode {
  id: string;
  parent_node_id: string | null;
  device_type: string;
  question_text: string;
  answer_option: string;
  preliminary_result: string;
  estimated_min: number;
  estimated_max: number;
  is_terminal: boolean;
}

export default function CotizacionPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const [deviceType, setDeviceType] = useState<'Laptop' | 'Smartphone' | null>(null);
  
  // Wizard state
  const [currentNode, setCurrentNode] = useState<PigNode | null>(null);
  const [options, setOptions] = useState<PigNode[]>([]);
  const [history, setHistory] = useState<PigNode[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('Inicializando diagnóstico...');
  
  // Result state
  const [resultNode, setResultNode] = useState<PigNode | null>(null);

  // Fetch root node when device type is selected
  useEffect(() => {
    if (deviceType) {
      fetchRootNode(deviceType);
    }
  }, [deviceType]);

  const fetchRootNode = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/pig/nodes?device_type=${type}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCurrentNode(data[0]);
          // Fetch child options for this root question
          fetchOptions(type, data[0].id);
        }
      }
    } catch (e) {
      console.error("Error fetching root node", e);
    }
    setLoading(false);
  };

  const fetchOptions = async (type: string, parentId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/pig/nodes?device_type=${type}&parent_id=${parentId}`);
      if (res.ok) {
        const data = await res.json();
        setOptions(data || []);
      }
    } catch (e) {
      console.error("Error fetching options", e);
    }
  };

  const handleSelectOption = async (selectedNode: PigNode) => {
    setError('');
    
    // Add current node to history before moving forward
    if (currentNode) {
      setHistory(prev => [...prev, currentNode]);
    }

    if (selectedNode.is_terminal) {
      // It's a final node! Trigger high-tech scan animation
      triggerScanning(selectedNode);
    } else {
      // It's an intermediate option question, move forward
      setCurrentNode(selectedNode);
      setLoading(true);
      await fetchOptions(selectedNode.device_type, selectedNode.id);
      setLoading(false);
    }
  };

  const handleGoBack = async () => {
    if (history.length === 0) {
      setDeviceType(null);
      setCurrentNode(null);
      setOptions([]);
      return;
    }

    const prevHistory = [...history];
    const prevNode = prevHistory.pop(); // Remove last node to go back
    setHistory(prevHistory);

    if (prevNode) {
      setCurrentNode(prevNode);
      setLoading(true);
      await fetchOptions(prevNode.device_type, prevNode.id);
      setLoading(false);
    }
  };

  const [error, setError] = useState('');

  const triggerScanning = (finalNode: PigNode) => {
    setIsScanning(true);
    setScanProgress(0);
    
    const steps = [
      { progress: 15, text: 'Conectando con base de datos de ingeniería...' },
      { progress: 40, text: 'Comprobando árbol de síntomas de hardware...' },
      { progress: 70, text: 'Calculando costo estimado de componentes...' },
      { progress: 90, text: 'Finalizando análisis y emitiendo diagnóstico...' },
      { progress: 100, text: '¡Diagnóstico completo!' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].progress);
        setScanText(steps[currentStepIdx].text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setResultNode(finalNode);
        }, 600);
      }
    }, 650);
  };

  const handleReset = () => {
    setDeviceType(null);
    setCurrentNode(null);
    setOptions([]);
    setHistory([]);
    setResultNode(null);
    setIsScanning(false);
    setScanProgress(0);
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => setDeviceType('Laptop')}
              className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all cursor-pointer group text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="p-4 bg-secondary-container/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Laptop className="w-12 h-12 text-secondary" />
              </div>
              <div>
                <h3 className="text-primary dark:text-white font-bold text-xl mb-1">Reparar Laptop</h3>
                <p className="text-xs text-on-surface-variant max-w-xs">Diagnóstico para pantallas, encendido, baterías, recalentamientos y más.</p>
              </div>
            </button>

            <button
              onClick={() => setDeviceType('Smartphone')}
              className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all cursor-pointer group text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="p-4 bg-secondary-container/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Smartphone className="w-12 h-12 text-secondary" />
              </div>
              <div>
                <h3 className="text-primary dark:text-white font-bold text-xl mb-1">Reparar Smartphone</h3>
                <p className="text-xs text-on-surface-variant max-w-xs">Diagnóstico de pantallas mojadas o rotas, fallos de carga, baterías y sensores.</p>
              </div>
            </button>
          </div>
        )}

        {/* 2. ÁRBOL DE SÍNTOMAS (ASISTENTE WIZARD) */}
        {deviceType && currentNode && !isScanning && !resultNode && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-lg relative">
              
              {/* Back Button / Breadcrumb */}
              <button 
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-secondary transition-colors mb-6 font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </button>

              {/* Progress bar info */}
              <div className="flex justify-between items-center text-xs text-on-surface-variant/70 mb-4">
                <span>Paso {history.length + 1} de tu diagnóstico</span>
                <span className="font-bold">{deviceType}</span>
              </div>

              {/* Question Text */}
              <h2 className="text-primary dark:text-white font-h2 font-bold mb-8 leading-tight">
                {currentNode.question_text}
              </h2>

              {/* Loader */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                </div>
              ) : (
                /* Options Buttons */
                <div className="flex flex-col gap-3">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className="w-full text-left bg-white/50 dark:bg-slate-900/40 hover:bg-secondary/10 hover:border-secondary/40 border border-outline-variant/20 dark:border-outline/10 p-5 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-between text-on-background group"
                    >
                      <span className="text-sm">{option.answer_option}</span>
                      <ChevronRight className="w-5 h-5 text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. PANTALLA DE ESCANEO FUTURISTA */}
        {isScanning && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center gap-6">
              
              <div className="relative p-6 bg-secondary-container/10 rounded-full border border-secondary-container/20 animate-pulse">
                <Cpu className="w-16 h-16 text-secondary animate-spin-slow" />
              </div>
              
              <div className="w-full">
                <h3 className="text-primary dark:text-white font-bold text-lg mb-2">Escaneo y Análisis Técnico...</h3>
                <p className="text-xs text-on-surface-variant h-8">{scanText}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-container-low dark:bg-white/5 rounded-full h-2 overflow-hidden border border-outline-variant/10 dark:border-outline/10">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              
              <span className="text-xs font-bold text-secondary">{scanProgress}%</span>
            </div>
          </div>
        )}

        {/* 4. RESULTADO FINAL DE DIAGNÓSTICO */}
        {resultNode && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col gap-8">
              
              {/* Decorative top lights */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent"></div>

              <div className="text-center">
                <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-4 border border-green-500/20">
                  <ShieldCheck className="w-8 h-8 text-green-500 animate-pulse" />
                </div>
                <h2 className="text-primary dark:text-white font-h2 font-bold mb-2">Presupuesto Estimado Listo</h2>
                <p className="text-xs text-on-surface-variant">Nuestro algoritmo determinó el fallo con base en tus respuestas de diagnóstico.</p>
              </div>

              {/* Tarjeta del Diagnóstico */}
              <div className="bg-surface-container-low dark:bg-white/5 p-6 rounded-xl border border-outline-variant/20 dark:border-outline/10">
                <span className="text-[10px] bg-secondary-container/10 text-secondary dark:text-secondary-container font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Fallo Preliminar Detectado
                </span>
                <p className="text-sm font-bold text-on-background mt-3 leading-relaxed">
                  {resultNode.preliminary_result}
                </p>
              </div>

              {/* Medidor de Costos Estimados */}
              <div className="bg-white/80 dark:bg-slate-900/60 p-6 rounded-xl border border-outline-variant/10 dark:border-outline/20 flex flex-col items-center gap-4 text-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monto de Reparación Estimado</span>
                
                <div className="flex items-baseline gap-1 mt-2 text-primary dark:text-white">
                  <span className="text-xl font-bold">$</span>
                  <span className="text-5xl font-black tracking-tighter">
                    {resultNode.estimated_min} - {resultNode.estimated_max}
                  </span>
                  <span className="text-xs text-on-surface-variant font-bold ml-1">USD</span>
                </div>
                
                <div className="w-full max-w-sm mt-4 flex items-center gap-2 text-xs text-on-surface-variant/70 justify-center">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span>*Precios estimativos de repuestos e ingeniería.</span>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant/15 dark:border-outline/10 pt-6 mt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 border border-outline-variant/40 hover:bg-surface-container-low dark:hover:bg-white/5 font-bold rounded-xl transition-all cursor-pointer text-sm text-on-surface-variant flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Iniciar Otro Diagnóstico
                </button>
                <button
                  onClick={() => router.push('/reparaciones')}
                  className="bg-secondary hover:bg-secondary/95 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Agendar Cita Técnica
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
