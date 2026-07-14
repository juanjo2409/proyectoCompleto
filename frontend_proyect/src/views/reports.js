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
  const colorRejilla = esOscuro ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)';

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
  const txsOrdenadas = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt));
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
    <div class="animate-fade-in-up space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Reportes y Estadísticas</h1>
          <p class="text-xs text-slate-500">Visualiza el flujo de tu dinero mediante gráficos interactivos.</p>
        </div>
        
        <!-- Selectores de Fecha -->
        <div class="flex gap-2.5 self-start md:self-auto">
          <div>
            <select id="report-month" onchange="cambiarPeriodoReporte('report-month', this.value)" class="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-750 dark:text-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer">
              ${nombresMeses.map((m, idx) => `<option value="${idx + 1}" ${mesSeleccionado === (idx + 1) ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          
          <div>
            <select id="report-year" onchange="cambiarPeriodoReporte('report-year', this.value)" class="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-750 dark:text-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer">
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
            <p class="text-[10px] text-slate-500 font-medium">Comparativa mensual del año seleccionado.</p>
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
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg">
                Total: ${formatearMoneda(totalGastadoEnMes, state.summary.currency)}
              </span>
            </div>
            <p class="text-[10px] text-slate-500 font-medium">Distribución por categoría en ${nombresMeses[mesSeleccionado - 1]}.</p>
          </div>
          <div class="relative w-full h-[280px] flex items-center justify-center">
            ${donaDatos.length > 0 
              ? `<canvas id="canvas-dona"></canvas>` 
              : `<p class="text-xs text-slate-500 py-12">No hay gastos registrados en este mes.</p>`
            }
          </div>
        </div>

        <!-- Gráfico 3: Histórico de Saldo -->
        <div class="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Evolución de Saldo Neto Acumulado</h3>
            <p class="text-[10px] text-slate-500 font-medium">Evolución histórica total de tu balance.</p>
          </div>
          <div class="relative w-full h-[300px]">
            ${historicoDatos.length > 0
              ? `<canvas id="canvas-linea"></canvas>`
              : `<p class="text-xs text-slate-500 text-center py-16">Registra transacciones para ver la evolución.</p>`
            }
          </div>
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
  const esOscuro = document.documentElement.classList.contains('dark');
  const tooltipStyle = {
    backgroundColor: esOscuro ? '#0f172a' : '#ffffff',
    titleColor: esOscuro ? '#ffffff' : '#0f172a',
    bodyColor: esOscuro ? '#94a3b8' : '#475569',
    borderColor: esOscuro ? '#334155' : '#e2e8f0',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 12,
    titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
    bodyFont: { family: 'Outfit', size: 12 },
    displayColors: true
  };

  // 1. Gráfico de Barras
  const elBarras = document.getElementById('canvas-barras');
  if (elBarras) {
    const chart = new Chart(elBarras, {
      type: 'bar',
      data: {
        labels: nombresMeses,
        datasets: [
          { label: 'Ingresos', data: ingresosMensuales, backgroundColor: '#10b981', borderRadius: 4, maxBarThickness: 10 },
          { label: 'Gastos', data: gastosMensuales, backgroundColor: '#f43f5e', borderRadius: 4, maxBarThickness: 10 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: colorTexto, font: { family: 'Outfit', size: 11, weight: '600' } } },
          tooltip: tooltipStyle
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } },
          y: { 
            grid: { color: colorRejilla, borderDash: [5, 5] }, 
            ticks: { color: colorTexto, font: { family: 'Outfit', size: 10 } } 
          }
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
          backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#fb923c', '#eab308', '#10b981', '#3b82f6'],
          borderWidth: 2.5,
          borderColor: esOscuro ? '#020617' : '#ffffff',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'right', 
            labels: { 
              color: colorTexto, 
              font: { family: 'Outfit', size: 10.5, weight: '600' },
              padding: 12
            } 
          },
          tooltip: tooltipStyle
        },
        cutout: '68%'
      }
    });
    listaGraficos.push(chart);
  }

  // 3. Gráfico de Línea
  const elLinea = document.getElementById('canvas-linea');
  if (elLinea && historicoDatos.length > 0) {
    const ctx = elLinea.getContext('2d');
    
    // Crear gradiente de fondo premium
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.005)');

    const chart = new Chart(elLinea, {
      type: 'line',
      data: {
        labels: historicoEtiquetas,
        datasets: [{
          label: 'Saldo Acumulado',
          data: historicoDatos,
          borderColor: '#6366f1',
          backgroundColor: gradient,
          borderWidth: 3.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#6366f1',
          pointHoverBackgroundColor: '#4f46e5',
          pointBorderColor: esOscuro ? '#020617' : '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 3.5,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: tooltipStyle
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colorTexto, font: { family: 'Outfit', size: 9.5 } } },
          y: { 
            grid: { color: colorRejilla, borderDash: [5, 5] }, 
            ticks: { color: colorTexto, font: { family: 'Outfit', size: 9.5 } } 
          }
        }
      }
    });
    listaGraficos.push(chart);
  }
}
export { destruirGraficosActivos };
