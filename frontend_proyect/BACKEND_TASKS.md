# Tareas del Backend (Compañero)

Este archivo documenta las tareas y requisitos que debe implementar el compañero en el backend. Juan ya desarrolló el frontend en JavaScript vanilla, y el backend debe integrarse con esa solución.

## Requisitos generales del backend

- Soportar JSON en las solicitudes y respuestas.
- Habilitar CORS para `http://localhost:5173`.
- Aceptar peticiones desde el frontend de Vite.
- Responder con datos de transacciones y fechas `createdAt`.

## Endpoints requeridos

### 1. Obtener transacciones
- Método: `GET`
- Ruta: `/transactions`
- Retorna: arreglo de objetos de transacciones.
- Ejemplo de respuesta:
```json
[
  {
    "id": "tx-a1b2c3d4",
    "type": "income",
    "amount": 2800.00,
    "category": "Salary",
    "date": "2026-07-01",
    "description": "Salario mensual",
    "createdAt": "2026-07-01T08:00:00Z"
  }
]
```

### 2. Crear transacción
- Método: `POST`
- Ruta: `/transactions`
- Cuerpo: JSON con `type`, `amount`, `category`, `date`, `description`
- Respuesta: objeto de la transacción creada con `id` y `createdAt`.

### 3. Actualizar transacción
- Método: `PUT`
- Ruta: `/transactions/:id`
- Cuerpo: JSON con los campos actualizados.
- Respuesta: objeto de la transacción actualizada.

### 4. Eliminar transacción
- Método: `DELETE`
- Ruta: `/transactions/:id`
- Respuesta: `{ "success": true }`.

## Tareas del compañero según sprint

### Sprint 1
- Diseñar la interfaz principal del backend (estructura de rutas y respuestas).
- Crear rutas de `GET /transactions` y `POST /transactions`.
- Asegurar que el backend responde con JSON.

### Sprint 2
- Crear rutas de `PUT /transactions/:id` y `DELETE /transactions/:id`.
- Probar la integración con el frontend en modo real.
- Ajustar respuestas para que coincidan con la estructura esperada por el frontend.

### Sprint 3
- Verificar CORS y compatibilidad con `http://localhost:5173`.
- Realizar pruebas funcionales y corregir errores de integración.
- Documentar el backend para el equipo.

## Notas importantes

- El backend del compañero no debe modificar el frontend de Juan.
- El frontend ya está implementado en el repositorio; el backend solo debe integrarse con él.
- Toda la explicación de las tareas del compañero queda documentada en este archivo.
