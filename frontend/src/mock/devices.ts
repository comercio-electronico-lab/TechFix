// Re-exportar datos de dispositivos desde la carpeta mock existente
export { mockCustomerDevices } from '@/mock/devices';

// Extraer datos útiles de dispositivos
import { mockCustomerDevices } from '@/mock/devices';

export const getMockDeviceModel = () => {
  const model = mockCustomerDevices[Math.floor(Math.random() * mockCustomerDevices.length)];
  return `${model.brand} ${model.model}`;
};

export const getMockSerialNumber = () => {
  return mockCustomerDevices[Math.floor(Math.random() * mockCustomerDevices.length)].serialNumber;
};

export const getMockDevice = () => {
  const device = mockCustomerDevices[Math.floor(Math.random() * mockCustomerDevices.length)];
  return {
    deviceModel: `${device.brand} ${device.model}`,
    serialNumber: device.serialNumber,
  };
};
