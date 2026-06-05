import { Suspense } from 'react';
import AuthPageClient from './AuthPageClient';

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>}>
      <AuthPageClient />
    </Suspense>
  );
}
