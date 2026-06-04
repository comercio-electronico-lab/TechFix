'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDiagnosticNodeById } from '@/actions';
import { IDiagnosticNode, IDiagnosticOption, IDiagnosticHistory, IProduct } from '@/interfaces/domain';

export interface UseDiagnosticFlowReturn {
  step: number;
  deviceType: string | null;
  currentNode: IDiagnosticNode | null;
  options: IDiagnosticOption[];
  symptomPath: string[];
  suggestedProducts: IProduct[];
  history: IDiagnosticHistory[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isSubmitting: boolean;
  ticketId: string | null;
  progressPercentage: number;
  terminalNode: IDiagnosticNode | null;
  serialNumber: string;
  deviceModel: string;
  appointmentDate: string;
  appointmentTime: string;
  selectedBranch: string;
  failurePhoto: string | null;
  handleBack: () => void;
  selectOption: (optionNode: IDiagnosticOption) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setDeviceType: (device: string) => void;
  setClientField: (field: string, value: string) => void;
  setFailurePhoto: (photo: string | null) => void;
  resetFlow: () => void;
}

const TOTAL_STEPS = 5;

export function useDiagnosticFlow(): UseDiagnosticFlowReturn {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceTypeState] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<IDiagnosticNode | null>(null);
  const [options, setOptions] = useState<IDiagnosticOption[]>([]);
  const [symptomPath, setSymptomPath] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<IProduct[]>([]);
  const [history, setHistory] = useState<IDiagnosticHistory[]>([]);
  const [terminalNode, setTerminalNode] = useState<IDiagnosticNode | null>(null);
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00 AM - 11:00 AM');
  const [selectedBranch, setSelectedBranch] = useState('Laboratorio Central - Miraflores');
  const [failurePhoto, setFailurePhoto] = useState<string | null>(null);

  const setDeviceType = useCallback(async (device: string) => {
    setDeviceTypeState(device);
    const rootId = `root_${device.toLowerCase()}`;
    const node = await getDiagnosticNodeById(rootId);
    if (node) {
      setCurrentNode(node);
      setOptions(node.options);
      setStep(2);
    }
  }, []);

  const selectOption = useCallback(async (option: IDiagnosticOption) => {
    if (!currentNode) return;
    setHistory(prev => [...prev, { node: currentNode, options }]);
    setSymptomPath(prev => [...prev, `${currentNode.question} → ${option.label}`]);

    if (option.nextStepId) {
      const nextNode = await getDiagnosticNodeById(option.nextStepId);
      if (nextNode) {
        if (nextNode.isTerminal) {
          setTerminalNode(nextNode);
          setSuggestedProducts(nextNode.suggestedProducts || []);
          setStep(4);
        }
        setCurrentNode(nextNode);
        setOptions(nextNode.options);
      }
    }
  }, [currentNode, options]);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentNode(last.node);
      setOptions(last.options);
      setSymptomPath(prev => prev.slice(0, -1));
      if (step === 4) setStep(2);
    } else {
      setStep(1);
    }
  }, [history, step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setTicketId(`TK-${Date.now()}`);
      setStep(5);
      setIsSubmitting(false);
    }, 1000);
  };

  const resetFlow = useCallback(() => {
    setStep(1);
    setDeviceTypeState(null);
    setCurrentNode(null);
    setSymptomPath([]);
    setHistory([]);
    setTicketId(null);
  }, []);

  return {
    step, deviceType, currentNode, options, symptomPath, suggestedProducts, history,
    clientName, clientEmail, clientPhone, isSubmitting, ticketId, progressPercentage: (step / TOTAL_STEPS) * 100,
    terminalNode, serialNumber, deviceModel, appointmentDate, appointmentTime, selectedBranch, failurePhoto,
    handleBack, selectOption, handleSubmit, setDeviceType,
    setClientField: (f, v) => { if (f === 'clientName') setClientName(v); },
    setFailurePhoto, resetFlow
  };
}
