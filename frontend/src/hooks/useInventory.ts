'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { InventoryItem } from '@/types';

export interface UseInventoryReturn {
  inventory: InventoryItem[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  editingItem: InventoryItem | null;
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
  setIsEditModalOpen: (open: boolean) => void;
  setEditingItem: (item: InventoryItem | null) => void;
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
  const { token, isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState('Todas');
  const [selectedStatus, setSelectedStatusState] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    sku: '', name: '', compatibility: '',
    category: 'Displays', supplier: 'TechParts Global',
    stock: 20, maxStock: 50, price: 49.99
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchInventory = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setInventory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Mapear GORM Producto a formato de UI InventoryItem
        const mapped: InventoryItem[] = (data || []).map((p: any) => ({
          id: p.id,
          sku: p.sku || `SKU-${p.id.slice(0, 6).toUpperCase()}`,
          name: p.nombre,
          category: p.categoria || 'Generales',
          stock: p.stock_actual,
          maxStock: p.stock_minimo * 4 || 100,
          price: p.precio_venta,
          status: (p.stock_actual === 0 ? 'Out of Stock' : p.stock_actual <= p.stock_minimo ? 'Low Stock' : 'In Stock') as any,
          supplier: 'Importaciones TechParts S.A.', // Proveedor principal
          compatibility: p.descripcion || 'Universal / OEM',
        }));
        setInventory(mapped);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Error al obtener inventario del taller.');
      }
    } catch (e) {
      console.error(e);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, isAuthenticated]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const categories = useMemo(() =>
    ['Todas', ...Array.from(new Set(inventory.map(item => item.category)))], [inventory]);

  const statuses = ['Todos', 'In Stock', 'Low Stock', 'Out of Stock'];

  const stats = useMemo(() => ({
    totalSKUs: inventory.length,
    lowStockAlerts: inventory.filter(item => item.status === 'Low Stock').length,
    outOfStock: inventory.filter(item => item.status === 'Out of Stock').length,
    pendingOrders: inventory.filter(item => item.status === 'Out of Stock').length, // Representativo
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

  // Reabastecimiento a través de mayorista seeded
  const handleRequestPart = async (itemId: string) => {
    if (!token) return;

    try {
      // 1. Obtener lista de proveedores semilla en Go
      const supRes = await fetch(`${API_URL}/api/admin/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!supRes.ok) {
        alert('Error al obtener la lista de proveedores mayoristas.');
        return;
      }

      const suppliers = await supRes.json();
      if (!suppliers || suppliers.length === 0) {
        alert('No hay proveedores mayoristas registrados en el sistema.');
        return;
      }

      // Tomar primer proveedor (Importaciones TechParts S.A.)
      const mainSupplier = suppliers[0];

      // 2. Colocar pedido de repuesto
      const orderRes = await fetch(`${API_URL}/api/admin/supplier-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proveedor_id: mainSupplier.id,
          producto_id: itemId,
          cantidad: 20, // Cantidad estándar de reabastecimiento
        }),
      });

      if (orderRes.ok) {
        alert(`¡Orden de compra mayorista enviada con éxito a "${mainSupplier.nombre}" por 20 unidades!`);
        // Actualizar localmente el stock para simular el arribo express
        // En una app real, el arribo se marca como "entregado" en backoffice
        // Haremos una llamada PUT para reabastecer el stock local en vivo de forma integrada.
        const itemToUpdate = inventory.find(i => i.id === itemId);
        if (itemToUpdate) {
          const newStockVal = itemToUpdate.stock + 20;
          await fetch(`${API_URL}/api/admin/products/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              stock_actual: newStockVal,
              stock_minimo: Math.round(newStockVal / 4) || 5,
            }),
          });
          await fetchInventory();
        }
      } else {
        const err = await orderRes.json();
        alert(err.error || 'Error al emitir el pedido al mayorista.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al procesar el reabastecimiento.');
    }
  };

  // Crear nuevo repuesto en catálogo
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.sku || !newItem.name || !newItem.compatibility) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: newItem.name,
          descripcion: newItem.compatibility, // mapped to compatibility in ui
          sku: newItem.sku.toUpperCase(),
          precio_venta: Number(newItem.price),
          precio_costo: Math.round(Number(newItem.price) * 0.6 * 100) / 100, // costo simulado
          stock_actual: Number(newItem.stock),
          stock_minimo: Math.round(Number(newItem.maxStock) / 4) || 5,
          categoria: newItem.category,
        }),
      });

      if (res.ok) {
        alert('¡Repuesto registrado con éxito en el catálogo de TechFix!');
        setIsModalOpen(false);
        setNewItem({ sku: '', name: '', compatibility: '', category: 'Displays', supplier: 'TechParts Global', stock: 20, maxStock: 50, price: 49.99 });
        await fetchInventory();
        setCurrentPage(1);
      } else {
        const err = await res.json();
        alert(err.error || 'Error al registrar el repuesto.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al crear el producto.');
    }
  };

  // Modificar repuesto existente
  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: editingItem.name,
          descripcion: editingItem.compatibility,
          precio_venta: Number(editingItem.price),
          stock_actual: Number(editingItem.stock),
        }),
      });

      if (res.ok) {
        alert('¡Repuesto actualizado correctamente!');
        setIsEditModalOpen(false);
        setEditingItem(null);
        await fetchInventory();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al actualizar el repuesto.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
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
