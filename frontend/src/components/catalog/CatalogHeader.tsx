import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { SortOption } from '@/hooks/useCatalog';

interface CatalogHeaderProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  selectedCategory?: string;
}

export default function CatalogHeader({
  totalCount,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategory
}: CatalogHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 dark:border-slate-800 pb-4">
      <div>
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface dark:text-white tracking-tight flex items-center gap-2.5">
          Catálogo Técnico
          {selectedCategory && (
            <span className="text-sm font-semibold px-3 py-1 bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 rounded-full border border-primary/20 dark:border-sky-500/20 transition-all">
              {selectedCategory}
            </span>
          )}
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400 mt-1">
          Visualizando <span className="font-bold text-primary dark:text-sky-400">{totalCount}</span> componentes de alta gama.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Búsqueda en móvil */}
        <div className="flex lg:hidden items-center w-full sm:w-auto relative mb-2 sm:mb-0 flex-1 sm:flex-initial">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar componente..."
            className="w-full bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-sky-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 absolute right-3 text-outline-variant" />
        </div>

        {/* Ordenar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-on-surface-variant dark:text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white dark:bg-slate-800 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-1 focus:ring-primary cursor-pointer font-medium transition-colors"
          >
            <option value="Relevance">Relevance</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Newest Arrivals">Newest Arrivals</option>
          </select>
        </div>
      </div>
    </div>
  );
}
