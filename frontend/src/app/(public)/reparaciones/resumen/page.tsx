"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Wrench, 
  ShoppingCart, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface SuggestedPart {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

function DiagnosticSummaryContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  
  // Parámetros dinámicos del diagnóstico anterior o valores por defecto
  const ticketId = searchParams.get('ticket') || 'TK-2026-8042';
  const device = searchParams.get('device') || 'Dispositivo Técnico';
  const category = searchParams.get('category') || 'Display';
  const detail = searchParams.get('detail') || 'Pantalla completamente negra (no da imagen).';

  const [addedParts, setAddedParts] = useState<string[]>([]);

  // Configuración del diagnóstico dinámico basado en la selección del cliente
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

  // Agregar componente al carrito de compras real
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
      
      {/* Contenido Principal en dos columnas */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Columna Izquierda: Diagnóstico e Informe */}
        <div className="flex-grow flex flex-col gap-8 md:w-2/3">
          
          {/* Header del Resumen */}
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

          {/* Tarjeta de Diagnóstico Principal */}
          <div className="bg-surface-container-low dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-primary dark:hover:border-sky-500 transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container dark:bg-sky-500 opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-105"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
              
              <div className="flex-grow">
                <span className="inline-block bg-error-container text-on-error-container dark:bg-red-950/40 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-error/20">
                  {diagnosticData.badge}
                </span>
                
                <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-on-surface dark:text-slate-100 mb-2">
                  {diagnosticData.title}
                </h2>
                
                <p className="text-base text-on-surface-variant dark:text-slate-400 mb-4 leading-relaxed">
                  {diagnosticData.description}
                </p>
                
                <div className="flex items-center gap-4 text-on-surface-variant dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-outline dark:text-slate-500" />
                    <span>Tiempo Estimado: {diagnosticData.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-outline dark:text-slate-500" />
                    <span>Dificultad: {diagnosticData.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Rango de Precios */}
              <div className="flex-shrink-0 flex flex-col items-start md:items-end md:text-right border-t md:border-t-0 md:border-l border-outline-variant dark:border-slate-800 pt-6 md:pt-0 md:pl-6 min-w-[160px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-500 mb-1">
                  Costo de Reparación Est.
                </span>
                
                <div className="text-3xl md:text-4xl font-bold text-primary dark:text-sky-400 mb-2 flex items-baseline tracking-tight font-mono">
                  <span>${diagnosticData.costMin}</span>
                  <span className="text-on-surface-variant/40 dark:text-slate-650 mx-1.5">-</span>
                  <span>${diagnosticData.costMax}</span>
                </div>
                
                <span className="text-[11px] text-on-surface-variant dark:text-slate-500 leading-tight max-w-[150px] md:max-w-none">
                  *Incluye refacciones genuinas y mano de obra experta en laboratorio.
                </span>
              </div>

            </div>
          </div>

          {/* Componentes Requeridos para Auto-Reparación */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-on-surface dark:text-slate-100 mb-2 tracking-tight">
                Componentes Recomendados
              </h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1 leading-normal">
                Si cuentas con experiencia técnica avanzada, estas son las refacciones OEM certificadas necesarias para completar la labor tú mismo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticData.parts.map((part) => {
                const isAlreadyAdded = addedParts.includes(part.id);
                
                return (
                  <div 
                    key={part.id} 
                    className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-4 flex gap-4 items-center hover:border-primary dark:hover:border-sky-500 hover:shadow-sm transition-all duration-300"
                  >
                    {/* Miniatura del Componente */}
                    <div className="w-20 h-20 bg-surface-container-low dark:bg-slate-950/40 rounded-md flex-shrink-0 flex items-center justify-center p-1 overflow-hidden border border-outline-variant dark:border-slate-800">
                      <img 
                        src={part.image} 
                        alt={part.name} 
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95 select-none" 
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-on-surface dark:text-slate-200 line-clamp-1 leading-snug">
                        {part.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 mb-2 line-clamp-1">
                        {part.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-base text-primary dark:text-sky-400 font-mono">
                          ${part.price.toFixed(2)}
                        </span>
                        
                        {isAlreadyAdded ? (
                          <span className="text-xs font-semibold text-emerald-650 dark:text-emerald-405 uppercase bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-250 dark:border-emerald-900/60">
                            Agregado
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleAddPartToCart(part)}
                            className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-slate-950 px-3 py-1 rounded text-xs font-semibold transition-all active:scale-[0.96] cursor-pointer"
                          >
                            Añadir Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Columna Derecha: Panel de Acciones */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="bg-surface-container dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 sticky top-24 shadow-sm">
            <h3 className="text-2xl font-semibold text-on-surface dark:text-slate-100 mb-4 border-b border-outline-variant/10 dark:border-slate-800 pb-3 uppercase tracking-wider text-xs">
              Siguientes Pasos
            </h3>
            
            <div className="flex flex-col gap-4">
              
              {/* Botón Principal: Comprar Piezas */}
              <Link href="/carrito" className="w-full">
                <button 
                  className="w-full bg-primary hover:bg-primary/95 text-on-primary dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-slate-950 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Piezas (DIY)
                </button>
              </Link>
              
              {/* Divisor OR */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-outline dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Ó</span>
                <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
              </div>
              
              {/* Botón Secundario: Reservar Reparación Profesional */}
              <Link href="/portal" className="w-full">
                <button 
                  className="w-full bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-primary/5 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Reservar Cita Profesional
                </button>
              </Link>

            </div>

            {/* Asistencia de Soporte */}
            <div className="mt-6 pt-6 border-t border-outline-variant dark:border-slate-800">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-secondary dark:text-sky-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-on-surface dark:text-slate-200">
                    ¿Necesitas Asesoría?
                  </h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-normal">
                    Nuestros ingenieros de hardware están a tu total disposición para ayudarte a decidir.
                  </p>
                  <Link 
                    href="/portal" 
                    className="text-sm font-semibold text-primary dark:text-sky-400 mt-2.5 inline-flex items-center gap-1 hover:underline group"
                  >
                    Contactar Soporte <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default function DiagnosticSummary() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent dark:border-sky-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">Cargando diagnóstico técnico...</p>
        </div>
      </div>
    }>
      <DiagnosticSummaryContent />
    </Suspense>
  );
}
