'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Coins, 
  TrendingUp, 
  Plus, 
  Info, 
  Calendar, 
  User, 
  Loader2, 
  AlertTriangle,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader';
import InventoryStatCard from '@/components/admin/InventoryStatCard';

interface Supplier {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
}

interface SupplierOrder {
  id: string;
  proveedor: Supplier;
  producto: {
    id: string;
    nombre: string;
    sku: string;
    precio_costo: number;
    precio_venta: number;
  };
  cantidad: number;
  estado: string;
  created_at: string;
}

interface Product {
  id: string;
  nombre: string;
  sku: string;
  stock_actual: number;
  stock_minimo: number;
}

export default function AdminProveedores() {
  const { token, isAuthenticated } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(25);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch suppliers
      const supRes = await fetch(`${API_URL}/api/admin/suppliers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fetchedSuppliers: Supplier[] = [];
      if (supRes.ok) {
        fetchedSuppliers = await supRes.json();
        setSuppliers(fetchedSuppliers);
        if (fetchedSuppliers.length > 0) {
          setSelectedSupplierId(fetchedSuppliers[0].id);
        }
      }

      // 2. Fetch products for catalog pick
      const prodRes = await fetch(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData || []);
        if (prodData && prodData.length > 0) {
          setSelectedProductId(prodData[0].id);
        }
      }

      // 3. Fetch past orders
      const orderRes = await fetch(`${API_URL}/api/admin/supplier-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData || []);
      }
    } catch (e) {
      console.error(e);
      setError('Error al comunicar con los servidores de TechFix.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generar pedido de reabastecimiento
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !selectedProductId || quantity <= 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/supplier-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proveedor_id: selectedSupplierId,
          producto_id: selectedProductId,
          cantidad: quantity,
        }),
      });

      if (res.ok) {
        alert('¡Pedido de reabastecimiento emitido exitosamente!');
        setQuantity(25);
        
        // Simular que el stock aumenta en el backend tras el pedido (Simulación de arribo OEM)
        const selectedProd = products.find(p => p.id === selectedProductId);
        if (selectedProd) {
          const newStock = selectedProd.stock_actual + quantity;
          await fetch(`${API_URL}/api/admin/products/${selectedProductId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              stock_actual: newStock,
            }),
          });
        }

        await fetchData(); // Refrescar listas y bitácoras
      } else {
        const err = await res.json();
        alert(err.error || 'Error al procesar la orden mayorista.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular repuestos con stock crítico
  const criticalParts = products.filter(p => p.stock_actual <= p.stock_minimo);

  // Calcular precio total de órdenes
  const totalCostSimulated = orders.reduce((acc, curr) => {
    const cost = curr.producto?.precio_costo || 25;
    return acc + (cost * curr.cantidad);
  }, 0);

  return (
    <div className="space-y-6 bg-surface dark:bg-slate-900/30 rounded-2xl border border-outline-variant/30 dark:border-slate-800 p-6 transition-colors duration-300 shadow-sm min-h-[calc(100vh-140px)]">
      
      {/* Cabecera */}
      <AdminHeader 
        title="Mayoristas y Pedidos OEM" 
        description="Gestiona convenios con proveedores de repuestos y coordina órdenes de reabastecimiento directo."
        icon={Truck}
      />

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InventoryStatCard label="Total Mayoristas" value={suppliers.length} subLabel="OEM Partners" accentColor="primary" />
        <InventoryStatCard label="Pedidos Generados" value={orders.length} subLabel="Bitácora Activa" accentColor="primary" />
        <InventoryStatCard label="Inversión Estimada" value={`$${totalCostSimulated.toFixed(2)}`} subLabel="Wholesale USD" accentColor="primary" />
        <InventoryStatCard 
          label="Partes Críticas" 
          value={criticalParts.length} 
          accentColor={criticalParts.length > 0 ? "warning" : "primary"}
          badge={criticalParts.length > 0 ? (
            <span className="text-[9px] bg-amber-50 dark:bg-amber-955 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-250 font-bold flex items-center mb-1 animate-pulse">
              Restock Needed
            </span>
          ) : undefined}
        />
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-sky-500" />
          <span className="ml-3 text-xs text-on-surface-variant font-bold">Cargando bitácora de mayoristas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Columna Izquierda: Proveedores y Bitácora */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Lista de Proveedores */}
            <div className="bg-surface-container-lowest dark:bg-slate-950/20 border border-outline-variant/30 dark:border-slate-850 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-on-surface dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary dark:text-sky-400" />
                Mayoristas Sembrados
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suppliers.map(s => (
                  <div key={s.id} className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-850 rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-all shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-xs text-on-surface dark:text-white uppercase tracking-tight">{s.nombre}</h4>
                        <span className="text-[8px] bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50 px-1.5 py-0.5 rounded font-black uppercase">
                          OEM Direct
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 mt-3 text-on-surface-variant/80 dark:text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-outline dark:text-slate-500 shrink-0" />
                          <span>Contacto: {s.contacto}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-outline dark:text-slate-500 shrink-0" />
                          <a href={`tel:${s.telefono}`} className="hover:underline">{s.telefono}</a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-outline dark:text-slate-500 shrink-0" />
                          <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bitácora de Pedidos */}
            <div className="bg-surface-container-lowest dark:bg-slate-950/20 border border-outline-variant/30 dark:border-slate-850 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-on-surface dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                Historial de Órdenes Mayoristas
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/30 dark:border-slate-850 bg-surface-container-low/40 dark:bg-slate-900/30">
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Orden ID</th>
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Mayorista</th>
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Repuesto</th>
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Cantidad</th>
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Costo Est.</th>
                      <th className="py-2.5 px-3 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-850/40">
                    {orders.map(o => {
                      const cost = o.producto?.precio_costo || 25;
                      const orderSubtotal = cost * o.cantidad;
                      return (
                        <tr key={o.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-primary dark:text-sky-400 uppercase select-all">
                            ORD-{o.id.slice(0, 6).toUpperCase()}
                          </td>
                          <td className="py-3 px-3 font-medium text-on-surface dark:text-slate-300">
                            {o.proveedor?.nombre || 'OEM Provider'}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-on-surface dark:text-slate-200">{o.producto?.nombre || 'Repuesto de Taller'}</div>
                            <div className="text-[9px] text-outline font-mono uppercase">{o.producto?.sku || 'N/A'}</div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-on-surface dark:text-slate-350">{o.cantidad} ud</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${orderSubtotal.toFixed(2)} USD
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 font-bold uppercase tracking-wider text-[9px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                              Arribado Express
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-on-surface-variant/40 dark:text-slate-600 italic">
                          No se han emitido pedidos de reabastecimiento en esta sesión.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Formulario & Recomendaciones */}
          <div className="space-y-6">
            
            {/* Formulario de Compra */}
            <div className="bg-surface-container-lowest dark:bg-slate-950/20 border border-outline-variant/30 dark:border-slate-850 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-on-surface dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Nueva Solicitud OEM
              </h3>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Seleccionar Mayorista</label>
                  <select 
                    required
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded px-3 py-2 text-xs font-semibold text-on-surface dark:text-white cursor-pointer"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-900">{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Seleccionar Componente</label>
                  <select 
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded px-3 py-2 text-xs font-semibold text-on-surface dark:text-white cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="dark:bg-slate-900">
                        {p.nombre} (Stock: {p.stock_actual})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Cantidad a Comprar</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded px-3 py-2 text-xs text-on-surface dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Emitir Pedido OEM</>
                  )}
                </button>
              </form>
            </div>

            {/* Panel de Alertas de Stock */}
            {criticalParts.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Reabastecimiento Recomendado
                </h4>
                
                <p className="text-[11px] text-on-surface-variant/80 dark:text-slate-400 leading-relaxed">
                  Las siguientes refacciones están por debajo o igual al stock mínimo. Se aconseja generar un pedido OEM directo:
                </p>

                <div className="space-y-2 mt-2">
                  {criticalParts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className="bg-white dark:bg-slate-900/60 border border-outline-variant/30 dark:border-slate-850 rounded-lg p-2.5 flex items-center justify-between hover:border-amber-500 cursor-pointer transition-colors shadow-sm"
                    >
                      <div>
                        <div className="font-bold text-[11px] text-on-surface dark:text-slate-200">{p.nombre}</div>
                        <div className="text-[9px] text-slate-400 font-mono select-none">Minimo: {p.stock_minimo}</div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-error animate-pulse">
                        Stock: {p.stock_actual}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
