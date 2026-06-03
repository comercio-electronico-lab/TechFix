import DiagnosticStepper from '@/components/repair/DiagnosticStepper';
import AsistenteDiagnosticoClient from '@/components/repair/AsistenteDiagnosticoClient';

export default function ReparacionesPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] py-6 md:py-12 px-4 md:px-gutter bg-surface-bright dark:bg-slate-950 transition-colors duration-300 flex justify-center">
      <div className="max-w-5xl w-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <DiagnosticStepper currentStep={1} onBack={() => {}} />
        <AsistenteDiagnosticoClient />
      </div>
    </div>
  );
}
