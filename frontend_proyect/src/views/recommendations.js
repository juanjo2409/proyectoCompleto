// Vista de Recomendaciones y Simulador - Nivel Estudiante (Ahorro Funcional)
import { formatearMoneda, obtenerEstilosAlerta } from '../utils';

window.calcularInteresCompuesto = function() {
  const principalEl = document.getElementById('sim-principal');
  const mensualEl = document.getElementById('sim-monthly');
  const tasaEl = document.getElementById('sim-rate');
  const aniosEl = document.getElementById('sim-years');

  if (!principalEl || !mensualEl || !tasaEl || !aniosEl) return;

  const P = parseFloat(principalEl.value) || 0; // Capital Inicial
  const PMT = parseFloat(mensualEl.value) || 0; // Aportación Mensual
  const tasaAnual = (parseFloat(tasaEl.value) || 0) / 100; // Interés Anual
  const t = parseFloat(aniosEl.value) || 0; // Años

  const r = tasaAnual / 12; // Interés Mensual
  const n = t * 12; // Total Meses

  let totalAcumulado = 0;
  let capitalInvertido = P + (PMT * n);

  if (r === 0) {
    totalAcumulado = P + (PMT * n);
  } else {
    // Fórmula matemática de interés compuesto con aportaciones
    const capitalCompuesto = P * Math.pow(1 + r, n);
    const aportacionCompuesta = PMT * ((Math.pow(1 + r, n) - 1) / r);
    totalAcumulado = capitalCompuesto + aportacionCompuesta;
  }

  const interesGanado = Math.max(0, totalAcumulado - capitalInvertido);

  // Actualizar DOM de salida
  document.getElementById('res-total').textContent = formatearMoneda(totalAcumulado);
  document.getElementById('res-invested').textContent = formatearMoneda(capitalInvertido);
  document.getElementById('res-interest').textContent = formatearMoneda(interesGanado);

  // Actualizar barra visual
  const barAportado = document.getElementById('bar-invested');
  const barIntereses = document.getElementById('bar-interest');
  if (barAportado && barIntereses && totalAcumulado > 0) {
    const pctAportado = (capitalInvertido / totalAcumulado) * 100;
    const pctInteres = (interesGanado / totalAcumulado) * 100;
    barAportado.style.width = `${pctAportado}%`;
    barIntereses.style.width = `${pctInteres}%`;
    
    barAportado.textContent = `Aportado (${pctAportado.toFixed(0)}%)`;
    barIntereses.textContent = `Intereses (${pctInteres.toFixed(0)}%)`;
  }
};

export function mostrarRecomendaciones(state) {
  const container = document.getElementById('view-content');
  if (!container) return;

  const recommendations = state.recommendations;
  
  // Calcular puntaje de salud financiera
  const { totalIncome, totalExpenses } = state.summary;
  let puntaje = 100;
  let estadoSalud = "Excelente";
  let claseColorGlow = "from-emerald-500 to-teal-500 text-emerald-600 dark:text-emerald-400";
  let stopColor1 = "#10b981";
  let stopColor2 = "#059669";

  if (totalIncome > 0) {
    const ratioGasto = totalExpenses / totalIncome;
    if (ratioGasto > 1.0) {
      puntaje = 30;
      estadoSalud = "Crítico (Déficit)";
      claseColorGlow = "from-rose-500 to-red-650 text-rose-600 dark:text-rose-400";
      stopColor1 = "#f43f5e";
      stopColor2 = "#be123c";
    } else if (ratioGasto > 0.8) {
      puntaje = 55;
      estadoSalud = "Afectado (Gasto elevado)";
      claseColorGlow = "from-amber-500 to-orange-550 text-amber-600 dark:text-amber-400";
      stopColor1 = "#f59e0b";
      stopColor2 = "#d97706";
    } else if (ratioGasto > 0.6) {
      puntaje = 75;
      estadoSalud = "Estable";
      claseColorGlow = "from-indigo-500 to-primary-500 text-indigo-600 dark:text-primary-400";
      stopColor1 = "#6366f1";
      stopColor2 = "#4f46e5";
    }
  } else {
    puntaje = 0;
    estadoSalud = "Faltan Movimientos";
    claseColorGlow = "from-slate-400 to-slate-500 text-slate-500 dark:text-slate-400";
    stopColor1 = "#94a3b8";
    stopColor2 = "#64748b";
  }

  // Generar tarjetas de recomendación HTML
  let recsHtml = '';
  if (recommendations.length > 0) {
    recsHtml = recommendations.map(rec => {
      const estilos = obtenerEstilosAlerta(rec.type);
      
      // Icono correspondiente al nivel
      let svgIcon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      if (rec.type === 'danger') {
        svgIcon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
      } else if (rec.type === 'warning') {
        svgIcon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
      }

      return `
        <div class="p-5 rounded-2xl border ${estilos.border} ${estilos.bg} flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5">
          <span class="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex-shrink-0 ${estilos.icon}">
            ${svgIcon}
          </span>
          <div class="space-y-1.5 flex-1 min-w-0">
            <h3 class="text-sm font-bold ${estilos.text}">${rec.title}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${rec.message}</p>
            <div class="mt-2.5 p-3.5 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Acción Recomendada:
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-normal">${rec.actionableTip}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    recsHtml = `
      <div class="p-6 rounded-2xl border border-slate-250 dark:border-slate-800/60 text-center text-slate-550">
        <p class="text-xs">No hay recomendaciones disponibles por el momento.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="animate-fade-in-up space-y-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ahorro y Recomendaciones</h1>
        <p class="text-xs text-slate-500">Consejos automatizados para gestionar eficientemente tus recursos.</p>
      </div>

      <!-- Panel Superior -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Calificación -->
        <div class="lg:col-span-1 p-6 rounded-2xl glass-panel flex flex-col items-center justify-center text-center space-y-4">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Salud Financiera</h3>
            <p class="text-[10px] text-slate-400">Score de gastos en relación a ingresos</p>
          </div>
          
          <!-- SVG Gauge Circular -->
          <div class="relative w-28 h-28 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="45" stroke="currentColor" stroke-width="7.5" fill="transparent" class="text-slate-100 dark:text-slate-900" />
              <circle cx="56" cy="56" r="45" stroke="url(#health-grad)" stroke-width="7.5" fill="transparent"
                      stroke-dasharray="282.7"
                      stroke-dashoffset="${282.7 - (puntaje / 100) * 282.7}"
                      stroke-linecap="round"
                      class="transition-all duration-700 ease-out" />
              <defs>
                <linearGradient id="health-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="${stopColor1}" />
                  <stop offset="100%" stop-color="${stopColor2}" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute flex flex-col items-center justify-center text-center">
              <span class="text-2xl font-black text-slate-950 dark:text-white leading-none">${puntaje}</span>
              <span class="text-[8px] uppercase tracking-wider text-slate-455 font-bold mt-1">Puntos</span>
            </div>
          </div>
          
          <div>
            <span class="px-3 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 tracking-wide capitalize">${estadoSalud}</span>
          </div>
        </div>

        <!-- Listado Sugerencias -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alertas y Sugerencias de Salud</h3>
          <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            ${recsHtml}
          </div>
        </div>

      </div>

      <!-- Simulador Interés Compuesto -->
      <div class="p-6 rounded-2xl glass-panel border border-primary-150 dark:border-primary-900/30 shadow-md space-y-6">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            💰
            Simulador de Ahorro e Inversión Futura
          </h3>
          <p class="text-xs text-slate-500 mt-1">Calcula la evolución de tu capital aplicando interés compuesto mensual.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Inputs -->
          <div class="lg:col-span-1 space-y-4">
            <div>
              <label class="form-label-custom text-[10px] uppercase font-bold text-slate-500">Monto Inicial ($)</label>
              <input type="number" id="sim-principal" oninput="calcularInteresCompuesto()" class="form-input-custom text-xs" value="1000">
            </div>
            <div>
              <label class="form-label-custom text-[10px] uppercase font-bold text-slate-500">Aportación Mensual ($)</label>
              <input type="number" id="sim-monthly" oninput="calcularInteresCompuesto()" class="form-input-custom text-xs" value="100">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label-custom text-[10px] uppercase font-bold text-slate-500">Tasa Anual (%)</label>
                <input type="number" id="sim-rate" oninput="calcularInteresCompuesto()" class="form-input-custom text-xs" value="8">
              </div>
              <div>
                <label class="form-label-custom text-[10px] uppercase font-bold text-slate-500">Horizonte (Años)</label>
                <input type="number" id="sim-years" oninput="calcularInteresCompuesto()" class="form-input-custom text-xs" value="5">
              </div>
            </div>
          </div>

          <!-- Resultados -->
          <div class="lg:col-span-2 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Capital Final Proyectado</span>
                <p id="res-total" class="text-2xl font-black text-primary-655 dark:text-primary-400 tracking-tight">$0.00</p>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Tus Aportaciones</span>
                <p id="res-invested" class="text-base font-bold text-slate-700 dark:text-slate-200">$0.00</p>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Interés Ganado Neto</span>
                <p id="res-interest" class="text-base font-bold text-emerald-650 dark:text-emerald-400">$0.00</p>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Distribución de Capital Proyectado</span>
              <div class="w-full bg-slate-200 dark:bg-slate-800 h-7 rounded-xl overflow-hidden flex font-bold text-[9px] text-white">
                <div id="bar-invested" class="bg-gradient-to-r from-primary-600 to-primary-500 h-full flex items-center justify-center transition-all duration-300">Aportado</div>
                <div id="bar-interest" class="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full flex items-center justify-center transition-all duration-300">Intereses</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
      </div>
    </div>
  `;

  // Ejecutar el primer cálculo del simulador
  setTimeout(() => {
    window.calcularInteresCompuesto();
  }, 30);
}
