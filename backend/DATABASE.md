# Esquema de Base de Datos - TechFix

## Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| **usuarios** | Usuarios del sistema (clientes, técnicos, admin) |
| **techfix_devices** | Dispositivos registrados para reparación |
| **productos** | Catálogo de productos y repuestos |
| **proveedores** | Proveedores de repuestos y servicios |

## Tablas de Procesos

| Tabla | Descripción |
|-------|-------------|
| **techfix_pig_nodes** | Árbol de diagnóstico interactivo |
| **techfix_pig_sessions** | Sesiones de diagnóstico de usuarios |
| **techfix_repair_orders** | Órdenes de reparación |
| **techfix_repair_tracking** | Historial de cambios en reparaciones |
| **techfix_warranties** | Garantías de reparaciones completadas |

## Tablas de Transacciones

| Tabla | Descripción |
|-------|-------------|
| **transacciones** | Pagos y transacciones del sistema |
| **pedidos_repuesto** | Órdenes de compra a proveedores |

## Tablas de Relaciones (M2M)

| Tabla | Descripción |
|-------|-------------|
| **transaccion_producto** | Productos en cada transacción |
| **pig_node_producto** | Productos recomendados por nodo de diagnóstico |
| **repair_order_producto** | Repuestos usados en cada reparación |

---

**ID**: UUID en todas las tablas  
**Timestamps**: `created_at`, `updated_at`, `deleted_at` (soft delete)
