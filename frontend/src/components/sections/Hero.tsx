'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Container from '../ui/Container';
import { Wrench, ShoppingCart } from 'lucide-react';

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero-gradient relative overflow-hidden -mt-14 pt-36 pb-20 text-white min-h-[90vh] flex items-center justify-center">
      {/* Background Radial Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,97,161,0.25)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Badge with pulse/entrance */}
        <div 
          className={`transition-all duration-1000 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Badge variant="secondary" className="mb-6 px-4! py-1.5! text-[11px]! font-black! bg-secondary-container/20 border-secondary-container/30 text-sky-400">
            Laboratorio Técnico y Hardware OEM
          </Badge>
        </div>

        {/* Title with stark gradient contrast */}
        <h1 
          className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mb-6 transition-all duration-1000 delay-200 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Calidad de Ingeniería <br />
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            para cada dispositivo.
          </span>
        </h1>

        {/* Short clean description */}
        <p 
          className={`font-medium text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed transition-all duration-1000 delay-400 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Reparaciones especializadas de hardware a nivel de microcomponente y un catálogo curado de componentes certificados de fábrica. Precisión profesional garantizada.
        </p>

        {/* Action Buttons */}
        <div 
          className={`flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 delay-600 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link href="/reparaciones">
            <Button variant="primary" icon={Wrench} className="btn-sweep !py-3.5 !px-8 text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] transition-all">
              Reservar Reparación
            </Button>
          </Link>
          <Link href="/catalogo">
            <Button variant="outline-white" icon={ShoppingCart} className="btn-sweep !py-3.5 !px-8 text-xs font-black uppercase tracking-wider hover:bg-white/10 hover:scale-[1.02] transition-all">
              Comprar Repuestos
            </Button>
          </Link>
        </div>

        {/* Image Showcase framed like a premium device presentation */}
        <div 
          className={`w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/40 backdrop-blur-sm p-2 transition-all duration-1200 delay-800 ease-out transform ${
            mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-16'
          }`}
        >
          <div className="rounded-xl overflow-hidden aspect-video relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent z-10" />
            <img 
              alt="Hardware Técnico de Precisión" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0T0BldPpCgoZQ0J_wCqXDXBCX0tOWLgNaI6dcVNp0x40wKd-kJp2iCm7y9bzM_DM-OUHOFW2PwYYk8tyxAHw3N3Ce6Y6Bp1TvGzxNqJq2Y8Kez2JzptHlL7--BjopUElmBR92UdFTGQERg9nFjQTvUd8HUt5I1XbQTYc5gny7zMXFvHHSkcBy6ZKq7lauq5kS44uOZI_BmyDyMGx42n2T7FhjI1iP-eEeXNsx3rv5mc-chIanF7NMSzMs7Gt1hMK7INA1qecSGqQ"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
