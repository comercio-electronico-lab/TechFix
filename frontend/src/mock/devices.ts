export interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  device_type: string;
  purchase_date: string | null;
}

export const mockDevices: Device[] = [
  { 
    id: 'DEV-001', 
    brand: 'Apple', 
    model: 'MacBook Pro M2', 
    serial_number: 'SN-AAPL-1234', 
    device_type: 'Laptop', 
    purchase_date: '2023-05-15' 
  },
  { 
    id: 'DEV-002', 
    brand: 'Samsung', 
    model: 'Galaxy S23 Ultra', 
    serial_number: 'SN-SAMS-5678', 
    device_type: 'Smartphone', 
    purchase_date: '2023-10-20' 
  },
  { 
    id: 'DEV-003', 
    brand: 'Dell', 
    model: 'XPS 15', 
    serial_number: 'SN-DELL-9012', 
    device_type: 'Laptop', 
    purchase_date: '2022-12-05' 
  },
];
