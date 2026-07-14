import ProductGallery from '@/components/product/ProductGallery';
import ProductHeader from '@/components/product/ProductHeader';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductFooter from '@/components/product/ProductFooter';
import ProductActions from '@/components/product/ProductActions';
import { getProductById } from '@/actions/products';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="bg-background text-on-background font-body-md py-stack-lg">
      <div className="max-w-container-max mx-auto px-gutter">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          <ProductGallery image={product.image} name={product.name} />

          <div className="lg:col-span-5 flex flex-col gap-8">
            <ProductHeader 
              name={product.name}
              price={product.price}
              rating={product.rating}
              reviews={product.reviews}
              sku={product.sku}
            />

            <ProductSpecs 
              specs={product.specs}
              description={product.description}
            />

            <ProductActions product={product} />

            <ProductFooter />
          </div>
        </section>
      </div>
    </div>
  );
}
