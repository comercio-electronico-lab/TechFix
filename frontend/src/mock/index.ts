// Users
export { getMockPhone, getMockPhones, getMockUserEmail, mockUsers } from './users';

// Devices
export { getMockDeviceModel, getMockSerialNumber, getMockDevice, mockCustomerDevices, mockDevices } from './devices';
export type { Device } from './devices';

// Addresses
export { MOCK_ADDRESSES, MOCK_ZIP_CODES, MOCK_CITIES, MOCK_STATES, getMockAddress, getMockZipCode, getMockCity } from './addresses';

// Dates
export { getTomorrowDate, getNextWeekDate, getTodayDate, MOCK_TIME_SLOTS, getMockTimeSlot, getDefaultTimeSlot } from './dates';

// Orders
export { DEFAULT_ORDER, MOCK_ORDERS, getMockOrder, type OrderData, type OrderItem } from './orders';

// Products
export { mockProducts } from './products';

// Repairs
export { mockRepairTickets } from './repairs';

// Suppliers
export { mockSuppliers, mockSupplierOrders } from './suppliers';

// Admin
export { mockAppointments, mockInventory, type Appointment, type InventoryItem } from './admin';

// Images
export { MOCK_DEVICE_IMAGE } from './mockDeviceImage';

// Diagnostic Tree
export { mockDiagnosticTree, getNodeById, getOptionsForNode } from './diagnosticTree';

// Generator functions
import { getMockPhone } from './users';
import { getMockDeviceModel, getMockSerialNumber } from './devices';
import { getMockAddress, getMockZipCode } from './addresses';

export const generateMockData = () => ({
  phone: getMockPhone(),
  deviceModel: getMockDeviceModel(),
  serialNumber: getMockSerialNumber(),
});

export const generateMockShippingData = () => ({
  phone: getMockPhone(),
  address: getMockAddress(),
  zipCode: getMockZipCode(),
});
