import React from 'react';
import { Cpu } from 'lucide-react';

interface ScanningScreenProps {
  scanText: string;
  scanProgress: number;
}

const ScanningScreen: React.FC<ScanningScreenProps> = ({ scanText, scanProgress }) => {
  return (
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
  );
};

export default ScanningScreen;
