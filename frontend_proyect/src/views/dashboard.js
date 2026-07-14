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

  // Color de la barra/anillo circular
  let colorClaseAnillo = 'text-emerald-500 dark:text-emerald-450';
  if (percentGastado > 90) {
    colorClaseAnillo = 'text-rose-500 dark:text-rose-450';
  } else if (percentGastado > 70) {
    colorClaseAnillo = 'text-amber-500 dark:text-amber-450';
  }

  // Filtrar los últimos 4 movimientos más recientes, ordenamiento robusto
  const ultimasTransacciones = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
    .slice(0, 4);

  // Generar filas para las transacciones recientes
  let filasHtml = '';
  if (ultimasTransacciones.length > 0) {
    filasHtml = ultimasTransacciones.map(tx => {
      const esIngreso = tx.type === 'income';
      const colorMonto = esIngreso ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white';
      const signo = esIngreso ? '+' : '-';
      const badgeClase = obtenerColorBadge(tx.category);

      return `
        <div class="flex items-center justify-between p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 border-b border-slate-100 dark:border-slate-850/30 transition-all duration-200 rounded-xl hover:translate-x-0.5">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              esIngreso 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }">
              ${esIngreso 
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>'
                : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>'
              }
            </span>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-850 dark:text-slate-200 truncate max-w-[130px] sm:max-w-xs capitalize">${tx.description || 'Sin descripción'}</p>
              <p class="text-[10px] text-slate-455 font-medium">${formatearFecha(tx.date)}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 flex flex-col items-end gap-1">
            <p class="text-sm font-bold ${colorMonto}">${signo}${formatearMoneda(tx.amount, state.summary.currency)}</p>
            <span class="text-[9px] px-2 py-0.5 rounded-lg border ${badgeClase} font-semibold uppercase tracking-wider">
              ${tx.category}
            </span>
          </div>
        </div>
      `;
    }).join('');
  } else {
    filasHtml = `
      <div class="text-center py-10 text-slate-500 space-y-3">
        <p class="text-xs">No hay movimientos registrados.</p>
        <button onclick="navegarA('transactions')" class="px-4 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
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
    
    let colorTarjeta = 'bg-sky-500/5 border-sky-500/20 text-sky-900 dark:text-sky-350';
    let colorIcono = 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
    if (esPeligro) {
      colorTarjeta = 'bg-rose-500/5 border-rose-500/20 text-rose-900 dark:text-rose-350';
      colorIcono = 'bg-rose-500/10 text-rose-600 dark:text-rose-450';
    } else if (esAlerta) {
      colorTarjeta = 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-350';
      colorIcono = 'bg-amber-500/10 text-amber-600 dark:text-amber-450';
    }

    alertaHtml = `
      <div class="p-4 rounded-2xl border ${colorTarjeta} flex items-start gap-3.5">
        <span class="p-2 rounded-xl flex-shrink-0 ${colorIcono}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <div class="min-w-0 flex-1">
          <h4 class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450">Notificación Financiera</h4>
          <h5 class="text-xs font-bold mt-1 text-slate-900 dark:text-white leading-snug">${consejoPrioritario.title}</h5>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">${consejoPrioritario.message}</p>
          <span onclick="navegarA('recommendations')" class="inline-block text-[11px] font-semibold text-primary-600 dark:text-primary-400 underline mt-2 cursor-pointer hover:text-indigo-600">Ver todas las recomendaciones &rarr;</span>
        </div>
      </div>
    `;
  } else {
    alertaHtml = `
      <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 text-center text-slate-500 py-8">
        <svg class="w-8 h-8 text-emerald-500/70 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-xs font-medium">¡Excelente salud financiera! No tienes alertas pendientes.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="animate-fade-in-up space-y-6">
      <!-- Cabecera -->
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Panel Financiero</h1>
        <p class="text-xs text-slate-500">Resumen rápido de tus transacciones este mes.</p>
      </div>

      <!-- Tarjetas de Balance -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Ingresos -->
        <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between">
            <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </span>
            <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Ingresos</span>
          </div>
          <h2 class="text-3xl font-black text-emerald-650 dark:text-emerald-400 tracking-tight mt-4">${formatearMoneda(totalIncome, state.summary.currency)}</h2>
          <p class="text-[10px] text-slate-500 dark:text-slate-450 mt-2 font-medium">Total de dinero ingresado</p>
        </div>

        <!-- Gastos -->
        <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 bg-rose-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between">
            <span class="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-455">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
            </span>
            <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Gastos</span>
          </div>
          <h2 class="text-3xl font-black text-rose-650 dark:text-rose-400 tracking-tight mt-4">${formatearMoneda(totalExpenses, state.summary.currency)}</h2>
          <p class="text-[10px] text-slate-500 dark:text-slate-450 mt-2 font-medium">Gastos acumulados este periodo</p>
        </div>

        <!-- Balance Neto -->
        <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
          <div class="absolute -right-3 -top-3 w-16 h-16 ${isNegative ? 'bg-rose-500/10' : 'bg-primary-500/10'} rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between">
            <span class="p-2.5 rounded-xl ${isNegative ? 'bg-rose-500/10 text-rose-600' : 'bg-primary-500/10 text-primary-600 dark:text-primary-400'}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </span>
            <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Balance Neto</span>
          </div>
          <h2 class="text-3xl font-black tracking-tight mt-4 ${isNegative ? 'text-rose-650 dark:text-rose-400' : 'text-primary-650 dark:text-primary-400'}">${formatearMoneda(netBalance, state.summary.currency)}</h2>
          <p class="text-[10px] text-slate-500 dark:text-slate-450 mt-2 font-medium">Saldo disponible a favor</p>
        </div>

      </div>

      <!-- Grid de Contenido (2 Columnas en desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Izquierda: Estado de Presupuesto y Alertas -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Límite de Gasto -->
          <div class="p-6 rounded-2xl glass-panel space-y-4">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Límite de Presupuesto</h3>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-black text-slate-950 dark:text-white">${percentGastado.toFixed(0)}%</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Gastado de tu límite</span>
              </div>
              <div class="relative w-14 h-14 flex items-center justify-center">
                <!-- SVG circular progress -->
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="currentColor" stroke-width="4.5" fill="transparent" class="text-slate-100 dark:text-slate-900" />
                  <circle cx="28" cy="28" r="23" stroke="currentColor" stroke-width="4.5" fill="transparent"
                          stroke-dasharray="144.5"
                          stroke-dashoffset="${144.5 - (percentGastado / 100) * 144.5}"
                          stroke-linecap="round"
                          class="${colorClaseAnillo} transition-all duration-500" />
                </svg>
                <span class="absolute text-[8px] font-bold text-slate-500">
                  ${percentGastado.toFixed(0)}%
                </span>
              </div>
            </div>

            <!-- Barra de Progreso lineal secundaria -->
            <div class="space-y-1">
              <div class="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div class="bg-primary-600 dark:bg-primary-500 h-full rounded-full transition-all duration-500" style="width: ${percentGastado}%"></div>
              </div>
              <div class="w-full flex items-center justify-between text-xs font-semibold border-t border-slate-100 dark:border-slate-850/30 pt-3 text-slate-650 dark:text-slate-350">
                <span>Límite: ${formatearMoneda(budgetLimit, state.summary.currency)}</span>
                <span>Usado: ${formatearMoneda(totalExpenses, state.summary.currency)}</span>
              </div>
            </div>
          </div>

          <!-- Alertas -->
          <div class="space-y-3.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Recomendación Crítica</h3>
            ${alertaHtml}
          </div>

        </div>

        <!-- Derecha: Movimientos Recientes -->
        <div class="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/30 pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Movimientos Recientes</h3>
                <p class="text-[10px] text-slate-500 font-medium">Tus últimos 4 movimientos registrados.</p>
              </div>
              <button onclick="navegarA('transactions')" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                Ver todos
              </button>
            </div>

            <div class="space-y-1">
              ${filasHtml}
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850/30 flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total registros: ${state.transactions.length}</span>
            <button onclick="navegarA('reports')" class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-650 dark:hover:text-primary-400 flex items-center gap-1">
              Ver reportes y gráficos
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
