import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Container from '../ui/Container';
import { Wrench, ShoppingCart } from 'lucide-react';

const HeroContent = () => (
  <div className="z-10">
    <Badge variant="secondary" className="mb-stack-md px-4! py-1! text-[12px]!">
      Servicios de Reparación Premium
    </Badge>
    <h1 className="text-white mb-stack-md">
      Calidad de Ingeniería para cada dispositivo.
    </h1>
    <p className="font-body-lg text-white/80 mb-stack-lg max-w-xl">
      Reparaciones de hardware expertas y un catálogo curado de tecnología de alto rendimiento. 
      Desde portátiles empresariales hasta smartphones insignia, lo reparamos con precisión.
    </p>
    <div className="flex flex-wrap gap-stack-md">
      <Link href="/reparaciones">
        <Button variant="primary" icon={Wrench}>
          Reservar Reparación
        </Button>
      </Link>
      <Link href="/catalogo">
        <Button variant="accent" icon={ShoppingCart}>
          Comprar ahora
        </Button>
      </Link>
      <Link href="/catalogo">
        <Button variant="outline-white">
          Explorar Hardware
        </Button>
      </Link>
    </div>
  </div>
);

const HeroVisual = () => (
  <div className="relative">
    <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary-container/20 rounded-full blur-[100px]"></div>
    <div className="relative z-10 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <img 
        alt="Hardware Técnico" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0T0BldPpCgoZQ0J_wCqXDXBCX0tOWLgNaI6dcVNp0x40wKd-kJp2iCm7y9bzM_DM-OUHOFW2PwYYk8tyxAHw3N3Ce6Y6Bp1TvGzxNqJq2Y8Kez2JzptHlL7--BjopUElmBR92UdFTGQERg9nFjQTvUd8HUt5I1XbQTYc5gny7zMXFvHHSkcBy6ZKq7lauq5kS44uOZI_BmyDyMGx42n2T7FhjI1iP-eEeXNsx3rv5mc-chIanF7NMSzMs7Gt1hMK7INA1qecSGqQ"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="hero-gradient relative overflow-hidden -mt-18 pt-38 pb-section-padding text-white">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
        <HeroContent />
        <HeroVisual />
      </Container>
    </section>
  );
};

export default Hero;
