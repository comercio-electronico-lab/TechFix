# 📦 Centro Centralizado de Datos Mock

Todos los datos mock se reutilizan desde las fuentes existentes en `/src/mock/` para evitar duplicación.

## 📁 Estructura

```
/data/mock/
├── index.ts       - Punto de entrada (exporta todo)
├── users.ts       - Datos de usuarios (teléfono, email)
├── devices.ts     - Modelos y seriales de dispositivos
├── addresses.ts   - Direcciones, códigos postales, ciudades
└── dates.ts       - Fechas, horarios disponibles
```

## 🎯 Cómo usar

### Importar funciones específicas

```typescript
// En cualquier componente o hook
import { 
  getMockPhone, 
  getTomorrowDate, 
  getMockAddress 
} from '@/data/mock';

// Usar en states
const [phone] = useState(getMockPhone());
const [date] = useState(getTomorrowDate());
```

### Importar data completa

```typescript
import { mockUsers, mockCustomerDevices } from '@/data/mock';

// Acceder directamente a arrays
mockUsers.forEach(user => console.log(user.phone));
```

### Importar generadores

```typescript
import { generateMockData, generateMockShippingData } from '@/data/mock';

// Generar objeto completo
const diagnostic = generateMockData();
// { phone: '+51 987 654 321', deviceModel: 'iPhone 13 Pro', serialNumber: 'SN-2024-001542' }

const shipping = generateMockShippingData();
// { phone: '+51 987 654 321', address: 'Av. Paseo de la República 3500, Miraflores', zipCode: '15047' }
```

## ✨ Funciones disponibles

### Usuarios (`users.ts`)
- `getMockPhone()` - Un teléfono aleatorio
- `getMockPhones()` - Lista de todos los teléfonos
- `getMockUserEmail()` - Un email aleatorio

### Dispositivos (`devices.ts`)
- `getMockDeviceModel()` - Modelo de dispositivo aleatorio
- `getMockSerialNumber()` - Número de serie aleatorio
- `getMockDevice()` - Objeto con modelo y serie

### Direcciones (`addresses.ts`)
- `getMockAddress()` - Dirección completa aleatoria
- `getMockZipCode()` - Código postal aleatorio
- `getMockCity()` - Ciudad aleatoria

### Fechas (`dates.ts`)
- `getTomorrowDate()` - Fecha de mañana
- `getNextWeekDate()` - Fecha de la próxima semana
- `getTodayDate()` - Fecha de hoy
- `getMockTimeSlot()` - Rango de hora aleatorio
- `getDefaultTimeSlot()` - Primer rango (09:00 AM - 11:00 AM)

## 📌 Regla de oro

**NO** crear datos mock en componentes/hooks.

**SÍ** importar desde `/data/mock` y reutilizar.

```typescript
// ❌ MAL
const [phone] = useState('+51 987 654 321');

// ✅ BIEN
const [phone] = useState(getMockPhone());
```

## 🔄 Agregar nuevos datos mock

1. Crear nuevo archivo en `/data/mock/`
2. Agregar exportes en `index.ts`
3. Importar en componentes
4. Mantener los datos en la fuente original (`/mock/`)
