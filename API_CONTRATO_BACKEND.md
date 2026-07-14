# CONTRATO DE API — FinanzaFlow
## Para el equipo de Backend

---

## Configuración General

- **URL Base:** `http://localhost:8001/api/v1`
- **CORS:** debe permitir `http://localhost:5173` y `http://localhost:5174`
- **Autenticación:** Bearer Token en el header `Authorization: Bearer <token>`
- **Errores:** siempre en formato `{ "detail": "mensaje de error" }`
- **Si el servidor responde 401:** el frontend cierra sesión automáticamente

---

## Endpoints de Autenticación

### POST /auth/login
- **Content-Type:** `application/x-www-form-urlencoded`
- **Body:** `username=juanjo&password=1234`
- **Respuesta 200:**
```json
{
  "access_token": "eyJhbGciOi...",
  "user": { "username": "juanjo" }
}
```

### POST /auth/register
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "username": "juanjo",
  "password": "1234"
}
```
- **Respuesta 201:**
```json
{
  "access_token": "eyJhbGciOi...",
  "user": { "username": "juanjo" }
}
```

---

## Endpoints de Transacciones (requieren Bearer Token)

### GET /transactions
- **Respuesta 200:** array con todas las transacciones del usuario
```json
[
  {
    "id": "abc123",
    "type": "income",
    "amount": 2800.00,
    "category": "Salary",
    "date": "2026-07-01",
    "description": "Salario mensual",
    "createdAt": "2026-07-01T08:00:00Z"
  }
]
```

### POST /transactions
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "type": "income",
  "amount": 150.00,
  "category": "Freelance",
  "date": "2026-07-14",
  "description": "Proyecto web"
}
```
- **Respuesta 201:** misma transacción con `id` y `createdAt` generados
```json
{
  "id": "abc123",
  "type": "income",
  "amount": 150.00,
  "category": "Freelance",
  "date": "2026-07-14",
  "description": "Proyecto web",
  "createdAt": "2026-07-14T10:00:00Z"
}
```

### PUT /transactions/{id}
- **Content-Type:** `application/json`
- **Body:** campos a actualizar
```json
{
  "type": "expense",
  "amount": 200.00,
  "category": "Food",
  "date": "2026-07-14",
  "description": "Mercado"
}
```
- **Respuesta 200:** transacción completa actualizada

### DELETE /transactions/{id}
- **Respuesta 200:** cualquier JSON de confirmación
```json
{ "message": "deleted" }
```

---

## Modelo de Transacción

| Campo | Tipo | Valores posibles |
|---|---|---|
| `id` | string | generado por el backend |
| `type` | string | `"income"` o `"expense"` |
| `amount` | float | número positivo ej. `150.00` |
| `category` | string | ver categorías abajo |
| `date` | string | formato `"YYYY-MM-DD"` |
| `description` | string | texto libre |
| `createdAt` | string | ISO 8601 ej. `"2026-07-14T10:00:00Z"` |

### Categorías usadas en el frontend
- **Ingresos (income):** Salary, Freelance, Investments, Other
- **Gastos (expense):** Rent, Food, Transport, Entertainment, Utilities, Other

---

## Cómo conectar el frontend al backend

Una vez que el backend esté corriendo en `localhost:8001`:

1. Abrir la app FinanzaFlow en el navegador
2. Ir a **Configuración** en el menú lateral
3. En la sección **"Conexión con Backend"**:
   - Cambiar **Origen de datos** a `API REST Backend (Real)`
   - Verificar que la **URL** sea `http://localhost:8001/api/v1`
4. Clic en **Guardar Conexión**
5. La página se recarga y ya usa el backend real

---

## Resumen rápido de endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | /auth/login | No | Iniciar sesión |
| POST | /auth/register | No | Registrar usuario |
| GET | /transactions | Si | Listar transacciones |
| POST | /transactions | Si | Crear transacción |
| PUT | /transactions/{id} | Si | Editar transacción |
| DELETE | /transactions/{id} | Si | Eliminar transacción |
