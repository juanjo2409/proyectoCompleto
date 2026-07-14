# Plan de Desarrollo Frontend - FinanzaFlow

## Proyecto

SPA de Gestión de Finanzas Personales

## Descripción del proyecto

Se desarrollará una Single Page Application (SPA) que permitirá a los usuarios administrar sus finanzas personales mediante el registro de ingresos y gastos, la generación de balances mensuales y anuales, la visualización de estadísticas y la obtención de recomendaciones básicas de ahorro e inversión. La aplicación será desarrollada utilizando JavaScript, HTML5 y Tailwind CSS.

## Tecnologías

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6+)
- Vite
- Chart.js
- LocalStorage
- Git y GitHub

## Objetivo general

Desarrollar una aplicación web SPA que permita gestionar las finanzas personales mediante el registro de ingresos y gastos, mostrando balances, reportes y estadísticas para apoyar la toma de decisiones financieras.

## Objetivos específicos

- Registrar ingresos y gastos.
- Calcular automáticamente el balance financiero.
- Mostrar reportes mensuales y anuales.
- Visualizar estadísticas mediante gráficas.
- Generar recomendaciones básicas de ahorro e inversión.
- Diseñar una interfaz moderna, intuitiva y adaptable a dispositivos móviles.

## Ingeniería de Requerimientos

### Requerimientos funcionales

- RF-01: Registrar ingresos.
- RF-02: Registrar gastos.
- RF-03: Editar y eliminar movimientos financieros.
- RF-04: Calcular automáticamente el saldo disponible.
- RF-05: Mostrar balances mensuales.
- RF-06: Mostrar balances anuales.
- RF-07: Visualizar gráficas de ingresos y gastos.
- RF-08: Mostrar recomendaciones financieras.
- RF-09: Almacenar la información utilizando LocalStorage.

### Requerimientos no funcionales

- RNF-01: La aplicación debe ser responsive.
- RNF-02: Debe tener una interfaz intuitiva.
- RNF-03: El tiempo de respuesta debe ser menor a dos segundos.
- RNF-04: El código debe estar organizado y modular.
- RNF-05: Debe ser compatible con los principales navegadores.

## Historias de Usuario

- HU-01: Como usuario quiero registrar mis ingresos para llevar el control del dinero que recibo.
- HU-02: Como usuario quiero registrar mis gastos para conocer en qué utilizo mi dinero.
- HU-03: Como usuario quiero visualizar mi balance para saber cuánto dinero tengo disponible.
- HU-04: Como usuario quiero consultar reportes mensuales y anuales para analizar mis finanzas.
- HU-05: Como usuario quiero recibir recomendaciones de ahorro para mejorar mi situación financiera.

## Análisis del Frontend

### Módulos del sistema

- Dashboard
- Registro de ingresos
- Registro de gastos
- Reportes
- Estadísticas
- Recomendaciones
- Configuración

### Componentes principales

- Barra de navegación
- Menú lateral
- Tarjetas de resumen financiero
- Formularios de registro
- Tabla de movimientos
- Gráficas estadísticas
- Panel de recomendaciones

## Metodología Scrum

### Roles

- Product Owner: Compañero.
- Scrum Master y Desarrollador Frontend: Juan.

### Sprint 1

**Objetivo**

Construir la estructura inicial de la aplicación y desarrollar el módulo de registro de ingresos y gastos.

**Tareas de Juan**

- Configurar el proyecto con Vite.
- Configurar Tailwind CSS.
- Crear la estructura de carpetas.
- Implementar LocalStorage para guardar datos de forma local.
- Configurar GitHub y el control de versiones.

**Tareas del compañero**

- Diseñar la interfaz principal.
- Crear Navbar.
- Crear Sidebar.
- Crear formulario de ingresos.
- Crear formulario de gastos.

### Sprint 2

**Objetivo**

Desarrollar el Dashboard y el sistema de cálculos financieros.

**Tareas de Juan**

- Programar el cálculo del balance.
- Programar los reportes mensuales.
- Programar los reportes anuales.
- Integrar Chart.js para gráficas.

**Tareas del compañero**

- Diseñar el Dashboard.
- Crear tarjetas informativas.
- Diseñar tablas.
- Implementar diseño responsive.

### Sprint 3

**Objetivo**

Finalizar la aplicación y realizar pruebas.

**Tareas de Juan**

- Programar recomendaciones financieras.
- Optimizar el rendimiento.
- Corregir errores.

**Tareas del compañero**

- Mejorar la experiencia de usuario.
- Realizar pruebas funcionales.
- Ajustar el diseño final.
- Elaborar la documentación.

## Product Backlog

- Registro de ingresos (Alta prioridad)
- Registro de gastos (Alta prioridad)
- Balance automático (Alta prioridad)
- Dashboard financiero (Media prioridad)
- Reportes mensuales (Media prioridad)
- Reportes anuales (Media prioridad)
- Gráficas estadísticas (Media prioridad)
- Recomendaciones financieras (Baja prioridad)

## Entregables

- Código fuente en GitHub.
- Aplicación desplegada.
- Documentación técnica.
- Manual de usuario.
- Presentación del proyecto.

## Notas importantes

Este plan se centra en el desarrollo frontend de Juan. Las tareas del compañero se dejan documentadas en `BACKEND_TASKS.md` y en este archivo como actividades de colaboración.
