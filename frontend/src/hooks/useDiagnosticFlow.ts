'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockDiagnosticTree, getNodeById, getOptionsForNode } from '@/mock/diagnosticTree';

export interface UseDiagnosticFlowReturn {
  step: number;
  deviceType: string | null;
  currentNode: any;
  options: any[];
  symptomPath: string[];
  suggestedProducts: any[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isSubmitting: boolean;
  ticketId: string | null;
  progressPercentage: number;
  terminalNode: any;
  handleBack: () => void;
  selectOption: (optionNode: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setDeviceType: (device: string) => void;
  setClientField: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void;
  resetFlow: () => void;
}

const TOTAL_STEPS = 5;

// Mapeador para adaptar los nodos mock al formato esperado por el frontend
const mapNode = (node: any) => {
  if (!node) return null;
  return {
    ...node,
    question_text: node.question, // Mapea question a question_text
    answer_option: node.question, // Mapea question a answer_option para la lista de opciones
    preliminary_result: node.preliminary_result || `Fallo técnico identificado: ${node.question}.`,
    estimated_min: node.estimated_min !== undefined ? node.estimated_min : Math.round((node.suggestedProducts || []).reduce((sum: number, p: any) => sum + p.price, 0) * 0.8) || 45,
    estimated_max: node.estimated_max !== undefined ? node.estimated_max : Math.round((node.suggestedProducts || []).reduce((sum: number, p: any) => sum + p.price, 0) * 1.2) || 120,
  };
};

export function useDiagnosticFlow(): UseDiagnosticFlowReturn {
  // Estados de flujo
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceTypeState] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [symptomPath, setSymptomPath] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<{ node: any; options: any[] }[]>([]);
  const [terminalNode, setTerminalNode] = useState<any>(null);

  // Estados de cliente
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  // Iniciar Diagnóstico
  const setDeviceType = (device: string) => {
    setDeviceTypeState(device);
    setSymptomPath([]);
    setHistory([]);
    setSuggestedProducts([]);
    setTerminalNode(null);

    const rootNodeId = `root_${device.toLowerCase()}`;
    const rootNode = getNodeById(rootNodeId);

    if (rootNode) {
      const mappedRoot = mapNode(rootNode);
      setCurrentNode(mappedRoot);
      const opts = getOptionsForNode(rootNodeId).map(mapNode);
      setOptions(opts);
      setStep(2);
    } else {
      alert('Tipo de dispositivo no válido.');
    }
  };

  // Avanzar nodo del árbol
  const selectOption = (optionNode: any) => {
    // Almacenar el nodo actual mapeado antes de avanzar
    setHistory((prev) => [...prev, { node: currentNode, options }]);
    
    // Guardar el formato "Pregunta → Respuesta"
    const currentQuestionText = currentNode?.question_text || currentNode?.question || 'Pregunta';
    const selectedAnswerOption = optionNode?.answer_option || optionNode?.question || 'Opción';
    setSymptomPath((prev) => [...prev, `${currentQuestionText} → ${selectedAnswerOption}`]);

    const mappedNode = mapNode(optionNode);
    setCurrentNode(mappedNode);

    if (optionNode.isTerminal) {
      setSuggestedProducts(optionNode.suggestedProducts || []);
      setTerminalNode(mappedNode);
      setStep(4); // Avanzar directamente al paso 4 (Contacto, mapeado como paso 3 en el Stepper)
    } else {
      const opts = getOptionsForNode(optionNode.id).map(mapNode);
      setOptions(opts);
    }
  };

  // Retroceder
  const handleBack = () => {
    if (step === 2 && history.length === 0) {
      setStep(1);
      setCurrentNode(null);
      setOptions([]);
      setSymptomPath([]);
      setDeviceTypeState(null);
    } else if (step === 4) {
      // Si estamos en el formulario de contacto (Paso 4), volvemos a la última pregunta
      if (history.length > 0) {
        const lastHistory = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        setCurrentNode(lastHistory.node);
        setOptions(lastHistory.options);
        setSymptomPath((prev) => prev.slice(0, -1));
        setTerminalNode(null);
        setSuggestedProducts([]);
        setStep(2);
      }
    } else if (history.length > 0) {
      const lastHistory = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentNode(lastHistory.node);
      setOptions(lastHistory.options);
      setSymptomPath((prev) => prev.slice(0, -1));
      if (terminalNode && lastHistory.node.id === terminalNode.id) {
        setTerminalNode(null);
        setSuggestedProducts([]);
        setStep(2);
      }
    }
  };

  // Rellenar datos cliente
  const setClientField = (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => {
    if (field === 'clientName') setClientName(value);
    if (field === 'clientEmail') setClientEmail(value);
    if (field === 'clientPhone') setClientPhone(value);
  };

  // Submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert('Por favor completa todos los campos de contacto.');
      return;
    }

    setIsSubmitting(true);

    // Simular envío al servidor
    setTimeout(() => {
      const generatedTicketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setTicketId(generatedTicketId);
      setStep(5);
      setIsSubmitting(false);
    }, 1000);
  };

  // Reset
  const resetFlow = () => {
    setStep(1);
    setDeviceTypeState(null);
    setCurrentNode(null);
    setOptions([]);
    setSymptomPath([]);
    setSuggestedProducts([]);
    setHistory([]);
    setTerminalNode(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setTicketId(null);
  };

  return {
    step,
    deviceType,
    currentNode,
    options,
    symptomPath,
    suggestedProducts,
    clientName,
    clientEmail,
    clientPhone,
    isSubmitting,
    ticketId,
    progressPercentage,
    terminalNode,
    handleBack,
    selectOption,
    handleSubmit,
    setDeviceType,
    setClientField,
    resetFlow,
  };
}
