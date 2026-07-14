export function mostrarLogin() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center mb-6">
          <span class="p-3 bg-primary-600 dark:bg-primary-500 rounded-xl text-white shadow-lg shadow-primary-500/20 inline-block cursor-pointer" onclick="window.navegarA('landing')">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
        </div>
        <h2 class="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Bienvenido de nuevo
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700/50">
          <form class="space-y-6" id="form-login" onsubmit="window.handleAuthSubmit(event, 'login')">
            <div>
              <label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Usuario (Username)
              </label>
              <div class="mt-1">
                <input id="username" name="username" type="text" required class="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white transition-colors">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <div class="mt-1">
                <input id="password" name="password" type="password" required class="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white transition-colors">
              </div>
            </div>

            <div id="auth-error" class="hidden text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-100 dark:border-rose-800"></div>

            <div>
              <button type="submit" id="btn-submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                Ingresar
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>
            <div class="mt-6">
              <button onclick="window.navegarA('register')" class="w-full flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                Regístrate ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function mostrarRegister() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center mb-6">
          <span class="p-3 bg-primary-600 dark:bg-primary-500 rounded-xl text-white shadow-lg shadow-primary-500/20 inline-block cursor-pointer" onclick="window.navegarA('landing')">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
        </div>
        <h2 class="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Crea tu cuenta
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700/50">
          <form class="space-y-6" id="form-register" onsubmit="window.handleAuthSubmit(event, 'register')">
            <div>
              <label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Elige un nombre de usuario
              </label>
              <div class="mt-1">
                <input id="username" name="username" type="text" required class="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white transition-colors">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <div class="mt-1">
                <input id="password" name="password" type="password" required class="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white transition-colors">
              </div>
            </div>
            
            <div>
              <label for="password_confirm" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirma la contraseña
              </label>
              <div class="mt-1">
                <input id="password_confirm" name="password_confirm" type="password" required class="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white transition-colors">
              </div>
            </div>

            <div id="auth-error" class="hidden text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-100 dark:border-rose-800"></div>

            <div>
              <button type="submit" id="btn-submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                Registrarse
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>
            <div class="mt-6">
              <button onclick="window.navegarA('login')" class="w-full flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
