'use server';

import { mockUsers } from '../mock/users';
import { mockRepairTickets, mockClientRepairs } from '../mock/repairs';
import { mockProducts } from '../mock/products';
import { mockSuppliers, mockSupplierOrders } from '../mock/suppliers';

// Mapeador para adaptar los tipos del archivo mock al formato esperado por el frontend
function mapMockUser(user: any) {
  return {
    id: user.id,
    nombre: user.name,
    apellido: user.lastName,
    login: user.email.split('@')[0].toLowerCase(),
    email: user.email,
    rol: user.role,
    estado: user.status,
    joined_date: user.joinedDate,
    teléfono: user.phone,
    documentType: user.documentType,
    documentId: user.documentId,
    dirección: user.address,
    ciudad: user.city,
    código_postal: user.postalCode,
    país: user.country,
  };
}

export async function loginAction(email: string, password?: string) {
  // Simular retraso de red en el servidor
  await new Promise((resolve) => setTimeout(resolve, 800));

  const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    throw new Error('Credenciales inválidas (Usuario no registrado)');
  }

  const user = mapMockUser(found);
  const token = `mock-jwt-token-${user.id}`;

  return { user, token };
}

export async function registerAction(nombre: string, email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const autoLogin = email.split('@')[0].toLowerCase();

  const newUser = {
    id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    nombre,
    login: autoLogin,
    email,
    rol: 'Cliente',
    estado: 'Activo',
    joined_date: new Date().toISOString().split('T')[0],
    apellido: '',
    teléfono: '',
    documentType: 'DNI',
    documentId: '',
    dirección: '',
    ciudad: '',
    código_postal: '',
    país: 'Argentina',
  };

  const token = `mock-jwt-token-${newUser.id}`;

  return { user: newUser, token };
}

export async function meAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Token inválido');
  }

  const userId = token.replace('mock-jwt-token-', '');
  const found = mockUsers.find((u) => u.id === userId);

  if (!found) {
    throw new Error('Usuario no encontrado');
  }

  return mapMockUser(found);
}

export async function getRepairTrackingAction(ticketId: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const foundTicket = mockRepairTickets.find(
    (t) => t.id.toLowerCase() === ticketId.toLowerCase()
  );

  if (!foundTicket) {
    throw new Error('No se pudo encontrar el ticket de reparación.');
  }

  // Generamos un estado completo e historial de trazabilidad simulado para el ticket
  return {
    order: {
      id: foundTicket.id,
      status: foundTicket.status,
      notes: foundTicket.notes,
      finalPrice: foundTicket.finalPrice,
      description: foundTicket.description,
      customerName: foundTicket.customerName,
      deviceName: foundTicket.deviceName,
      deviceSerial: foundTicket.deviceSerial,
    },
    tracking: [
      {
        id: '1',
        new_status: 'pending',
        notes: 'Solicitud de asistencia técnica agendada en línea.',
        created_at: foundTicket.createdAt,
      },
      {
        id: '2',
        new_status: 'in_review',
        notes: 'Dispositivo recibido físicamente en el laboratorio central. Se inicia diagnóstico.',
        created_at: foundTicket.createdAt,
      },
      ...(foundTicket.status === 'waiting_parts' || foundTicket.status === 'repairing' || foundTicket.status === 'ready' || foundTicket.status === 'delivered'
        ? [
            {
              id: '3',
              new_status: foundTicket.status === 'waiting_parts' ? 'waiting_parts' : 'repairing',
              notes: foundTicket.status === 'waiting_parts' 
                ? 'Esperando repuestos del fabricante.' 
                : 'Iniciando reparaciones en el laboratorio.',
              created_at: foundTicket.createdAt,
            }
          ]
        : []),
      ...(foundTicket.status === 'ready' || foundTicket.status === 'delivered'
        ? [
            {
              id: '4',
              new_status: 'ready',
              notes: 'Reparaciones concluidas y pruebas de rendimiento superadas al 100%.',
              created_at: foundTicket.createdAt,
            }
          ]
        : []),
    ],
    warranty: foundTicket.status === 'delivered' ? {
      id: 'WARR-001',
      warrantyDays: 90,
      startDate: foundTicket.createdAt,
      endDate: new Date(new Date(foundTicket.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      warrantyToken: `WARR-${foundTicket.id}-OK`,
    } : null,
  };
}

// Estado en memoria para persistencia de modificaciones en la cola de reparaciones
let repairsState = [...mockRepairTickets];

let productsState = mockProducts.map((p) => ({
  id: p.id,
  sku: `SKU-PROD-${p.id}`,
  nombre: p.name,
  descripcion: p.description,
  precio_venta: p.price,
  precio_costo: p.price * 0.6,
  stock_actual: p.status === 'In Stock' ? 25 : p.status === 'Limited Edition' ? 8 : 12,
  stock_minimo: 5,
  categoria: p.category,
  imagen_url: p.image,
  status: p.status,
}));

let suppliersState = [...mockSuppliers];
let supplierOrdersState = [...mockSupplierOrders];

export async function getClientRepairsAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  // Usar los nuevos mocks de ClientRepair con estructura mejorada
  const userRepairs = mockClientRepairs.filter((repair) => {
    // Buscar en todos los usuarios si el email coincide
    const owner = mockUsers.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
    // Para simplificar la demo, devolver todas las reparaciones si el usuario existe
    // En producción esto vendría del backend filtrado por usuario
    return owner !== undefined;
  });

  // Si es un cliente específico, mostrar solo algunas reparaciones de demo
  // Mapear según el email para mostrar diferentes reparaciones
  if (currentUser.email === 'ana@example.com') {
    return [mockClientRepairs[0]]; // pending
  } else if (currentUser.email === 'carlos@example.com') {
    return [mockClientRepairs[1]]; // agendado
  } else if (currentUser.email === 'lucia.vargas@gmail.com') {
    return [mockClientRepairs[2]]; // en_reparacion
  } else if (currentUser.email === 'juan.perez@gmail.com') {
    return [mockClientRepairs[3]]; // reparado
  } else if (currentUser.email === 'luis@example.com') {
    return [mockClientRepairs[4]]; // completado
  }

  return [];
}

export async function getClientWarrantiesAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  // Obtener reparaciones con garantía activa (reparado o completado)
  let userRepairs: any[] = [];

  if (currentUser.email === 'juan.perez@gmail.com') {
    userRepairs = [mockClientRepairs[3]]; // reparado
  } else if (currentUser.email === 'luis@example.com') {
    userRepairs = [mockClientRepairs[4]]; // completado
  }

  return userRepairs
    .filter((r) => r.warranty && r.warranty.is_active)
    .map((o) => ({
      id: 'WARR-' + o.id,
      repair_id: o.id,
      user_id: currentUser.id,
      device: o.device,
      warranty_days: o.warranty?.warranty_days || 30,
      start_date: o.warranty?.start_date,
      end_date: o.warranty?.end_date,
      is_active: o.warranty?.is_active || false,
      warranty_token: `WARR-${o.id}-OK`,
    }));
}

export async function scheduleRepairAction(token: string, input: any) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  const newId = `WO-2026-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, '0')}`;
  const newOrder = {
    id: newId,
    customerName: currentUser.nombre,
    customerEmail: currentUser.email,
    deviceName: 'Dispositivo Agendado',
    deviceSerial: 'SN-' + Math.floor(Math.random() * 1000000).toString(),
    description: input.notes || 'Reparación agendada desde el portal.',
    status: 'pending',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    finalPrice: 50,
    notes: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  repairsState.unshift(newOrder);
  return newOrder;
}

export async function getAdminRepairsAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Validamos el token
  await meAction(token);

  // Mapeamos al formato GORM esperado por useRepairQueue
  return repairsState.map((o) => ({
    id: o.id,
    user: {
      nombre: o.customerName,
      email: o.customerEmail,
    },
    device: {
      brand: o.deviceName.split(' ')[0],
      model: o.deviceName.split(' ').slice(1).join(' '),
      serial_number: o.deviceSerial,
    },
    notes: o.description,
    status: o.status,
    final_price: o.finalPrice,
    diagnosis_final: o.notes,
    created_at: o.createdAt,
  }));
}

export async function updateRepairStatusAction(
  token: string,
  ticketId: string,
  status: string,
  notes?: string
) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const ticket = repairsState.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.status = status;
    if (notes) {
      ticket.notes = notes;
    }
  }

  return { success: true };
}

export async function addPartToRepairAction(
  token: string,
  ticketId: string,
  productId: string,
  quantity: number
) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const ticket = repairsState.find((t) => t.id === ticketId);
  if (ticket) {
    // Simulamos un incremento del precio según la cantidad
    ticket.finalPrice += 45.0 * quantity;
    if (!ticket.notes) {
      ticket.notes = 'Repuesto vinculado: ' + productId;
    } else {
      ticket.notes += ', Repuesto vinculado: ' + productId;
    }
  }

  return { success: true };
}

export async function getProductsAction() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return productsState;
}

export async function getAdminProductsAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);
  return productsState;
}

export async function getSuppliersAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);
  return suppliersState;
}

export async function createSupplierOrderAction(
  token: string,
  orderInput: { proveedor_id: string; producto_id: string; cantidad: number }
) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const supplier = suppliersState.find((s) => s.id === orderInput.proveedor_id);
  const product = productsState.find((p) => p.id === orderInput.producto_id);

  if (!supplier) throw new Error('Proveedor no encontrado');
  if (!product) throw new Error('Producto no encontrado');

  const newOrder = {
    id: `SO-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    supplierName: supplier.name,
    partName: product.nombre,
    quantity: orderInput.cantidad,
    unitPrice: product.precio_costo || (product.precio_venta * 0.6),
    totalPrice: (product.precio_costo || (product.precio_venta * 0.6)) * orderInput.cantidad,
    status: 'pending' as const,
    orderDate: new Date().toISOString().split('T')[0],
  };

  supplierOrdersState.unshift(newOrder);
  return newOrder;
}

export async function createProductAction(token: string, productInput: any) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const newId = (productsState.length + 1).toString();
  const newProduct = {
    id: newId,
    sku: productInput.sku || `SKU-PROD-${newId}`,
    nombre: productInput.nombre,
    descripcion: productInput.descripcion,
    precio_venta: Number(productInput.precio_venta),
    precio_costo: Number(productInput.precio_costo) || Number(productInput.precio_venta) * 0.6,
    stock_actual: Number(productInput.stock_actual) || 0,
    stock_minimo: Number(productInput.stock_minimo) || 5,
    categoria: productInput.categoria || 'Generales',
    imagen_url: 'https://via.placeholder.com/300',
    status: (Number(productInput.stock_actual) === 0 ? 'Out of Stock' : Number(productInput.stock_actual) <= Number(productInput.stock_minimo) ? 'Low Stock' : 'In Stock') as any,
  };

  productsState.push(newProduct);
  return newProduct;
}

export async function updateProductAction(token: string, id: string, productInput: any) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const productIndex = productsState.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    throw new Error('Producto no encontrado');
  }

  const current = productsState[productIndex];
  const updated = {
    ...current,
    nombre: productInput.nombre !== undefined ? productInput.nombre : current.nombre,
    descripcion: productInput.descripcion !== undefined ? productInput.descripcion : current.descripcion,
    precio_venta: productInput.precio_venta !== undefined ? Number(productInput.precio_venta) : current.precio_venta,
    stock_actual: productInput.stock_actual !== undefined ? Number(productInput.stock_actual) : current.stock_actual,
    stock_minimo: productInput.stock_minimo !== undefined ? Number(productInput.stock_minimo) : current.stock_minimo,
    status: (productInput.stock_actual !== undefined 
      ? (Number(productInput.stock_actual) === 0 ? 'Out of Stock' : Number(productInput.stock_actual) <= (productInput.stock_minimo !== undefined ? Number(productInput.stock_minimo) : current.stock_minimo) ? 'Low Stock' : 'In Stock') 
      : current.status) as any,
  };

  productsState[productIndex] = updated;
  return updated;
}
