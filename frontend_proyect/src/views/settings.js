// Vista de Configuración - Nivel Estudiante (Funciones de Gestión Directa)
import { state, guardarConfiguracion } from '../state/state';
import { mostrarNotificacion } from '../utils';

window.guardarPresupuestoLimite = function(e) {
  e.preventDefault();
  const inputVal = document.getElementById('set-budget-limit').value;
  const limite = parseFloat(inputVal);

  if (isNaN(limite) || limite <= 0) {
    alert("Por favor, ingresa un monto válido de presupuesto.");
    return;
  }

  guardarConfiguracion(limite, undefined);
  mostrarNotificacion("Límite de presupuesto guardado correctamente.");
};

window.guardarIntegracionBackend = function(e) {
  e.preventDefault();
  const modo = document.getElementById('api-mode').value;
  const url = document.getElementById('api-url').value.trim();

  if (modo === 'false' && !url) {
    alert("Por favor, introduce la URL base de la API del backend.");
    return;
  }

  localStorage.setItem('finance_use_mock_api', modo);
  localStorage.setItem('finance_api_url', url);

  mostrarNotificacion("Configuración de API guardada. Recargando...");
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

window.agregarNuevaCategoria = function(e) {
  e.preventDefault();
  const tipo = document.getElementById('cat-type').value;
  const nombre = document.getElementById('cat-name').value.trim();

  if (nombre.length < 3) {
    alert("El nombre de la categoría debe tener al menos 3 caracteres.");
    return;
  }

  const copiaCategorias = { ...state.settings.categories };
  if (copiaCategorias[tipo].includes(nombre)) {
    alert("Esta categoría ya existe.");
    return;
  }

  copiaCategorias[tipo].push(nombre);
  guardarConfiguracion(undefined, copiaCategorias);
  
  document.getElementById('cat-name').value = '';
  mostrarNotificacion(`Categoría "${nombre}" agregada.`);
};

window.borrarCategoriaExistente = function(tipo, nombre) {
  if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`)) {
    const copiaCategorias = { ...state.settings.categories };
    copiaCategorias[tipo] = copiaCategorias[tipo].filter(c => c !== nombre);
    
    guardarConfiguracion(undefined, copiaCategorias);
    mostrarNotificacion(`Categoría "${nombre}" eliminada.`);
  }
};

window.limpiarBaseDatos = function() {
  if (confirm("¿Estás seguro de que deseas eliminar TODOS los movimientos y restablecer los valores de fábrica?")) {
    localStorage.removeItem('finance_transactions');
    localStorage.removeItem('finance_budget_limit');
    localStorage.removeItem('finance_categories');
    localStorage.removeItem('finance_use_mock_api');
    localStorage.removeItem('finance_api_url');
    
    mostrarNotificacion("Datos eliminados. Restableciendo...");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  }
};

export function mostrarConfiguracion(stateData) {
  const container = document.getElementById('view-content');
  if (!container) return;

  const budgetLimit = stateData.settings.monthlyBudgetLimit;
  const categories = stateData.settings.categories;
  
  const usarMock = localStorage.getItem('finance_use_mock_api') !== 'false';
  const urlApi = localStorage.getItem('finance_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  container.innerHTML = `
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración</h1>
      <p class="text-sm text-slate-500">Parámetros del sistema y herramientas de conexión para el backend.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Columna Izquierda: Ajustes de Presupuesto y API -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Presupuesto -->
        <div class="p-6 rounded-2xl glass-panel space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Límite de Gasto Mensual</h3>
          <form onsubmit="guardarPresupuestoLimite(event)" class="space-y-4">
            <div>
              <label class="form-label-custom text-xs">Monto Límite ($)</label>
              <input type="number" id="set-budget-limit" class="form-input-custom text-sm" value="${budgetLimit}">
            </div>
            <button type="submit" class="btn-primary w-full text-xs py-2">
              Guardar Límite
            </button>
          </form>
        </div>

        <!-- Conexión Backend -->
        <div class="p-6 rounded-2xl glass-panel border border-violet-100 dark:border-violet-950/60 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            🔌
            Conexión con Backend
          </h3>
          <p class="text-[11px] text-slate-500 leading-normal">
            Cambia a modo de datos real para conectarte a los servicios que desarrolle el equipo del backend.
          </p>
          <form onsubmit="guardarIntegracionBackend(event)" class="space-y-4">
            <div>
              <label class="form-label-custom text-xs">Origen de Datos</label>
              <select id="api-mode" class="form-input-custom text-xs py-2">
                <option value="true" ${usarMock ? 'selected' : ''}>Mock LocalStorage (Simulado)</option>
                <option value="false" ${!usarMock ? 'selected' : ''}>API REST Backend (Real)</option>
              </select>
            </div>
            <div>
              <label class="form-label-custom text-xs">URL del Servidor Backend</label>
              <input type="text" id="api-url" class="form-input-custom text-xs py-2" placeholder="http://localhost:8080/api" value="${urlApi}">
            </div>
            <button type="submit" class="btn-secondary w-full text-xs py-2 font-semibold">
              Guardar Conexión
            </button>
          </form>
        </div>

        <!-- Botón Peligroso -->
        <div class="p-6 rounded-2xl glass-panel space-y-3">
          <h3 class="text-sm font-bold text-rose-600">Restaurar Todo</h3>
          <p class="text-[11px] text-slate-500">Elimina el historial y vuelve a la base de datos simulada original.</p>
          <button onclick="limpiarBaseDatos()" class="btn-danger w-full text-xs py-2">
            Restablecer Datos de Fábrica
          </button>
        </div>

      </div>

      <!-- Columna Derecha: Categorías -->
      <div class="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-6">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Categorías de Transacción</h3>
          <p class="text-[11px] text-slate-500">Personaliza las categorías que utilizas para organizar tus ingresos y gastos.</p>
        </div>

        <!-- Formulario Agregar Categoría -->
        <form onsubmit="agregarNuevaCategoria(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
          <div>
            <label class="text-[10px] font-semibold text-slate-500 block mb-1">Tipo</label>
            <select id="cat-type" class="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2">
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>
          
          <div class="sm:col-span-2 flex items-end gap-3">
            <div class="flex-1">
              <label class="text-[10px] font-semibold text-slate-500 block mb-1">Nombre Categoría</label>
              <input type="text" id="cat-name" class="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2" placeholder="Ej. Regalos, Gym">
            </div>
            <button type="submit" class="btn-primary text-xs py-2 px-4 h-[34px]">Añadir</button>
          </div>
        </form>

        <!-- Listados -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Ingresos -->
          <div>
            <h4 class="text-xs font-bold text-emerald-600 mb-3 border-b border-emerald-500/10 pb-1.5 uppercase tracking-wider">Ingresos</h4>
            <div class="flex flex-wrap gap-2">
              ${categories.income.map(c => {
                const esFijo = c === 'Salary' || c === 'Freelance' || c === 'Other';
                return `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300">
                    ${c}
                    ${!esFijo 
                      ? `<button onclick="borrarCategoriaExistente('income', '${c}')" class="hover:text-rose-500 transition-colors pointer-events-auto">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>` 
                      : ''
                    }
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Gastos -->
          <div>
            <h4 class="text-xs font-bold text-rose-600 mb-3 border-b border-rose-500/10 pb-1.5 uppercase tracking-wider">Gastos</h4>
            <div class="flex flex-wrap gap-2">
              ${categories.expense.map(c => {
                const esFijo = c === 'Rent' || c === 'Food' || c === 'Transport' || c === 'Other';
                return `
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300">
                    ${c}
                    ${!esFijo 
                      ? `<button onclick="borrarCategoriaExistente('expense', '${c}')" class="hover:text-rose-500 transition-colors pointer-events-auto">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>` 
                      : ''
                    }
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}
