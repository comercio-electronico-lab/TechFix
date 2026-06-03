export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const mockInventory: InventoryItem[] = [
  { id: '1', sku: 'LAP-001', name: 'ProBook X15 G9', category: 'Laptops', stock: 12, price: 1499, status: 'In Stock' },
  { id: '2', sku: 'PHN-042', name: 'Nexus Ultra 5G', category: 'Smartphones', stock: 3, price: 999, status: 'Low Stock' },
  { id: '3', sku: 'MON-108', name: 'Precision Display 4K', category: 'Monitors', stock: 0, price: 649, status: 'Out of Stock' },
  { id: '4', sku: 'TAB-009', name: 'TabPro 12.9" M2', category: 'Tablets', stock: 25, price: 899, status: 'In Stock' },
  { id: '5', sku: 'RAM-015', name: 'DDR5 32GB Kit', category: 'Components', stock: 45, price: 199, status: 'In Stock' },
];

export interface Appointment {
  id: string;
  customer: string;
  device: string;
  service: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export const mockAppointments: Appointment[] = [
  { id: 'TKT-1001', customer: 'Carlos Perez', device: 'MacBook Pro 14"', service: 'Microsoldadura', date: '2026-05-26', status: 'In Progress' },
  { id: 'TKT-1002', customer: 'Ana Garcia', device: 'iPhone 15 Pro', service: 'Cambio de Pantalla', date: '2026-05-27', status: 'Pending' },
  { id: 'TKT-1003', customer: 'Roberto Diaz', device: 'Dell XPS 13', service: 'Recuperación de Datos', date: '2026-05-25', status: 'Completed' },
  { id: 'TKT-1004', customer: 'Maria Lopez', device: 'Samsung S24', service: 'Batería', date: '2026-05-28', status: 'Pending' },
  { id: 'TKT-1005', customer: 'Diego Ruiz', device: 'iPad Pro 11"', service: 'Pantalla', date: '2026-05-29', status: 'In Progress' },
];
