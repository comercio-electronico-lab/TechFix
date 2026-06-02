"use client";

import { useState, useEffect } from 'react';
import { PigNode } from '@/components/cotizacion/QuotationWizard';

export const useQuotation = () => {
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
    if (currentNode) {
      setHistory(prev => [...prev, currentNode]);
    }

    if (selectedNode.is_terminal) {
      triggerScanning(selectedNode);
    } else {
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
    const prevNode = prevHistory.pop();
    setHistory(prevHistory);

    if (prevNode) {
      setCurrentNode(prevNode);
      setLoading(true);
      await fetchOptions(prevNode.device_type, prevNode.id);
      setLoading(false);
    }
  };

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

  return {
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
  };
};
