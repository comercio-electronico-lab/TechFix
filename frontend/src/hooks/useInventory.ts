'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IInventoryItem } from '@/interfaces/domain';
import {
  getProducts,
  getSuppliers,
  createRestockOrder,
  createProduct,
  updateProduct
} from '@/actions';

export interface UseInventoryReturn {
  inventory: IInventoryItem[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  editingItem: IInventoryItem | null;
  currentPage: number;
  totalPages: number;
  filteredInventory: IInventoryItem[];
  paginatedInventory: IInventoryItem[];
  categories: string[];
  statuses: string[];
  stats: { totalSKUs: number; lowStockAlerts: number; outOfStock: number; pendingOrders: number };
  newItem: {
    sku: string; name: string; compatibility: string;
    category: string; supplier: string; stock: number; maxStock: number; price: number;
  };
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setSelectedStatus: (s: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setEditingItem: (item: IInventoryItem | null) => void;
  setNewItem: React.Dispatch<React.SetStateAction<UseInventoryReturn['newItem']>>;
  handlePageChange: (page: number) => void;
  handleRequestPart: (itemId: string) => Promise<void>;
  handleCreateItem: (e: React.FormEvent) => Promise<void>;
  handleUpdateItem: (e: React.FormEvent) => Promise<void>;
  handleClearFilters: () => void;
  refetch: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 5;

export function useInventory(): UseInventoryReturn {
  const { isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState<IInventoryItem[]>([]);
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState('Todas');
  const [selectedStatus, setSelectedStatusState] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IInventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    sku: '', name: '', compatibility: '',
    category: 'Displays', supplier: 'TechParts Global',
    stock: 20, maxStock: 50, price: 49.99
  });

  const fetchInventory = useCallback(async () => {
    if (!isAuthenticated) {
      setInventory([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      const mapped: IInventoryItem[] = data.map((p: any) => ({
        id: p.id,
        sku: p.sku || `SKU-${p.id.toUpperCase()}`,
        name: p.name,
        category: p.category.name,
        stock: p.stock,
        maxStock: 100,
        price: p.price,
        status: p.stock === 0 ? 'Out of Stock' : p.stock < 5 ? 'Low Stock' : 'In Stock',
        supplier: 'TechParts Global',
        compatibility: p.description,
      }));
      setInventory(mapped);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al obtener inventario';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(inventory.map(i => i.category)))], [inventory]);
  const statuses = ['Todos', 'In Stock', 'Low Stock', 'Out of Stock'];

  const stats = useMemo(() => ({
    totalSKUs: inventory.length,
    lowStockAlerts: inventory.filter(i => i.status === 'Low Stock').length,
    outOfStock: inventory.filter(i => i.status === 'Out of Stock').length,
    pendingOrders: 2
  }), [inventory]);

  const filteredInventory = useMemo(() =>
    inventory.filter(item => {
      const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Todos' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    }),
  [inventory, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE) || 1;
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInventory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const setSearchQuery = (q: string) => { setSearchQueryState(q); setCurrentPage(1); };
  const setSelectedCategory = (c: string) => { setSelectedCategoryState(c); setCurrentPage(1); };
  const setSelectedStatus = (s: string) => { setSelectedStatusState(s); setCurrentPage(1); };

  const handleRequestPart = async (itemId: string) => {
    if (!isAuthenticated) return;
    try {
      const suppliers = await getSuppliers();
      await createRestockOrder({ proveedor_id: suppliers[0].id, producto_id: itemId, cantidad: 20 });
      alert('Orden enviada!');
      await fetchInventory();
    } catch (e) { console.error(e); }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      await createProduct(newItem);
      setIsModalOpen(false);
      await fetchInventory();
    } catch (e) { console.error(e); }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !editingItem) return;
    try {
      await updateProduct(editingItem.id, editingItem);
      setIsEditModalOpen(false);
      await fetchInventory();
    } catch (e) { console.error(e); }
  };

  const handleClearFilters = () => {
    setSearchQueryState('');
    setSelectedCategoryState('Todas');
    setSelectedStatusState('Todos');
    setCurrentPage(1);
  };

  return {
    inventory, searchQuery, selectedCategory, selectedStatus,
    isModalOpen, isEditModalOpen, editingItem, currentPage, totalPages, filteredInventory, paginatedInventory,
    categories, statuses, stats, newItem,
    setSearchQuery, setSelectedCategory, setSelectedStatus,
    setIsModalOpen, setIsEditModalOpen, setEditingItem, setNewItem, handlePageChange,
    handleRequestPart, handleCreateItem, handleUpdateItem, handleClearFilters,
    refetch: fetchInventory, loading, error
  };
}
