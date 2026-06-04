# 🎯 Estados y Transiciones

Máquina de estados completa del sistema de reparaciones.

---

## 📊 Diagrama de Estados

```
                    ┌────────────────┐
                    │    PENDING      │ ← Sistema crea aquí
                    │  (Diagnóstico)  │   cuando usuario confirma
                    └────────┬────────┘
                             │
                    Acción: Cliente paga
                    Validación: part_type ✓
                             │
                             ▼
                    ┌────────────────┐
                    │   AGENDADO      │
                    │  (Cita fijada)  │
                    └────────┬────────┘
                             │
                  Acción: Técnico recibe equipo
                  Validación: Payment.status="approved"
                             │
                             ▼
                    ┌────────────────┐
                    │ EN_REPARACION   │
                    │  (Técnico trab) │
                    └────────┬────────┘
                             │
                    Acción: Técnico termina
                    Auto: Crea Warranty(30d)
                             │
                             ▼
                    ┌────────────────┐
                    │   REPARADO      │
                    │  (Listo/Warranty)
                    └────────┬────────┘
                             │
                    Acción: Cliente retira
                             │
                             ▼
                    ┌────────────────┐
                    │  COMPLETADO     │
                    │  (Histórico)    │
                    └────────────────┘
```

---

## 📋 Tabla de Transiciones

| De | A | Quién | Condiciones | Auto-Acciones | Data Guardada |
|----|---|-------|-------------|---------------|---------------|
| — | **PENDING** | Sistema | Usuario confirma diagnóstico | — | `part_type`, `estimated_price_min/max` |
| **PENDING** | **AGENDADO** | Cliente | Hace pago (Payment.status=approved) | — | `final_price`, `appointment_datetime` |
| **AGENDADO** | **EN_REPARACION** | Técnico | Arrastra en Kanban | Valida Payment=approved | `technician_id` |
| **EN_REPARACION** | **REPARADO** | Técnico | Arrastra en Kanban | **Crea Warranty(30d)** | `warranty_id` |
| **REPARADO** | **COMPLETADO** | Admin/Técnico | Cliente retira equipo | — | — |

---

## 🔍 Estado PENDING

### Dónde
```
Frontend: /reparaciones/resumen → RepairActionPanel
Backend: POST /api/repairs/{id}/confirm
```

### Cuándo
```
Cuando: Usuario confirma diagnóstico + acepta diagnóstico
De: Sistema (acción automática después de confirmar en /reparaciones)
Quién lo crea: Sistema + acción frontend (ConfirmRepairForm)
```

### Qué pasa
```
✓ Se guarda en BD con status="pending"
✓ Se almacena: part_type, estimated_price_min/max
✓ Se crea entrada en RepairOrder
✓ Se registra en RepairTracking
✗ No se crea Payment aún
✗ No se crea Warranty
```

### Data
```json
{
  "status": "pending",
  "part_type": "compatible",
  "estimated_price_min": 65.00,
  "estimated_price_max": 95.00,
  "final_price": null,
  "appointment_datetime": null,
  "technician_id": null,
  "warranty_id": null
}
```

### Salida
```
→ Cliente ve en /cliente/dashboard → "Mis Reparaciones"
→ No tiene botones de acción
→ Solo lectura
```

---

## 🔍 Estado AGENDADO

### Dónde
```
Frontend: /cliente/dashboard → Botón "Pagar Cita"
Backend: POST /api/payments + PATCH /api/repairs/{id}/status
```

### Cuándo
```
Cuando: Cliente efectúa pago desde dashboard
De: PENDING
Quién lo cambia: Cliente + Sistema (automático al aprobar pago)
```

### Qué pasa
```
✓ Valida que Payment sea aprobado
✓ Actualiza status de RepairOrder a "agendado"
✓ Guarda appointment_datetime (3 días por defecto)
✓ Calcula final_price según part_type seleccionado
✓ Registra en RepairTracking
✗ No crea Warranty
✗ No asigna técnico aún
```

### Cálculo de Precio
```
Si part_type = "original"
  final_price = estimated_price_min * 1.15

Si part_type = "compatible"
  final_price = (estimated_price_min + estimated_price_max) / 2

Si part_type = "economic"
  final_price = estimated_price_max * 0.75
```

### Data
```json
{
  "status": "agendado",
  "part_type": "compatible",
  "estimated_price_min": 65.00,
  "estimated_price_max": 95.00,
  "final_price": 80.00,
  "appointment_datetime": "2026-06-05T09:00:00Z",
  "technician_id": null,
  "warranty_id": null,
  "payment_status": "approved"
}
```

### Validaciones
```
✓ Requiere: Payment.status == "approved"
✗ Si falla: Rechaza cambio de estado
```

### Salida
```
→ Cliente ve en /cliente/dashboard → "Mis Reparaciones"
→ Ve badge "Pago Confirmado"
→ Ve fecha de cita
→ Botones: Solo lectura
```

---

## 🔍 Estado EN_REPARACION

### Dónde
```
Frontend: /tecnico/dashboard → Kanban → Columna "En Reparación"
Backend: PATCH /api/repairs/{id}/status
```

### Cuándo
```
Cuando: Técnico arrastra tarjeta en Kanban
De: AGENDADO
Quién lo cambia: Técnico (rol="Técnico")
```

### Qué pasa
```
✓ Valida Payment.status == "approved"
✓ Si falla: Rechaza con error
✓ Asigna technician_id
✓ Actualiza status
✓ Registra en RepairTracking
✗ No crea Warranty
✗ Warranty se crea al pasar a REPARADO, no aquí
```

### Data
```json
{
  "status": "en_reparacion",
  "technician_id": "uuid-of-leonardo",
  "payment_status": "approved"
}
```

### Validaciones
```
CRÍTICO: 
✓ Si Payment.status != "approved"
✗ RECHAZA transición con error:
   "Cannot move to en_reparacion without approved payment"
```

### Salida
```
→ Cliente ve en /cliente/dashboard
→ Timeline actualizado: Paso 3 de 5
→ Botones: Solo lectura
→ Técnico ve tarjeta en columna "En Reparación"
```

---

## 🔍 Estado REPARADO

### Dónde
```
Frontend: /tecnico/dashboard → Kanban → Columna "Terminado"
Backend: PATCH /api/repairs/{id}/status
```

### Cuándo
```
Cuando: Técnico arrastra tarjeta en Kanban
De: EN_REPARACION
Quién lo cambia: Técnico
Auto-acción: Sistema crea Warranty
```

### Qué pasa
```
✓ Cambia status a "reparado"
✓ Registra en RepairTracking
✓ AUTO-CREA WARRANTY (30 días)
  - warranty_id: uuid
  - warranty_days: 30
  - start_date: now()
  - end_date: now() + 30 days
  - is_active: true
  - warranty_token: WARR-{repair_id}-{random}
✓ Notifica al cliente
```

### Data
```json
{
  "status": "reparado",
  "warranty_id": "uuid-created-automatically",
  "warranty_days": 30,
  "warranty_start": "2026-06-04T14:30:00Z",
  "warranty_end": "2026-07-04T14:30:00Z"
}
```

### Auto-Acciones
```
1. Crea registro Warranty
2. Notifica a cliente (eventual)
3. Registra cambio en RepairTracking
```

### Salida
```
→ Cliente ve en /cliente/dashboard
→ Badge: "🛡️ Warranty: 30 días activa"
→ Botón: "Retirar equipo"
→ Timeline actualizado: Paso 4 de 5
```

---

## 🔍 Estado COMPLETADO

### Dónde
```
Frontend: /cliente/dashboard → Histórico
Backend: PATCH /api/repairs/{id}/status
```

### Cuándo
```
Cuando: Técnico/Admin marca como retirado
De: REPARADO
Quién lo cambia: Técnico / Admin
```

### Qué pasa
```
✓ Cambia status a "completado"
✓ Warranty sigue activa (no se modifica)
✓ Registra en RepairTracking
✓ Aparece en histórico del cliente
```

### Data
```json
{
  "status": "completado",
  "warranty_id": "uuid",
  "warranty_days": 30,
  "warranty_active": true,
  "warranty_end": "2026-07-04T14:30:00Z"
}
```

### Salida
```
→ Cliente ve en /cliente/dashboard → "Mis Reparaciones"
→ Aparece en histórico (no en activos)
→ Warranty sigue visible y activa
→ Timeline: Completado (paso 5 de 5)
→ Botones: Solo lectura
```

---

## ⚠️ Validaciones por Transición

### PENDING → AGENDADO
```
Validación: Payment.status == "approved"
Error si:
  ✗ Payment no existe
  ✗ Payment.status == "pending"
  ✗ Payment.status == "failed"
Acción: Rechaza con error 400
```

### AGENDADO → EN_REPARACION
```
Validación: Payment.status == "approved"
Error si:
  ✗ Payment no existe
  ✗ Payment.status != "approved"
Acción: Rechaza con error 400
Nota: CRÍTICA - El técnico no puede recibir equipo si no pagó
```

### EN_REPARACION → REPARADO
```
Validación: Ninguna especial
Auto-acción: Crea Warranty automáticamente
Error: Si falla crear Warranty, rechaza transición
```

### REPARADO → COMPLETADO
```
Validación: Ninguna especial
Auto-acción: Ninguna
```

---

## 🚀 Eventos por Estado

| Estado | Eventos | Notificaciones |
|--------|---------|----------------|
| **PENDING** | RepairCreated | Email: "Tu diagnóstico está listo" |
| **AGENDADO** | PaymentApproved, RepairScheduled | Email: "Cita confirmada", SMS opcional |
| **EN_REPARACION** | TechnicianAssigned | Email: "Tu equipo está siendo reparado" |
| **REPARADO** | WarrantyCreated, RepairCompleted | Email: "Tu equipo está listo", "30 días warranty" |
| **COMPLETADO** | RepairClosed | Email: "Gracias por tu confianza" |

---

## 📝 Resumen: De Verdad, ¿Qué Pasa?

```
1. Usuario hace diagnóstico en /reparaciones
   → Sistema crea RepairOrder(status="pending")

2. Usuario elige tipo de repuestos + acepta
   → Frontend guarda en localStorage
   → Redirige a /auth

3. Usuario logea
   → Dashboard muestra su reparación en PENDING
   → Ve botón "Pagar Cita"

4. Usuario paga
   → Payment se aprueba
   → RepairOrder cambia a AGENDADO
   → Técnico ve tarjeta en Kanban

5. Técnico recibe equipo
   → Si Payment != approved → RECHAZA
   → Arrastra tarjeta a "En Reparación"
   → RepairOrder cambia a EN_REPARACION

6. Técnico termina
   → Arrastra tarjeta a "Terminado"
   → RepairOrder cambia a REPARADO
   → SISTEMA CREA AUTOMÁTICAMENTE WARRANTY(30d)

7. Cliente retira
   → Técnico marca como retirado
   → RepairOrder cambia a COMPLETADO
   → Cliente ve Warranty activa

8. Fin
   → RepairOrder queda en histórico
   → Warranty sigue activa por 30 días
```
