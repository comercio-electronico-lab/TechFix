import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/cards/ProductCard';
import Input from '@/components/ui/Input';
import { mockProducts } from '@/mock/products';
import { Search } from 'lucide-react';

export default function Catalogo() {
  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        <section className="bg-primary py-12 text-white">
          <div className="max-w-container-max mx-auto px-gutter">
            <h1 className="text-[32px] font-bold mb-2">Catálogo de Hardware</h1>
            <p className="text-white/60">Encuentra los componentes de grado profesional que necesitas.</p>
          </div>
        </section>

        <div className="max-w-container-max mx-auto px-gutter py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Filtros */}
          <aside className="space-y-8">
            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-4">Búsqueda</h3>
              <Input icon={Search} placeholder="Buscar producto..." />
            </div>

            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-4">Categorías</h3>
              <div className="flex flex-col gap-2">
                {['Todos', 'Laptops', 'Smartphones', 'Monitores', 'Tablets', 'Componentes'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 border-outline-variant rounded text-secondary focus:ring-secondary" />
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-4">Rango de Precio</h3>
              <input type="range" className="w-full accent-secondary" min="0" max="2000" />
              <div className="flex justify-between text-xs text-on-surface-variant mt-2 font-bold">
                <span>$0</span>
                <span>$2000+</span>
              </div>
            </div>
          </aside>

          {/* Grid de Productos */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-on-surface-variant text-sm">Mostrando <span className="font-bold text-primary">{mockProducts.length}</span> productos</p>
              <select className="bg-white border border-outline-variant/50 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-secondary text-sm">
                <option>Ordenar por: Relevancia</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* Repetimos algunos para llenar la vista */}
              {mockProducts.map((product) => (
                <ProductCard key={`dup-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
