export interface IUser {
  id: string;
  email: string;
  nombre: string;
  teléfono?: string;
  dirección?: string;
  ciudad?: string;
  documentId?: string;
  role: 'admin' | 'tecnico' | 'cliente';
  createdAt: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface ICustomerDevice {
  id: string;
  brand: string;
  model: string;
  specs: string;
  serialNumber: string;
  purchaseDate: string;
  status: 'Active Warranty' | 'Out of Warranty';
  inService: boolean;
  image: string;
}

export interface IActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface IDashboardStats {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface IAdminRepairTicket extends IRepair {
  customerEmail: string;
  deviceSerial: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  finalPrice: number;
  notes: string;
}

export interface IInventoryItem {
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

export interface ICategory {
  id: string;
  name: string;
  slug: string;
}

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  category?: ICategory | string;
  status?: 'active' | 'out_of_stock' | 'discontinued';
  sku?: string;
  reasoning?: string;
  estimated_price?: number;
}

export type RepairStatus = 'pending' | 'diagnosing' | 'waiting_parts' | 'repairing' | 'testing' | 'ready' | 'delivered';

export interface IRepair {
  id: string;
  customerName?: string;
  deviceName?: string;
  serialNumber?: string;
  issueDescription?: string;
  status: RepairStatus;
  createdAt?: string;
  created_at?: string;
  estimatedDate?: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  final_price?: number;
  diagnosis_final?: string;
  appointment_datetime?: string;
  notes?: string;
  customerEmail?: string;
  device?: {
    brand: string;
    model: string;
    serial_number: string;
  };
}

export interface IAppointment {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  customerName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface IDiagnosticOption {
  id: string;
  label: string;
  nextStepId?: string;
  action?: string;
  isTerminal?: boolean;
  suggestedProducts?: IProduct[];
  question_text?: string;
  answer_option?: string;
}

export interface IDiagnosticNode {
  id: string;
  question: string;
  question_text?: string;
  answer_option?: string;
  isTerminal?: boolean;
  options: IDiagnosticOption[];
  preliminary_result?: string;
  estimated_min?: number;
  estimated_max?: number;
  suggestedProducts?: IProduct[];
}

export interface IDiagnosticHistory {
  node: IDiagnosticNode;
  options: IDiagnosticOption[];
}

export interface RepairOrderProduct {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ClientRepair {
  id: string;
  device?: {
    brand: string;
    model: string;
    serial_number: string;
  };
  status: 'pending' | 'agendado' | 'en_reparacion' | 'reparado' | 'completado';
  diagnosis_final: string;
  created_at: string;
  appointment_datetime?: string;
  final_price: number;
  estimated_price_min?: number;
  estimated_price_max?: number;
  productos?: RepairOrderProduct[];
  notes?: string;
  warranty?: {
    warranty_days: number;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
  };
  payment_status?: 'pending' | 'approved' | 'failed';
}

export interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  device_type: string;
  purchase_date: string | null;
}

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderData {
  orderNumber: string;
  email: string;
  clientName: string;
  address: string;
  estimatedDate: string;
  courier: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}



