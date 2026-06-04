'use client';

import React from 'react';
import SidebarFactura from '@/components/catalogo/SidebarFactura';
import { useCatalog } from '@/hooks/useCatalog';
import CatalogoBanner from '@/components/sections/CatalogoBanner';
import CatalogoProductsGrid from '@/components/sections/CatalogoProductsGrid';
import CatalogoFilters from '@/components/sections/CatalogoFilters';

export default function CatalogoClient() {
  const {
    filters,
    categoriesList,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    setSearchQuery,
    handleCategoryToggle,
    setMaxPrice,
    setSortBy,
    handlePageChange,
    handleClearFilters,
  } = useCatalog();

  return (
    <div className="bg-surface-bright dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <CatalogoBanner />

      <div className="max-w-container-max mx-auto px-4 md:px-gutter py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* COLUMNA IZQUIERDA - Filtros + Factura */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1 lg:sticky lg:top-24 self-start">
            <CatalogoFilters
              filters={filters}
              categoriesList={categoriesList}
              setSearchQuery={setSearchQuery}
              handleCategoryToggle={handleCategoryToggle}
              setMaxPrice={setMaxPrice}
              setSortBy={setSortBy}
              handleClearFilters={handleClearFilters}
              filteredProductsCount={filteredProducts.length}
            />
            <SidebarFactura />
          </div>

          {/* COLUMNA DERECHA - Resultados + Grid + Paginación */}
          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
            <CatalogoProductsGrid
              paginatedProducts={paginatedProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
