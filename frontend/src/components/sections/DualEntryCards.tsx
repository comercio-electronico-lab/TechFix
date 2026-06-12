import React from 'react';
import PremiumBanner from './PremiumBanner';

const DualEntryCards = () => {
  const cards = [
    {
      id: "pig-assistant",
      tagline: "ASISTENTE INTELIGENTE PIG",
      title: "¿Tu equipo presenta fallas de hardware?",
      description: "Utiliza nuestro asistente de diagnóstico automatizado. Descubre problemas de batería, pantalla, cortocircuitos o software en menos de 2 minutos.",
      image: "/diagnostic_assistant.png",
      isDarkTheme: false,
      bgGradient: "from-[#f5f5f7] to-[#ffffff] dark:from-[#061533] dark:to-[#020816]",
      linkAction: "/reparaciones",
      actionText: "Diagnosticar mi equipo",
    },
    {
      id: "diy-parts",
      tagline: "REPUESTOS Y KITS DE TIENDA",
      title: "¿Buscas repuestos profesionales u OEM?",
      description: "Adquiere repuestos directos de fábrica: pantallas, baterías de alta densidad, memorias ultrarrápidas y herramientas especializadas de calibración.",
      image: "/premium_parts.png",
      isDarkTheme: true,
      bgGradient: "from-[#000000] to-[#000000]", // pure black
      linkAction: "/catalogo",
      actionText: "Ver catálogo de repuestos",
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 bg-background">
      {cards.map((card) => (
        <PremiumBanner
          key={card.id}
          id={card.id}
          tagline={card.tagline}
          title={card.title}
          description={card.description}
          image={card.image}
          isDarkTheme={card.isDarkTheme}
          bgGradient={card.bgGradient}
          linkAction={card.linkAction}
          actionText={card.actionText}
        />
      ))}
    </div>
  );
};

export default DualEntryCards;
