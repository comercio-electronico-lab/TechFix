// Exportar todas las funciones y datos mock centralizados

// Users
export { getMockPhone, getMockPhones, getMockUserEmail, mockUsers } from './users';

// Devices
export { getMockDeviceModel, getMockSerialNumber, getMockDevice, mockCustomerDevices } from './devices';

// Addresses
export { MOCK_ADDRESSES, MOCK_ZIP_CODES, MOCK_CITIES, MOCK_STATES, getMockAddress, getMockZipCode, getMockCity } from './addresses';

// Dates
export { getTomorrowDate, getNextWeekDate, getTodayDate, MOCK_TIME_SLOTS, getMockTimeSlot, getDefaultTimeSlot } from './dates';

// Funciones generadoras combinadas
export const generateMockData = () => ({
  phone: require('./users').getMockPhone(),
  deviceModel: require('./devices').getMockDeviceModel(),
  serialNumber: require('./devices').getMockSerialNumber(),
});

export const generateMockShippingData = () => ({
  phone: require('./users').getMockPhone(),
  address: require('./addresses').getMockAddress(),
  zipCode: require('./addresses').getMockZipCode(),
});
