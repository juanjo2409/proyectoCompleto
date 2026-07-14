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
    // Fórmula matemática
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
  let claseColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";

  if (totalIncome > 0) {
    const ratioGasto = totalExpenses / totalIncome;
    if (ratioGasto > 1.0) {
      puntaje = 30;
      estadoSalud = "Crítico (Déficit)";
      claseColor = "text-rose-500 border-rose-500/20 bg-rose-500/5";
    } else if (ratioGasto > 0.8) {
      puntaje = 55;
      estadoSalud = "Afectado (Mucho gasto)";
      claseColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";
    } else if (ratioGasto > 0.6) {
      puntaje = 75;
      estadoSalud = "Estable";
      claseColor = "text-indigo-500 border-indigo-500/20 bg-indigo-500/5";
    }
  } else {
    puntaje = 0;
    estadoSalud = "Faltan Movimientos";
    claseColor = "text-slate-500 border-slate-500/20 bg-slate-500/5";
  }

  // Generar tarjetas de recomendación HTML
  let recsHtml = '';
  if (recommendations.length > 0) {
    recsHtml = recommendations.map(rec => {
      const estilos = obtenerEstilosAlerta(rec.type);
      return `
        <div class="p-5 rounded-2xl border ${estilos.border} ${estilos.bg} flex items-start gap-4 transition-all">
          <span class="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${estilos.icon}">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
          <div class="space-y-1.5 flex-1 min-w-0">
            <h3 class="text-sm font-bold ${estilos.text}">${rec.title}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">${rec.message}</p>
            <div class="mt-2.5 p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Consejo:
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${rec.actionableTip}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    recsHtml = `<p class="text-xs text-slate-500">No hay recomendaciones en este momento.</p>`;
  }

  container.innerHTML = `
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ahorro y Recomendaciones</h1>
      <p class="text-sm text-slate-500">Consejos automatizados para gestionar eficientemente tus recursos.</p>
    </div>

    <!-- Panel Superior -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Calificación -->
      <div class="lg:col-span-1 p-6 rounded-2xl glass-panel flex flex-col items-center justify-center text-center space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Salud Financiera</h3>
        <div class="w-28 h-28 rounded-full border-4 border-slate-100 dark:border-slate-800/60 flex items-center justify-center ${claseColor}">
          <div class="flex flex-col items-center justify-center">
            <span class="text-2xl font-black">${puntaje}</span>
            <span class="text-[8px] uppercase font-bold tracking-wider opacity-60">Puntos</span>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-white">${estadoSalud}</h4>
        </div>
      </div>

      <!-- Listado Sugerencias -->
      <div class="lg:col-span-2 space-y-4">
        <h3 class="text-sm font-bold text-slate-700 dark:text-slate-350">Alertas y Recomendaciones</h3>
        <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          ${recsHtml}
        </div>
      </div>

    </div>

    <!-- Simulador Interés Compuesto -->
    <div class="p-6 rounded-2xl glass-panel border border-primary-100 dark:border-primary-900/30 shadow-md space-y-6">
      <div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          💰
          Simulador de Ahorro Futuro
        </h3>
        <p class="text-xs text-slate-500 mt-1">Simula cómo crece tu dinero mes a mes.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Inputs -->
        <div class="lg:col-span-1 space-y-4">
          <div>
            <label class="form-label-custom text-xs">Monto Inicial ($)</label>
            <input type="number" id="sim-principal" oninput="calcularInteresCompuesto()" class="form-input-custom text-sm" value="1000">
          </div>
          <div>
            <label class="form-label-custom text-xs">Aportación Mensual ($)</label>
            <input type="number" id="sim-monthly" oninput="calcularInteresCompuesto()" class="form-input-custom text-sm" value="100">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label-custom text-xs">Tasa Anual (%)</label>
              <input type="number" id="sim-rate" oninput="calcularInteresCompuesto()" class="form-input-custom text-sm" value="8">
            </div>
            <div>
              <label class="form-label-custom text-xs">Horizonte (Años)</label>
              <input type="number" id="sim-years" oninput="calcularInteresCompuesto()" class="form-input-custom text-sm" value="5">
            </div>
          </div>
        </div>

        <!-- Resultados -->
        <div class="lg:col-span-2 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500">Capital Final</span>
              <p id="res-total" class="text-2xl font-black text-primary-600 dark:text-primary-400">$0.00</p>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500">Tus Depósitos</span>
              <p id="res-invested" class="text-base font-bold text-slate-800 dark:text-slate-250">$0.00</p>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500">Interés Ganado</span>
              <p id="res-interest" class="text-base font-bold text-emerald-600">$0.00</p>
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-[10px] uppercase font-semibold text-slate-500">Distribución de Capital Proyectado</span>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-xl overflow-hidden flex font-bold text-[9px] text-white">
              <div id="bar-invested" class="bg-primary-500 h-full flex items-center justify-center transition-all" style="width: 50%">Aportado</div>
              <div id="bar-interest" class="bg-emerald-500 h-full flex items-center justify-center transition-all" style="width: 50%">Intereses</div>
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
