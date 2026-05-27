# TechFix Frontend

Interfaz moderna para la plataforma TechFix de reparación de equipos electrónicos con diagnóstico guiado, gestión de órdenes y carrito de compras.

## 🏗️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.2.6 - React framework con SSR/SSG
- **Runtime**: [Bun](https://bun.sh/) - JavaScript runtime rápido
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 - Utilidades CSS
- **Language**: TypeScript 5
- **UI Components**: Lucide React - Iconografía
- **Charts**: Recharts 3.8.1 - Gráficos interactivos
- **Node**: React 19.2.4

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App router de Next.js
│   │   ├── layout.tsx          # Layout raíz
│   │   └── page.tsx            # Página principal
│   ├── context/
│   │   └── CartContext.tsx     # Context para el carrito
│   ├── mock/                   # Datos de prueba
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── admin.ts
│   └── components/             # Componentes reutilizables
├── public/                     # Archivos estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── next-env.d.ts
└── .eslintrc.json
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
cp .env.example .env.local

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
bun run dev --port 4000  # En puerto personalizado

# Producción
bun run build        # Compila Next.js
bun run start        # Inicia servidor de producción

# Linting
bun run lint         # Ejecuta ESLint
bun run lint --fix   # Arregla automáticamente

# Dependencies
bun install          # Instala dependencias (crea bun.lockb)
bun update           # Actualiza paquetes
bun remove <pkg>     # Desinstala paquete
```

## 🎨 Características

- **Next.js App Router**: Estructura moderna con layout y rutas anidadas
- **TypeScript**: Type safety en todo el proyecto
- **Tailwind CSS 4**: Estilos utilitarios optimizados
- **CartContext**: Gestión de estado del carrito con React Context
- **Mock Data**: Datos de prueba para usuarios, productos y admin
- **Responsive Design**: Mobile-first approach

## 🔧 Configuración

### Tailwind CSS

La configuración está en `tailwind.config.ts`. Personaliza colores, fuentes y extensiones:

```typescript
// tailwind.config.ts
extend: {
  colors: { /* ... */ },
  spacing: { /* ... */ }
}
```

### ESLint

Configurado con Next.js preset en `.eslintrc.json`. Ejecuta:

```bash
bun run lint --fix
```

### TypeScript

Configuración en `tsconfig.json` con Next.js presets.

## 📝 Convenciones

- **Componentes**: PascalCase en `src/components/`
- **Hooks**: Prefijo `use` (e.g., `useCart`)
- **Types**: `types.ts` en carpetas de módulos
- **Archivos**: camelCase para utilidades, PascalCase para componentes

## 🔗 Integración con Backend

Para conectar con el API de Go en `http://localhost:8080`:

```typescript
// Ejemplo en un componente
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
  { method: 'GET' }
);
```

Define `NEXT_PUBLIC_API_URL` en `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

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
rm -rf node_modules bun.lockb
bun install
```

**Cambiar de npm a bun**
```bash
# Si tienes package-lock.json, eliminalo
rm package-lock.json
bun install  # Genera bun.lockb automáticamente
```

**HMR no funciona**
- Verifica que no hay firewall bloqueando puerto 3000
- Intenta en otra terminal

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)

## 🤝 Desarrollo

### Agregar un nuevo componente

1. Crear en `src/components/YourComponent.tsx`
2. Exportar desde `src/components/index.ts` (si existe)
3. Importar en páginas necesarias

### Agregar una nueva página

1. Crear carpeta en `src/app/new-page/`
2. Crear archivo `page.tsx`
3. Next.js enruta automáticamente

### Agregar un nuevo context

1. Crear en `src/context/YourContext.tsx`
2. Exportar provider y hook
3. Envolver app en `layout.tsx`

## ⚡ Performance Tips

- Use dynamic imports para componentes pesados: `dynamic(() => import(...))`
- Optimiza imágenes con Next.js Image component
- Usa `next/font` para fonts optimizadas
- Habilita ISR (Incremental Static Regeneration) cuando sea posible

---

**Última actualización**: 2026-05-26  
**Versión**: 0.1.0 (Early Development)  
**Package Manager**: Bun 🔥
