'use client';

import React from 'react';
import { useCatalog, SortOption } from '@/hooks/useCatalog';
import CatalogFilterSidebar from '@/components/catalog/CatalogFilterSidebar';
import CatalogHeader from '@/components/catalog/CatalogHeader';
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
    <div className="flex flex-col lg:flex-row flex-1 max-w-container-max mx-auto w-full px-gutter bg-surface-bright dark:bg-slate-950 transition-colors duration-300">

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
          <CatalogHeader
            totalCount={filteredProducts.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : undefined}
          />

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
