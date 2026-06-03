import { Truck, ShieldCheck } from 'lucide-react';

export default function ProductFooter() {
  return (
    <div className="flex items-center gap-6 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
      <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Envío Gratis</div>
      <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 2 Años de Garantía</div>
    </div>
  );
}
