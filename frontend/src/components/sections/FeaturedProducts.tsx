import ProductCard from "@/components/cards/ProductCard";
import { mockProducts } from "@/mock/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  return (
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
  );
}
