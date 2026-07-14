# Faltantes en el Frontend - FinanzaFlow

Este documento resume las tareas pendientes del frontend que corresponden a Juan.

## Resumen rápido
Aquí están las áreas que aún requieren trabajo, con prioridad y estimación de tiempo.

- **Responsive (móvil/tablet)**: revisar y corregir estilos, puntos de quiebre y disposición. Prioridad: Alta. Estimado: 2–4 h.

- **Validaciones y UX de formularios**: mensajes de error claros, prevención de envío inválido y enfoque accesible. Prioridad: Alta. Estimado: 1–2 h.

- **Manejo de errores (API y UI)**: capturar errores de red en `src/api.js`, mostrar notificaciones amigables y estados de fallo. Prioridad: Alta. Estimado: 1–2 h.

- **Integración con backend real**: probar `GET/POST/PUT/DELETE /transactions` y ajustar `apiUrl` si hace falta; documentar cualquier discrepancia en contratos JSON. Prioridad: Alta. Estimado: 2–4 h.

- **Tests unitarios (state y api)**: añadir pruebas básicas para `src/state/state.js` y `src/api.js` (sana cobertura de lógica). Prioridad: Media. Estimado: 3–6 h.

- **Tests E2E (flujos críticos)**: pruebas de registro/edición/eliminación de movimientos con Cypress o similar. Prioridad: Media. Estimado: 4–8 h.

- **CI (build + tests)**: configurar GitHub Actions para build y ejecución de tests en cada push/PR. Prioridad: Media. Estimado: 2–3 h.

- **Accesibilidad (WCAG)**: revisar contrastes, roles ARIA y navegación con teclado. Prioridad: Media. Estimado: 2–4 h.

- **Lint/Format (ESLint + Prettier)**: configurar y aplicar formato consistente al código. Prioridad: Baja. Estimado: 1–2 h.

- **Optimización de gráficos y rendimiento**: reducir re-render, manejar destrucción de Chart.js y optimizar datasets grandes. Prioridad: Baja. Estimado: 1–3 h.

- **Build y despliegue**: crear scripts y configuración para desplegar en Netlify/Vercel. Prioridad: Baja. Estimado: 1–2 h.

- **Documentación técnica y manual de usuario**: completar instrucciones, funcionamiento y despliegue. Prioridad: Baja. Estimado: 1–2 h.
x   
## Siguientes pasos recomendados
1. Priorizar las tareas críticas: `Responsive`, `Validaciones`, `Manejo de errores` e `Integración con backend`.
2. Elegir una tarea a la vez y abrir PRs pequeños para revisión.
3. Tras completar las críticas, añadir tests y CI.

Si quieres, empiezo por la tarea: **Revisar y corregir responsive (móvil/tablet)** y hago los cambios necesarios en `src/styles` y vistas.
