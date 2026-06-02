'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface KanbanAddPartModalProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KanbanAddPartModal({ 
  isOpen, 
  ticketId, 
  onClose,
  onSuccess
}: KanbanAddPartModalProps) {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Cargar repuestos en vivo para asociar
  useEffect(() => {
    if (isOpen) {
      async function fetchProducts() {
        setLoadingProducts(true);
        try {
          const res = await fetch(`${API_URL}/api/products`);
          if (res.ok) {
            const data = await res.json();
            // Filtrar productos con stock
            setProducts((data || []).filter((p: any) => p.stock_actual > 0));
          }
        } catch (e) {
          console.error('Error fetching parts:', e);
        } finally {
          setLoadingProducts(false);
        }
      }
      fetchProducts();
    }
  }, [isOpen, API_URL]);

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/repairs/${ticketId}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          producto_id: selectedProductId,
          cantidad: quantity,
        }),
      });

      if (res.ok) {
        alert('¡Repuesto añadido e inventario descontado con éxito!');
        onClose();
        setSelectedProductId('');
        setQuantity(1);
        
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Error al añadir el repuesto.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor de laboratorio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white dark:bg-slate-950 z-20 rounded-lg p-4 flex flex-col justify-between border border-primary dark:border-sky-500">
      <form onSubmit={handleAddPart} className="space-y-3 flex-grow flex flex-col justify-between">
        <div>
          <h5 className="text-xs font-black text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-850 pb-1.5">
            <ShoppingBag className="w-4 h-4 text-amber-500" /> Cargar Repuesto
          </h5>
          
          {loadingProducts ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              <label className="block text-[9px] font-bold uppercase text-slate-400">Seleccionar repuesto:</label>
              <select 
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-on-surface dark:text-white"
              >
                <option value="">-- Seleccionar pieza --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (${p.precio_venta} USD - Stock: {p.stock_actual})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1 mt-2">
            <label className="block text-[9px] font-bold uppercase text-slate-400">Cantidad:</label>
            <input 
              type="number"
              required
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-850">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-1.5 bg-primary hover:bg-primary-dark text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cargar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
