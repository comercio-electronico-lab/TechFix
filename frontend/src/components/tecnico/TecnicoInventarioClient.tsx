'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminProductsAction } from '@/actions';
import { Search, Package, AlertTriangle } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function TecnicoInventarioClient() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [token]);

  const loadProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminProductsAction();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const getStockBadge = (stock: number) => {
    if (stock <= 0) return <Badge variant="error">Sin Stock</Badge>;
    if (stock <= 5) return <Badge variant="pending">Stock Bajo ({stock})</Badge>;
    return <Badge variant="success">{stock} disp.</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Inventario</h1>
          <p className="text-sm text-on-surface-variant">Consulta el stock disponible de repuestos y componentes.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Buscar repuesto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/40 border border-dashed border-outline-variant/30 p-12 text-center rounded-2xl">
          <Package className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="font-bold text-on-surface-variant">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900/60 border border-outline-variant/20 rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm text-on-background flex-1">{p.name}</p>
                <span className="text-[10px] font-mono text-on-surface-variant/50 bg-surface-container-low px-2 py-0.5 rounded">{p.sku}</span>
              </div>
              {p.description && (
                <p className="text-xs text-on-surface-variant/70 line-clamp-2">{p.description}</p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  {p.stock !== undefined && p.stock <= 5 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="text-xs font-bold">${p.price?.toFixed(2)}</span>
                </div>
                {getStockBadge(p.stock || 0)}
              </div>
              {p.category && (
                <div className="text-[10px] text-on-surface-variant/60 bg-surface-container-low px-2 py-1 rounded-lg inline-block">
                  {typeof p.category === 'object' ? p.category.name : p.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
