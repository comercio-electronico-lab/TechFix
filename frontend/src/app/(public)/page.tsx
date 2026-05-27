import Hero from "@/components/sections/Hero";
import ServiceBentoGrid from "@/components/sections/ServiceBentoGrid";
import ProductCard from "@/components/cards/ProductCard";
import { mockProducts } from "@/mock/products";
import Link from "next/link";
import { ArrowRight, Radar, ReceiptText } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceBentoGrid />

      {/* Featured Products */}
      <section className="py-section-padding bg-surface-bright">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="text-primary">Hardware Destacado</h2>
              <p className="text-on-surface-variant">Máquinas de alto rendimiento seleccionadas para profesionales.</p>
            </div>
            <Link href="/catalogo" className="text-secondary font-bold flex items-center gap-1 hover:underline">
              Ver Todo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Status CTA Section */}
      <section className="py-section-padding bg-primary-container relative">
        <div className="max-w-container-max mx-auto px-gutter text-center text-white">
          <h2 className="text-white mb-stack-md">¿Listo para restaurar tu tecnología?</h2>
          <p className="font-body-lg text-white/70 mb-stack-lg max-w-2xl mx-auto">
            Nuestros técnicos certificados están listos. Obtén una cotización instantánea para tu reparación o consulta el estado de tu servicio actual.
          </p>
          <div className="flex flex-col sm:flex-row gap-stack-md justify-center">
            <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 text-left border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <Radar className="text-secondary-container w-10 h-10" />
              <div>
                <p className="font-bold text-white">Rastreador de Reparaciones</p>
                <p className="text-sm text-white/60">Consulta por ID de Ticket</p>
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4 text-left border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <ReceiptText className="text-secondary-container w-10 h-10" />
              <div>
                <p className="font-bold text-white">Cotización Instantánea</p>
                <p className="text-sm text-white/60">Estima costos de reparación ahora</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
