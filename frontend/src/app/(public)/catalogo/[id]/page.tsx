import { use } from 'react';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductDetailInfo from '@/components/product/ProductDetailInfo';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';

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
    <div className="bg-background dark:bg-slate-950 text-on-background dark:text-white font-body-md py-stack-lg transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          {/* Left: Image Gallery */}
          <ProductImageGallery productName={product.name} productImage={product.image} />

          {/* Right: Product Info */}
          <ProductDetailInfo product={product} />
        </section>

        {/* Specs Table */}
        <ProductSpecsTable specs={product.specs} />
      </div>
    </div>
  );
}
