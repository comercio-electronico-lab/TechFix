# 🔧 Flujo de Negocio - TechFix

Documentación clara del flujo de diagnóstico, reparación y pago en TechFix.

## 📋 Contenido
- [Flujo General](#flujo-general)
- [Flujos por Rol](#flujos-por-rol)
- [Estados de Reparación](#estados-de-reparación)
- [Endpoints API](#endpoints-api)

---

## 🔄 Flujo General

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRADA: /reparaciones                    │
│                  (Sin login, diagnóstico gratis)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Diagnóstico    │
                  │  Interactivo    │
                  │   (PIG Nodes)   │
                  └────────┬────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  Resumen: Costo + Repuestos     │
         │  Usuario elige:                 │
         │  • Original / Compatible / Eco  │
         │  • Acepta diagnóstico           │
         └────────────┬────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    [OPCIÓN A]              [OPCIÓN B]
    Confirmar Cita          Comprar DIY
    ↓                       ↓
    Login                   Carrito
    ↓
┌─────────────────────────────┐
│  Dashboard Cliente          │
│  Estado: PENDING            │
│  Costo: $65-95              │
│  Opciones: Pagar Cita       │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Pago (Mercado Pago)        │
│  si [APROBADO]              │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Estado: AGENDADO           │
│  Cita: 3 días después       │
│  Pago: ✓ Confirmado         │
└────────────┬────────────────┘
             │
    (Técnico recibe equipo)
             │
             ▼
┌─────────────────────────────┐
│  Estado: EN_REPARACION      │
│  Técnico: Trabajando        │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Estado: REPARADO           │
│  ✓ Warranty: 30 días        │
│  Listo para retirar         │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Estado: COMPLETADO         │
│  Cliente retiró equipo      │
│  Warranty: Activa           │
└─────────────────────────────┘
```

---

## 👥 Flujos por Rol

### 1️⃣ CLIENTE (Sin Login)

**En `/reparaciones`:**
1. Responde cuestionario diagnóstico (PIG)
2. Ve resultado + costo estimado
3. **Elige tipo de repuestos:**
   - Original (máxima calidad) → +15% costo
   - Compatible (recomendado) → precio base
   - Económico (presupuesto) → -25% costo
4. **Acepta diagnóstico** (checkbox)
5. Hace clic **"Confirmar y Agendar Cita"**
6. → Redirige a Login

### 2️⃣ CLIENTE (Logueado)

**En `/cliente/dashboard` → "Mis Reparaciones":**

| Estado | Ve | Acciones |
|--------|-----|----------|
| **PENDING** | Diagnóstico, costo aprox | — (solo lectura) |
| **AGENDADO** | Cita confirmada, costo final | "Pagar Cita" |
| **EN_REPARACION** | Técnico trabajando | — (seguimiento) |
| **REPARADO** | Equipo listo, warranty | "Retirar" |
| **COMPLETADO** | Histórico, warranty activa | Ver detalles |

### 3️⃣ TÉCNICO (Logueado)

**En `/tecnico/dashboard` → "Cola de Reparaciones":**

1. Ve columnas Kanban:
   - **Por Diagnosticar:** estado = agendado
   - **En Reparación:** estado = en_reparacion
   - **Terminado:** estado = reparado
2. **Acciones:**
   - Recibe equipo → mueve a `en_reparacion`
   - Termina reparación → mueve a `reparado`
   - (Auto-crea warranty de 30 días)
   - Cliente retira → mueve a `completado`

### 4️⃣ ADMIN

- Monitor general de todas las reparaciones
- Reportes de ingresos
- Gestión de técnicos

---

## 📊 Estados de Reparación

```yaml
Estados válidos:
  pending:
    descripción: "Diagnóstico hecho, usuario decide"
    transición_a: ["agendado"]
    requiere: "Cliente acepta diagnóstico + elige tipo repuestos"
    data_guardada: "part_type, estimated_price_min/max"

  agendado:
    descripción: "Cita confirmada, esperando pago"
    transición_a: ["en_reparacion"]
    requiere: "Payment.status == 'approved'"
    data_guardada: "appointment_datetime"

  en_reparacion:
    descripción: "Técnico tiene el equipo"
    transición_a: ["reparado"]
    requiere: "Técnico lo cambia manualmente"
    data_guardada: "technician_id"

  reparado:
    descripción: "Listo para retirar + warranty creada"
    transición_a: ["completado"]
    auto_acciones: "Crea Warranty(30 días)"
    requiere: "Técnico lo cambia manualmente"

  completado:
    descripción: "Cliente retiró, warranty activa"
    transición_a: []
    requiere: "Técnico/Admin lo cambia"
```

---

## 🔌 Endpoints API

### Cliente: Confirmar Diagnóstico
```
POST /api/repairs/{id}/confirm
Body: { "part_type": "compatible" }
Response: { status: "agendado", ... }
```

### Cliente: Pagar Cita
```
POST /api/payments
Body: { 
  "repair_id": "uuid",
  "amount": 85.00,
  "payment_method": "credit_card"
}
Response: { status: "pending", mercado_pago_id: "..." }
```

### Cliente: Ver Mis Reparaciones
```
GET /api/repairs/user/{userId}
Response: [{ status: "pending", ... }, { status: "agendado", ... }]
```

### Técnico: Cambiar Estado
```
PATCH /api/repairs/{id}/status
Body: { "status": "en_reparacion", "notes": "Recibido equipo" }
Validación: Si status="en_reparacion" → requiere Payment.status="approved"
Response: { status: "en_reparacion", ... }

# Al cambiar a "reparado" → AUTO-CREA WARRANTY
```

---

## 🚨 Validaciones Críticas

| Validación | Ubicación | Acción |
|-----------|-----------|--------|
| **Payment required** | Backend (PATCH /status) | Si nuevo_estado = `en_reparacion`, rechaza si no hay pago aprobado |
| **Warranty auto-create** | Backend (PATCH /status) | Al cambiar a `reparado`, crea Warranty(30 días) automáticamente |
| **Part type obligatorio** | Frontend + Backend | Cliente DEBE elegir tipo de repuestos antes de confirmar |
| **Diagnóstico aceptado** | Frontend | Checkbox DEBE estar marcado antes de agendar |

---

## 🛠️ Campos Importantes por Estado

### PENDING
```json
{
  "status": "pending",
  "diagnosis_final": "Batería degradada...",
  "estimated_price_min": 65,
  "estimated_price_max": 95,
  "part_type": null,
  "appointment_datetime": null,
  "final_price": null
}
```

### AGENDADO
```json
{
  "status": "agendado",
  "part_type": "compatible",
  "appointment_datetime": "2026-06-05T09:00:00Z",
  "final_price": 85.00,
  "payment_status": "pending"
}
```

### EN_REPARACION
```json
{
  "status": "en_reparacion",
  "technician_id": "uuid",
  "payment_status": "approved"
}
```

### REPARADO
```json
{
  "status": "reparado",
  "warranty_id": "uuid",
  "warranty_days": 30,
  "warranty_active": true
}
```

---

## 📝 Notas de Implementación

- **Sin duplicación:** Un cliente = Una entrada en PENDING = Una reparación
- **Flujo lineal:** pending → agendado → en_reparacion → reparado → completado
- **Sin pasos atrás:** Los estados solo avanzan, nunca retroceden
- **Warranty automática:** Se crea al pasar a REPARADO, no manualmente
- **Pago obligatorio:** No se puede pasar a EN_REPARACION sin Payment aprobado
