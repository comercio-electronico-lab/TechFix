import ProductCard from '@/components/cards/ProductCard';
import { IProduct } from '@/interfaces/domain';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface CatalogoProductsGridProps {
  paginatedProducts: IProduct[];
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 px-6 text-center bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 backdrop-blur-xl rounded-2xl shadow-inner flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 flex items-center justify-center text-slate-450 dark:text-slate-500">
              <Inbox className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="font-extrabold text-on-surface dark:text-slate-200 text-sm">Ningún producto coincide con los filtros</p>
              <p className="text-xs text-on-surface-variant dark:text-slate-450 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Intenta buscar con otros términos o limpia los filtros de búsqueda aplicados para ver la lista completa.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 p-2.5 rounded-2xl shadow-md max-w-[280px] mx-auto backdrop-blur-xl transition-all duration-300">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-xl border border-outline-variant/30 dark:border-outline/10 text-on-surface dark:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-black text-on-surface dark:text-white font-mono px-3">
            {currentPage} <span className="text-on-surface-variant/40 dark:text-slate-500 font-normal">/</span> {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-xl border border-outline-variant/30 dark:border-outline/10 text-on-surface dark:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

