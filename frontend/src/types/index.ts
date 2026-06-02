// ============================================
// PRODUCT TYPES
// ============================================
export interface Product {
  id: string;
  sku?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: string;
}

// ============================================
// CART TYPES (re-exported from CartContext for convenience)
// ============================================
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  tags?: string[];
}

// ============================================
// REPAIR / TICKET TYPES
// ============================================
export interface RepairTicket {
  id: string;
  customer: string;
  device: string;
  description: string;
  status: 'Pending' | 'Diagnosis' | 'Repairing' | 'Completed';
  technician: string;
  technicianAvatar?: string;
  priority: 'Low' | 'Medium' | 'High';
  progress?: number;
  timeSpent: string;
}

export interface DiagnosticState {
  step: number;
  deviceType: 'Smartphone' | 'Laptop' | 'Tablet' | 'Desktop' | null;
  issueCategory: 'Display' | 'Battery' | 'Performance' | 'Physical' | null;
  issueDetail: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

// ============================================
// INVENTORY TYPES
// ============================================
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier: string;
  compatibility: string;
}

// ============================================
// CUSTOMER / PORTAL TYPES
// ============================================
export interface CustomerDevice {
  id: string;
  brand: string;
  model: string;
  specs: string;
  serialNumber: string;
  purchaseDate: string;
  status: 'Active Warranty' | 'Out of Warranty';
  inService?: boolean;
  image: string;
}

// ============================================
// ADMIN / STATS TYPES
// ============================================
export interface StatsData {
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'warning' | 'error' | 'success';
}
