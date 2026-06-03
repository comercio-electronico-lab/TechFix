'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import SidebarFactura from '@/components/catalogo/SidebarFactura';
import { useCatalog } from '@/hooks/useCatalog';
import CatalogoBanner from '@/components/sections/CatalogoBanner';
import CatalogoProductsGrid from '@/components/sections/CatalogoProductsGrid';

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
    setMaxPrice,
    setSortBy,
    handlePageChange,
    handleClearFilters,
  } = useCatalog();

  return (
    <>
      <Navbar />
      <main className="bg-surface-bright dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <CatalogoBanner />

        <div className="max-w-container-max mx-auto px-4 md:px-gutter py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* COLUMNA IZQUIERDA - Filtros + Factura */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
              {/* Filtros */}
              <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
                <div className="flex items-center gap-2 text-primary dark:text-white border-b border-outline-variant/20 dark:border-slate-800 pb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2" />
                  </svg>
                  <h2 className="text-sm font-black uppercase tracking-wider">Filtros</h2>
                </div>

                {/* Búsqueda */}
                <div className="space-y-2.5">
                  <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Buscar</h3>
                  <input
                    type="text"
                    placeholder="Ej. Batería, SSD..."
                    value={filters.searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2.5 border border-outline-variant/40 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-on-surface dark:text-slate-200 text-xs placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* Categorías */}
                <div className="space-y-2.5">
                  <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Categorías</h3>
                  <div className="flex flex-col gap-2">
                    {categoriesList.length > 0 ? (
                      categoriesList.map((cat) => (
                        <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.selectedCategories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                            className="w-4 h-4 border-outline-variant/60 rounded text-secondary cursor-pointer accent-secondary"
                          />
                          <span className="text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-wider">
                            {cat}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-[10px] text-on-surface-variant/50">Cargando...</p>
                    )}
                  </div>
                </div>

                {/* Rango de precios */}
                <div className="space-y-2.5">
                  <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Precio Máximo</h3>
                  <input
                    type="range"
                    className="w-full accent-secondary cursor-pointer"
                    min="0"
                    max="2000"
                    value={filters.maxPrice || '2000'}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant dark:text-slate-400 font-mono font-black">
                    <span>$0</span>
                    <span>${filters.maxPrice || '2000'}</span>
                  </div>
                </div>

                {/* Limpiar */}
                <button
                  onClick={handleClearFilters}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-350 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-xs cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar Filtros
                </button>
              </div>

              {/* Factura */}
              <SidebarFactura />
            </div>

            {/* COLUMNA DERECHA - Resultados + Grid + Paginación */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              {/* Header con ordenamiento */}
              <div className="bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <p className="text-on-surface-variant dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Resultados: <span className="text-primary dark:text-sky-400 font-black font-mono">{filteredProducts.length}</span> repuestos encontrados
                </p>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondary text-xs font-bold text-on-surface dark:text-slate-250 cursor-pointer"
                >
                  <option value="Relevance">Ordenar por: Relevancia</option>
                  <option value="Price: Low to High">Precio: Menor a Mayor</option>
                  <option value="Price: High to Low">Precio: Mayor a Menor</option>
                  <option value="Newest Arrivals">Más Nuevos</option>
                </select>
              </div>

              {/* Grid de productos y paginación */}
              <CatalogoProductsGrid
                paginatedProducts={paginatedProducts}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
