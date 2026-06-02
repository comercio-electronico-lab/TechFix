'use client';

import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useCatalog, SortOption } from '@/hooks/useCatalog';
import CatalogFilterSidebar from '@/components/catalog/CatalogFilterSidebar';
import CatalogProductCard from '@/components/catalog/CatalogProductCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

export default function Catalogo() {
  const {
    filters,
    categoriesList,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    setSearchQuery,
    handleCategoryToggle,
    setMinPrice,
    setMaxPrice,
    setInStockOnly,
    setSortBy,
    handlePageChange,
    handleClearFilters,
  } = useCatalog();

  const { searchQuery, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy } = filters;

  const hasActiveFilters = !!(minPrice || maxPrice || searchQuery || selectedCategories.length > 0 || inStockOnly);

  return (
    <div className="flex flex-col lg:flex-row flex-1 pt-18 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop bg-surface-bright dark:bg-slate-950 transition-colors duration-300">

      {/* Sidebar de Filtros */}
      <CatalogFilterSidebar
        searchQuery={searchQuery}
        categoriesList={categoriesList}
        selectedCategories={selectedCategories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        inStockOnly={inStockOnly}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchQuery}
        onCategoryToggle={handleCategoryToggle}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onInStockChange={setInStockOnly}
        onClearFilters={handleClearFilters}
      />

      {/* Sección Principal */}
      <main className="flex-1 w-full lg:pl-8 pt-6">
        <div className="space-y-8">

          {/* Header y Ordenación */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 dark:border-slate-800 pb-4">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-on-surface dark:text-white tracking-tight flex items-center gap-2.5">
                Catálogo Técnico
                {selectedCategories.length === 1 && (
                  <span className="text-sm font-semibold px-3 py-1 bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 rounded-full border border-primary/20 dark:border-sky-500/20">
                    {selectedCategories[0]}
                  </span>
                )}
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400 mt-1">
                Visualizando <span className="font-bold text-primary dark:text-sky-400">{filteredProducts.length}</span> componentes de alta gama.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Búsqueda en móvil */}
              <div className="flex lg:hidden items-center w-full sm:w-auto relative mb-2 sm:mb-0 flex-1 sm:flex-initial">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar componente..."
                  className="w-full bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-sky-500"
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
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white dark:bg-slate-800 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                >
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Productos */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ningún componente coincide con los filtros"
              description="Prueba a restablecer el rango de precios, la casilla de stock o a buscar con un término más general."
              action={
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-primary-container dark:hover:bg-sky-500 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  Restablecer Catálogo
                </button>
              }
            />
          )}

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>
      </main>
    </div>
  );
}
