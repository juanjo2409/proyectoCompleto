export function mostrarLanding() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div class="mb-8">
        <span class="p-4 bg-primary-600 dark:bg-primary-500 rounded-2xl text-white shadow-xl shadow-primary-500/20 inline-block mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
          FinanzaFlow
        </h1>
        <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Toma el control de tu dinero hoy mismo. Registra tus ingresos, analiza tus gastos y alcanza tus metas financieras.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <button onclick="window.navegarA('login')" class="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
          Iniciar Sesión
        </button>
        <button onclick="window.navegarA('register')" class="px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-0.5">
          Crear Cuenta Gratis
        </button>
      </div>
    </div>
  `;
}
