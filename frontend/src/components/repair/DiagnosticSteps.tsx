'use client';

// Modular Steps (New Segmented Flow)
export { Step1_DeviceType } from './steps/Step1_DeviceType';
export { Step2_Brand } from './steps/Step2_Brand';
export { Step3_Model } from './steps/Step3_Model';
export { Step4_Damage } from './steps/Step4_Damage';

// Legacy Steps (Keep for backward compatibility)
export { SelectionCard } from './steps/SelectionCard';
export { DiagnosticStep1 } from './steps/Step1DeviceSelection';
export { DiagnosticStep2 } from './steps/Step2Questionnaire';
export { DiagnosticStep4 } from './steps/Step4ContactForm';
export { DiagnosticStep5 } from './steps/Step5ReportAndCrossSell';
export { Step3AuthGate } from './steps/Step3AuthGate';
