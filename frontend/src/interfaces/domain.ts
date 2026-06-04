export interface IUser {
  id: string;
  email: string;
  name: string;
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
  description: string;
  price: number;
  stock: number;
  image: string;
  category: ICategory;
  status: 'active' | 'out_of_stock' | 'discontinued';
}

export type RepairStatus = 'pending' | 'diagnosing' | 'waiting_parts' | 'repairing' | 'testing' | 'ready' | 'delivered';

export interface IRepair {
  id: string;
  customerName: string;
  deviceName: string;
  serialNumber: string;
  issueDescription: string;
  status: RepairStatus;
  createdAt: string;
  estimatedDate?: string;
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
