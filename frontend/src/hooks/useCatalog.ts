'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types';
import { getProductsAction } from '@/app/actions';

export type SortOption = 'Relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Newest Arrivals';

export interface CatalogFilters {
  searchQuery: string;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface UseCatalogReturn {
  filters: CatalogFilters;
  categoriesList: string[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
  currentPage: number;
  totalPages: number;
  setSearchQuery: (q: string) => void;
  handleCategoryToggle: (cat: string) => void;
  setMinPrice: (p: string) => void;
  setMaxPrice: (p: string) => void;
  setInStockOnly: (v: boolean) => void;
  setSortBy: (s: SortOption) => void;
  handlePageChange: (page: number) => void;
  handleClearFilters: () => void;
}

const ITEMS_PER_PAGE = 8;

export function useCatalog(): UseCatalogReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPriceState] = useState('');
  const [maxPrice, setMaxPriceState] = useState('');
  const [inStockOnly, setInStockOnlyState] = useState(false);
  const [sortBy, setSortByState] = useState<SortOption>('Relevance');
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar catálogo usando Server Action
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProductsAction();
        const mapped = data.map((p: any) => ({
          id: p.id,
          sku: p.sku || 'N/A',
          name: p.nombre,
          description: p.descripcion || '',
          price: p.precio_venta,
          category: p.categoria,
          image: p.imagen_url || 'https://via.placeholder.com/300',
          status: p.status || 'In Stock',
        }));
        setProducts(mapped);
      } catch (e) {
        console.error('Error al cargar productos del servidor:', e);
      }
    }
    fetchProducts();
  }, []);

  const categoriesList = useMemo(() =>
    Array.from(new Set(products.map(p => p.category))), [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (minPrice.trim()) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }

    if (maxPrice.trim()) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    if (inStockOnly) {
      result = result.filter(p =>
        p.status === 'In Stock' || p.status === 'Low Stock' || p.status === 'Limited Edition'
      );
    }

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Newest Arrivals') {
      const order: Record<string, number> = { 'Limited Edition': 1, 'In Stock': 2, 'Low Stock': 3, 'Out of Stock': 4 };
      result.sort((a, b) => (order[a.status] || 9) - (order[b.status] || 9));
    }

    return result;
  }, [products, searchQuery, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const setSearchQuery = (q: string) => { setSearchQueryState(q); setCurrentPage(1); };
  const setMinPrice = (p: string) => { setMinPriceState(p); setCurrentPage(1); };
  const setMaxPrice = (p: string) => { setMaxPriceState(p); setCurrentPage(1); };
  const setInStockOnly = (v: boolean) => { setInStockOnlyState(v); setCurrentPage(1); };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchQueryState('');
    setSelectedCategories([]);
    setMinPriceState('');
    setMaxPriceState('');
    setInStockOnlyState(false);
    setSortByState('Relevance');
    setCurrentPage(1);
  };

  return {
    filters: { searchQuery, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy },
    categoriesList,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    setSearchQuery,
    handleCategoryToggle,
    setMinPrice,
    setMaxPrice,
    setInStockOnly,
    setSortBy: setSortByState,
    handlePageChange,
    handleClearFilters,
  };
}
