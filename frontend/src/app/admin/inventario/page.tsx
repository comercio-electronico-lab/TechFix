'use client';

import React from 'react';
import { Search, Plus, Package2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import InventoryStatCard from '@/components/admin/InventoryStatCard';
import InventoryTable from '@/components/admin/InventoryTable';
import NewInventoryItemModal from '@/components/admin/NewInventoryItemModal';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/ui/Modal';

const inputClass = "w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-755 rounded px-3 py-2 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20";

export default function AdminInventario() {
  const {
    searchQuery,
    selectedCategory,
    selectedStatus,
    isModalOpen,
    isEditModalOpen,
    editingItem,
    currentPage,
    totalPages,
    filteredInventory,
    paginatedInventory,
    categories,
    statuses,
    stats,
    newItem,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setIsModalOpen,
    setIsEditModalOpen,
    setEditingItem,
    setNewItem,
    handlePageChange,
    handleRequestPart,
    handleCreateItem,
    handleUpdateItem,
    handleClearFilters,
  } = useInventory();

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'Todas' || selectedStatus !== 'Todos';

  return (
    <div className="space-y-6 bg-surface dark:bg-slate-900/30 rounded-2xl border border-outline-variant/30 dark:border-slate-800 p-6 transition-colors duration-300 shadow-sm min-h-[calc(100vh-140px)]">

      {/* Cabecera */}
      <AdminHeader
        title="Inventory Management"
        description="Manage components, track stock levels, and coordinate supplier orders."
        icon={Package2}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InventoryStatCard label="Total SKUs" value={stats.totalSKUs} subLabel="Items Registered" accentColor="primary" />
        <InventoryStatCard
          label="Low Stock Alerts"
          value={stats.lowStockAlerts}
          accentColor="warning"
          badge={stats.lowStockAlerts > 0 ? (
            <span className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60 font-bold flex items-center mb-1 animate-pulse">
              Needs attention
            </span>
          ) : undefined}
        />
        <InventoryStatCard
          label="Out of Stock"
          value={stats.outOfStock}
          accentColor="error"
          badge={stats.outOfStock > 0 ? (
            <span className="text-[9px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/60 font-bold mb-1">
              Needs order
            </span>
          ) : undefined}
        />
        <InventoryStatCard label="Pending Orders" value={stats.pendingOrders} subLabel="auto-requests" accentColor="primary" />
      </div>

      {/* Tabla + Filtros */}
      <div className="bg-surface-container-lowest dark:bg-slate-950/20 border border-outline-variant/30 dark:border-slate-850 rounded-xl shadow-sm flex flex-col overflow-hidden transition-colors mt-6">

        {/* Barra de Filtros */}
        <div className="p-4 border-b border-outline-variant/30 dark:border-slate-850 flex flex-wrap gap-4 items-center justify-between bg-surface-container-low/40 dark:bg-slate-900/40">
          <div className="flex flex-wrap gap-3 items-center flex-1 w-full md:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 dark:text-slate-500" />
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, Part Name, Supplier..."
                className="w-full pl-9 pr-4 py-1.5 bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded-lg text-xs text-on-surface dark:text-white placeholder:text-outline/70 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded-lg text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 cursor-pointer font-semibold">
              {categories.map(cat => (
                <option key={cat} value={cat} className="dark:bg-slate-900">{cat === 'Todas' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-850 rounded-lg text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-500 cursor-pointer font-semibold">
              {statuses.map(st => (
                <option key={st} value={st} className="dark:bg-slate-900">{st === 'Todos' ? 'All Statuses' : st}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="text-[10px] font-bold text-primary dark:text-sky-400 hover:text-secondary dark:hover:text-sky-300 uppercase tracking-wider cursor-pointer">
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Item
            </button>
          </div>
        </div>

        {/* Tabla */}
        <InventoryTable
          paginatedInventory={paginatedInventory}
          filteredInventory={filteredInventory}
          onRequestPart={handleRequestPart}
          onEditItem={(item) => {
            setEditingItem(item);
            setIsEditModalOpen(true);
          }}
        />

        {/* Paginación */}
        <div className="p-4 border-t border-outline-variant/30 dark:border-slate-855 bg-surface-container-low/40 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="font-semibold text-on-surface-variant/80 dark:text-slate-400 text-xs">
            Showing{' '}
            <span className="font-bold text-on-surface dark:text-white font-mono">
              {filteredInventory.length === 0 ? 0 : (currentPage - 1) * 5 + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-on-surface dark:text-white font-mono">
              {Math.min(currentPage * 5, filteredInventory.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-on-surface dark:text-white font-mono">{filteredInventory.length}</span> items
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant/50 dark:border-slate-850 text-on-surface dark:text-slate-350 hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded font-semibold transition-all text-xs ${currentPage === page ? 'bg-primary dark:bg-sky-600 text-on-primary shadow-sm font-bold' : 'border border-transparent text-on-surface dark:text-slate-350 hover:bg-surface'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant/50 dark:border-slate-850 text-on-surface dark:text-slate-350 hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <NewInventoryItemModal
        isOpen={isModalOpen}
        newItem={newItem}
        onClose={() => setIsModalOpen(false)}
        onChange={setNewItem}
        onSubmit={handleCreateItem}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          title="Edit Catalog Product"
          icon={<Edit className="w-4 h-4 text-amber-500" />}
        >
          <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">SKU Code (Read-Only)</label>
              <input type="text" disabled className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-500 cursor-not-allowed uppercase font-mono" value={editingItem.sku} />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Item Name</label>
              <input type="text" required value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Compatible Models / Specs</label>
              <input type="text" required value={editingItem.compatibility} onChange={(e) => setEditingItem({ ...editingItem, compatibility: e.target.value })} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Stock Actual</label>
                <input type="number" required value={editingItem.stock} onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Unit Price ($)</label>
                <input type="number" step="0.01" required value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })} className={inputClass} />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => {
                setIsEditModalOpen(false);
                setEditingItem(null);
              }} className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest dark:bg-slate-800 dark:hover:bg-slate-750 text-on-surface-variant dark:text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-outline-variant/20">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
