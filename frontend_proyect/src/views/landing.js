export function mostrarLanding() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between overflow-x-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      <!-- Navbar superior sutil -->
      <header class="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="p-2 bg-primary-600 dark:bg-primary-500 rounded-xl text-white shadow-md shadow-primary-500/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <span class="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">FinanzaFlow</span>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button onclick="window.alternarTema()" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 rounded-xl transition-all focus:outline-none active:scale-95 cursor-pointer mr-1" title="Alternar Tema">
            ${window.iconoTemaSvg()}
          </button>
          <button onclick="window.navegarA('login')" class="text-xs font-semibold px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Acceder
          </button>
          <button onclick="window.navegarA('register')" class="text-xs font-semibold px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-95 transition-all">
            Registrarse
          </button>
        </div>
      </header>

      <!-- Hero Section con efectos de fondo -->
      <main class="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 relative max-w-7xl mx-auto w-full">
        <!-- Glowing background decoration -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10"></div>
        <div class="absolute bottom-10 right-10 w-[200px] h-[200px] bg-indigo-500/15 dark:bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none -z-10"></div>

        <div class="text-center max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-55/10 border border-primary-500/20 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">
            ✨ Tu asistente financiero definitivo
          </div>
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Toma el control de tu <br class="hidden sm:inline">
            <span class="bg-gradient-to-r from-primary-600 via-violet-500 to-indigo-650 dark:from-primary-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">dinero hoy mismo</span>
          </h1>
          
          <p class="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            FinanzaFlow te permite registrar tus ingresos y gastos de forma simple, analizar tus comportamientos mediante reportes gráficos elegantes y optimizar tu capacidad de ahorro.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onclick="window.navegarA('register')" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-650 to-indigo-650 hover:from-primary-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Comienza gratis ahora
            </button>
            <button onclick="window.navegarA('login')" class="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Iniciar Sesión
            </button>
          </div>
        </div>

        <!-- Características destacadas con Glassmorphism -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24 w-full">
          <!-- Item 1 -->
          <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Control de Transacciones</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Registra tus ingresos y egresos con facilidad. Categoriza tus movimientos y define presupuestos mensuales.
            </p>
          </div>

          <!-- Item 2 -->
          <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
            <div class="p-3 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-xl w-fit mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Análisis Estadístico</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Gráficos interactivos de barra, dona y línea por cortesía de Chart.js para comprender visualmente a dónde va tu dinero.
            </p>
          </div>

          <!-- Item 3 -->
          <div class="p-6 rounded-2xl glass-panel relative overflow-hidden group">
            <div class="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl w-fit mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Simulador & Consejos</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Calcula el interés compuesto de tus inversiones futuras y recibe sugerencias automatizadas basadas en tu salud financiera.
            </p>
          </div>
        </section>
      </main>

      <!-- Footer sutil -->
      <footer class="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; 2026 FinanzaFlow. SPA Académica de Finanzas Personales. Desarrollado con Vite, Tailwind CSS y FastAPI.</p>
      </footer>

    </div>
  `;
}
