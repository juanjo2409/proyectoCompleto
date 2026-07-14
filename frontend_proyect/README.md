# FinanzaFlow - Frontend de Juan

Este repositorio contiene la versión del frontend desarrollada por **Juan** en **JavaScript vanilla** con **Vite**, **Tailwind CSS** y **Chart.js**.

## Lo que implementó Juan

- Estructura básica de la SPA con navegación de pestañas.
- Sidebar, navbar y cambio de tema claro/oscuro.
- Página de **Dashboard** con resumen de ingresos, gastos, balance y transacciones recientes.
- Página de **Movimientos** con:
  - registro de nuevos movimientos
  - edición de movimientos existentes
  - eliminación de movimientos
  - filtros por tipo, categoría y búsqueda por descripción
- Página de **Reportes** con gráficos de barras, dona y línea usando Chart.js.
- Página de **Recomendaciones** con reglas simples de ahorro y un simulador de interés compuesto.
- Página de **Configuración** con:
  - límite de presupuesto mensual
  - categorías personalizables
  - selección entre mock local y backend real
  - URL del servidor backend
- Capa de API mock que usa `localStorage` y simula llamadas de red.
- Manejo de estado global simple en `src/state/state.js`.

## Archivos importantes hechos por Juan

- `src/main.js`
- `src/api.js`
- `src/state/state.js`
- `src/utils.js`
- `src/views/dashboard.js`
- `src/views/transactions.js`
- `src/views/reports.js`
- `src/views/recommendations.js`
- `src/views/settings.js`

## Cómo ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

3. Abrir `http://localhost:5173` en el navegador.

## Qué no está implementado en este repositorio

Este repositorio NO contiene el código real del backend del compañero. Solo se documenta qué debe hacer el backend para integrarse con el frontend.

- Ver `FRONTEND_TASKS.md` para las tareas específicas de Juan.
- Ver `BACKEND_TASKS.md` para los detalles del backend del compañero.
- Ver `SPRINT_PLAN.md` para la división de responsabilidades por sprint.
