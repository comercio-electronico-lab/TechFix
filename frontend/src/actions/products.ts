'use server';

import { initializeData, getProducts } from './data';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sku: string;
  rating: number;
  reviews: number;
  image: string;
  specs: {
    processor: string;
    graphics: string;
    ram: string;
    storage: string;
  };
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  await initializeData();
  const products = await getProducts();
  const baseProduct = products.find(p => p.id === id);

  if (!baseProduct) {
    return null;
  }

  return {
    id: baseProduct.id,
    name: baseProduct.name,
    price: baseProduct.price,
    description: baseProduct.description,
    category: baseProduct.category,
    image: baseProduct.image,
    sku: `TF-PRX-${baseProduct.id}`,
    rating: 4.5,
    reviews: 128,
    specs: {
      processor: 'Intel i9-14900HX',
      graphics: 'RTX 4080 12GB',
      ram: '64GB DDR5 RAM',
      storage: '2TB NVMe SSD'
    }
  };
}
