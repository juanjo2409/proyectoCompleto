export function mostrarLogin() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      <!-- Theme Switcher Top-Right -->
      <div class="absolute top-5 right-5 z-20">
        <button onclick="window.alternarTema()" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 rounded-xl transition-all focus:outline-none active:scale-95 cursor-pointer" title="Alternar Tema">
          ${window.iconoTemaSvg()}
        </button>
      </div>

      <!-- Ambient background glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10"></div>
      
      <div class="animate-scale-up w-full max-w-md mx-auto z-10 space-y-6">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="text-center mb-6">
            <span class="p-3 bg-gradient-to-tr from-primary-650 to-indigo-650 rounded-2xl text-white shadow-lg shadow-primary-500/20 inline-block cursor-pointer hover:scale-105 active:scale-95 transition-all" onclick="window.navegarA('landing')">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
          </div>
          <h2 class="text-center text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ingresa a tu cuenta
          </h2>
          <p class="text-center text-xs text-slate-550 dark:text-slate-400 mt-2">
            Gestiona tus movimientos y ahorros en tiempo real
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <form class="space-y-5" id="form-login" onsubmit="window.handleAuthSubmit(event, 'login')">
            
            <div>
              <label for="username" class="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Usuario (Username)
              </label>
              <input id="username" name="username" type="text" required 
                     class="appearance-none block w-full px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-slate-955 dark:text-white transition-all duration-200"
                     placeholder="ej. admin">
            </div>

            <div>
              <label for="password" class="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div class="relative">
                <input id="password" name="password" type="password" required 
                       class="appearance-none block w-full px-3.5 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-slate-955 dark:text-white transition-all duration-200"
                       placeholder="••••••••">
                <button type="button" 
                        onclick="const p = document.getElementById('password'); p.type = p.type === 'password' ? 'text' : 'password';" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error visual premium container -->
            <div id="auth-error" class="hidden text-xs text-rose-600 bg-rose-50 dark:bg-rose-955/20 dark:text-rose-400 p-3.5 rounded-xl border border-rose-200/50 dark:border-rose-900/30 animate-pulse"></div>

            <div class="pt-2">
              <button type="submit" id="btn-submit" 
                      class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 text-sm font-semibold text-white bg-gradient-to-r from-primary-650 to-indigo-650 hover:from-primary-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-[0.98] transition-all cursor-pointer">
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative flex items-center justify-center my-4">
              <div class="absolute w-full border-t border-slate-200 dark:border-slate-800"></div>
              <span class="relative px-3 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                ¿Eres nuevo?
              </span>
            </div>
            
            <button onclick="window.navegarA('register')" 
                    class="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-55 dark:bg-slate-950 dark:hover:bg-slate-900 transition-all cursor-pointer">
              Crear una cuenta gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function mostrarRegister() {
  return `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      <!-- Theme Switcher Top-Right -->
      <div class="absolute top-5 right-5 z-20">
        <button onclick="window.alternarTema()" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 rounded-xl transition-all focus:outline-none active:scale-95 cursor-pointer" title="Alternar Tema">
          ${window.iconoTemaSvg()}
        </button>
      </div>

      <!-- Ambient background glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10"></div>

      <div class="animate-scale-up w-full max-w-md mx-auto z-10 space-y-6">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="text-center mb-6">
            <span class="p-3 bg-gradient-to-tr from-primary-650 to-indigo-650 rounded-2xl text-white shadow-lg shadow-primary-500/20 inline-block cursor-pointer hover:scale-105 active:scale-95 transition-all" onclick="window.navegarA('landing')">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
          </div>
          <h2 class="text-center text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Crea tu cuenta gratis
          </h2>
          <p class="text-center text-xs text-slate-550 dark:text-slate-400 mt-2">
            Empieza a rastrear y planificar tus metas financieras
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <form class="space-y-5" id="form-register" onsubmit="window.handleAuthSubmit(event, 'register')">
            
            <div>
              <label for="username" class="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Elige tu nombre de usuario
              </label>
              <input id="username" name="username" type="text" required 
                     class="appearance-none block w-full px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-slate-950 dark:text-white transition-all duration-200"
                     placeholder="ej. carlos22">
            </div>

            <div>
              <label for="password" class="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div class="relative">
                <input id="password" name="password" type="password" required 
                       class="appearance-none block w-full px-3.5 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-slate-950 dark:text-white transition-all duration-200"
                       placeholder="••••••••">
                <button type="button" 
                        onclick="const p = document.getElementById('password'); p.type = p.type === 'password' ? 'text' : 'password';" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label for="password_confirm" class="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Confirma la contraseña
              </label>
              <div class="relative">
                <input id="password_confirm" name="password_confirm" type="password" required 
                       class="appearance-none block w-full px-3.5 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-slate-950 dark:text-white transition-all duration-200"
                       placeholder="••••••••">
                <button type="button" 
                        onclick="const p = document.getElementById('password_confirm'); p.type = p.type === 'password' ? 'text' : 'password';" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error visual premium container -->
            <div id="auth-error" class="hidden text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 p-3.5 rounded-xl border border-rose-200/50 dark:border-rose-900/30 animate-pulse"></div>

            <div class="pt-2">
              <button type="submit" id="btn-submit" 
                      class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 text-sm font-semibold text-white bg-gradient-to-r from-primary-650 to-indigo-650 hover:from-primary-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-[0.98] transition-all cursor-pointer">
                Registrarse
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative flex items-center justify-center my-4">
              <div class="absolute w-full border-t border-slate-200 dark:border-slate-800"></div>
              <span class="relative px-3 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                ¿Ya tienes una cuenta?
              </span>
            </div>
            
            <button onclick="window.navegarA('login')" 
                    class="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-all cursor-pointer">
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
