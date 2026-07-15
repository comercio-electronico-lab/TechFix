'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ChevronLeft, Send } from 'lucide-react';

interface Step6Props {
  deviceType: string;
  brand: string;
  model: string;
  damageDescription: string;
  onDiagnosisComplete: (sessionId: string, result: DiagnosticResult) => void;
  onBack: () => void;
}

interface DiagnosticResult {
  turn_number: number;
  is_terminal: boolean;
  question?: string;
  diagnosis?: string;
  estimated_min_price?: number;
  estimated_max_price?: number;
  recommended_products?: RecommendedProduct[];
}

interface RecommendedProduct {
  name: string;
  category: string;
  estimated_price: number;
  reasoning: string;
  image_url?: string;
  producto_id?: string;
}

export function Step6_AIDiagnostic({
  deviceType,
  brand,
  model,
  damageDescription,
  onDiagnosisComplete,
  onBack,
}: Step6Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ q: string; a: string }>
  >([]);
  const [turnNumber, setTurnNumber] = useState(0);

  // Inicia el diagnóstico
  useEffect(() => {
    const startDiagnostic = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/diagnostic/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            device_type: deviceType,
            initial_issue: damageDescription,
            brand,
            model,
          }),
        });

        if (!response.ok) throw new Error('Failed to start diagnostic');

        const data = await response.json();
        setSessionId(data.session_id);
        setQuestion(data.question);
        setTurnNumber(data.turn_number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error iniciando diagnóstico');
      } finally {
        setLoading(false);
      }
    };

    startDiagnostic();
  }, [deviceType, damageDescription, brand, model]);

  const handleAnswer = async () => {
    if (!answer.trim() || !sessionId) return;

    try {
      setAnswering(true);
      const response = await fetch('/api/diagnostic/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answer: answer.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to answer question');

      const data: DiagnosticResult = await response.json();

      // Agregar a historial
      setConversationHistory([...conversationHistory, { q: question, a: answer }]);

      if (data.is_terminal) {
        // Diagnóstico completado
        onDiagnosisComplete(sessionId, data);
      } else {
        // Siguiente pregunta
        setQuestion(data.question || '');
        setTurnNumber(data.turn_number || 0);
        setAnswer('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error respondiendo pregunta');
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-center items-center py-16">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-sky-400 mx-auto" />
            <p className="text-slate-600 dark:text-slate-400">
              Iniciando diagnóstico por IA...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary dark:text-sky-400 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="text-center text-red-600 dark:text-red-400 py-12">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary dark:text-sky-400 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Historial de conversación */}
      {conversationHistory.length > 0 && (
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg max-h-64 overflow-y-auto">
          {conversationHistory.map((item, idx) => (
            <div key={idx} className="space-y-1 text-sm">
              <p className="font-semibold text-primary dark:text-sky-400">
                Pregunta {idx + 1}: {item.q}
              </p>
              <p className="text-slate-700 dark:text-slate-300">Tu respuesta: {item.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pregunta actual */}
      <div key={turnNumber} className="space-y-6 animate-fade-in-slide">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pregunta {turnNumber}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface dark:text-white">
            {question}
          </h2>
        </div>

        {/* Input para respuesta */}
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Describe tu respuesta aquí..."
            disabled={answering}
            className="w-full p-4 border-2 border-outline-variant/40 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-on-surface dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary dark:focus:border-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-24"
          />

          <button
            onClick={handleAnswer}
            disabled={!answer.trim() || answering}
            className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-sky-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {answering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Respuesta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
