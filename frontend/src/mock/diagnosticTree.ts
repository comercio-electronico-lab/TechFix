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

  // Tablet branches
  'root_tablet': {
    id: 'root_tablet',
    question: '¿Cuál es el problema principal con tu tableta?',
    isRoot: true,
    isTerminal: false,
    children: ['tablet_screen_issue', 'tablet_battery_issue', 'tablet_stylus_issue'],
  },
  'tablet_screen_issue': {
    id: 'tablet_screen_issue',
    question: '¿La pantalla está rota o el táctil no responde?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod11', name: 'Módulo de pantalla iPad Pro 12.9"', price: 320, category: 'Pantallas' },
      { id: 'prod12', name: 'Servicio de instalación de pantalla', price: 80, category: 'Servicios' },
    ],
  },
  'tablet_battery_issue': {
    id: 'tablet_battery_issue',
    question: '¿La batería se descarga muy rápido o no carga?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod3', name: 'Batería interna de tableta', price: 85, category: 'Componentes' },
      { id: 'prod17', name: 'Cargador rápido USB-C 45W', price: 35, category: 'Accesorios' },
    ],
  },
  'tablet_stylus_issue': {
    id: 'tablet_stylus_issue',
    question: '¿El lápiz óptico (Stylus) tiene problemas de precisión o conexión?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod30', name: 'Lápiz óptico activo universal', price: 65, category: 'Accesorios' },
      { id: 'prod31', name: 'Puntas de repuesto para lápiz (x4)', price: 15, category: 'Repuestos' },
    ],
  },

  'power_issue': {
    id: 'power_issue',
    question: '¿Qué sucede cuando intentas encender la PC?',
    isTerminal: false,
    children: ['power_supply_failure', 'motherboard_shortcircuit'],
  },
  'power_supply_failure': {
    id: 'power_supply_failure',
    question: '¿La PC no hace ningún ruido ni encienden luces?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod17', name: 'Fuente de poder 750W 80+ Gold', price: 120, category: 'Componentes' },
      { id: 'prod33', name: 'Cable de poder de PC', price: 10, category: 'Accesorios' },
    ],
  },
  'motherboard_shortcircuit': {
    id: 'motherboard_shortcircuit',
    question: '¿Se encienden los ventiladores medio segundo y se apaga?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod34', name: 'Tarjeta madre ATX compatible', price: 180, category: 'Componentes' },
      { id: 'prod35', name: 'Servicio de diagnóstico microscópico', price: 50, category: 'Servicios' },
    ],
  },
  'overheating': {
    id: 'overheating',
    question: '¿El equipo se apaga repentinamente al jugar o trabajar?',
    isTerminal: false,
    children: ['dust_accumulation', 'thermal_paste_dry'],
  },
  'dust_accumulation': {
    id: 'dust_accumulation',
    question: '¿Se escucha demasiado ruido en los ventiladores?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod19', name: 'Ventilador de CPU premium Noctua', price: 85, category: 'Refrigeración' },
      { id: 'prod10', name: 'Limpieza de polvo profesional', price: 40, category: 'Servicios' },
    ],
  },
  'thermal_paste_dry': {
    id: 'thermal_paste_dry',
    question: '¿Los ventiladores giran pero el flujo de aire es muy caliente?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod20', name: 'Pasta térmica profesional MX-4', price: 15, category: 'Mantenimiento' },
      { id: 'prod12', name: 'Servicio de mantenimiento completo', price: 60, category: 'Servicios' },
    ],
  },
  'component_failure': {
    id: 'component_failure',
    question: '¿Estás experimentando pantallazos azules o cuelgues?',
    isTerminal: false,
    children: ['ram_failure', 'gpu_artifacting'],
  },
  'ram_failure': {
    id: 'ram_failure',
    question: '¿La PC emite pitidos al encender o da pantallazos con código MEMORY?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod22', name: 'Memoria RAM DDR5 32GB (2x16GB)', price: 150, category: 'Memoria' },
      { id: 'prod6', name: 'Memoria RAM DDR4 16GB', price: 65, category: 'Memoria' },
    ],
  },
  'gpu_artifacting': {
    id: 'gpu_artifacting',
    question: '¿Se distorsiona la imagen o aparecen rayas en la pantalla?',
    isTerminal: true,
    suggestedProducts: [
      { id: 'prod21', name: 'Tarjeta gráfica RTX 4060 Ti 8GB', price: 450, category: 'GPU' },
      { id: 'prod38', name: 'Cable HDMI 2.1 trenzado', price: 20, category: 'Accesorios' },
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
