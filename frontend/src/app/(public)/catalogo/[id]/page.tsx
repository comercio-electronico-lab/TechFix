import { use } from 'react';
import { Star, StarHalf, MemoryStick, Cpu, HardDrive, ShieldCheck, Truck, Settings } from 'lucide-react';
import ProductActions from '@/components/product/ProductActions';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // In a real app, we would fetch the product by ID
  const product = {
    id: id,
    name: 'ProStream X-15 Elite',
    price: 2499.00,
    description: 'Diseñada para el máximo rendimiento, la ProStream X-15 Elite combina hardware de vanguardia con una estética de grado profesional. Diseñada para arquitectos, ingenieros y profesionales creativos de alto nivel.',
    category: 'Laptops',
    sku: 'TF-PRX-2024',
    rating: 4.5,
    reviews: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXEWEF8VPneBBeLGB8Q4JjTURalyXbyp77icXOkTRg_X2_U-0ksTbGD5Abji5CHmf9kjLHHd2auJXzhi4gZrZWsylOmPAsSqYc89mfl0T_7-AaCc3xaZdPAZrB0rkAMTG9YlLldyACf7sygbwBK4t_x4zyCC_Sdzt3AOYdj74hxKjQqIg8tzezUdJcEOngBbBRFR3UOZxRA-X_jFmqWmlon3lTWQ_9hwGwgehR5wY6ku-VMsL0ufElc_p_S8jyasAFHKK66CEQkeM',
    specs: {
      processor: 'Intel i9-14900HX',
      graphics: 'RTX 4080 12GB',
      ram: '64GB DDR5 RAM',
      storage: '2TB NVMe SSD'
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md py-stack-lg">
      <div className="max-w-container-max mx-auto px-gutter">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10 aspect-4/3 flex items-center justify-center p-8">
              <img className="w-full h-full object-contain" src={product.image} alt={product.name} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`bg-white rounded-lg border ${i === 1 ? 'border-secondary-container' : 'border-outline-variant/20'} p-2 aspect-square cursor-pointer hover:border-secondary-container transition-colors`}>
                  <img className="w-full h-full object-cover opacity-50" src={product.image} alt={`Vista ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-surface-container-high text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">EN STOCK</span>
                <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">SKU: {product.sku}</span>
              </div>
              <h1 className="text-[48px] font-bold text-primary mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-secondary-container">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <StarHalf className="w-4 h-4 fill-current" />
                </div>
                <span className="text-on-surface-variant text-sm">({product.reviews} reseñas)</span>
              </div>
              <div className="text-[32px] font-bold text-primary">${product.price.toFixed(2)}</div>
            </div>

            <div className="border-y border-outline-variant/20 py-8 flex flex-col gap-6">
              <p className="text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex items-center gap-2">
                  <Cpu className="text-secondary w-5 h-5" />
                  <span className="text-sm font-bold text-on-surface">{product.specs.processor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="text-secondary w-5 h-5" />
                  <span className="text-sm font-bold text-on-surface">{product.specs.graphics}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MemoryStick className="text-secondary w-5 h-5" />
                  <span className="text-sm font-bold text-on-surface">{product.specs.ram}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="text-secondary w-5 h-5" />
                  <span className="text-sm font-bold text-on-surface">{product.specs.storage}</span>
                </div>
              </div>
            </div>

            <ProductActions product={product} />

            <div className="flex items-center gap-6 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Envío Gratis</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 2 Años de Garantía</div>
            </div>
          </div>
        </section>

        {/* Specs Table */}
        <section className="mt-section-padding pt-stack-lg">
          <h2 className="text-[32px] font-bold text-primary mb-8 border-l-4 border-secondary pl-6">Especificaciones Técnicas</h2>
          <div className="overflow-hidden border border-outline-variant/30 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Característica</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Detalle Técnico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr className="bg-surface-container-low">
                  <td className="px-6 py-4 font-bold text-primary w-1/3 text-sm">Procesador</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">Intel® Core™ i9-14900HX (24 Cores, 32 Threads, up to 5.8 GHz)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-bold text-primary text-sm">Gráficos</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">NVIDIA® GeForce RTX™ 4080 Laptop GPU, 12GB GDDR6, 175W TGP</td>
                </tr>
                <tr className="bg-surface-container-low">
                  <td className="px-6 py-4 font-bold text-primary text-sm">Memoria</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">64GB (2x32GB) DDR5 5600MHz SO-DIMM (Expandible a 128GB)</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-bold text-primary text-sm">Almacenamiento</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">2TB PCIe Gen4 x4 NVMe M.2 SSD (Segundo slot M.2 disponible)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
