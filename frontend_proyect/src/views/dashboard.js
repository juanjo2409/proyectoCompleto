// Vista de Dashboard - Nivel Estudiante (Funciones y Plantillas directas)
import { formatearMoneda, formatearFecha, obtenerColorBadge } from '../utils';

export function mostrarDashboard(state) {
  const container = document.getElementById('view-content');
  if (!container) return;

  const { totalIncome, totalExpenses, netBalance } = state.summary;
  const isNegative = netBalance < 0;

  // Presupuesto mensual
  const budgetLimit = state.settings.monthlyBudgetLimit;
  const percentGastado = budgetLimit > 0 ? Math.min((totalExpenses / budgetLimit) * 100, 100) : 0;

  let colorBarra = 'bg-emerald-500';
  if (percentGastado > 90) {
    colorBarra = 'bg-rose-500';
  } else if (percentGastado > 70) {
    colorBarra = 'bg-amber-500';
  }

  // Filtrar los últimos 4 movimientos más recientes
  const ultimasTransacciones = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Generar filas para las transacciones recientes
  let filasHtml = '';
  if (ultimasTransacciones.length > 0) {
    filasHtml = ultimasTransacciones.map(tx => {
      const esIngreso = tx.type === 'income';
      const colorMonto = esIngreso ? 'text-emerald-600' : 'text-slate-900 dark:text-white';
      const signo = esIngreso ? '+' : '-';
      const badgeClase = obtenerColorBadge(tx.category);

      return `
        <div class="flex items-center justify-between p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 border-b border-slate-100 dark:border-slate-850/60 transition-colors rounded-xl">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-8 h-8 rounded-full flex items-center justify-center ${
              esIngreso 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
            }">
              ${esIngreso 
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>'
                : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>'
              }
            </span>
            <div class="min-w-0">
              <p class="text-sm font-semibold truncate max-w-[140px] sm:max-w-xs">${tx.description}</p>
              <p class="text-xs text-slate-500">${formatearFecha(tx.date)}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-bold ${colorMonto}">${signo}${formatearMoneda(tx.amount, state.summary.currency)}</p>
            <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeClase} font-medium">
              ${tx.category}
            </span>
          </div>
        </div>
      `;
    }).join('');
  } else {
    filasHtml = `
      <div class="text-center py-8 text-slate-500">
        <p class="text-xs">No hay movimientos registrados.</p>
        <button onclick="navegarA('transactions')" class="btn-secondary text-xs mt-3 mx-auto px-4 py-2">
          Registrar mi primer movimiento
        </button>
      </div>
    `;
  }

  // Recomendación prioritaria rápida
  const consejoPrioritario = state.recommendations.find(r => r.type === 'danger' || r.type === 'warning') || state.recommendations[0];
  let alertaHtml = '';

  if (consejoPrioritario) {
    const esPeligro = consejoPrioritario.type === 'danger';
    const esAlerta = consejoPrioritario.type === 'warning';
    
    let colorTarjeta = 'bg-sky-50/50 border-sky-100 text-sky-850 dark:bg-sky-950/10 dark:border-sky-900/30 dark:text-sky-300';
    let colorIcono = 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400';
    if (esPeligro) {
      colorTarjeta = 'bg-rose-50/50 border-rose-100 text-rose-850 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-300';
      colorIcono = 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400';
    } else if (esAlerta) {
      colorTarjeta = 'bg-amber-50/50 border-amber-100 text-amber-850 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-300';
      colorIcono = 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400';
    }

    alertaHtml = `
      <div class="p-4 rounded-xl border ${colorTarjeta} flex items-start gap-3">
        <span class="p-1 rounded-lg ${colorIcono}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Alerta de Ahorro</h4>
          <h5 class="text-sm font-semibold mt-0.5">${consejoPrioritario.title}</h5>
          <p class="text-xs text-slate-600 dark:text-slate-350 mt-1">${consejoPrioritario.message}</p>
          <p onclick="navegarA('recommendations')" class="text-xs font-medium underline mt-1.5 cursor-pointer hover:text-primary-650">Ver todas las recomendaciones &rarr;</p>
        </div>
      </div>
    `;
  } else {
    alertaHtml = `
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 py-6">
        <p class="text-xs">¡Buen trabajo! No tienes alertas financieras pendientes.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Cabecera -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Panel Financiero</h1>
      <p class="text-sm text-slate-500">Resumen rápido de tus transacciones este mes.</p>
    </div>

    <!-- Tarjetas de Balance -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Ingresos -->
      <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Ingresos Totales</span>
          <span class="p-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </span>
        </div>
        <h2 class="text-2xl font-black text-emerald-600">${formatearMoneda(totalIncome, state.summary.currency)}</h2>
        <p class="text-xs text-slate-500 mt-2">Total de dinero recibido</p>
      </div>

      <!-- Gastos -->
      <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Gastos Totales</span>
          <span class="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
          </span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">${formatearMoneda(totalExpenses, state.summary.currency)}</h2>
        <p class="text-xs text-slate-500 mt-2">Total de egresos acumulados</p>
      </div>

      <!-- Balance Neto -->
      <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group border-primary-200 dark:border-primary-900/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Balance Neto</span>
          <span class="p-1.5 bg-primary-100 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </span>
        </div>
        <h2 class="text-2xl font-black ${isNegative ? 'text-rose-600' : 'text-primary-600 dark:text-primary-400'}">${formatearMoneda(netBalance, state.summary.currency)}</h2>
        <p class="text-xs text-slate-500 mt-2">Diferencia neta disponible</p>
      </div>

    </div>

    <!-- Fila Grid Inferior -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Límite de Presupuesto y Alerta -->
      <div class="lg:col-span-1 space-y-6 flex flex-col justify-between">
        <!-- Control de Presupuesto -->
        <div class="p-6 rounded-2xl glass-panel space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Presupuesto Mensual</h3>
            <button onclick="navegarA('settings')" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">Ajustar</button>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-medium">
              <span class="text-slate-500">Gastos: ${formatearMoneda(totalExpenses, state.summary.currency)}</span>
              <span class="text-slate-700 dark:text-slate-350">Límite: ${formatearMoneda(budgetLimit, state.summary.currency)}</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ${colorBarra}" style="width: ${percentGastado}%"></div>
            </div>
            <p class="text-[10px] text-slate-500 leading-normal">
              Has consumido el <strong>${percentGastado.toFixed(0)}%</strong> de tu presupuesto fijado para gastos.
            </p>
          </div>
        </div>

        <!-- Alerta Dinámica -->
        <div class="flex-1 mt-6 lg:mt-0 flex flex-col justify-end">
          ${alertaHtml}
        </div>
      </div>

      <!-- Movimientos Recientes -->
      <div class="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
              <p class="text-[11px] text-slate-500">Tus transacciones más recientes.</p>
            </div>
            <button onclick="navegarA('transactions')" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">Ver todos &rarr;</button>
          </div>

          <div class="space-y-1">
            ${filasHtml}
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
          <span class="text-[10px] text-slate-500">Registros totales: ${state.transactions.length}</span>
          <button onclick="navegarA('reports')" class="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            Ver reportes mensuales
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

    </div>
  `;
}
