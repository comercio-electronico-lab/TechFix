'use client';

import { useState, useMemo } from 'react';
import { InventoryItem } from '@/types';

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'DP-OLED-IP13', name: 'OLED Display Assembly', category: 'Displays', stock: 145, maxStock: 200, price: 129, status: 'In Stock', supplier: 'TechParts Global', compatibility: 'iPhone 13 Pro' },
  { id: '2', sku: 'BAT-LIION-S22', name: 'Lithium-Ion Battery 3700mAh', category: 'Batteries', stock: 12, maxStock: 50, price: 35, status: 'Low Stock', supplier: 'PowerCell Inc.', compatibility: 'Samsung S22' },
  { id: '3', sku: 'BRD-MAC-M1-256', name: 'Logic Board M1 8-Core 256GB', category: 'Motherboards', stock: 0, maxStock: 15, price: 649, status: 'Out of Stock', supplier: 'Cupertino OEM', compatibility: 'MacBook Air 2020' },
  { id: '4', sku: 'CNS-THRM-TGK', name: 'Thermal Grizzly Kryonaut', category: 'Consumables', stock: 42, maxStock: 50, price: 15, status: 'In Stock', supplier: 'Cooling Direct', compatibility: 'Consumable 1g' },
  { id: '5', sku: 'SSD-NVME-1TB-GEN4', name: '1TB M.2 NVMe SSD Gen4', category: 'Storage', stock: 28, maxStock: 30, price: 119, status: 'In Stock', supplier: 'Silicon Valley Dist.', compatibility: 'PCIe 4.0 Systems' },
  { id: '6', sku: 'LAP-001', name: 'ProBook X15 G9 Panel', category: 'Laptops', stock: 8, maxStock: 20, price: 1499, status: 'Low Stock', supplier: 'TechParts Global', compatibility: 'ProBook X15' },
  { id: '7', sku: 'PHN-042', name: 'Nexus Ultra 5G Glass', category: 'Smartphones', stock: 3, maxStock: 15, price: 999, status: 'Low Stock', supplier: 'Cupertino OEM', compatibility: 'Nexus Ultra' },
];

export interface UseInventoryReturn {
  inventory: InventoryItem[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  isModalOpen: boolean;
  currentPage: number;
  totalPages: number;
  filteredInventory: InventoryItem[];
  paginatedInventory: InventoryItem[];
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
  setNewItem: React.Dispatch<React.SetStateAction<UseInventoryReturn['newItem']>>;
  handlePageChange: (page: number) => void;
  handleRequestPart: (itemId: string) => void;
  handleCreateItem: (e: React.FormEvent) => void;
  handleClearFilters: () => void;
}

const ITEMS_PER_PAGE = 5;

export function useInventory(): UseInventoryReturn {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState('Todas');
  const [selectedStatus, setSelectedStatusState] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newItem, setNewItem] = useState({
    sku: '', name: '', compatibility: '',
    category: 'Displays', supplier: 'TechParts Global',
    stock: 20, maxStock: 50, price: 49.99
  });

  const categories = useMemo(() =>
    ['Todas', ...Array.from(new Set(inventory.map(item => item.category)))], [inventory]);

  const statuses = ['Todos', 'In Stock', 'Low Stock', 'Out of Stock'];

  const stats = useMemo(() => ({
    totalSKUs: inventory.length,
    lowStockAlerts: inventory.filter(item => item.stock < 15 && item.stock > 0).length,
    outOfStock: inventory.filter(item => item.stock === 0).length,
    pendingOrders: inventory.filter(item => item.status === 'Out of Stock').length,
  }), [inventory]);

  const filteredInventory = useMemo(() =>
    inventory.filter(item => {
      const matchesSearch = !searchQuery.trim() ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.compatibility.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const setSearchQuery = (q: string) => { setSearchQueryState(q); setCurrentPage(1); };
  const setSelectedCategory = (c: string) => { setSelectedCategoryState(c); setCurrentPage(1); };
  const setSelectedStatus = (s: string) => { setSelectedStatusState(s); setCurrentPage(1); };

  const handleRequestPart = (itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const newStock = Math.min(item.stock + 15, item.maxStock);
      return { ...item, stock: newStock, status: newStock >= 15 ? 'In Stock' : 'Low Stock' };
    }));
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.sku || !newItem.name || !newItem.compatibility) return;

    const itemStock = Number(newItem.stock);
    const itemMax = Number(newItem.maxStock);
    const itemStatus: InventoryItem['status'] = itemStock === 0 ? 'Out of Stock' : itemStock < 15 ? 'Low Stock' : 'In Stock';

    const item: InventoryItem = {
      id: `${inventory.length + 1}`,
      sku: newItem.sku.toUpperCase(),
      name: newItem.name,
      compatibility: newItem.compatibility,
      category: newItem.category,
      supplier: newItem.supplier,
      stock: itemStock,
      maxStock: itemMax,
      price: Number(newItem.price),
      status: itemStatus
    };

    setInventory(prev => [item, ...prev]);
    setIsModalOpen(false);
    setNewItem({ sku: '', name: '', compatibility: '', category: 'Displays', supplier: 'TechParts Global', stock: 20, maxStock: 50, price: 49.99 });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQueryState('');
    setSelectedCategoryState('Todas');
    setSelectedStatusState('Todos');
    setCurrentPage(1);
  };

  return {
    inventory, searchQuery, selectedCategory, selectedStatus,
    isModalOpen, currentPage, totalPages, filteredInventory, paginatedInventory,
    categories, statuses, stats, newItem,
    setSearchQuery, setSelectedCategory, setSelectedStatus,
    setIsModalOpen, setNewItem, handlePageChange,
    handleRequestPart, handleCreateItem, handleClearFilters,
  };
}
