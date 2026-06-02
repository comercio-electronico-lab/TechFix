import { PigNode } from '@/components/cotizacion/QuotationWizard';

export const mockPigNodes: PigNode[] = [
  // Laptops - Root
  {
    id: 'L-ROOT',
    parent_node_id: null,
    device_type: 'Laptop',
    question_text: '¿Cuál es el síntoma principal de tu laptop?',
    answer_option: 'Root',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  // Laptops - Level 1
  {
    id: 'L-1-PANTALLA',
    parent_node_id: 'L-ROOT',
    device_type: 'Laptop',
    question_text: '¿Qué problema presenta la pantalla?',
    answer_option: 'Problemas de Pantalla',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  {
    id: 'L-1-ENCENDIDO',
    parent_node_id: 'L-ROOT',
    device_type: 'Laptop',
    question_text: '¿Qué sucede cuando intentas encenderla?',
    answer_option: 'No enciende / Fallos de energía',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  {
    id: 'L-1-LENTA',
    parent_node_id: 'L-ROOT',
    device_type: 'Laptop',
    question_text: '¿En qué momento notas la lentitud?',
    answer_option: 'Está muy lenta o se queda pegada',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  // Laptops - Level 2 (Terminal)
  {
    id: 'L-T-DISPLAY-ROT',
    parent_node_id: 'L-1-PANTALLA',
    device_type: 'Laptop',
    question_text: '',
    answer_option: 'Pantalla rota o con manchas',
    preliminary_result: 'Fallo de Panel LCD/LED. Requiere reemplazo completo del módulo de pantalla.',
    estimated_min: 120,
    estimated_max: 250,
    is_terminal: true
  },
  {
    id: 'L-T-DISPLAY-PARP',
    parent_node_id: 'L-1-PANTALLA',
    device_type: 'Laptop',
    question_text: '',
    answer_option: 'La pantalla parpadea o cambia de colores',
    preliminary_result: 'Fallo en cable flex de video o inverter. Posible problema de GPU.',
    estimated_min: 45,
    estimated_max: 95,
    is_terminal: true
  },
  {
    id: 'L-T-POWER-BATT',
    parent_node_id: 'L-1-ENCENDIDO',
    device_type: 'Laptop',
    question_text: '',
    answer_option: 'Solo enciende conectada al cargador',
    preliminary_result: 'Batería agotada o circuito de carga defectuoso. Se recomienda cambio de batería original.',
    estimated_min: 60,
    estimated_max: 110,
    is_terminal: true
  },
  {
    id: 'L-T-POWER-DEAD',
    parent_node_id: 'L-1-ENCENDIDO',
    device_type: 'Laptop',
    question_text: '',
    answer_option: 'No hace absolutamente nada (muerta)',
    preliminary_result: 'Fallo en placa base (Motherboard) o Cortocircuito en etapa de potencia.',
    estimated_min: 150,
    estimated_max: 400,
    is_terminal: true
  },
  {
    id: 'L-T-SLOW-DISK',
    parent_node_id: 'L-1-LENTA',
    device_type: 'Laptop',
    question_text: '',
    answer_option: 'Tarda mucho en iniciar Windows/MacOS',
    preliminary_result: 'Degradación de Disco Duro Mecánico. Se recomienda upgrade a SSD de alto rendimiento.',
    estimated_min: 80,
    estimated_max: 150,
    is_terminal: true
  },

  // Smartphones - Root
  {
    id: 'S-ROOT',
    parent_node_id: null,
    device_type: 'Smartphone',
    question_text: '¿Cuál es el problema de tu smartphone?',
    answer_option: 'Root',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  // Smartphones - Level 1
  {
    id: 'S-1-PANTALLA',
    parent_node_id: 'S-ROOT',
    device_type: 'Smartphone',
    question_text: '¿Qué daño tiene la pantalla?',
    answer_option: 'Pantalla Rota / Touch no funciona',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  {
    id: 'S-1-BATERIA',
    parent_node_id: 'S-ROOT',
    device_type: 'Smartphone',
    question_text: '¿Cómo se comporta la energía?',
    answer_option: 'Problemas de Batería o Carga',
    preliminary_result: '',
    estimated_min: 0,
    estimated_max: 0,
    is_terminal: false
  },
  // Smartphones - Level 2 (Terminal)
  {
    id: 'S-T-GLASS-ROT',
    parent_node_id: 'S-1-PANTALLA',
    device_type: 'Smartphone',
    question_text: '',
    answer_option: 'Solo el vidrio está roto (la imagen se ve bien)',
    preliminary_result: 'Rotura de cristal exterior (Gorilla Glass). Cambio de glass o módulo completo.',
    estimated_min: 50,
    estimated_max: 120,
    is_terminal: true
  },
  {
    id: 'S-T-LCD-ROT',
    parent_node_id: 'S-1-PANTALLA',
    device_type: 'Smartphone',
    question_text: '',
    answer_option: 'No da imagen o tiene líneas/manchas negras',
    preliminary_result: 'Fallo de panel OLED/AMOLED. Requiere reemplazo de pantalla original.',
    estimated_min: 90,
    estimated_max: 300,
    is_terminal: true
  },
  {
    id: 'S-T-BATT-SWOLLEN',
    parent_node_id: 'S-1-BATERIA',
    device_type: 'Smartphone',
    question_text: '',
    answer_option: 'La batería está inflada o dura muy poco',
    preliminary_result: 'Degradación química de celdas de litio. Reemplazo urgente de batería por seguridad.',
    estimated_min: 35,
    estimated_max: 85,
    is_terminal: true
  },
  {
    id: 'S-T-PORT-DIRTY',
    parent_node_id: 'S-1-BATERIA',
    device_type: 'Smartphone',
    question_text: '',
    answer_option: 'Hay que mover el cable para que cargue',
    preliminary_result: 'Puerto de carga (USB-C/Lightning) dañado o sucio. Limpieza técnica o cambio de flex.',
    estimated_min: 25,
    estimated_max: 65,
    is_terminal: true
  }
];
