import React from 'react';
import TecnicoSidebar from '@/components/layout/TecnicoSidebar';

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen text-on-background transition-colors duration-300">
      <TecnicoSidebar />
      <main className="ml-64 min-h-screen">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
      </main>
    </div>
  );
}
