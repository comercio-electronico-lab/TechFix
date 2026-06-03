// Datos de direcciones mock
export const MOCK_ADDRESSES = [
  'Av. Paseo de la República 3500, Miraflores',
  'Calle Mariscal Miller 450, San Isidro',
  'Avenida Javier Prado Este 1250, La Molina',
  'Calle Larco 900, Miraflores',
  'Av. Primavera 500, Chaclacayo',
];

export const MOCK_ZIP_CODES = [
  '15047',
  '15073',
  '15038',
  '15024',
  '15162',
];

export const MOCK_CITIES = [
  'Lima',
  'Arequipa',
  'Cusco',
  'La Libertad',
];

export const MOCK_STATES = [
  'Lima',
  'Arequipa',
  'Cusco',
  'La Libertad',
];

export const getMockAddress = () => {
  return MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)];
};

export const getMockZipCode = () => {
  return MOCK_ZIP_CODES[Math.floor(Math.random() * MOCK_ZIP_CODES.length)];
};

export const getMockCity = () => {
  return MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];
};
