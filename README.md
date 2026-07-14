# TechFix - Plataforma Modular de Reparación de Equipos 🛠️💻

Plataforma B2C completa para venta de productos tecnológicos y gestión integral de servicios de reparación con diagnóstico guiado, carrito de compras y panel administrativo.

## 🏗️ Tech Stack General

### Backend
- **Lenguaje**: Go 1.25
- **Framework**: Gin Gonic
- **ORM**: GORM
- **Base de Datos**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Pagos**: Mercado Pago SDK
- **IDs**: UUID v4

### Frontend
- **Framework**: Next.js 16.2.6
- **Runtime**: Bun (package manager)
- **Styling**: Tailwind CSS 4
- **Lenguaje**: TypeScript 5
- **UI**: React 19.2.4, Lucide Icons, Recharts

---

## 📁 Estructura del Proyecto

```
laboratorio-1/
├── backend/
│   ├── cmd/api/              # Punto de entrada
│   ├── internal/
│   │   ├── db/              # Configuración DB y migraciones
│   │   ├── models/          # Modelos de datos
│   │   ├── handlers/        # Controllers HTTP
│   │   └── repositories/    # Queries a BD
│   ├── go.mod & go.sum
│   ├── Makefile
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/             # App Router de Next.js
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Estado global (CartContext)
│   │   └── mock/            # Datos de prueba
│   ├── package.json (Bun)
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
│
└── README.md                 # Este archivo
```

---

## 🚀 Quick Start

### Opción A: Docker (recomendado)

Con [Docker Desktop](https://www.docker.com/products/docker-desktop/) corriendo:

```bash
docker compose up -d
```

Levanta Postgres, corre migraciones y siembra datos base automáticamente.
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Variables opcionales (para pagos reales y diagnóstico por IA real, en vez de modo simulado):

```bash
JWT_SECRET=...
API_KEY_IA=...                    # clave de Groq
MERCADO_PAGO_PUBLIC_KEY=...
MERCADO_PAGO_ACCESS_TOKEN=...
MERCADO_PAGO_WEBHOOK_SECRET=...
```

### Opción B: Local

#### Requisitos Previos
- **Go** 1.25+ (backend)
- **Bun** 1.2+ (frontend) - [Instalar](https://bun.sh/)
- **PostgreSQL** 12+ (base de datos)
- **Make** (opcional, para backend)

#### 1. Backend

```bash
cd backend

# Copiar variables de entorno
cp .env.example .env

# Instalar dependencias
go mod download && go mod tidy

# Crear tablas y cargar datos base
make migrate-up
make seed

# Ejecutar servidor (puerto 8080)
make dev
```

**Ver más**: [backend/README.md](./backend/README.md)

#### 2. Frontend

```bash
cd frontend

# Instalar dependencias con Bun
bun install

# Copiar variables de entorno
cp .env.example .env.local

# Ejecutar servidor dev (puerto 3000)
bun run dev
```

---

## 📊 Modelo de Datos

### Entidades Principales

| Entidad | Descripción | Relaciones |
| :--- | :--- | :--- |
| **Usuario** | Clientes, técnicos, administradores | → Dispositivos, Órdenes |
| **Dispositivo** | Equipos registrados (laptops, celulares) | ← Usuario |
| **Orden de Reparación** | Orden central de servicio | → Usuario, Dispositivo, Productos |
| **Producto** | Repuestos y servicios | ← Órdenes, Diagnóstico |
| **Diagnóstico (PIG)** | Árbol de decisión guiado | → Productos sugeridos |
| **Garantía Digital** | Post-reparación | ← Orden |
| **Transacción** | Pagos realizados | → Productos, Orden |

**Detalle completo**: Ver [backend/README.md](./backend/README.md#-estructura-de-la-base-de-datos)

---

## 🎯 Funcionalidades

### 👥 Cliente
- ✅ Registro e inicio de sesión
- ✅ Perfil con historial de citas y pedidos
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras con cálculo de envíos
- ✅ Diagnóstico guiado (PIG) para servicios
- ✅ Booking de citas con técnicos
- ✅ Garantía digital post-reparación

### 👨‍💼 Administrador
- ✅ Panel de control
- ✅ Gestión de pedidos (actualizar estados)
- ✅ Control de inventario
- ✅ Gestión de citas y asignación de técnicos
- ✅ Reportes de ventas

### 🔧 Características Técnicas
- ✅ Diagnóstico inteligente guiado (PIG)
- ✅ Órdenes de reparación modulares
- ✅ Tracking de estado en tiempo real
- ✅ Sistema de garantías digitales
- ✅ Integración con proveedores

---

## 🔄 Flujos Principales (Happy Paths)

### 🛒 Compra de Producto
1. Usuario navega catálogo
2. Selecciona producto y lo añade al carrito
3. Procede a checkout
4. Selecciona dirección de envío
5. Realiza pago
6. Recibe confirmación y número de pedido

### 🔧 Servicio de Reparación
1. Usuario inicia diagnóstico guiado (PIG)
2. Responde preguntas sobre el problema
3. Sistema sugiere productos/servicios
4. Usuario selecciona fecha en calendario
5. Se crea cita y se asigna técnico
6. Técnico completa reparación
7. Sistema genera garantía digital

---

## 📝 Desarrollo

### Agregar nueva ruta en backend

1. Crear handler en `backend/internal/handlers/`
2. Crear repository en `backend/internal/repositories/`
3. Registrar ruta en `backend/cmd/api/main.go`
4. Testear con curl o Postman

### Agregar nueva página en frontend

1. Crear carpeta en `frontend/src/app/nombre-pagina/`
2. Crear archivo `page.tsx`
3. Next.js enruta automáticamente

### Agregar modelo a base de datos

1. Definir struct en `backend/internal/models/models.go`
2. Agregar `TableName()` si es necesario
3. Incluir en `DB.AutoMigrate()` en `backend/internal/db/db.go`
4. Ejecutar `make migrate-down && make migrate-up`

---

## 🔐 Variables de Entorno

### Backend (.env)
```env
PORT=8080
GIN_MODE=debug
DB_HOST=localhost
DB_USER=parker
DB_PASSWORD=parker123
DB_NAME=tech_fix
DB_PORT=5432
JWT_SECRET=tu_secreto_aqui
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🆘 Troubleshooting

**Backend - Error conexión PostgreSQL**
```bash
# Verificar que PostgreSQL está corriendo
# Crear BD si no existe:
createdb tech_fix
```

**Frontend - Puerto 3000 en uso**
```bash
bun run dev --port 3001
```

**Node modules corrupto**
```bash
rm -rf frontend/node_modules frontend/bun.lockb
cd frontend && bun install
```

**Cambiar npm a Bun**
```bash
rm package-lock.json
bun install  # Genera bun.lockb
```

---

## 🧪 CI y Tests

En cada push/PR a `main` corre [`.github/workflows/ci.yml`](.github/workflows/ci.yml): build + vet + tests del backend, y typecheck + build del frontend.

```bash
cd backend && go test ./... -v
```

## 📚 Documentación Relacionada

- [Backend README](./backend/README.md) - Guía completa del servidor Go/Gin
- [docker-compose.yml](./docker-compose.yml) - Levantar todo el stack con un comando

---

## 👥 Equipo

## 👥 Equipo de Trabajo (Semana 05)
* [cite_start]RODRIGUEZ RUIZ, JHORVIN [cite: 9]
* [cite_start]SANTIAGO SOSA, JAYRO RENZO [cite: 10]
* [cite_start]QUISPE CARPIO, KEVIN ANDY [cite: 11]
* [cite_start]PIZARRO LAVIO, ADERLY [cite: 12]
* [cite_start]HUAMAN PERALTA, RICHARD BRUNO [cite: 13]
* [cite_start]YUPARI RAMOS, GABRIEL [cite: 14]

- **Institución**: Universidad Nacional de San Cristóbal de Huamanga
- **Curso**: Comercio Electrónico
- **Docente**: Espinoza Reina Stivens Rayli

---

**Última actualización**: 2026-07-13
