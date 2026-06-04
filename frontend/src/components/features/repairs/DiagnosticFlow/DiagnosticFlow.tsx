'use client';

import React, { useState } from 'react';
import { IDiagnosticFlowProps } from '@/interfaces/components';
import { Button, Card, Icon } from '@/components/ui';

export const DiagnosticFlow = ({ nodes, onComplete }: IDiagnosticFlowProps) => {
  const [currentNodeId, setCurrentNodeId] = useState(nodes[0]?.id);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = nodes.find(n => n.id === currentNodeId);

  const handleOptionClick = (option: any) => {
    if (option.nextStepId) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(option.nextStepId);
    } else if (option.action === 'complete') {
      onComplete({ status: 'finished', finalNode: currentNodeId });
    }
  };

  const handleBack = () => {
    const prevId = history.pop();
    if (prevId) {
      setCurrentNodeId(prevId);
      setHistory([...history]);
    }
  };

  if (!currentNode) return <div>Error: Nodo no encontrado</div>;

  return (
    <Card className="max-w-2xl mx-auto border-2 border-[var(--color-primary)]/20 shadow-xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="Activity" className="text-[var(--color-primary)]" />
            Asistente de Diagnóstico
          </h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              Volver
            </Button>
          )}
        </div>

        <div className="py-8 text-center space-y-4">
          <p className="text-2xl font-semibold leading-tight">
            {currentNode.question}
          </p>
        </div>

        <div className="grid gap-3">
          {currentNode.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="w-full p-4 text-left rounded-lg border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-all group flex justify-between items-center"
            >
              <span className="font-medium group-hover:text-[var(--color-primary)]">{option.label}</span>
              <Icon name="ChevronRight" size={18} className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)]" />
            </button>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <div className="flex gap-1">
            {nodes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-8 rounded-full ${idx <= history.length ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
