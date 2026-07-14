# FinanzaFlow: Gestión de Finanzas Personales

FinanzaFlow es una aplicación de Single Page Application (SPA) para la administración y control de finanzas personales. Su arquitectura cuenta con un frontend moderno y dinámico (Vite + Tailwind CSS + Chart.js) y un backend robusto de alto rendimiento (FastAPI + PostgreSQL).

---

## 🚀 Inicio Rápido (Cómo Ejecutar el Proyecto)

### Requisitos Previos
* **Python 3.11+**
* **Node.js 18+** y **npm**
* **PostgreSQL 16** (activo en el puerto `5433` con contraseña `postgres`)

---

### 1. Configurar y Ejecutar el Backend

El servidor de la API se ejecuta con FastAPI y almacena los datos de forma persistente en PostgreSQL.

1. Navega al directorio del backend:
   ```bash
   cd app-backend
   ```

2. Verifica las variables de entorno en el archivo `.env`:
   ```ini
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=app_db
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5433
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/app_db
   ```

3. Ejecuta las migraciones de base de datos para crear las tablas necesarias:
   ```bash
   python3 -m alembic upgrade head
   ```

4. Genera el usuario administrador de prueba por defecto:
   ```bash
   python3 seed_admin.py
   ```

5. Levanta el servidor FastAPI en el puerto `8001`:
   ```bash
   python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001
   ```

El backend estará disponible en: [http://localhost:8001](http://localhost:8001)  
Puedes explorar la documentación interactiva en: [http://localhost:8001/docs](http://localhost:8001/docs)

---

### 2. Configurar y Ejecutar el Frontend

El cliente web es una SPA construida con Vite, estilizada con componentes premium de Tailwind CSS y visualizaciones de Chart.js.

1. Navega al directorio del frontend:
   ```bash
   cd ../frontend_proyect
   ```

2. Instala los paquetes y dependencias del proyecto:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

El cliente web estará disponible en tu navegador en: [http://localhost:5173/](http://localhost:5173/)

---

## 🔑 Credenciales por Defecto (Administrador)
Puedes entrar a la interfaz web para probar la base de datos real con las siguientes credenciales:
* **Usuario**: `admin`
* **Contraseña**: `admin123`
