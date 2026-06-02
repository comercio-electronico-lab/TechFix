'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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

export function useDiagnosticFlow(): UseDiagnosticFlowReturn {
  const { token } = useAuth();
  
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  // Iniciar Diagnóstico (Obtiene nodo raíz)
  const setDeviceType = async (device: string) => {
    setDeviceTypeState(device);
    setSymptomPath([]);
    setHistory([]);
    setSuggestedProducts([]);
    setTerminalNode(null);

    try {
      const res = await fetch(`${API_URL}/api/pig/start?device_type=${device}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentNode(data.current_node);
        setOptions(data.options);
        setStep(2);
      } else {
        alert('Error al iniciar el asistente de diagnóstico.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    }
  };

  // Avanzar nodo del árbol
  const selectOption = async (optionNode: any) => {
    // Registrar paso en el historial de síntomas
    const formattedStep = `${currentNode.question_text} → ${optionNode.answer_option}`;
    setSymptomPath(prev => [...prev, formattedStep]);

    // Si es terminal, guardar nodo terminal y proceder al formulario de contacto
    if (optionNode.is_terminal) {
      setTerminalNode(optionNode);
      setStep(4);
      return;
    }

    // Guardar estado actual en el historial para backtracking
    setHistory(prev => [...prev, { node: currentNode, options: options }]);

    // Obtener siguiente nodo
    try {
      const res = await fetch(`${API_URL}/api/pig/node/${optionNode.id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentNode(data.current_node);
        setOptions(data.options);
      } else {
        alert('Error al cargar la siguiente pregunta.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    }
  };

  // Backtracking (Retroceder pasos de forma interactiva en el árbol)
  const handleBack = () => {
    if (step === 4) {
      // Regresa de la pantalla de formulario al último nodo de pregunta
      setStep(2);
      setTerminalNode(null);
      
      // Remover último síntoma
      setSymptomPath(prev => prev.slice(0, -1));
      return;
    }

    if (step === 2) {
      if (history.length === 0) {
        // Regresa al Paso 1: Selección de dispositivo
        setStep(1);
        setDeviceTypeState(null);
        setCurrentNode(null);
        setOptions([]);
        setSymptomPath([]);
      } else {
        // Pop de la historia anterior
        const prevHistory = [...history];
        const last = prevHistory.pop();
        setHistory(prevHistory);

        if (last) {
          setCurrentNode(last.node);
          setOptions(last.options);
        }

        // Remover último síntoma registrado
        setSymptomPath(prev => prev.slice(0, -1));
      }
    }
  };

  const setClientField = (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => {
    if (field === 'clientName') setClientName(value);
    else if (field === 'clientEmail') setClientEmail(value);
    else if (field === 'clientPhone') setClientPhone(value);
  };

  // Enviar sesión diagnóstica final
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !terminalNode) return;

    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body = {
        terminal_node_id: terminalNode.id,
        symptom_path: symptomPath,
      };

      const res = await fetch(`${API_URL}/api/pig/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // Mapear repuestos sugeridos del backend
        const mappedProducts = (data.suggested_products || []).map((p: any) => ({
          id: p.id,
          sku: p.sku || 'N/A',
          name: p.nombre,
          description: p.descripcion || '',
          price: p.precio_venta,
          category: p.categoria,
          image: p.imagen_url || 'https://via.placeholder.com/300',
          status: p.status || 'In Stock',
        }));

        setSuggestedProducts(mappedProducts);

        // Generar ticket preliminar
        const randomTicket = `TKT-PIG-${Math.floor(1000 + Math.random() * 9000)}`;
        setTicketId(randomTicket);
        setStep(5);
      } else {
        alert(data.error || 'Error al guardar el diagnóstico técnico.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setDeviceTypeState(null);
    setCurrentNode(null);
    setOptions([]);
    setSymptomPath([]);
    setSuggestedProducts([]);
    setHistory([]);
    setTerminalNode(null);
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
