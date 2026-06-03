# Arquitectura: Diagnóstico Dual (PIG + IA)

## Situación Actual
El flujo usa un árbol de decisión binario (PIG) con preguntas/respuestas predefinidas:

```
Step 1: Device Selection (tipo dispositivo)
   ↓
Step 2: PIG Questionnaire (árbol binario)
   ↓
Step 4: Contact Form (datos cliente)
   ↓
Step 5: Report & Cross-sell (confirmación)
```

## Propuesta: Diagnóstico Dual
Agregar opción de diagnóstico por IA **sin romper** el flujo existente:

```
Step 1: Device Selection (tipo dispositivo)
   ↓
[NEW] Step 1.5: Diagnostic Mode Selection
   ├─ "Diagnóstico Rápido por IA" (conversacional)
   └─ "Árbol de Decisión" (PIG clásico)
   ↓
Step 2: Dynamic Questionnaire
   ├─ Si PIG: /api/pig/nodes (árbol predefinido)
   └─ Si IA:  /api/diagnostic/start → /api/diagnostic/answer (iterativo)
   ↓
Step 4: Contact Form (igual para ambos)
   ↓
Step 5: Report & Cross-sell (igual para ambos)
```

## Datos de Estado

### useDiagnosticFlow necesita:
```typescript
// Nuevas variables
diagnosticMode: 'pig' | 'ia';           // Modo seleccionado
diagnosticSessionId?: string;           // Para IA: session ID
isAILoading: boolean;                   // Para IA: spinner
aiTurns: number;                        // Para IA: contador de turnos
aiHistory: AITurn[];                    // Para IA: Q&A history
```

### Modelo AITurn:
```typescript
interface AITurn {
  turnNumber: number;
  question: string;
  userAnswer: string;
  timestamp: Date;
}
```

## Componentes Necesarios

### 1. Step1.5: Mode Selection
```typescript
// src/components/repair/steps/Step1_5DiagnosticModeSelection.tsx
- CardA: "Diagnóstico por IA" (ícono sparkles)
  - Descripción: "Conversacional, rápido, personalizado"
  - Duración: "5-10 min"
  - Costo: "GRATIS"
  
- CardB: "Árbol de Decisión" (ícono diagram)
  - Descripción: "Preguntas técnicas estructuradas"
  - Duración: "5-15 min"
  - Costo: "GRATIS"
```

### 2. Step2: Unified Questionnaire
```typescript
// src/components/repair/steps/Step2Questionnaire.tsx (actualizar)
if (diagnosticMode === 'pig') {
  // Componente actual (PIG)
  return <DiagnosticStep2PIG {...props} />
} else {
  // Nuevo componente (IA)
  return <DiagnosticStep2AI {...props} />
}
```

### 3. Step2AI: IA Questionnaire
```typescript
// src/components/repair/steps/Step2DiagnosticAI.tsx
- Pregunta IA en el centro
- Input de respuesta (textarea)
- Botón "Enviar respuesta"
- Historial de turnos en panel lateral/collapsible
- Indicador de carga mientras espera respuesta de IA
- Cuando es terminal: muestra diagnóstico + productos recomendados
```

## Flujo API

### Inicio Diagnóstico PIG (actual)
```
GET /api/pig/nodes?device_type=smartphone
→ Obtiene nodos raíz
```

### Inicio Diagnóstico IA (nuevo)
```
POST /api/diagnostic/start
{
  "device_type": "smartphone",
  "initial_issue": "Pantalla no enciende"
}
→ {
  "session_id": "...",
  "question": "¿El teléfono se enciende o muestra algún indicio de vida?",
  "turn_number": 1
}
```

### Responder Pregunta IA (nuevo)
```
POST /api/diagnostic/answer
{
  "session_id": "...",
  "answer": "No, completamente muerto"
}
→ {
  "turn_number": 2,
  "is_terminal": false,
  "question": "¿Ha sufrido caídas o mojaduras?",
  // O si es terminal:
  // "is_terminal": true,
  // "diagnosis": "...",
  // "estimated_min_price": 15000,
  // "estimated_max_price": 40000,
  // "recommended_products": [...]
}
```

## Mapeo de Datos a Step 4 & 5

Ambos modos (PIG e IA) **convergen** en Step 4:

```typescript
// Step 4 recibe indistintamente:
const diagnosticData = {
  deviceType,
  diagnosis: terminalNode.preliminary_result || aiResponse.diagnosis,
  estimatedMin: terminalNode.estimated_min || aiResponse.estimated_min_price,
  estimatedMax: terminalNode.estimated_max || aiResponse.estimated_max_price,
  suggestedProducts: suggestedProducts || aiResponse.recommended_products,
  symptomPath: symptomPath, // PIG
  // O
  aiHistory: aiHistory,     // IA
};
```

## Step 5 Improvements

Al recibir productos recomendados de IA:
- Productos dinámicos (generados por IA)
- **Nuevo campo**: `aiReasoning` (por qué la IA recomienda cada producto)
- Búsqueda de stock/precio en tiempo real vía `/api/products/search`

```typescript
// SuggestedPartsList.tsx (actualizar)
{suggestedProducts.map(product => (
  <div key={product.id}>
    <h4>{product.name}</h4>
    {product.aiReasoning && (
      <p className="text-xs text-slate-500 italic">
        💡 {product.aiReasoning}
      </p>
    )}
    <p>${product.estimatedPrice}</p>
    {/* Botón de búsqueda si no está en stock */}
  </div>
))}
```

## Caché & Optimización

### Para evitar consultas constantes:

1. **Caché en Frontend** (localStorage)
```typescript
const cachedCategories = localStorage.getItem('productCategories');
// Reutilizar en búsquedas, solo actualizar si es > 1 hora
```

2. **Búsqueda Eficiente**
```typescript
// Usar /api/products/search con debounce
const [searchResults] = useAsyncDebounce(
  query => fetch(`/api/products/search?q=${query}`),
  500
);
```

3. **Backend**: Índices en BD (ya creados en migration 0008)
```sql
CREATE INDEX idx_productos_nombre_lower ON productos (LOWER(nombre));
CREATE INDEX idx_productos_categoria ON productos (categoria);
```

## Timeline de Implementación

### Phase 1: UI & Routing
- [ ] Crear Step1.5 (mode selection)
- [ ] Crear Step2AI (conversación)
- [ ] Actualizar useDiagnosticFlow para soportar ambos modos

### Phase 2: Integración IA
- [ ] Conectar /api/diagnostic/start
- [ ] Conectar /api/diagnostic/answer
- [ ] Mapear respuestas IA a formato esperado en Step 4

### Phase 3: Optimización
- [ ] Implementar /api/products/search
- [ ] Agregar caché de categorías
- [ ] Mejorar SuggestedPartsList con aiReasoning

### Phase 4: Polish
- [ ] Animaciones de carga para IA
- [ ] Error handling (timeout de IA, etc)
- [ ] Fallback a PIG si IA falla
