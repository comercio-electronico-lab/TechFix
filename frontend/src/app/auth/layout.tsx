'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Usamos requestAnimationFrame para asegurar que el cambio de estado
    // ocurra después del primer frame de renderizado, evitando la advertencia
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--color-background)]" />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[var(--color-background)] font-sans antialiased">
        {children}
      </div>
    </ThemeProvider>
  );
}
