// Vista de Reportes y Gráficos Estadísticos - Nivel Estudiante (Chart.js Funcional)
import { Chart } from 'chart.js/auto';
import { state } from '../state/state';
import { formatearMoneda, formatearFecha } from '../utils';

// Variables locales del módulo para filtros de fecha
let anioSeleccionado = new Date().getFullYear();
let mesSeleccionado = new Date().getMonth() + 1;

// Guardar las instancias de Chart.js para destruirlas al recargar
let listaGraficos = [];

window.cambiarPeriodoReporte = function(idSelector, valor) {
  if (idSelector === 'report-year') {
    anioSeleccionado = parseInt(valor, 10);
  }
  if (idSelector === 'report-month') {
    mesSeleccionado = parseInt(valor, 10);
  }

  // Volver a renderizar llamando a la función principal pasándole el estado guardado
  destruirGraficosActivos();
  mostrarReportes(state);
};

function destruirGraficosActivos() {
  for (let i = 0; i < listaGraficos.length; i++) {
    if (listaGraficos[i] && typeof listaGraficos[i].destroy === 'function') {
      listaGraficos[i].destroy();
    }
  }
  listaGraficos = [];
}

export function mostrarReportes(state) {
  const container = document.getElementById('view-content');
  if (!container) return;

  const transactions = state.transactions;
  const esOscuro = document.documentElement.classList.contains('dark');
  const colorTexto = esOscuro ? '#94a3b8' : '#64748b';
  const colorRejilla = esOscuro ? '#334155' : '#f1f5f9';

  // Obtener la lista única de años disponibles en las transacciones para el select
  let listaAnios = [];
  for (let i = 0; i < transactions.length; i++) {
    const a = new Date(transactions[i].date).getFullYear();
    if (!listaAnios.includes(a)) {
      listaAnios.push(a);
    }
  }
  if (listaAnios.length === 0) {
    listaAnios.push(new Date().getFullYear());
  }
  listaAnios.sort((a, b) => b - a);

  // Meses en español
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // --- 1. PROCESAR DATOS: Ingresos vs Gastos Mensuales del Año ---
  const ingresosMensuales = Array(12).fill(0);
  const gastosMensuales = Array(12).fill(0);

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    const fecha = new Date(tx.date);
    if (fecha.getFullYear() === anioSeleccionado) {
      const mesIndex = fecha.getMonth(); // 0-11
      if (tx.type === 'income') {
        ingresosMensuales[mesIndex] += tx.amount;
      } else {
        gastosMensuales[mesIndex] += tx.amount;
      }
    }
  }

  // --- 2. PROCESAR DATOS: Distribución por Categoría en el Mes Seleccionado ---
  const totalesCategorias = {};
  let totalGastadoEnMes = 0;

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    const fecha = new Date(tx.date);
    if (fecha.getFullYear() === anioSeleccionado && (fecha.getMonth() + 1) === mesSeleccionado) {
      if (tx.type === 'expense') {
        totalesCategorias[tx.category] = (totalesCategorias[tx.category] || 0) + tx.amount;
        totalGastadoEnMes += tx.amount;
      }
    }
  }

  const donaEtiquetas = Object.keys(totalesCategorias);
  const donaDatos = Object.values(totalesCategorias);

  // --- 3. PROCESAR DATOS: Evolución de Saldo Histórico ---
  const txsOrdenadas = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const historicoEtiquetas = [];
  const historicoDatos = [];
  let saldoAcumulado = 0;

  for (let i = 0; i < txsOrdenadas.length; i++) {
    const tx = txsOrdenadas[i];
    if (tx.type === 'income') {
      saldoAcumulado += tx.amount;
    } else {
      saldoAcumulado -= tx.amount;
    }
    historicoEtiquetas.push(formatearFecha(tx.date));
    historicoDatos.push(saldoAcumulado);
  }

  // Destruir gráficos previos por seguridad antes de renderizar nuevos lienzos canvas
  destruirGraficosActivos();

  container.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reportes y Estadísticas</h1>
        <p class="text-sm text-slate-500">Visualiza el flujo de tu dinero mediante gráficos interactivos.</p>
      </div>
      
      <!-- Selectores de Fecha -->
      <div class="flex gap-3 self-start md:self-auto">
        <div>
          <select id="report-month" onchange="cambiarPeriodoReporte('report-month', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 focus:outline-none">
            ${nombresMeses.map((m, idx) => `<option value="${idx + 1}" ${mesSeleccionado === (idx + 1) ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>
        
        <div>
          <select id="report-year" onchange="cambiarPeriodoReporte('report-year', this.value)" class="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 focus:outline-none">
            ${listaAnios.map(y => `<option value="${y}" ${anioSeleccionado === y ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- Grid de Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Gráfico 1: Comparativo Ingresos vs Gastos -->
      <div class="p-6 rounded-2xl glass-panel space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Ingresos vs Gastos (${anioSeleccionado})</h3>
          <p class="text-[11px] text-slate-500 font-medium">Comparativa mensual del año seleccionado.</p>
        </div>
        <div class="relative w-full h-[280px]">
          <canvas id="canvas-barras"></canvas>
        </div>
      </div>

      <!-- Gráfico 2: Distribución por Categorías -->
      <div class="p-6 rounded-2xl glass-panel space-y-4">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Gastos del Mes</h3>
            <span class="text-xs font-bold text-slate-700 bg-slate-50 border dark:bg-slate-900 dark:border-slate-850 px-2.5 py-0.5 rounded-full">
              Total: ${formatearMoneda(totalGastadoEnMes, state.summary.currency)}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium">Distribución por categoría en ${nombresMeses[mesSeleccionado - 1]}.</p>
        </div>
        <div class="relative w-full h-[280px] flex items-center justify-center">
          ${donaDatos.length > 0 
            ? `<canvas id="canvas-dona"></canvas>` 
            : `<p class="text-xs text-slate-550 py-12">No hay gastos en este mes.</p>`
          }
        </div>
      </div>

      <!-- Gráfico 3: Histórico de Saldo -->
      <div class="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Evolución de Saldo Neto Acumulado</h3>
          <p class="text-[11px] text-slate-500 font-medium">Evolución histórica total de tu balance.</p>
        </div>
        <div class="relative w-full h-[300px]">
          ${historicoDatos.length > 0
            ? `<canvas id="canvas-linea"></canvas>`
            : `<p class="text-xs text-slate-555 text-center py-16">Registra transacciones para ver la evolución.</p>`
          }
        </div>
      </div>

    </div>
  `;

  // Renderizar gráficos mediante Chart.js
  setTimeout(() => {
    inicializarGraficos(
      ingresosMensuales, gastosMensuales, nombresMeses,
      donaEtiquetas, donaDatos,
      historicoEtiquetas, historicoDatos,
      colorTexto, colorRejilla
    );
  }, 50);
}

function inicializarGraficos(
  ingresosMensuales, gastosMensuales, nombresMeses,
  donaEtiquetas, donaDatos,
  historicoEtiquetas, historicoDatos,
  colorTexto, colorRejilla
) {
  // 1. Gráfico de Barras
  const elBarras = document.getElementById('canvas-barras');
  if (elBarras) {
    const chart = new Chart(elBarras, {
      type: 'bar',
      data: {
        labels: nombresMeses,
        datasets: [
          { label: 'Ingresos', data: ingresosMensuales, backgroundColor: '#10b981', borderRadius: 5, maxBarThickness: 12 },
          { label: 'Gastos', data: gastosMensuales, backgroundColor: '#f43f5e', borderRadius: 5, maxBarThickness: 12 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: colorTexto, font: { family: 'Outfit', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } },
          y: { grid: { color: colorRejilla }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } }
        }
      }
    });
    listaGraficos.push(chart);
  }

  // 2. Gráfico de Dona
  const elDona = document.getElementById('canvas-dona');
  if (elDona && donaDatos.length > 0) {
    const chart = new Chart(elDona, {
      type: 'doughnut',
      data: {
        labels: donaEtiquetas,
        datasets: [{
          data: donaDatos,
          backgroundColor: ['#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#6366f1', '#94a3b8'],
          borderWidth: 2,
          borderColor: document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: colorTexto, font: { family: 'Outfit', size: 11 } } }
        },
        cutout: '60%'
      }
    });
    listaGraficos.push(chart);
  }

  // 3. Gráfico de Línea
  const elLinea = document.getElementById('canvas-linea');
  if (elLinea && historicoDatos.length > 0) {
    const chart = new Chart(elLinea, {
      type: 'line',
      data: {
        labels: historicoEtiquetas,
        datasets: [{
          label: 'Saldo Acumulado',
          data: historicoDatos,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.04)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#8b5cf6',
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } },
          y: { grid: { color: colorRejilla }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } }
        }
      }
    });
    listaGraficos.push(chart);
  }
}
export { destruirGraficosActivos };
