import { ReactNode } from 'react';
import { IProduct, ICategory, IRepair, IAppointment, IDashboardStats, IActivityLog } from './domain';

// Props para componentes de la UI
export interface ICardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
}

export interface IIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

// Props para Features (Dashboard)
export interface IMetricCardProps {
  stat: IDashboardStats;
}

export interface IActivityListProps {
  activities: IActivityLog[];
}

export interface IDashboardHeaderProps {
  title: string;
  subtitle?: string;
}

// Props para Features (Reparaciones)
export interface IRepairStatusBadgeProps {
  status: IRepair['status'];
}

// Props para Features (Citas)
export interface IAppointmentCardProps {
  appointment: IAppointment;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

// Props para Features (Inventario)
export interface IInventoryTableProps {
  products: IProduct[];
  onEdit?: (product: IProduct) => void;
  onDelete?: (id: string) => void;
}

export interface IProductFormProps {
  initialData?: Partial<IProduct>;
  onSubmit: (data: Partial<IProduct>) => void;
}

// Props para Features (Catálogo)
export interface IProductCardProps {
  product: IProduct;
  onAddToCart?: (product: IProduct) => void;
}

export interface ICatalogFiltersProps {
  categories: ICategory[];
  onFilterChange: (filters: Record<string, string | string[]>) => void;
}

// Props para Features
export interface ILoginFormProps {
  onSuccess?: () => void;
}

export interface IRegisterFormProps {
  onSuccess?: () => void;
}
