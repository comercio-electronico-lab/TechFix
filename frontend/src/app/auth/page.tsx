import { LoginView } from '@/components/views/LoginView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Laboratorio L1',
  description: 'Accede a tu cuenta en Laboratorio L1',
};

export default function LoginPage() {
  return <LoginView />;
}
