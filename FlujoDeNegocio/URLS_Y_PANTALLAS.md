# 🗺️ URLs y Pantallas del Sistema

Mapa completo de dónde sucede cada acción en el flujo.

---

## 📍 FLUJO SIN LOGIN (Diagnóstico Gratis)

### 1. Inicio del Diagnóstico
```
URL: http://localhost:3000/reparaciones
Componente: ReparacionesWrapper
Estado: Sin autenticación
Acción: Usuario inicia cuestionario diagnóstico (PIG)
```

### 2. Responde Cuestionario
```
URL: http://localhost:3000/reparaciones
Componente: PIG Flow (paso a paso)
Estado: Sin autenticación
Acción: Responde preguntas técnicas
Salida: Diagnóstico + Costo Estimado
```

### 3. Ve Resultados del Diagnóstico
```
URL: http://localhost:3000/reparaciones/resumen?ticket=TK-...&device=...&category=Display
Componente: DiagnosticSummaryClient
Estado: Sin autenticación
Elementos:
  - DiagnosticSummaryCard: Muestra diagnóstico + costo
  - SuggestedPartsList: Lista repuestos recomendados
  - RepairActionPanel: AQUÍ VA EL FORMULARIO

Acción: Usuario elige tipo de repuestos
  └─ RepairActionPanel muestra:
     - Botón "Confirmar y Agendar Cita" (principal)
     - Botón "Comprar Piezas (DIY)" (secundario)
```

### 4. FORMULARIO DE CONFIRMACIÓN (EN RepairActionPanel)
```
URL: http://localhost:3000/reparaciones/resumen
Componente: RepairActionPanel → ConfirmRepairForm
Estado: Sin autenticación
Campos:
  - Radio: Tipo de repuestos
    ○ Original (OEM) → +15% costo
    ○ Compatible (recomendado) → precio base
    ○ Económico → -25% costo
  - Checkbox: "Acepto el diagnóstico"
  - Display: Costo dinámico según selección

Acción: Hace clic en "Confirmar"
  └─ Guarda en localStorage: techfix_pending_repair
  └─ Redirige a: /auth?redirect=%2Freparaciones
```

---

## 🔐 FLUJO CON LOGIN (Dashboard Cliente)

### 5. Login
```
URL: http://localhost:3000/auth
Componente: LoginClient
Acción: Email + contraseña
Redirige a: /cliente/dashboard (por redirect param)
```

### 6. Dashboard Cliente
```
URL: http://localhost:3000/cliente/dashboard?section=reparaciones
Componente: ClienteDashboardClient
Estado: Logueado
Tabs disponibles:
  - Equipos (dispositivos registrados)
  - Reparaciones ← AQUÍ VE SUS REPARACIONES
  - Compras
  - Garantías
  - Perfil
```

### 7. Mis Reparaciones
```
URL: http://localhost:3000/cliente/dashboard?section=reparaciones
Componente: RepairsSection → RepairsList → RepairCard
Estado: Logueado
Ver por estado:

┌─────────────────────────────────┐
│ Estado: PENDING                 │
├─────────────────────────────────┤
│ • Diagnóstico completado        │
│ • Costo estimado: $65-95        │
│ • Productos recomendados:       │
│   - Batería: $39.99             │
│   - Kit herramientas: $24.50    │
│ • SIN botón de pago             │
│ • Nota: "Compra en sección ..." │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Estado: AGENDADO                │
├─────────────────────────────────┤
│ • Cita reservada: 2026-06-05    │
│ • Costo final: $85.00           │
│ • Pago PENDIENTE (alert)        │
│ • Botón: "Pagar Cita" (azul)    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Estado: EN_REPARACION           │
├─────────────────────────────────┤
│ • Técnico: Leonardo             │
│ • Progreso: En reparación       │
│ • Timeline: Paso 3 de 5         │
│ • Botones: Solo lectura         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Estado: REPARADO                │
├─────────────────────────────────┤
│ • ✓ Reparación completada       │
│ • Listo para retirar            │
│ • 🛡️ Warranty: 30 días activa   │
│ • Botón: "Retirar" (verde)      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Estado: COMPLETADO              │
├─────────────────────────────────┤
│ • ✓ Equipo retirado             │
│ • 🛡️ Warranty: 30 días (activa) │
│ • Vence: 2026-07-04             │
│ • Histórico (lectura)           │
└─────────────────────────────────┘
```

### 8. Hacer Pago
```
URL: http://localhost:3000/cliente/dashboard?section=reparaciones
Componente: RepairCard → Botón "Pagar Cita"
Acción: Abre modal/página de pago
Integración: Mercado Pago
Redirige a: Dashboard (con status actualizado)
```

### 9. Sección Compras (DIY)
```
URL: http://localhost:3000/cliente/dashboard?section=compras
Componente: PurchasesSection
Acción: Usuario compra repuestos del catálogo normal
Independiente del flujo de reparación
```

---

## 🔧 FLUJO CON LOGIN (Dashboard Técnico)

### 10. Dashboard Técnico
```
URL: http://localhost:3000/tecnico/dashboard
Componente: TecnicoDashboardClient
Estado: Logueado + Rol="Técnico"
Vista: Kanban con 3 columnas

┌──────────────────┬──────────────────┬──────────────────┐
│ Por Diagnosticar │ En Reparación    │ Terminado        │
├──────────────────┼──────────────────┼──────────────────┤
│ estado="agendado"│ estado="en_rep"  │ estado="reparado"│
│                  │                  │                  │
│ Tarjeta 1        │ Tarjeta 3        │ Tarjeta 4        │
│ - Dispositivo    │ - Dispositivo    │ - Dispositivo    │
│ - Cita           │ - Progreso       │ - Warranty info  │
│ - Cliente        │ - Notas          │ - Cliente        │
│                  │                  │                  │
│ Acción: Recibe  │ Acción: Trabaja  │ Acción: Listo   │
│ equipo           │ + Agrega notas   │ para retirar     │
│ → mueve a        │ → mueve a        │ → mueve a        │
│ "En Reparación"  │ "Terminado"      │ "Completado"     │
└──────────────────┴──────────────────┴──────────────────┘
```

### 11. Cambiar Estado (Técnico)
```
Acción: Arrastra tarjeta en Kanban
Backend: PATCH /api/repairs/{id}/status
  Body: { 
    "status": "en_reparacion",
    "notes": "Recibido equipo, iniciando diagnóstico" 
  }
Validación: Si status="en_reparacion"
  → Valida: Payment.status == "approved"
  → Si NO → Rechaza con error
```

### 12. Marca como Reparado
```
Acción: Arrastra tarjeta a "Terminado"
Backend: PATCH /api/repairs/{id}/status
  Body: { 
    "status": "reparado",
    "notes": "Reparación completada, todas las pruebas ok" 
  }
Auto-acción: 
  → Crea Warranty(30 días) automáticamente
  → Cliente ve badge en dashboard
```

---

## 📱 Resumen: URLs Principales

| Acción | URL | Login | Componente |
|--------|-----|-------|-----------|
| **Diagnóstico** | `/reparaciones` | ❌ | ReparacionesWrapper |
| **Resumen Diagnóstico** | `/reparaciones/resumen` | ❌ | DiagnosticSummaryClient |
| **Confirmar Cita** | `/reparaciones/resumen` | ❌ | RepairActionPanel |
| **Login** | `/auth` | ❌ | LoginClient |
| **Mis Reparaciones** | `/cliente/dashboard` | ✅ | ClienteDashboardClient |
| **Compras DIY** | `/cliente/dashboard` | ✅ | ClienteDashboardClient |
| **Garantías** | `/cliente/dashboard` | ✅ | ClienteDashboardClient |
| **Cola Técnico** | `/tecnico/dashboard` | ✅ | TecnicoDashboardClient |
| **Carrito** | `/carrito` | ❌ | CartContent |

---

## 🔗 Flujo de Data

```
1. PENDIENTE (sin login)
   /reparaciones/resumen
   → RepairActionPanel (ConfirmRepairForm)
   → localStorage: techfix_pending_repair
   → redirect: /auth
   
2. PENDIENTE (logueado)
   /cliente/dashboard → RepairsSection
   → ve estado PENDING
   → sin acciones
   
3. AGENDADO
   /cliente/dashboard → RepairsSection
   → ve botón "Pagar Cita"
   → POST /api/payments → Mercado Pago
   
4. EN_REPARACION
   /tecnico/dashboard → Kanban
   → Técnico mueve tarjeta
   → PATCH /api/repairs/{id}/status
   → Validación: Payment.status="approved"
   
5. REPARADO
   /tecnico/dashboard → Kanban
   → Técnico mueve tarjeta
   → PATCH /api/repairs/{id}/status → "reparado"
   → Auto-crea Warranty
   
6. COMPLETADO
   /cliente/dashboard → RepairsSection
   → ve histórico con Warranty activa
```
