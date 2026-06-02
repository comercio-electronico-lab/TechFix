'use client';

import React, { use, useState, useEffect } from 'react';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductDetailInfo from '@/components/product/ProductDetailInfo';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sku: string;
  rating: number;
  reviews: number;
  image: string;
  specs: {
    processor: string;
    graphics: string;
    ram: string;
    storage: string;
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await res.json();
        
        // Simular especificaciones técnicas basadas en categoría para la tabla técnica
        const specs = {
          processor: data.categoria === 'Laptops' ? 'Intel i7-13700H / AMD Ryzen 7' : 'Calidad OEM Certificada',
          graphics: data.categoria === 'Laptops' || data.categoria === 'Tarjetas Gráficas' ? 'NVIDIA RTX Series / AMD Radeon' : 'N/A',
          ram: data.categoria === 'Laptops' ? '16GB DDR5 Dual-Channel' : data.categoria === 'Memorias RAM' ? 'Frecuencia Óptima Calibrada' : 'Compatibilidad Universal',
          storage: data.categoria === 'Discos SSD' ? 'Lectura 7000MB/s NVMe Gen4' : 'N/A'
        };

        setProduct({
          id: data.id,
          name: data.nombre,
          price: data.precio_venta,
          description: data.descripcion || 'Sin descripción disponible.',
          category: data.categoria,
          sku: data.sku || 'TF-OEM-SPEC',
          rating: 4.8,
          reviews: Math.floor(15 + Math.random() * 80),
          image: data.imagen_url || 'https://via.placeholder.com/300',
          specs: specs
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center bg-background dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary dark:text-sky-500 mb-3" />
        <p className="text-xs text-on-surface-variant dark:text-slate-400 font-semibold animate-pulse">Cargando detalles técnicos...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center bg-background dark:bg-slate-950 px-4 text-center">
        <h3 className="font-bold text-lg text-on-surface dark:text-white">Lo sentimos</h3>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
          No pudimos localizar el componente solicitado. Es posible que haya sido descontinuado o el enlace sea incorrecto.
        </p>
        <Link
          href="/catalogo"
          className="mt-5 px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-slate-950 text-on-background dark:text-white font-body-md py-stack-lg transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter">
        
        {/* Breadcrumb de regreso */}
        <div className="mb-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-xs text-on-surface-variant/80 hover:text-primary dark:hover:text-sky-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo de hardware
          </Link>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          {/* Left: Image Gallery */}
          <ProductImageGallery productName={product.name} productImage={product.image} />

          {/* Right: Product Info */}
          <ProductDetailInfo product={product} />
        </section>

        {/* Specs Table */}
        <ProductSpecsTable specs={product.specs} />
      </div>
    </div>
  );
}
