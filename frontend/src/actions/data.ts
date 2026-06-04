'use server';

// --- PSEUDO ENDPOINTS (data sources) ---
export async function getUsersData() {
  const data = await import('../data/users.json');
  return data.default;
}

export async function getProductsData() {
  const data = await import('../data/products.json');
  return data.default;
}

export async function getRepairsData() {
  const data = await import('../data/repairs.json');
  return data.default;
}

export async function getSuppliersData() {
  const data = await import('../data/suppliers.json');
  return data.default;
}

export async function getDevicesData() {
  const data = await import('../data/devices.json');
  return data.default;
}

export async function getDiagnosticTreeData() {
  const data = await import('../data/diagnosticTree.json');
  return data.default;
}

// --- ESTADO EN MEMORIA ---
let users: any[] = [];
let products: any[] = [];
let repairs: any[] = [];
let devices: any[] = [];
let suppliers: any[] = [];
let supplierOrders: any[] = [];

// --- INICIALIZAR DATOS ---
export async function initializeData() {
  if (users.length === 0) {
    const usersData = await getUsersData();
    users = [...usersData];
  }
  if (products.length === 0) {
    const productsData = await getProductsData();
    products = [...productsData];
  }
  if (repairs.length === 0) {
    const repairsData = await getRepairsData();
    repairs = [...repairsData];
  }
  if (devices.length === 0) {
    const devicesData = await getDevicesData();
    devices = [...devicesData];
  }
  if (suppliers.length === 0) {
    const suppliersData = await getSuppliersData();
    suppliers = suppliersData.suppliers;
    supplierOrders = [...suppliersData.orders];
  }
}

// --- GETTERS ---
export function getUsers() {
  return users;
}

export function getProducts() {
  return products;
}

export function getRepairs() {
  return repairs;
}

export function getDevices() {
  return devices;
}

export function getSuppliers() {
  return suppliers;
}

export function getSupplierOrders() {
  return supplierOrders;
}

// --- SETTERS ---
export function setUsers(newUsers: any[]) {
  users = newUsers;
}

export function setProducts(newProducts: any[]) {
  products = newProducts;
}

export function setRepairs(newRepairs: any[]) {
  repairs = newRepairs;
}

export function setDevices(newDevices: any[]) {
  devices = newDevices;
}

export function setSuppliers(newSuppliers: any[]) {
  suppliers = newSuppliers;
}

export function setSupplierOrders(newOrders: any[]) {
  supplierOrders = newOrders;
}
