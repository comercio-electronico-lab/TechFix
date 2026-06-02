import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import AboutMetrics from '@/components/about/AboutMetrics';
import AboutPhilosophy from '@/components/about/AboutPhilosophy';
import AboutLabStandards from '@/components/about/AboutLabStandards';
import AboutTeam from '@/components/about/AboutTeam';
import AboutCTA from '@/components/about/AboutCTA';

export const metadata = {
  title: 'Sobre Nosotros - TechFix',
  description: 'Conoce la historia, valores y el equipo de ingenieros detrás de TechFix, el servicio técnico premium líder en reparación de dispositivos de alta gama.',
};

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero />
      <AboutMetrics />
      <AboutPhilosophy />
      <AboutLabStandards />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}
