import { SlidersHorizontal, Trash2, Search, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import { SortOption } from '@/hooks/useCatalog';

interface CatalogoFiltersProps {
  filters: {
    searchQuery: string;
    selectedCategories: string[];
    maxPrice: string;
    sortBy: SortOption;
  };
  categoriesList: string[];
  setSearchQuery: (query: string) => void;
  handleCategoryToggle: (category: string) => void;
  setMaxPrice: (price: string) => void;
  setSortBy: (sort: SortOption) => void;
  handleClearFilters: () => void;
  filteredProductsCount: number;
}

export default function CatalogoFilters({
  filters,
  categoriesList,
  setSearchQuery,
  handleCategoryToggle,
  setMaxPrice,
  setSortBy,
  handleClearFilters,
  filteredProductsCount,
}: CatalogoFiltersProps) {
  return (
    <>
      {/* FILTROS LATERALES */}
      <aside className="space-y-8 bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 backdrop-blur-xl rounded-2xl p-6 shadow-md transition-all duration-300">
        <div className="flex items-center gap-2.5 text-primary dark:text-sky-450 border-b border-outline-variant/25 dark:border-outline/15 pb-4">
          <div className="p-1.5 rounded-lg bg-primary/5 dark:bg-sky-500/10">
            <SlidersHorizontal className="w-4 h-4 text-primary dark:text-sky-400" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-widest text-on-surface dark:text-white">Filtros de Búsqueda</h2>
        </div>

        {/* Búsqueda por texto */}
        <div className="space-y-3">
          <h3 className="text-primary dark:text-sky-400 text-[10px] font-black uppercase tracking-widest">Buscar</h3>
          <div className="relative group">
            <Input
              icon={Search}
              placeholder="Ej. Batería, SSD..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2.5! border-outline-variant/60 dark:border-outline/25 dark:bg-slate-950/70 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="space-y-3">
          <h3 className="text-primary dark:text-sky-400 text-[10px] font-black uppercase tracking-widest">Categorías</h3>
          <div className="flex flex-col gap-2">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => {
                const isChecked = filters.selectedCategories.includes(cat);
                return (
                  <label 
                    key={cat} 
                    className="flex items-center gap-3 cursor-pointer group py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-sky-950/20 px-1.5 -mx-1.5 transition-all"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(cat)}
                        className="sr-only" // Ocultar por completo el nativo para estilizar uno personalizado
                      />
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-secondary border-secondary dark:bg-[#00bcff] dark:border-[#00bcff] scale-110 shadow-sm shadow-secondary/35' 
                          : 'border-outline-variant/70 dark:border-outline/40 bg-white dark:bg-slate-950/70 group-hover:border-primary dark:group-hover:border-sky-450'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white dark:text-slate-950 stroke-[3.5]" />}
                      </div>
                    </div>
                    <span className={`transition-colors text-[11px] font-bold uppercase tracking-wider ${
                      isChecked 
                        ? 'text-primary dark:text-[#00bcff] font-extrabold' 
                        : 'text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-400'
                    }`}>
                      {cat}
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="text-[10px] text-on-surface-variant/50">Cargando categorías...</p>
            )}
          </div>
        </div>

        {/* Rango de Precios */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-primary dark:text-sky-400 text-[10px] font-black uppercase tracking-widest">Precio Máximo</h3>
            <span className="text-[11px] bg-secondary/10 dark:bg-secondary-container/40 text-secondary dark:text-sky-400 px-2 py-0.5 rounded font-black font-mono">
              ${filters.maxPrice || '2000'} USD
            </span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              className="w-full accent-secondary dark:accent-[#00bcff] cursor-pointer h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none transition-all"
              min="0"
              max="2000"
              value={filters.maxPrice || '2000'}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant/75 dark:text-slate-400 font-extrabold font-mono mt-2">
              <span>$0</span>
              <span>$2000+</span>
            </div>
          </div>
        </div>

        {/* Botón de limpiar */}
        <button
          onClick={handleClearFilters}
          className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-on-surface-variant dark:text-slate-300 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs cursor-pointer border border-outline-variant/30 dark:border-outline/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Limpiar Filtros
        </button>
      </aside>

      {/* HEADER CON ORDENAMIENTO */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 backdrop-blur-xl p-4 rounded-2xl shadow-sm transition-all duration-300">
        <p className="text-on-surface-variant dark:text-slate-350 text-xs font-bold uppercase tracking-wider">
          Resultados: <span className="text-secondary dark:text-[#00bcff] font-extrabold font-mono text-sm">{filteredProductsCount}</span> repuestos encontrados
        </p>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full bg-slate-50/50 dark:bg-slate-950/70 border border-outline-variant/50 dark:border-outline/25 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-secondary/40 text-xs font-bold text-on-surface dark:text-slate-200 cursor-pointer appearance-none pr-8 hover:bg-slate-100/50 dark:hover:bg-slate-900/70 transition-all"
          >
            <option value="Relevance">Ordenar por: Relevancia</option>
            <option value="Price: Low to High">Precio: Menor a Mayor</option>
            <option value="Price: High to Low">Precio: Mayor a Menor</option>
            <option value="Newest Arrivals">Por estado comercial</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant dark:text-slate-450">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

