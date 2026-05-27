# TechFix Lab - Backend

Backend modular desarrollado en Go enfocado en velocidad y mantenibilidad.

## Tech Stack
- **Framework:** [Gin Gonic](https://gin-gonic.com/)
- **ORM:** [GORM](https://gorm.io/)
- **Base de Datos:** PostgreSQL
- **ID:** UUID v4

## Estructura de Carpetas
- `cmd/api/`: Punto de entrada de la aplicación.
- `internal/db/`: Configuración y migración de base de datos.
- `internal/models/`: **Modelos Centralizados** (Todas las entidades viven aquí).
- `internal/handlers/`: Controladores de rutas.
- `internal/repositories/`: Consultas a base de datos.

## Configuración Rápida
1. Copia el archivo de entorno: `cp .env.example .env`
2. Configura tus credenciales de Postgres en `.env`.
3. Descarga dependencias: `go mod tidy`
4. Ejecuta: `go run cmd/api/main.go`
