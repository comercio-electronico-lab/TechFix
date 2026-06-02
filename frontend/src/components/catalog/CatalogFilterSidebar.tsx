'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { SortOption } from '@/hooks/useCatalog';

interface CatalogFilterSidebarProps {
  searchQuery: string;
  categoriesList: string[];
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (q: string) => void;
  onCategoryToggle: (cat: string) => void;
  onMinPriceChange: (p: string) => void;
  onMaxPriceChange: (p: string) => void;
  onInStockChange: (v: boolean) => void;
  onClearFilters: () => void;
}

export default function CatalogFilterSidebar({
  searchQuery,
  categoriesList,
  selectedCategories,
  minPrice,
  maxPrice,
  inStockOnly,
  hasActiveFilters,
  onSearchChange,
  onCategoryToggle,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onClearFilters,
}: CatalogFilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-outline-variant/30 dark:border-slate-800 bg-surface dark:bg-slate-900/20 min-h-[calc(100vh-72px)] pr-6 pt-6">
      <div className="space-y-8 sticky top-22">

        {/* Búsqueda */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-primary dark:text-sky-400" /> Búsqueda
          </h4>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SKU, marca, componente..."
              className="w-full bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-2 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-1 focus:ring-primary dark:focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        <hr className="border-outline-variant/30 dark:border-slate-800" />

        {/* Categorías */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
            Categorías
          </h4>
          <div className="space-y-3 font-body-md text-sm text-on-surface dark:text-slate-350">
            {categoriesList.map((category) => {
              const isChecked = selectedCategories.includes(category);
              return (
                <label key={category} className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onCategoryToggle(category)}
                    className="w-4 h-4 rounded-sm border-outline-variant/70 dark:border-slate-700 text-primary dark:text-sky-500 bg-white dark:bg-slate-800 focus:ring-primary dark:focus:ring-sky-500 transition-colors"
                  />
                  <span className={`group-hover:text-primary dark:group-hover:text-sky-400 transition-colors ${isChecked ? 'font-semibold text-primary dark:text-sky-400' : ''}`}>
                    {category}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <hr className="border-outline-variant/30 dark:border-slate-800" />

        {/* Rango de Precios */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
            Rango de Precio
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2.5 text-xs text-on-surface-variant/60 dark:text-slate-500">$</span>
                <input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded py-2 pl-6 pr-2 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-1 focus:ring-primary dark:focus:ring-sky-500"
                />
              </div>
              <span className="text-on-surface-variant/40 dark:text-slate-600">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2.5 text-xs text-on-surface-variant/60 dark:text-slate-500">$</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded py-2 pl-6 pr-2 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-1 focus:ring-primary dark:focus:ring-sky-500"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full py-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-700 rounded text-xs font-semibold tracking-wider transition-colors active:scale-[0.98] uppercase cursor-pointer"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        <hr className="border-outline-variant/30 dark:border-slate-800" />

        {/* Disponibilidad */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
            Disponibilidad
          </h4>
          <label className="flex items-center gap-3 cursor-pointer group font-body-md text-sm text-on-surface dark:text-slate-330 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="w-4 h-4 rounded-sm border-outline-variant/70 dark:border-slate-700 text-primary dark:text-sky-500 bg-white dark:bg-slate-800 focus:ring-primary dark:focus:ring-sky-500 transition-colors"
            />
            <span className="group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
              Solo en Stock
            </span>
          </label>
        </div>

      </div>
    </aside>
  );
}
