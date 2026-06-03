'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import DiagnosticSummaryCard from '@/components/repair/DiagnosticSummaryCard';
import SuggestedPartsList, { SuggestedPart } from '@/components/repair/SuggestedPartsList';
import RepairActionPanel from '@/components/repair/RepairActionPanel';

export default function DiagnosticSummaryClient() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const ticketId = searchParams.get('ticket') || 'TK-2026-8042';
  const device = searchParams.get('device') || 'Dispositivo Técnico';
  const category = searchParams.get('category') || 'Display';

  const [addedParts, setAddedParts] = useState<string[]>([]);

  const diagnosticData = useMemo(() => {
    switch (category) {
      case 'Display':
        return {
          badge: 'Falla Crítica',
          title: 'Display Assembly Failure',
          description: 'Los síntomas reportados apuntan de manera concluyente a un panel LCD/OLED degradado o a una fisura interna en el flex de transmisión de video. Recomendamos el reemplazo integral del módulo de pantalla para restaurar la resolución y respuesta táctil original.',
          time: '1-2 Horas',
          difficulty: 'Avanzado',
          costMin: 150,
          costMax: 220,
          parts: [
            {
              id: 'part-display-oled',
              name: 'OLED Display Assembly (Grade A)',
              price: 129.99,
              description: 'Calibración de color original y respuesta capacitiva táctil de precisión.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA76uqYRnN1ri42hmnXJ945qOuim-uH037CWXo1xO8UMFCT1GWCD1fq1bbJIFNOh5Sk2W9DQLwUml1jEzr6xpfBUyoZn08yxOi5dUMjB4e3cG7-Ui5tzDEa1MbggerpYNJCJmPr84DBQEd6aEfBxEG8vVfetpYd7M6lkNlZImeA0JzfqFvmr1sQPomLysNc4UiUFeS1AaVIYHRRVrHoh-sOyKk4ziDxhWIaT62XeBH9_uAGBv8wdfXTUV_nbiPxtADUXasbXxpfA1tn'
            },
            {
              id: 'part-toolkit',
              name: 'Kit de Herramientas de Precisión',
              price: 24.50,
              description: 'Destornilladores magnéticos y ventosas especiales de desmontaje.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_xBxxq7K1mVbvqTlJssT6nBShaTbdKY7tkY7sBOsf5Tjz9Svc25m82TppOFu1lhYxZWpral5ViCNwMxSdfpThjlQt5V2LYYOJC8b8GorIoJ_LJYRvnFAU-llGsQisNFtZ8zoN3acDau_SKwxDhesqTUDxUOQP6eUU_bUOwPoaocAsU3BcCdB4_hgBkqlLZskQyLs2LD-tPMwGK8EdeTaUqaNIBUbqwT5FvIbJbCp-Dza9Q8YbtxtruEnBriiMDAcLt2IJWGqbfYZ5'
            }
          ]
        };
      case 'Battery':
        return {
          badge: 'Advertencia de Rendimiento',
          title: 'Battery Degradation / Power System Failure',
          description: 'La tasa de descarga y comportamiento térmico indican una pérdida masiva en la retención de miliamperios. La celda de iones de litio ha completado sus ciclos útiles de vida. Requiere extracción segura y reemplazo con sellado hermético.',
          time: '30-45 Minutos',
          difficulty: 'Medio',
          costMin: 45,
          costMax: 79,
          parts: [
            {
              id: 'part-battery',
              name: 'Batería de Reemplazo Li-Ion de Alta Capacidad',
              price: 39.99,
              description: 'Celdas premium con protección contra sobrecargas y calibración de ciclos.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXRzafqDUD34bipauzTsS-oxqVXXfaGRrdwupCGc27ZLVwUkDaoFeMmDPNBCCzxaLQjBEUc4Kk1UqT5EWV5qcuKTXA0RUTkz4180C8i7qHlBEVl3n64OCypjU0io7b7yu5fklRYC7gciG3eidYQUSMDqEqdRFxWMX-Nb3rabHAxP-kSgEvhIsWE9V0CObJtYBB2Tbnz3HL3porDxa5JhuOjcJMKYaBaNZ8BpaZFTQ_CgvIYz35qcFuxIxfi6YB661hN3TOlipjKdKz'
            },
            {
              id: 'part-toolkit',
              name: 'Kit de Herramientas de Precisión',
              price: 24.50,
              description: 'Destornilladores magnéticos y ventosas especiales de desmontaje.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_xBxxq7K1mVbvqTlJssT6nBShaTbdKY7tkY7sBOsf5Tjz9Svc25m82TppOFu1lhYxZWpral5ViCNwMxSdfpThjlQt5V2LYYOJC8b8GorIoJ_LJYRvnFAU-llGsQisNFtZ8zoN3acDau_SKwxDhesqTUDxUOQP6eUU_bUOwPoaocAsU3BcCdB4_hgBkqlLZskQyLs2LD-tPMwGK8EdeTaUqaNIBUbqwT5FvIbJbCp-Dza9Q8YbtxtruEnBriiMDAcLt2IJWGqbfYZ5'
            }
          ]
        };
      case 'Performance':
        return {
          badge: 'Falla del Procesador',
          title: 'Thermal & System Board Instability',
          description: 'El colapso de rendimiento térmico indica resecamiento absoluto del compuesto conductor original o fisura por calor. Se recomienda limpieza del encapsulado y reinstalación de compuesto de metal líquido/pasta térmica de alto rendimiento.',
          time: '1-2 Horas',
          difficulty: 'Avanzado',
          costMin: 59,
          costMax: 109,
          parts: [
            {
              id: 'part-thermal',
              name: 'Thermal Grizzly Kryonaut Extreme 1g',
              price: 15.00,
              description: 'Compuesto térmico de máxima conductividad de grado industrial.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnlMbnng-Tto1PqWo3DFn2hJykYWyHz8TKE2PVnIxehLi5fWUye1lFLIkjthXV5td8yLkdKP6-00111U4rQgSSIjdQz18Aa0hmljAvVAl1OSbFrXq6ZlcKfLCdntBu7ja4Stpfa-2Efp3eTkaphaSt6c52-QSj65qNVHn81-E8AJZipmT6rmQr0DOTmqxQ6uACN5Lx9G8LbMmI5VI6nXRrJfLp9miM4iprKHf6FAg17n_H0nZSAwihosudVjpYfKSrrbiC4xJVN8M'
            },
            {
              id: 'part-toolkit',
              name: 'Kit de Herramientas de Precisión',
              price: 24.50,
              description: 'Destornilladores magnéticos y ventosas especiales de desmontaje.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_xBxxq7K1mVbvqTlJssT6nBShaTbdKY7tkY7sBOsf5Tjz9Svc25m82TppOFu1lhYxZWpral5ViCNwMxSdfpThjlQt5V2LYYOJC8b8GorIoJ_LJYRvnFAU-llGsQisNFtZ8zoN3acDau_SKwxDhesqTUDxUOQP6eUU_bUOwPoaocAsU3BcCdB4_hgBkqlLZskQyLs2LD-tPMwGK8EdeTaUqaNIBUbqwT5FvIbJbCp-Dza9Q8YbtxtruEnBriiMDAcLt2IJWGqbfYZ5'
            }
          ]
        };
      default:
        return {
          badge: 'Evaluación Técnica',
          title: 'Physical Component Damage',
          description: 'El análisis lógico inicial indica un fallo mecánico estructural o corrosión galvánica localizada por líquidos. Recomendamos un lavado químico por ultrasonido prioritario en placa base para detener el avance del óxido.',
          time: '2-3 Horas',
          difficulty: 'Avanzado',
          costMin: 39,
          costMax: 129,
          parts: [
            {
              id: 'part-toolkit',
              name: 'Kit de Herramientas de Precisión',
              price: 24.50,
              description: 'Destornilladores magnéticos y ventosas especiales de desmontaje.',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_xBxxq7K1mVbvqTlJssT6nBShaTbdKY7tkY7sBOsf5Tjz9Svc25m82TppOFu1lhYxZWpral5ViCNwMxSdfpThjlQt5V2LYYOJC8b8GorIoJ_LJYRvnFAU-llGsQisNFtZ8zoN3acDau_SKwxDhesqTUDxUOQP6eUU_bUOwPoaocAsU3BcCdB4_hgBkqlLZskQyLs2LD-tPMwGK8EdeTaUqaNIBUbqwT5FvIbJbCp-Dza9Q8YbtxtruEnBriiMDAcLt2IJWGqbfYZ5'
            }
          ]
        };
    }
  }, [category]);

  const handleAddPartToCart = (part: SuggestedPart) => {
    addItem({
      id: part.id,
      name: part.name,
      price: part.price,
      image: part.image,
      description: part.description,
      tags: ['Repuesto OEM']
    });
    setAddedParts(prev => [...prev, part.id]);
  };

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col font-sans antialiased transition-colors duration-300">
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-6">
        <div className="flex-grow flex flex-col gap-8 md:w-2/3">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2 text-primary dark:text-sky-400">
              <CheckCircle2 className="w-5 h-5 text-primary dark:text-sky-400 fill-primary dark:fill-transparent animate-pulse" />
              <span className="font-semibold text-xs uppercase tracking-wider">Análisis Lógico Completado</span>
            </div>
            <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
              Resumen del Diagnóstico
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed">
              Basándonos en tu cuestionario para el <span className="font-bold text-primary dark:text-sky-400">{device}</span> (Ticket: <span className="font-mono font-bold select-all text-primary dark:text-sky-400">{ticketId}</span>), hemos identificado el diagnóstico y costos estimados.
            </p>
          </div>

          <DiagnosticSummaryCard
            badge={diagnosticData.badge}
            title={diagnosticData.title}
            description={diagnosticData.description}
            time={diagnosticData.time}
            difficulty={diagnosticData.difficulty}
            costMin={diagnosticData.costMin}
            costMax={diagnosticData.costMax}
          />

          <SuggestedPartsList
            parts={diagnosticData.parts}
            addedParts={addedParts}
            onAddPart={handleAddPartToCart}
          />
        </div>

        <div className="md:w-1/3 flex flex-col gap-6">
          <RepairActionPanel />
        </div>
      </main>
    </div>
  );
}
