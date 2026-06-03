import ProductCard from '@/components/cards/ProductCard';
import type { Product } from '@/types';

interface CatalogoProductsGridProps {
  paginatedProducts: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CatalogoProductsGrid({
  paginatedProducts,
  currentPage,
  totalPages,
  onPageChange,
}: CatalogoProductsGridProps) {
  return (
    <div className="space-y-6">
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-inner">
            <p className="font-black text-on-surface dark:text-slate-350 text-sm">Ningún producto coincide con los filtros</p>
            <p className="text-xs text-on-surface-variant dark:text-slate-500 mt-1">Prueba restableciendo los criterios de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 p-4 rounded-2xl shadow-sm max-w-sm mx-auto">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Anterior
          </button>
          <span className="text-xs font-black text-on-surface dark:text-white px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
