'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { IProduct } from '@/interfaces/domain';
import { getProducts } from '@/app/actions';

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
  filteredProducts: IProduct[];
  paginatedProducts: IProduct[];
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
  loading: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 8;

export function useCatalog(): UseCatalogReturn {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPriceState] = useState('');
  const [maxPrice, setMaxPriceState] = useState('');
  const [inStockOnly, setInStockOnlyState] = useState(false);
  const [sortBy, setSortByState] = useState<SortOption>('Relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar catálogo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const categoriesList = useMemo(() =>
    Array.from(new Set(products.map(p => p.category.name))), [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category.name));
    }
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchQuery, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleClearFilters = () => {
    setSearchQueryState('');
    setSelectedCategories([]);
    setSortByState('Relevance');
    setCurrentPage(1);
  };

  return {
    filters: { searchQuery, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy },
    categoriesList, filteredProducts, paginatedProducts, currentPage, totalPages,
    setSearchQuery: (q) => { setSearchQueryState(q); setCurrentPage(1); },
    handleCategoryToggle: (c) => {
      setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
      setCurrentPage(1);
    },
    setMinPrice: setMinPriceState,
    setMaxPrice: setMaxPriceState,
    setInStockOnly: setInStockOnlyState,
    setSortBy: setSortByState,
    handlePageChange,
    handleClearFilters,
    loading, error
  };
}
