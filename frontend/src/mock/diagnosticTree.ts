export interface DiagnosticNode {
  id: string;
  question: string;
  description?: string;
  isTerminal: boolean;
  suggestedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
  }>;
  isRoot?: boolean;
  children?: string[];
}

export const mockDiagnosticTree: Record<string, DiagnosticNode> = {
  // Root nodes por tipo de dispositivo
  'root_laptop': {
    id: 'root_laptop',
    question: '¿Cuál es el problema principal con tu laptop?',
    isRoot: true,
    isTerminal: false,
    children: ['battery_issue', 'performance_issue', 'hardware_damage'],
  },
  'root_desktop': {
    id: 'root_desktop',
    question: '¿Cuál es el problema principal con tu desktop?',
    isRoot: true,
    isTerminal: false,
    children: ['power_issue', 'overheating', 'component_failure'],
  },

  // Laptop branches
  'battery_issue': {
    id: 'battery_issue',
    question: '¿Cuál es el problema con la batería?',
    isTerminal: false,
    children: ['battery_not_charging', 'battery_drains_fast'],
  },
  'battery_not_charging': {
    id: 'battery_not_charging',
    question: '¿La batería no carga en absoluto?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod1', name: 'Cable de carga USB-C', price: 45, category: 'Cables' },
      { id: 'prod2', name: 'Adaptador de corriente 100W', price: 85, category: 'Accesorios' },
    ],
  },
  'battery_drains_fast': {
    id: 'battery_drains_fast',
    question: '¿La batería se descarga rápidamente?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod3', name: 'Batería de reemplazo', price: 120, category: 'Componentes' },
      { id: 'prod4', name: 'Software de diagnóstico', price: 29, category: 'Software' },
    ],
  },

  'performance_issue': {
    id: 'performance_issue',
    question: '¿Cuál es el problema de rendimiento?',
    isTerminal: false,
    children: ['slow_startup', 'slow_apps', 'freezing'],
  },
  'slow_startup': {
    id: 'slow_startup',
    question: '¿La laptop tarda mucho en encender?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod5', name: 'SSD NVMe 1TB', price: 95, category: 'Almacenamiento' },
      { id: 'prod6', name: 'RAM DDR4 16GB', price: 65, category: 'Memoria' },
    ],
  },
  'slow_apps': {
    id: 'slow_apps',
    question: '¿Las aplicaciones se abren lentamente?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod7', name: 'SSD de actualización', price: 150, category: 'Almacenamiento' },
      { id: 'prod8', name: 'RAM adicional 8GB', price: 45, category: 'Memoria' },
    ],
  },
  'freezing': {
    id: 'freezing',
    question: '¿La laptop se congela frecuentemente?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod9', name: 'Pasta térmica premium', price: 25, category: 'Mantenimiento' },
      { id: 'prod10', name: 'Limpieza de polvo profesional', price: 40, category: 'Servicios' },
    ],
  },

  'hardware_damage': {
    id: 'hardware_damage',
    question: '¿Hay daño físico?',
    isTerminal: false,
    children: ['screen_damage', 'keyboard_damage', 'case_damage'],
  },
  'screen_damage': {
    id: 'screen_damage',
    question: '¿La pantalla está dañada?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod11', name: 'Pantalla de reemplazo', price: 250, category: 'Pantalla' },
      { id: 'prod12', name: 'Servicio de instalación', price: 80, category: 'Servicios' },
    ],
  },
  'keyboard_damage': {
    id: 'keyboard_damage',
    question: '¿El teclado está dañado?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod13', name: 'Teclado de reemplazo', price: 120, category: 'Periféricos' },
      { id: 'prod14', name: 'Teclado USB externo', price: 75, category: 'Periféricos' },
    ],
  },
  'case_damage': {
    id: 'case_damage',
    question: '¿La carcasa está dañada?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod15', name: 'Kit de reparación de carcasa', price: 35, category: 'Repuestos' },
      { id: 'prod16', name: 'Protector de pantalla', price: 20, category: 'Accesorios' },
    ],
  },

  // Desktop branches
  'power_issue': {
    id: 'power_issue',
    question: '¿El desktop no enciende?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod17', name: 'Fuente de poder 850W', price: 120, category: 'Componentes' },
      { id: 'prod18', name: 'Batería UPS', price: 180, category: 'Accesorios' },
    ],
  },
  'overheating': {
    id: 'overheating',
    question: '¿El desktop se sobrecalienta?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod19', name: 'Ventilador de CPU premium', price: 85, category: 'Refrigeración' },
      { id: 'prod20', name: 'Pasta térmica profesional', price: 30, category: 'Mantenimiento' },
    ],
  },
  'component_failure': {
    id: 'component_failure',
    question: '¿Algún componente está fallando?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod21', name: 'Tarjeta gráfica RTX 4070', price: 600, category: 'GPU' },
      { id: 'prod22', name: 'Memoria RAM DDR5 32GB', price: 150, category: 'Memoria' },
    ],
  },
};

export function getNodeById(nodeId: string): DiagnosticNode | null {
  return mockDiagnosticTree[nodeId] || null;
}

export function getOptionsForNode(nodeId: string): DiagnosticNode[] {
  const node = getNodeById(nodeId);
  if (!node || !node.children) return [];
  return node.children
    .map(childId => getNodeById(childId))
    .filter((n): n is DiagnosticNode => n !== null);
}
