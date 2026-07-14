# TechFix Backend

Sistema modular de reparación de equipos electrónicos con diagnóstico guiado, gestión de órdenes y garantías digitales.

## 🏗️ Tech Stack

- **Framework**: [Gin Gonic](https://gin-gonic.com/) - Web framework minimalista
- **ORM**: [GORM](https://gorm.io/) - Object-Relational Mapping
- **Database**: PostgreSQL - Base de datos relacional
- **Auth**: JWT (golang-jwt/jwt) + bcrypt
- **Pagos**: Mercado Pago SDK (Go)
- **IA de diagnóstico**: motor propio (`internal/diagnostic`) contra Groq (API compatible con OpenAI)
- **Language**: Go 1.25
- **ID Generation**: UUID v4 autogenerados

## 📁 Estructura del Proyecto

```
backend/
├── cmd/api/              # Punto de entrada de la aplicación
│   └── main.go          # Inicialización y flags
├── internal/
│   ├── db/              # Configuración y migraciones
│   │   ├── db.go        # Conexión y AutoMigrate
│   │   ├── seed.go      # Datos base
│   │   └── seeds/       # Archivos YAML con seed
│   ├── models/          # Modelos de datos y relaciones
│   │   └── models.go    # Structs con GORM tags
│   ├── handlers/        # Controladores HTTP (auth, orders, repairs, products, suppliers...)
│   ├── auth/            # Middlewares de autenticación y roles
│   ├── diagnostic/      # Motor de diagnóstico PIG (IA)
│   └── payment/         # Integración Mercado Pago
├── .env                 # Variables de entorno local
├── .env.example         # Template de variables
├── go.mod & go.sum      # Dependencias Go
├── Dockerfile           # Build de producción
└── Makefile             # Comandos de utilidad
```

## 🚀 Quick Start

### Opción A: Docker (recomendado)

Desde la raíz del repo, con Docker Desktop corriendo:

```bash
docker compose up -d
```

Esto levanta Postgres, corre migraciones + seeds automáticamente, y expone el backend en `http://localhost:8080` y el frontend en `http://localhost:3000`.

### Opción B: Local

#### 1. Requisitos
- Go 1.25+
- PostgreSQL 12+
- Make (opcional pero recomendado)

#### 2. Configuración

```bash
# Clonar repo
cd laboratorio-1/backend

# Copiar env template
cp .env.example .env

# Ajustar credenciales en .env
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, etc.
```

#### 3. Instalar dependencias

```bash
go mod download
go mod tidy
```

#### 4. Base de datos

```bash
# Crear tablas y relaciones
make migrate-up

# Cargar datos base (usuarios, dispositivos, productos)
make seed

# Limpiar BD (destructivo)
make migrate-down
```

#### 5. Ejecutar servidor

```bash
# Modo desarrollo
make dev

# O directamente
go run cmd/api/main.go
```

El servidor estará en `http://localhost:8080`

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### Usuarios
- `usuarios` - Clientes, técnicos, administradores

#### Equipos
- `techfix_devices` - Dispositivos registrados por usuarios

#### Diagnóstico (PIG - Pre-diagnóstico Inteligente Guiado)
- `techfix_pig_nodes` - Árbol de decisión del diagnóstico
- `techfix_pig_sessions` - Sesiones de diagnóstico del usuario
- `pig_node_producto` - Productos sugeridos por nodo de diagnóstico

#### Reparaciones
- `techfix_repair_orders` - Órdenes de reparación (entidad central)
- `repair_order_producto` - Productos usados en cada reparación
- `techfix_repair_tracking` - Historial inmutable de estados

#### Transacciones y pagos
- `transacciones` - Pagos de reparaciones (legado, ligado 1:1 a una reparación)
- `transaccion_producto` - Desglose de productos cobrados en una reparación
- `techfix_payments` - Pagos vía Mercado Pago (reparaciones o compras de catálogo)
- `pedidos` - Órdenes de compra de catálogo (checkout e-commerce)
- `pedido_producto` - Line items de cada pedido de catálogo

#### Diagnóstico por IA
- `diagnostic_sessions` - Sesiones de diagnóstico conversacional
- `diagnostic_turns` - Turnos de pregunta/respuesta de cada sesión
- `ai_recommended_products` - Productos sugeridos por la IA en una sesión

#### Otros
- `techfix_warranties` - Garantías digitales post-reparación
- `productos` - Catálogo de repuestos y servicios
- `proveedores` - Proveedores de repuestos
- `pedidos_repuesto` - Órdenes de compra a proveedores

### Relaciones Clave

```
Usuario → Device → RepairOrder
                        ↓
                  RepairOrderProducto → Producto
                        ↓
                  Transaccion → TransaccionProducto → Producto
                        ↓
                  RepairTracking (historial)
                        ↓
                  Warranty (garantía)

PigNode → PigNodeProducto → Producto (diagnóstico sugiere productos)
```

## 🔧 Comandos Disponibles

```bash
# Desarrollo
make dev              # Ejecutar servidor en modo debug

# Migraciones
make migrate-up       # Crear todas las tablas
make migrate-down     # Borrar todas las tablas (DESTRUCTIVO)

# Datos
make seed            # Cargar datos base desde YAML

# Build
make build           # Compilar binario
make clean           # Limpiar build

# Ayuda
make help            # Mostrar todos los comandos
```

## 📝 Seed Data

Los datos base se cargan desde archivos YAML:

- **usuarios.yml** - 3 usuarios (admin, técnico, cliente)
- **dispositivos.yml** - 3 dispositivos de prueba vinculados a usuarios
- **productos.yml** - 24 productos (baterías, pantallas, SSD, cables, servicios)

Para agregar más datos base, edita los YAML y ejecuta `make seed`.

## 🔐 Variables de Entorno

```env
# Servidor
PORT=8080
GIN_MODE=debug          # debug, test, release

# Base de datos
DB_HOST=localhost
DB_USER=parker
DB_PASSWORD=parker123
DB_NAME=tech_fix
DB_PORT=5432
DB_SSLMODE=disable

# JWT (futuro)
JWT_SECRET=tu_secreto_super_seguro
```

## 📦 Modelos Principales

### Usuario
```go
ID, Login, Nombre, Email, Rol (Admin|Técnico|Cliente), Estado, JoinedDate
```

### Device
```go
ID, UserID, Brand, Model, SerialNumber, DeviceType, PurchaseDate
```

### RepairOrder (central)
```go
ID, UserID, DeviceID, TechnicianID, Status, DiagnosisFinal, FinalPrice, AppointmentDatetime
```

### Producto
```go
ID, Nombre, SKU, PrecioVenta, PrecioCosto, StockActual, Categoria, EstadoComercial
```

## 🧪 Tests

```bash
go test ./... -v
```

Cobertura actual: registro/login/credenciales (`internal/handlers/auth_test.go`) y pedidos de catálogo — descuento de stock, rechazo por stock insuficiente, aislamiento por usuario (`internal/handlers/orders_test.go`). Usa SQLite en memoria vía `internal/testutil`, no requiere Postgres.

## 🎯 Próximos Pasos

- [ ] Configurar `API_KEY_IA` (Groq) en producción para el diagnóstico por IA
- [ ] Probar el flujo de pagos con credenciales reales de Mercado Pago (sandbox)
- [ ] Ampliar cobertura de tests a `repairs.go`, `payment/handlers.go` y `diagnostic/service.go`
- [ ] API documentation (Swagger)
- [ ] Logger estructurado
- [ ] Manejo de errores robusto (respuestas de error consistentes)

## 🤝 Desarrollo

### Crear una nueva ruta

1. Crear handler en `internal/handlers/`
2. Crear repository en `internal/repositories/` si necesita consultas
3. Registrar ruta en `cmd/api/main.go`
4. Testear con curl o Postman

### Agregar un nuevo modelo

1. Definir struct en `internal/models/models.go`
2. Agregar método `TableName()` si es necesario
3. Agregar a `DB.AutoMigrate()` en `internal/db/db.go`
4. Ejecutar `make migrate-down && make migrate-up`

## 🆘 Troubleshooting

**Error: cannot connect to database**
- Verificar que PostgreSQL está corriendo
- Verificar credenciales en `.env`
- Crear BD si no existe: `createdb tech_fix`

**Error: invalid UUID length**
- Los UUIDs son autogenerados, no incluir en YAML
- Si es en seed, revisar que los archivos YAML tengan formato correcto

**Port 8080 already in use**
- Cambiar `PORT` en `.env`
- O matar proceso: `lsof -ti:8080 | xargs kill -9`

## 📚 Recursos

- [GORM Documentation](https://gorm.io/)
- [Gin Gonic Docs](https://gin-gonic.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [UUID RFC 4122](https://tools.ietf.org/html/rfc4122)

---

**Última actualización**: 2026-07-13
