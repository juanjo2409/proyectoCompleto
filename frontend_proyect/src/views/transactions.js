// Vista de Movimientos (Ingresos y Gastos) - Nivel Estudiante (Funciones Simples)
import { state, registrarMovimiento, editarMovimiento, eliminarMovimiento } from '../state/state';
import { formatearMoneda, formatearFecha, obtenerColorBadge, mostrarNotificacion } from '../utils';

// Variables locales para filtros y búsquedas
let busqueda = '';
let filtroTipo = 'all';
let filtroCategoria = 'all';
let ordenarPor = 'date-desc';

// ID del movimiento que se está editando (null si es nuevo registro)
let idEdicion = null;

// Registrar manejadores globales en window para facilitar onclick/onsubmit en el HTML renderizado
window.cambiarFiltro = function(idInput, valor) {
  if (idInput === 'filter-search') busqueda = valor;
  if (idInput === 'filter-type') filtroTipo = valor;
  if (idInput === 'filter-category') filtroCategoria = valor;
  if (idInput === 'filter-sort') ordenarPor = valor;
  
  filtrarYRenderizarLista();
};

window.abrirModalNuevo = function() {
  idEdicion = null;
  renderizarModal(null);
};

window.abrirModalEditar = function(id) {
  idEdicion = id;
  const tx = state.transactions.find(t => t.id === id);
  if (tx) {
    renderizarModal(tx);
  }
};

window.cerrarModal = function() {
  const modal = document.getElementById('tx-modal');
  if (modal) modal.remove();
};

window.confirmarEliminar = async function(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
    await eliminarMovimiento(id);
    mostrarNotificacion("Movimiento eliminado correctamente.");
  }
};

window.guardarMovimiento = async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const tipo = form.elements['tx-type'].value;
  const amount = parseFloat(form.elements['tx-amount'].value);
  const category = form.elements['tx-category'].value;
  const date = form.elements['tx-date'].value;
  const description = form.elements['tx-description'].value.trim();

  // Validaciones básicas
  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, ingresa un monto mayor a cero.");
    return;
  }
  if (!category) {
    alert("Por favor, selecciona una categoría.");
    return;
  }
  if (!date) {
    alert("Por favor, selecciona una fecha válida.");
    return;
  }
  if (description.length < 3) {
    alert("La descripción debe tener al menos 3 caracteres.");
    return;
  }

  const datosTx = { type: tipo, amount, category, date, description };

  try {
    if (idEdicion) {
      await editarMovimiento(idEdicion, datosTx);
      mostrarNotificacion("Movimiento actualizado correctamente.");
    } else {
      await registrarMovimiento(datosTx);
      mostrarNotificacion("Movimiento registrado correctamente.");
    }
    window.cerrarModal();
  } catch (err) {
    alert("Ocurrió un error al guardar: " + err.message);
  }
};

window.cambiarModalCategorias = function() {
  const form = document.getElementById('tx-form');
  if (!form) return;
  const tipo = form.querySelector('input[name="tx-type"]:checked').value;
  const select = form.querySelector('#tx-category');
  
  const grupoIngresos = select.querySelector('.income-opt-group');
  const grupoGastos = select.querySelector('.expense-opt-group');

  if (tipo === 'income') {
    grupoIngresos.disabled = false;
    grupoGastos.disabled = true;
    if (grupoGastos.querySelector(`option[value="${select.value}"]`)) {
      select.value = "";
    }
  } else {
    grupoIngresos.disabled = true;
    grupoGastos.disabled = false;
    if (grupoIngresos.querySelector(`option[value="${select.value}"]`)) {
      select.value = "";
    }
  }
};

// Generar el modal HTML de forma dinámica en el DOM con animación y blur
function renderizarModal(tx = null) {
  const isEdit = tx !== null;
  const titulo = isEdit ? 'Editar Movimiento' : 'Registrar Nuevo Movimiento';
  const categorias = state.settings.categories;

  // Eliminar modal previo por seguridad
  const previo = document.getElementById('tx-modal');
  if (previo) previo.remove();

  const modalHtml = `
    <div id="tx-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onclick="cerrarModal()" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"></div>
      
      <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-up z-10 flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">${titulo}</h3>
          <button onclick="cerrarModal()" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form id="tx-form" onsubmit="guardarMovimiento(event)" class="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label class="form-label-custom">Tipo de Movimiento</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer hover:bg-emerald-50 hover:border-emerald-250 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-900/40 transition-all font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <input type="radio" name="tx-type" value="income" onchange="cambiarModalCategorias()" class="mr-2 text-primary-650 focus:ring-primary-500 cursor-pointer" ${!isEdit || tx.type === 'income' ? 'checked' : ''}>
                Ingreso
              </label>
              <label class="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer hover:bg-rose-50 hover:border-rose-250 dark:hover:bg-rose-950/20 dark:hover:border-rose-900/40 transition-all font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <input type="radio" name="tx-type" value="expense" onchange="cambiarModalCategorias()" class="mr-2 text-primary-650 focus:ring-primary-500 cursor-pointer" ${isEdit && tx.type === 'expense' ? 'checked' : ''}>
                Gasto
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="tx-amount" class="form-label-custom">Monto ($)</label>
              <input type="number" id="tx-amount" name="tx-amount" step="0.01" min="0.01" class="form-input-custom" placeholder="0.00" value="${isEdit ? tx.amount : ''}" required>
            </div>
            
            <div>
              <label for="tx-date" class="form-label-custom">Fecha</label>
              <input type="date" id="tx-date" name="tx-date" class="form-input-custom" value="${isEdit ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0]}" required>
            </div>
          </div>

          <div>
            <label for="tx-category" class="form-label-custom">Categoría</label>
            <select id="tx-category" name="tx-category" class="form-input-custom cursor-pointer" required>
              <option value="" disabled selected>Selecciona una opción</option>
              <optgroup label="Ingresos" class="income-opt-group">
                ${categorias.income.map(c => `<option value="${c}" ${isEdit && tx.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </optgroup>
              <optgroup label="Gastos" class="expense-opt-group">
                ${categorias.expense.map(c => `<option value="${c}" ${isEdit && tx.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </optgroup>
            </select>
          </div>

          <div>
            <label for="tx-description" class="form-label-custom">Descripción</label>
            <input type="text" id="tx-description" name="tx-description" class="form-input-custom" placeholder="Ej. Pago de nómina, Restaurante" value="${isEdit ? tx.description : ''}" required>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button type="button" onclick="cerrarModal()" class="btn-secondary text-xs">Cancelar</button>
            <button type="submit" class="btn-primary text-xs">
              ${isEdit ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window.cambiarModalCategorias(); // Ajustar el select inicial
}

// Filtra y renderiza la lista de transacciones usando un layout grid responsive premium (cards en mobile, tabla estructurada en desktop)
function filtrarYRenderizarLista() {
  const listContainer = document.getElementById('transactions-list-container');
  if (!listContainer) return;

  if (state.isLoading) {
    listContainer.innerHTML = `
      <div class="divide-y divide-slate-100 dark:divide-slate-800/60">
        ${Array(4).fill(0).map(() => `
          <div class="px-6 py-5 flex items-center justify-between skeleton animate-pulse h-16 rounded-xl my-1"></div>
        `).join('')}
      </div>
    `;
    return;
  }

  // Filtrar
  let filtradas = [...state.transactions];

  if (filtroTipo !== 'all') {
    filtradas = filtradas.filter(t => t.type === filtroTipo);
  }
  if (filtroCategoria !== 'all') {
    filtradas = filtradas.filter(t => t.category === filtroCategoria);
  }
  if (busqueda.trim() !== '') {
    const q = busqueda.toLowerCase();
    filtradas = filtradas.filter(t => t.description.toLowerCase().includes(q));
  }

  // Ordenar robustamente
  if (ordenarPor === 'date-desc') {
    filtradas.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
  } else if (ordenarPor === 'date-asc') {
    filtradas.sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt));
  } else if (ordenarPor === 'amount-desc') {
    filtradas.sort((a, b) => b.amount - a.amount);
  } else if (ordenarPor === 'amount-asc') {
    filtradas.sort((a, b) => a.amount - b.amount);
  }

  if (filtradas.length === 0) {
    listContainer.innerHTML = `
      <div class="px-6 py-14 text-center flex flex-col items-center justify-center space-y-3">
        <span class="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-650 rounded-2xl">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2.472M21 16v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m18 0H3"/></svg>
        </span>
        <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">No se encontraron movimientos</h3>
        <p class="text-xs text-slate-500">Ajusta los filtros de búsqueda o registra un nuevo movimiento.</p>
      </div>
    `;
    return;
  }

  const filasHtml = filtradas.map(tx => {
    const esIngreso = tx.type === 'income';
    const signo = esIngreso ? '+' : '-';
    const colorMonto = esIngreso ? 'text-emerald-650 dark:text-emerald-400' : 'text-slate-900 dark:text-white';
    const badgeClase = obtenerColorBadge(tx.category);
    const icono = esIngreso
      ? `<span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg></span>`
      : `<span class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-455 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg></span>`;

    return `
      <!-- Fila de cuadrícula flexible (Grid en desktop, stacked en mobile) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all duration-200 rounded-lg hover:translate-x-0.5">
        
        <!-- Detalle (col-span-5) -->
        <div class="col-span-1 md:col-span-5 flex items-center gap-3 min-w-0">
          ${icono}
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-850 dark:text-slate-200 truncate capitalize">${tx.description || 'Sin descripción'}</p>
            <p class="text-[10px] text-slate-455 font-medium">${formatearFecha(tx.date)}</p>
          </div>
        </div>
        
        <!-- Categoría (col-span-3) -->
        <div class="col-span-1 md:col-span-3 flex md:block items-center justify-between md:justify-start">
          <span class="md:hidden text-[10px] text-slate-400 uppercase font-semibold">Categoría:</span>
          <span class="px-2.5 py-0.5 rounded-lg border text-[10px] uppercase font-bold tracking-wider ${badgeClase}">
            ${tx.category}
          </span>
        </div>
        
        <!-- Monto (col-span-2) -->
        <div class="col-span-1 md:col-span-2 flex md:block items-center justify-between md:justify-end text-left md:text-right">
          <span class="md:hidden text-[10px] text-slate-400 uppercase font-semibold">Monto:</span>
          <p class="text-sm font-bold ${colorMonto}">${signo}${formatearMoneda(tx.amount, state.summary.currency)}</p>
        </div>
        
        <!-- Acciones (col-span-2) -->
        <div class="col-span-1 md:col-span-2 flex justify-end gap-1.5 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-dashed border-slate-100 dark:border-slate-800/40 md:border-none">
          <button onclick="abrirModalEditar('${tx.id}')" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Editar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button onclick="confirmarEliminar('${tx.id}')" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-600 transition-colors cursor-pointer" title="Eliminar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  listContainer.innerHTML = `
    <!-- Header de tabla oculto en móviles -->
    <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-55/30 dark:bg-slate-900/30 text-slate-500 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800/80">
      <div class="col-span-5">Detalle</div>
      <div class="col-span-3">Categoría</div>
      <div class="col-span-2 text-right">Monto</div>
      <div class="col-span-2 text-right">Acciones</div>
    </div>
    
    <!-- Filas / Lista -->
    <div class="divide-y divide-slate-100 dark:divide-slate-800/40 bg-white dark:bg-slate-950/40">
      ${filasHtml}
    </div>
  `;
}

export function mostrarMovimientos(stateData) {
  const container = document.getElementById('view-content');
  if (!container) return;

  const categorias = stateData.settings.categories;

  container.innerHTML = `
    <div class="animate-fade-in-up space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Gestión de Movimientos</h1>
          <p class="text-xs text-slate-500">Registra y administra tus ingresos y gastos.</p>
        </div>
        
        <button onclick="abrirModalNuevo()" class="btn-primary self-start md:self-auto text-xs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Registrar Movimiento
        </button>
      </div>

      <!-- Barra de Filtros -->
      <div class="p-5 rounded-2xl glass-panel space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filtros y Búsqueda</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-450 block mb-1">Buscar por descripción</label>
            <input type="text" id="filter-search" oninput="cambiarFiltro('filter-search', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-white transition-all" placeholder="Ej. Nómina" value="${busqueda}">
          </div>

          <!-- Tipo -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-455 block mb-1">Tipo</label>
            <select id="filter-type" onchange="cambiarFiltro('filter-type', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-white transition-all cursor-pointer">
              <option value="all" ${filtroTipo === 'all' ? 'selected' : ''}>Todos</option>
              <option value="income" ${filtroTipo === 'income' ? 'selected' : ''}>Ingresos</option>
              <option value="expense" ${filtroTipo === 'expense' ? 'selected' : ''}>Gastos</option>
            </select>
          </div>

          <!-- Categoría -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-455 block mb-1">Categoría</label>
            <select id="filter-category" onchange="cambiarFiltro('filter-category', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-white transition-all cursor-pointer">
              <option value="all">Todas</option>
              <optgroup label="Ingresos">
                ${categorias.income.map(c => `<option value="${c}" ${filtroCategoria === c ? 'selected' : ''}>${c}</option>`).join('')}
              </optgroup>
              <optgroup label="Gastos">
                ${categorias.expense.map(c => `<option value="${c}" ${filtroCategoria === c ? 'selected' : ''}>${c}</option>`).join('')}
              </optgroup>
            </select>
          </div>

          <!-- Ordenar por -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-455 block mb-1">Ordenar por</label>
            <select id="filter-sort" onchange="cambiarFiltro('filter-sort', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-white transition-all cursor-pointer">
              <option value="date-desc" ${ordenarPor === 'date-desc' ? 'selected' : ''}>Fecha (Más reciente)</option>
              <option value="date-asc" ${ordenarPor === 'date-asc' ? 'selected' : ''}>Fecha (Más antiguo)</option>
              <option value="amount-desc" ${ordenarPor === 'amount-desc' ? 'selected' : ''}>Monto (Mayor primero)</option>
              <option value="amount-asc" ${ordenarPor === 'amount-asc' ? 'selected' : ''}>Monto (Menor primero)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contenedor de la Tabla -->
      <div id="transactions-list-container" class="glass-panel rounded-2xl overflow-hidden">
        <!-- Se insertará la lista dinámicamente -->
      </div>
    </div>
  `;

  filtrarYRenderizarLista();
}
