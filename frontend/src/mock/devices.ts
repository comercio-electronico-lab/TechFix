import { CustomerDevice } from '@/types';

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

const AVATAR_URLS = {
  mac: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7SCbXC7X9DTJc09AiI7-DOk0euMyGnDeLG3HTa8SilNBSfEITuoAYyqh5IvRGTip2E0nzmyru26nyt3ama8q8zpoSpg3osrZAgUxKaNqLknD7DkJLXkNBBJr-KA5mqzbGBvwqQiK1DwI71h07mTxdOULcUU6MnCNlYH7ybDJwcrgukoIDeYfTHwA2s0a9CILgIGKPMn476RF7vtvTf-AWVEgNBtAAOGe8xxCuQid8HWcCNxqsWil4xAv8lmHMW-PVJj0JPrSca9_',
  other: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJbsxZYM-Q-iUazYn9janOEsVbVQXh0ImXh5rkHiCmzn9pmIe2t25MpF_3XHAQYh8Xf_XFK890Ab_iMSUCyXBrKFJMWp03mu1GI_uaK6EMrK0vSFm3CDaLvPlam61lX5jYM2q-RAci9J70cr_DDYJM0AQHgQxRrh2ObbiMhm3am_szZ7Og4fIbv0Vh_SN7HfIbIckxLrqnr36bYkFzdJeVJryoFEkotuig18bqE60k71HdZt0lnXLM13MxT5YAUBQOp6I-uvyXeAy',
};

export const mockCustomerDevices: CustomerDevice[] = [
  {
    id: '1',
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    specs: 'M3 Max, 36GB RAM, 512GB SSD',
    serialNumber: 'C02XT5CQT49H',
    purchaseDate: '15 ago 2023',
    status: 'Active Warranty',
    inService: false,
    image: AVATAR_URLS.mac,
  },
  {
    id: '2',
    brand: 'Dell',
    model: 'XPS 15',
    specs: 'i9-13900H, 32GB RAM, 1TB SSD',
    serialNumber: 'JXDM92K',
    purchaseDate: '22 mar 2024',
    status: 'Active Warranty',
    inService: true,
    image: AVATAR_URLS.other,
  },
  {
    id: '3',
    brand: 'Apple',
    model: 'iMac 24"',
    specs: 'M3, 24GB RAM, 256GB SSD',
    serialNumber: 'C02XT5TR4Q5J',
    purchaseDate: '10 dic 2022',
    status: 'Out of Warranty',
    inService: false,
    image: AVATAR_URLS.mac,
  },
];

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
