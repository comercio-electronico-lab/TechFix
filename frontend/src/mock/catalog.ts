import { Product } from '@/types';

// Catálogo completo de productos (extendido con todas las categorías)
export const catalogProducts: Product[] = [
  {
    id: 'gpu-rtx4090',
    sku: 'GPU-RTX4090-OC',
    name: 'NVIDIA GeForce RTX 4090 24GB GDDR6X Overclocked Edition',
    description: 'La GPU definitiva para creadores y entusiastas. Rendimiento masivo en trazado de rayos y trazado completo mediante IA.',
    price: 1599.00,
    category: 'Graphics Cards',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMEwP8kV9VlW-qsQZKEMms2m8RnnlbSnlypG6W1h8nqfUxjEVhxLU__SpVH80ksSBc3lL6SYUYDBbGIv_C0Sv124YcDRBGEI9R6JfvtxLNJXV3IqAxoV0NVAKjGz4U5Qth8ScP6em49mwwG3YQEeY1-PuN1CMY5N_RQ3xRNcmvPFzfdROuILDH6pSLWFwK4IjdI6BW1ejtJo3QHSu63s-dAXlZuE2-Ax4UH5d0V1I1gbe3maXCnV6Zftifct4C8478FHnvMAueIpWC',
    status: 'In Stock'
  },
  {
    id: 'gpu-rx7900',
    sku: 'GPU-RX7900-XTX',
    name: 'AMD Radeon RX 7900 XTX 24GB Reference Design',
    description: 'Arquitectura AMD RDNA 3, con memoria masiva de 24 GB y trazado de rayos de próxima generación para gaming avanzado.',
    price: 999.00,
    category: 'Graphics Cards',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW9LO4ERKLqHJAW0Ied-Vnx_RAQWenvW7eEXV5PneW-xFp46hohx7ot0uoznM5bacxN-aztMxIXhI_rKfbwBJooXYsMB9dAm5AK6ltQdUlGE240evW6p2ue1wvjsFXXWlAvuzK__DHJF5EVC9P5FiSpONrK7J7j7H1Chka9k37A8Is94DBh8bgNqV1T96vbWFO5CYMkNPqsTzYXxRTrUT0iYrZq5TuZWh_5xvyBxBrRUfjKTQgUvX2uOnrptRjvbl4sr6MdU8-pDaB',
    status: 'In Stock'
  },
  {
    id: 'gpu-rtx4070ti',
    sku: 'GPU-RTX4070-TI',
    name: 'NVIDIA GeForce RTX 4070 Ti 12GB Dual Fan',
    description: 'Arquitectura ultraeficiente Ada Lovelace y DLSS 3. Rendimiento extraordinario en resolución 1440p y más.',
    price: 799.00,
    category: 'Graphics Cards',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcDqlQTmwmba-V2rOfdj9nwAKNPB0SgLeK8yM2AaBef-L3gm_LG0tzi6XsjW162WvPCwzVXotOQKXuCMO5qI739_i_K0DZyMtgJw3192Zw-Rzc9czp6r_VE57KqYDF5675kibjO1SkejtE8qWPd8v_znAAG2bk5V-nmbfgKhh-ZYkf0BMKJ4UpPMHitiUIOwaxjiyDhMzeBZ48yo1ur0Um-7Y_mEVFJDaC3UkjJ-oJv2IeAIzBlAgUCbvKaZJ49ooOSvCIv3seJwHx',
    status: 'Out of Stock'
  },
  {
    id: 'gpu-rtx4060',
    sku: 'GPU-RTX4060-ITX',
    name: 'NVIDIA GeForce RTX 4060 8GB ITX Compact',
    description: 'Diseño compacto de un solo ventilador, ideal para sistemas de factor de forma pequeño (ITX) sin sacrificar el DLSS 3.',
    price: 299.00,
    category: 'Graphics Cards',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXRzafqDUD34bipauzTsS-oxqVXXfaGRrdwupCGc27ZLVwUkDaoFeMmDPNBCCzxaLQjBEUc4Kk1UqT5EWV5qcuKTXA0RUTkz4180C8i7qHlBEVl3n64OCypjU0io7b7yu5fklRYC7gciG3eidYQUSMDqEqdRFxWMX-Nb3rabHAxP-kSgEvhIsWE9V0CObJtYBB2Tbnz3HL3porDxa5JhuOjcJMKYaBaNZ8BpaZFTQ_CgvIYz35qcFuxIxfi6YB661hN3TOlipjKdKz',
    status: 'Low Stock'
  },
  {
    id: '1',
    sku: 'LAP-PROB-X15',
    name: 'ProBook X15 G9 - Intel Core i9 / 32GB RAM / 1TB SSD',
    description: 'Optimizado para cargas de trabajo pesadas de ingeniería, desarrollo de software y flujos de trabajo empresariales demandantes.',
    price: 1499.00,
    category: 'Laptops',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnlMbnng-Tto1PqWo3DFn2hJykYWyHz8TKE2PVnIxehLi5fWUye1lFLIkjthXV5td8yLkdKP6-00111U4rQgSSIjdQz18Aa0hmljAvVAl1OSbFrXq6ZlcKfLCdntBu7ja4Stpfa-2Efp3eTkaphaSt6c52-QSj65qNVHn81-E8AJZipmT6rmQr0DOTmqxQ6uACN5Lx9G8LbMmI5VI6nXRrJfLp9miM4iprKHf6FAg17n_H0nZSAwihosudVjpYfKSrrbiC4xJVN8M',
    status: 'In Stock'
  },
  {
    id: '2',
    sku: 'PHN-NEX-ULTRA',
    name: 'Nexus Ultra 5G - Pantalla LTPO 120Hz / 256GB',
    description: 'Conjunto de cámaras de precisión profesional, rendimiento premium con Snapdragon 8 y panel LTPO ultra fluido.',
    price: 999.00,
    category: 'Smartphones',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ySY66kgUJmWWfQNuwVEMKgUoShs04iCWklyi3Istqx21ub_PtsrX6rB-JlL5nYwTSzgBgxjiC02lhxsQGMrhjGADe7K8aOcGVCXexbyI9V6a15RPRrP4gkV1aAhmInvSuyQ6xbWB074wXM-N1YNjmbbY6GFBv6G57nQPl8squU_AXz8A8QI966dNYVRJfU25Zunnptq6h0stRc_LvftlRdN6ryP5M2XjJfewEzKZJTh-DiKHrx0fHBSuMjIW-UUp7MtrF3EX0SI',
    status: 'Limited Edition'
  },
  {
    id: '3',
    sku: 'MON-PREC-4K',
    name: 'Pantalla de Precisión 4K Ultra-Sharp sRGB 99%',
    description: 'Monitor profesional con cobertura sRGB del 99% y calibración de fábrica para flujos de trabajo creativos y color preciso.',
    price: 649.00,
    category: 'Monitors',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHyUO_CJZH4O0q3yR0o2wEQRSgN26OmcIndyZw83S-1Q4AcyyhRikgMn2gcJD4Fm6GjSgnqfnNjQx72rywYiVyd4l3__RatgEOjwmQJAuUgEA3Q7kkPuOP1x0X6_4jNJoph4eu8F1O_Vm4wkEJgqa0zMpfcfJbiBNTc9tQURWVyir87IL8sVtvxZxBtzy6JUS_Q-B0NbMh2PtbcpVkZo0A18zofORJ4KMXnJajp68KgngTaDoVxxXWtK0oRAesWrn-tis7pfMTKA',
    status: 'In Stock'
  },
  {
    id: '4',
    sku: 'TAB-PRO-M2',
    name: 'TabPro 12.9" Chip M2 / 256GB / Wi-Fi',
    description: 'Rendimiento extraordinario de nivel de computadora portátil en un diseño ultrafino con pantalla Liquid Retina.',
    price: 899.00,
    category: 'Tablets',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvM7R9FffvsBfVm0b7HZaCVeLK7ekLbHRqLqg8COKG81rPe1qEoF7InjzQhOZkLetblTyPpCOru9WzuZVjT8bO-zS0YJ_l-uuumjbFZ6doocvcJxoG8B94tygbyXKVLvAlFifbBOygUco0qwfXlfOiQhfC4vbPgWRDgA-0spr_Esqblutcc74vg1jbydoHFL0SFahoed1PHSPeNxwL1bYsr1OFCrVBAkg2yDoDA7BCo7bVe9v9xqzUFlFcMWyRsLKdgstX8TF1I4c',
    status: 'In Stock'
  },
  {
    id: 'cpu-i9',
    sku: 'CPU-INT-14900K',
    name: 'Intel Core i9-14900K 24-Core 6.0GHz Raptor Lake',
    description: 'Procesador premium de nivel de producción. 24 núcleos de cómputo de precisión y frecuencias que alcanzan los 6.0GHz.',
    price: 589.00,
    category: 'Processors',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnlMbnng-Tto1PqWo3DFn2hJykYWyHz8TKE2PVnIxehLi5fWUye1lFLIkjthXV5td8yLkdKP6-00111U4rQgSSIjdQz18Aa0hmljAvVAl1OSbFrXq6ZlcKfLCdntBu7ja4Stpfa-2Efp3eTkaphaSt6c52-QSj65qNVHn81-E8AJZipmT6rmQr0DOTmqxQ6uACN5Lx9G8LbMmI5VI6nXRrJfLp9miM4iprKHf6FAg17n_H0nZSAwihosudVjpYfKSrrbiC4xJVN8M',
    status: 'In Stock'
  },
  {
    id: 'ram-ddr5',
    sku: 'MEM-COR-64GB5',
    name: 'Corsair Vengeance DDR5 64GB (2x32GB) 6000MHz CL30',
    description: 'Memoria RAM de grado técnico extremo con disipador de aluminio anodizado y perfil XMP 3.0 para alta estabilidad.',
    price: 219.00,
    category: 'Memory',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXRzafqDUD34bipauzTsS-oxqVXXfaGRrdwupCGc27ZLVwUkDaoFeMmDPNBCCzxaLQjBEUc4Kk1UqT5EWV5qcuKTXA0RUTkz4180C8i7qHlBEVl3n64OCypjU0io7b7yu5fklRYC7gciG3eidYQUSMDqEqdRFxWMX-Nb3rabHAxP-kSgEvhIsWE9V0CObJtYBB2Tbnz3HL3porDxa5JhuOjcJMKYaBaNZ8BpaZFTQ_CgvIYz35qcFuxIxfi6YB661hN3TOlipjKdKz',
    status: 'In Stock'
  }
];
