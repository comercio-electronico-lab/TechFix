'use server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener el producto');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.nombre,
      price: data.precio_venta,
      description: data.descripcion || 'Sin descripción',
      category: data.categoria,
      image: (data.imagen_url || 'https://placehold.co/300').replace('via.placeholder.com', 'placehold.co'),
      sku: data.sku || `TF-PRX-${data.id}`,
      rating: 4.8,
      reviews: 94,
      specs: {
        processor: 'Componente/Repuesto OEM',
        graphics: 'Compatibilidad certificada',
        ram: 'Probado en laboratorio',
        storage: 'Garantía oficial TechFix'
      }
    };
  } catch (error) {
    console.error('Error in getProductById action:', error);
    return null;
  }
}
