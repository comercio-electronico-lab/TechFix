"use client";

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface PigNode {
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

interface QuotationWizardProps {
  deviceType: string;
  currentNode: PigNode;
  options: PigNode[];
  historyLength: number;
  loading: boolean;
  onSelectOption: (option: PigNode) => void;
  onGoBack: () => void;
}

const QuotationWizard: React.FC<QuotationWizardProps> = ({
  deviceType,
  currentNode,
  options,
  historyLength,
  loading,
  onSelectOption,
  onGoBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-lg relative">
        
        {/* Back Button / Breadcrumb */}
        <button 
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-secondary transition-colors mb-6 font-bold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>

        {/* Progress bar info */}
        <div className="flex justify-between items-center text-xs text-on-surface-variant/70 mb-4">
          <span>Paso {historyLength + 1} de tu diagnóstico</span>
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
                onClick={() => onSelectOption(option)}
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
  );
};

export default QuotationWizard;
