# TechFix Frontend

Interfaz moderna para la plataforma TechFix de reparación de equipos electrónicos con diagnóstico guiado, gestión de órdenes y carrito de compras.

## 🏗️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.2.6 - React framework con SSR/SSG y Server Actions
- **Runtime**: [Bun](https://bun.sh/) - JavaScript runtime rápido
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 - Utilidades CSS
- **Language**: TypeScript 5
- **UI Components**: Lucide React - Iconografía
- **Charts**: Recharts 3.8.1 - Gráficos interactivos
- **Testing**: [Vitest](https://vitest.dev/) - Tests unitarios
- **Node**: React 19.2.4

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App router de Next.js (páginas y layouts)
│   ├── actions/                 # Server Actions ('use server') que hablan con el backend Go
│   ├── components/              # Componentes de UI, organizados por dominio
│   │   └── ui/                  # Primitivos compartidos (Button, Input, Badge, Card...)
│   ├── context/                 # CartContext y AuthContext (React Context)
│   ├── hooks/                   # Hooks reutilizables (useInventory, useRepairs...)
│   ├── interfaces/               # Tipos de dominio y de props de componentes
│   ├── lib/                      # Utilidades del lado del servidor (auth-token, pricing, mercadopago)
│   ├── types/                    # Tipos auxiliares y declaraciones ambient (mercadopago.d.ts)
│   └── data/                     # Datos estáticos que aún no vienen del backend (diagnosticTree.json)
├── public/                     # Archivos estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.mts
├── vitest.config.ts
└── eslint.config.mjs
```

## 🚀 Quick Start

### 1. Requisitos

- [Bun](https://bun.sh/) 1.0+ (reemplaza Node.js/npm)
- Node.js 18+ (para compatibilidad)

**Instalar Bun:**
```bash
curl -fsSL https://bun.sh/install | bash
# O con brew en macOS:
# brew install oven-sh/bun/bun
```

### 2. Instalación de dependencias

```bash
cd frontend
bun install
```

### 3. Variables de entorno

```bash
# Copiar template
cp .env.example .env

# Configurar API backend (si es necesario)
# NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Ejecutar en desarrollo

```bash
bun run dev
```

El servidor estará en `http://localhost:3000`

### 5. Build para producción

```bash
bun run build
bun run start
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
bun run dev           # Inicia servidor dev con HMR (puerto 3000)

# Producción
bun run build        # Compila Next.js
bun run start        # Inicia servidor de producción

# Linting
bun run lint         # Ejecuta ESLint

# Tests
bun run test         # Ejecuta la suite de Vitest

# Dependencies
bun install          # Instala dependencias
bun update           # Actualiza paquetes
bun remove <pkg>     # Desinstala paquete
```

## 🎨 Características

- **Next.js App Router**: Estructura moderna con layout y rutas anidadas, Server Actions para toda la comunicación con el backend
- **TypeScript**: Type safety en todo el proyecto
- **Tailwind CSS 4**: Estilos utilitarios optimizados
- **Auth con cookies httpOnly**: la sesión se guarda en una cookie httpOnly gestionada por el servidor; el JWT nunca es accesible desde JavaScript del cliente
- **CartContext**: Gestión de estado del carrito con React Context
- **Responsive Design**: Mobile-first approach

## 🔧 Configuración

### Tailwind CSS

La configuración está en `tailwind.config.mts`. Personaliza colores, fuentes y extensiones ahí.

### ESLint

Configurado con Next.js preset en `eslint.config.mjs`. Ejecuta:

```bash
bun run lint
```

### TypeScript

Configuración en `tsconfig.json` con Next.js presets. El alias `@/*` apunta a `src/*`.

## 🧪 Testing

Los tests unitarios viven junto al código que prueban (`archivo.test.ts`) y usan [Vitest](https://vitest.dev/).

```bash
bun run test
```

La configuración está en `vitest.config.ts`. Para probar Server Actions que dependen de `next/headers` (cookies), usa `vi.mock('next/headers', ...)` — ver `src/lib/auth-token.test.ts` como referencia.

## 📝 Convenciones

- **Componentes**: PascalCase en `src/components/`
- **Hooks**: Prefijo `use` (e.g., `useCart`)
- **Server Actions**: Un archivo por dominio en `src/actions/` (`auth.ts`, `orders.ts`, `payments.ts`...), re-exportados desde `src/actions/index.ts`
- **Archivos**: camelCase para utilidades, PascalCase para componentes

## 🔗 Integración con Backend

El frontend nunca llama al backend Go directamente desde el navegador — toda la comunicación pasa por Server Actions (`'use server'`) en `src/actions/`, que corren en el servidor de Next.js y reenvían el JWT (leído de la cookie httpOnly) como header `Authorization: Bearer`.

```typescript
// Ejemplo: src/actions/orders.ts
import { getAuthToken } from '@/lib/auth-token';

export async function getUserOrdersAction() {
  const token = await getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}
```

Define `NEXT_PUBLIC_API_URL` en `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

El backend Go, a su vez, necesita `FRONTEND_URL` configurado para permitir credenciales en CORS (ver `backend/.env.example`).

## 🆘 Troubleshooting

**Error: "Bun not found"**
- Instala Bun: `curl -fsSL https://bun.sh/install | bash`
- Añade a PATH si es necesario: `export PATH="$HOME/.bun/bin:$PATH"`

**Puerto 3000 en uso**
```bash
bun run dev --port 3001
```

**Node modules corrupto**
```bash
rm -rf node_modules bun.lock
bun install
```

**No puedo iniciar sesión / las Server Actions devuelven "No autorizado"**
- Verifica que el backend Go esté corriendo y que `NEXT_PUBLIC_API_URL` apunte a él.
- Revisa que `FRONTEND_URL` en el backend coincida con el origen desde el que accedes al frontend (CORS con credenciales exige coincidencia exacta).

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)
- [Vitest](https://vitest.dev/)

## 🤝 Desarrollo

### Agregar un nuevo componente

1. Crear en `src/components/<dominio>/YourComponent.tsx`
2. Importar en las páginas necesarias

### Agregar una nueva página

1. Crear carpeta en `src/app/nueva-pagina/`
2. Crear archivo `page.tsx`
3. Next.js enruta automáticamente

### Agregar una nueva Server Action

1. Agregarla al archivo de `src/actions/` correspondiente al dominio (o crear uno nuevo)
2. Si necesita autenticación, usar `getAuthToken()` de `@/lib/auth-token` — nunca recibir el token como parámetro desde el cliente
3. Re-exportarla desde `src/actions/index.ts`

### Agregar un nuevo context

1. Crear en `src/context/YourContext.tsx`
2. Exportar provider y hook
3. Envolver app en `layout.tsx`

## ⚡ Performance Tips

- Usa dynamic imports para componentes pesados: `dynamic(() => import(...))`
- Optimiza imágenes con el componente `next/image` en vez de `<img>`
- Usa `next/font` para fonts optimizadas
- Habilita ISR (Incremental Static Regeneration) cuando sea posible

---

**Última actualización**: 2026-07-14
**Versión**: 0.1.0 (Early Development)
**Package Manager**: Bun 🔥
