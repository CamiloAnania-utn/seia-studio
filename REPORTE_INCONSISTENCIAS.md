# 🔍 Reporte de Inconsistencias - SEIA Studio

## ⚠️ PROBLEMAS CRÍTICOS

### 1. **Inconsistencia en Baja de Registros (CRÍTICO)**
**Archivo**: `seia-studio-backend/src/controllers/`

- **Catálogo & Categoría**: Usan baja lógica (`activo: false`)
- **Transacciones**: Usan borrado físico (`destroy()`) ❌

**Problema**: Las transacciones son registros históricos-contables y NUNCA deben ser borrados físicamente. Esto viola la integridad histórica de la información financiera.

**Solución**: Cambiar `transactionController.js` para usar baja lógica también:
```javascript
// Agregar campo 'activo' al modelo Transaction
// Cambiar destroy() por update({ activo: false })
```

---

### 2. **Validación Deficiente en Transacciones**
**Archivo**: `seia-studio-backend/src/controllers/transactionController.js` (líneas 14-20)

**Problema actual**:
```javascript
if (tipo === 'Ingreso' && !catalogo_id && !concepto) {
  // Esta validación siempre pasa si hay concepto
  // Debería ser: !catalogo_id (así catalogo_id es obligatorio para ingresos)
}
```

**Consecuencia**: Se pueden crear ingresos sin asociarlos a un servicio del catálogo.

---

### 3. **Foreign Keys Sin Validar a Nivel de BD**
**Archivo**: `seia-studio-backend/src/models/Transaction.js`

**Problema**: El modelo define `catalogo_id` y `categoria_id` pero NO definen restricciones de clave foránea:

```javascript
// FALTA esto:
catalogo_id: {
  type: DataTypes.UUID,
  references: {
    model: 'catalogo_servicios',
    key: 'id'
  },
  allowNull: true
},
categoria_id: {
  type: DataTypes.UUID,
  references: {
    model: 'categorias',
    key: 'id'
  },
  allowNull: true
}
```

**Riesgo**: Se pueden crear transacciones con IDs de catálogo/categoría que no existen.

---

## ⚠️ INCONSISTENCIAS MODERADAS

### 4. **Endpoints Duplicados en Frontend**
**Archivo**: `seia-studio-frontend/src/services/api.js`

```javascript
// DUPLICADO - Ambos hacen lo mismo:
export const fetchDashboardData = async () => {
  const response = await fetch(`${API_URL}/transacciones`);
  // ...
};

export const fetchTransacciones = async () => {
  const response = await fetch(`${API_URL}/transacciones`);
  // ...
};
```

**Solución**: Usar solo `fetchTransacciones` y eliminar `fetchDashboardData`.

---

### 5. **API_URL Hardcodeada en Producción**
**Archivo**: `seia-studio-frontend/src/services/api.js` (línea 1)

```javascript
const API_URL = 'https://seia-studio.onrender.com/api';
// const API_URL = 'http://localhost:3000/api'; // ← Comentado
```

**Problema**: 
- No hay configuración por entorno
- Cambiar entre dev/prod requiere comentar/descomentar
- Dificulta el desarrollo local

**Solución**: Usar variables de entorno:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

---

### 6. **Inconsistencia en Timestamps**
**Archivo**: `seia-studio-backend/src/models/Categoria.js`

```javascript
Catalogo:   timestamps: true       ✓ (createdAt, updatedAt)
Categoria:  timestamps: false      ✗ (Las categorías nunca se modifican)
Transaction: timestamps: true      ✓ (createdAt, updatedAt)
```

**Problema**: Si editas una categoría, no hay registro de cuándo se modificó. Incoherente con las demás entidades.

**Solución**: Cambiar a `timestamps: true` en Categoria.

---

### 7. **Campos Opcionales Inconsistentes**
**Archivo**: `seia-studio-backend/src/models/Transaction.js`

```javascript
monto_efectivo: defaultValue: 0,      // ✓ Bien
monto_transferencia: defaultValue: 0, // ✓ Bien
```

Pero en el controlador:
```javascript
monto_efectivo: monto_efectivo || 0,        // Redundante
monto_transferencia: monto_transferencia || 0, // Redundante
```

La lógica de `||` es innecesaria si el modelo ya tiene `defaultValue`.

---

### 8. **Falta Campo 'activo' en Transacción**
**Archivo**: `seia-studio-backend/src/models/Transaction.js`

Para implementar baja lógica consistente, necesitas:

```javascript
activo: {
  type: DataTypes.BOOLEAN,
  defaultValue: true,
  allowNull: false
}
```

---

## ✅ COSAS BIEN HECHAS

- ✓ Rutas bien organizadas y consistentes
- ✓ CRUD completo en ambas carpetas
- ✓ Manejo de errores con try/catch
- ✓ Asociaciones de Sequelize bien definidas
- ✓ Validaciones básicas de presencia
- ✓ Separación clara de responsabilidades (controladores/modelos/rutas)

---

## 📋 CHECKLIST DE CORRECCIONES RECOMENDADAS

| Prioridad | Tarea | Archivo |
|-----------|-------|---------|
| 🔴 CRÍTICA | Cambiar baja física a lógica en transacciones | `transactionController.js` |
| 🔴 CRÍTICA | Agregar campo `activo` a modelo Transaction | `Transaction.js` |
| 🔴 CRÍTICA | Agregar validaciones de FK a nivel BD | `Transaction.js` |
| 🟠 ALTA | Corregir validación de ingresos | `transactionController.js` |
| 🟠 ALTA | Configurar variables de entorno para API_URL | `api.js` + `.env.local` |
| 🟡 MEDIA | Agregar timestamps a Categoria | `Categoria.js` |
| 🟡 MEDIA | Eliminar función duplicada `fetchDashboardData` | `api.js` |
| 🟢 BAJA | Limpiar lógica redundante de || 0 | `transactionController.js` |

