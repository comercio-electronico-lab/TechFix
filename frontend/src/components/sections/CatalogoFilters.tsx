import { SlidersHorizontal, Trash2, Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import { SortOption } from '@/hooks/useCatalog';

interface CatalogoFiltersProps {
  filters: {
    searchQuery: string;
    selectedCategories: string[];
    maxPrice: number;
    sortBy: SortOption;
  };
  categoriesList: string[];
  setSearchQuery: (query: string) => void;
  handleCategoryToggle: (category: string) => void;
  setMaxPrice: (price: string | number) => void;
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
      <aside className="space-y-8 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
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
            className="py-2.5!"
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

      {/* HEADER CON ORDENAMIENTO */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <p className="text-on-surface-variant dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
          Resultados: <span className="text-primary dark:text-sky-400 font-black font-mono">{filteredProductsCount}</span> repuestos encontrados
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
    </>
  );
}
