import React from 'react';
import { Mail, BellRing, Printer, Home } from 'lucide-react';
import Button from '../ui/Button';
import Link from 'next/link';

interface NextStepsCardProps {
  email: string;
}

const NextStepsCard: React.FC<NextStepsCardProps> = ({ email }) => {
  return (
    <div className="bg-primary text-white rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Siguientes Pasos</h2>
      <ul className="space-y-6 mb-10">
        <li className="flex gap-4">
          <Mail className="text-secondary-container shrink-0 w-6 h-6" />
          <span className="text-sm opacity-90">Hemos enviado un correo de confirmación con tu factura a {email}</span>
        </li>
        <li className="flex gap-4">
          <BellRing className="text-secondary-container shrink-0 w-6 h-6" />
          <span className="text-sm opacity-90">Recibirás una notificación en cuanto tus partes salgan de nuestro almacén.</span>
        </li>
      </ul>
      <div className="space-y-4">
        <Button variant="secondary" className="w-full py-4 flex items-center justify-center gap-2 shadow-lg">
          <Printer className="w-5 h-5" />
          Imprimir Recibo
        </Button>
        <Link href="/">
          <Button variant="outline-white" icon={Home} className="w-full mt-4">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NextStepsCard;
