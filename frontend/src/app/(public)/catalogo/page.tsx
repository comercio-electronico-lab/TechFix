'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/cards/ProductCard';
import Input from '@/components/ui/Input';
import { Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useCatalog, SortOption } from '@/hooks/useCatalog';
import SidebarFactura from '@/components/catalogo/SidebarFactura';

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
        
        {/* Banner de Bienvenida */}
        <section className="bg-primary py-12 text-white shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="max-w-container-max mx-auto px-gutter relative z-10">
            <span className="text-[10px] font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Tienda Oficial TechFix
            </span>
            <h1 className="text-3xl md:text-4xl font-h1 font-bold mt-3 mb-2">Catálogo de Hardware</h1>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Encuentra repuestos originales de grado profesional y herramientas certificadas para laboratorios de micro-soldadura.
            </p>
          </div>
        </section>

        {/* Distribución Principal en Tres Columnas */}
        <div className="max-w-container-max mx-auto px-gutter py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA 1: FILTROS LATERALES (3 columnas / 25%) */}
            <aside className="lg:col-span-3 space-y-8 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-primary dark:text-white border-b border-outline-variant/20 dark:border-slate-800 pb-3">
                <SlidersHorizontal className="w-4 h-4" />
                <h2 className="text-sm font-black uppercase tracking-wider">Filtros de Búsqueda</h2>
              </div>

              {/* Búsqueda por texto */}
              <div className="space-y-3">
                <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Buscar</h3>
                <Input 
                  icon={Search} 
                  placeholder="Ej. Batería, SSD..." 
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="!py-2.5"
                />
              </div>

              {/* Categorías */}
              <div className="space-y-3">
                <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Categorías</h3>
                <div className="flex flex-col gap-2.5">
                  {categoriesList.length > 0 ? (
                    categoriesList.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.selectedCategories.includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                          className="w-4 h-4 border-outline-variant/60 rounded text-secondary focus:ring-secondary cursor-pointer" 
                        />
                        <span className="text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-wider">
                          {cat}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-[10px] text-on-surface-variant/50">Cargando categorías...</p>
                  )}
                </div>
              </div>

              {/* Rango de Precios */}
              <div className="space-y-3">
                <h3 className="text-primary dark:text-sky-400 text-xs font-black uppercase tracking-wider">Precio Máximo</h3>
                <input 
                  type="range" 
                  className="w-full accent-secondary cursor-pointer" 
                  min="0" 
                  max="2000" 
                  value={filters.maxPrice || '2000'}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant dark:text-slate-400 font-black font-mono">
                  <span>$0</span>
                  <span>${filters.maxPrice || '2000'}+ USD</span>
                </div>
              </div>

              {/* Botón de limpiar */}
              <button 
                onClick={handleClearFilters}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-350 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Filtros
              </button>
            </aside>

            {/* COLUMNA 2: LISTA DE PRODUCTOS (6 columnas / 50%) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Cabecera del Grid */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                <p className="text-on-surface-variant dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Resultados: <span className="text-primary dark:text-sky-400 font-black font-mono">{filteredProducts.length}</span> repuestos encontrados
                </p>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-850 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-secondary text-xs font-bold text-on-surface dark:text-slate-250 cursor-pointer"
                >
                  <option value="Relevance">Ordenar por: Relevancia</option>
                  <option value="Price: Low to High">Precio: Menor a Mayor</option>
                  <option value="Price: High to Low">Precio: Mayor a Menor</option>
                  <option value="Newest Arrivals">Por estado comercial</option>
                </select>
              </div>

              {/* Grid de Productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-xs font-black text-on-surface dark:text-white px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            {/* COLUMNA 3: FACTURA Y CHECKOUT LATERAL (3 columnas / 25%) */}
            <div className="lg:col-span-3">
              <SidebarFactura />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
