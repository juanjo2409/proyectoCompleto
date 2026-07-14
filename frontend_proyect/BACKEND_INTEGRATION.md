# Guía de Integración para el Equipo del Backend - FinanzaFlow

¡Hola, equipo de backend! 

Este proyecto contiene el frontend completo de **FinanzaFlow**, la SPA de gestión de finanzas personales. Está desarrollado en **JavaScript Vanilla , Vite, Tailwind CSS v4 y Chart.js.

Para facilitar la integración, toda la lógica de conexión e interactividad está encapsulada en una **Capa de API** única en la raíz de la carpeta de código. A continuación, les explicamos cómo funciona y qué endpoints deben implementar en su servidor.

---

## 1. Configuración de Variables de Entorno y Origen de Datos

En la raíz del proyecto encontrarán un archivo de configuración de entorno `.env` con las siguientes variables:

```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK_API=true
```

- **`VITE_USE_MOCK_API`**:
  - `true` (por defecto): La aplicación funciona de forma local simulando llamadas de red asíncronas con retardo (350ms) usando `LocalStorage`.
  - `false`: La aplicación comenzará a realizar peticiones HTTP `fetch` reales a la URL base de su servidor.
- **`VITE_API_URL`**:
  - URL base de su servidor backend (ej. `http://localhost:8080/api`).

> **Nota:** En la pestaña **Configuración** de la aplicación, existe un panel visual para alternar de forma interactiva entre el modo simulado y real, e introducir la URL base de su backend en tiempo de ejecución sin necesidad de recompilar el proyecto.

---

## 2. Contratos de Datos y Endpoints a Implementar

Todas las comunicaciones se realizan en formato JSON. Deben implementar los siguientes endpoints REST:

### 2.1. Obtener Transacciones
*   **Método:** `GET`
*   **Ruta:** `/transactions`
*   **Respuesta Exitosa (200 OK):** Un array de objetos con el listado de transacciones.
*   **Formato de Objeto:**
    ```json
    [
      {
        "id": "tx-a1b2c3d4",
        "type": "income" | "expense",
        "amount": 2800.00,
        "category": "Salary",
        "date": "2026-07-01",
        "description": "Salario mensual",
        "createdAt": "2026-07-01T08:00:00Z"
      }
    ]
    ```

### 2.2. Registrar Transacción
*   **Método:** `POST`
*   **Ruta:** `/transactions`
*   **Cuerpo de la Petición:**
    ```json
    {
      "type": "expense",
      "amount": 185.50,
      "category": "Food",
      "date": "2026-07-05",
      "description": "Supermercado semanal"
    }
    ```
*   **Respuesta Exitosa (201 Created):** Objeto de la transacción con su ID asignado en base de datos y fecha de creación.
    ```json
    {
      "id": "tx-uuid-asignado",
      "type": "expense",
      "amount": 185.50,
      "category": "Food",
      "date": "2026-07-05",
      "description": "Supermercado semanal",
      "createdAt": "2026-07-13T17:26:47Z"
    }
    ```

### 2.3. Actualizar Transacción
*   **Método:** `PUT`
*   **Ruta:** `/transactions/:id`
*   **Cuerpo de la Petición:**
    ```json
    {
      "type": "expense",
      "amount": 200.00,
      "category": "Food",
      "date": "2026-07-05",
      "description": "Supermercado semanal (ajustado)"
    }
    ```
*   **Respuesta Exitosa (200 OK):** Objeto transacción actualizado.

### 2.4. Eliminar Transacción
*   **Método:** `DELETE`
*   **Ruta:** `/transactions/:id`
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true
    }
    ```

---

## 3. Configuración de CORS en el Servidor (Importante)

El servidor de desarrollo del frontend se ejecuta en `http://localhost:5173`. Para que el navegador acepte las peticiones, deben habilitar **CORS** en su backend.

*   **Node.js (Express):**
    ```javascript
    const cors = require('cors');
    app.use(cors({ origin: 'http://localhost:5173' }));
    ```
*   **Spring Boot (Java):**
    ```java
    @CrossOrigin(origins = "http://localhost:5173")
    ```
*   **Python (FastAPI):**
    ```python
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```

---

## 4. Estructura de Archivos del Frontend

*   `src/main.js`: Define el enrutador funcional y dibuja los layouts del Sidebar y Navbar en el HTML.
*   `src/api.js`: Lógica de peticiones HTTP fetch / simulador mock.
*   `src/state/state.js`: Mantiene el estado global dinámico de movimientos y presupuesto.
*   `src/utils.js`: Formateadores de fecha, moneda y notificaciones en pantalla.
*   `src/views/`: Contiene las plantillas de HTML dinámico y manejadores onclick de cada pestaña.
