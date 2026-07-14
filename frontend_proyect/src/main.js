// Enrutador y Gestor Principal de la SPA - Nivel Estudiante (Funcional)
import './styles/main.css';
import { state, cargarEstado, cambiarVista, registrarCallbackUI } from './state/state';
import { formatearMoneda } from './utils';

import { mostrarDashboard } from './views/dashboard';
import { mostrarMovimientos } from './views/transactions';
import { mostrarReportes } from './views/reports';
import { mostrarRecomendaciones } from './views/recommendations';
import { mostrarConfiguracion } from './views/settings';
import { mostrarLanding } from './views/landing';
import { mostrarLogin, mostrarRegister } from './views/auth';
import { login, register, logout } from './state/state';

// Definir funciones en el objeto 'window' para que se puedan invocar directamente desde onclick en el HTML
window.handleAuthSubmit = function(event, type) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const user = formData.get('username');
  const pass = formData.get('password');
  
  if (type === 'register') {
    const confirm = formData.get('password_confirm');
    if (pass !== confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    register(user, pass);
  } else {
    login(user, pass);
  }
};

window.logout = logout;
window.navegarA = function(nombreVista) {
  cambiarVista(nombreVista);
};

window.iconoTemaSvg = function() {
  const esOscuro = document.documentElement.classList.contains('dark');
  return esOscuro 
    ? `<svg class="w-5 h-5 text-amber-450 transition-all duration-300 transform hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`
    : `<svg class="w-5 h-5 text-indigo-600 transition-all duration-300 transform hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
};

window.alternarTema = function() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  // Forzar redibujado de la interfaz
  redibujarInterfaz(state);
};

window.abrirMobileSidebar = function() {
  const sidebar = document.getElementById('sidebar-container');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
};

window.cerrarMobileSidebar = function() {
  const sidebar = document.getElementById('sidebar-container');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
};

//// Función para renderizar el Sidebar (Menú lateral)
function renderizarSidebar(appState) {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const activeView = appState.activeView;
  const username = appState.user ? appState.user.username : 'Usuario';
  const inicial = username.charAt(0).toUpperCase();

  const items = [
    { id: 'dashboard', label: 'Dashboard', iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { id: 'transactions', label: 'Movimientos', iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'reports', label: 'Reportes y Gráficos', iconPath: 'M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
    { id: 'recommendations', label: 'Recomendaciones', iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'settings', label: 'Configuración', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  const itemsHtml = items.map(item => {
    const esActivo = item.id === activeView;
    const clasesCSS = esActivo
      ? 'bg-gradient-to-r from-primary-500/10 to-indigo-500/5 text-primary-600 dark:text-primary-400 font-semibold border-l-4 border-primary-600 dark:border-primary-550 pl-3'
      : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200 pl-4 border-l-4 border-transparent';
    
    return `
      <li>
        <button 
          onclick="navegarA('${item.id}')"
          class="w-full flex items-center gap-3 py-3 rounded-r-xl transition-all duration-200 text-left cursor-pointer focus:outline-none ${clasesCSS}"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.iconPath}"/>
          </svg>
          <span class="text-sm">${item.label}</span>
        </button>
      </li>
    `;
  }).join('');

  container.className = "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full transition-transform duration-300 md:translate-x-0 md:static md:z-auto md:w-64 flex-shrink-0 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60";
  container.innerHTML = `
    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/60">
      <div class="flex items-center gap-2.5">
        <span class="p-2 bg-gradient-to-tr from-primary-650 to-indigo-650 rounded-xl text-white shadow-md shadow-primary-500/10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <span class="text-lg font-black bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">FinanzaFlow</span>
      </div>
      <button onclick="cerrarMobileSidebar()" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden text-slate-500 dark:text-slate-400 cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <nav class="flex-1 pr-4 py-6 overflow-y-auto">
      <ul class="space-y-1">
        ${itemsHtml}
      </ul>
    </nav>

    <div class="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary-500/10 text-sm capitalize">
          ${inicial}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate capitalize leading-tight">${username}</h4>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate tracking-wide uppercase font-semibold">Financista</p>
        </div>
      </div>
    </div>
  `;
}

// Función para renderizar el Navbar (Barra superior)
function renderizarNavbar(appState) {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const summary = appState.summary;
  const username = appState.user ? appState.user.username : 'Usuario';
  const isNegative = summary.netBalance < 0;
  const colorClase = isNegative 
    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/35 dark:text-rose-400' 
    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/35 dark:text-emerald-400';

  const iconoTema = window.iconoTemaSvg();

  container.className = "flex items-center justify-between px-4 md:px-8 h-16 flex-shrink-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 w-full";
  container.innerHTML = `
    <div class="flex items-center gap-4">
      <button onclick="abrirMobileSidebar()" class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 md:hidden focus:outline-none cursor-pointer">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      
      <div class="hidden sm:block">
        <h2 class="text-xs font-semibold text-slate-450 dark:text-slate-400 tracking-wider uppercase">FinanzaFlow Panel</h2>
        <h1 class="text-base font-bold text-slate-950 dark:text-white leading-tight capitalize flex items-center gap-1.5">
          Hola, ${username} <span class="animate-wave inline-block">👋</span>
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3 sm:gap-4 ml-auto">
      <div class="flex items-center gap-2 border px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${colorClase}">
        <span class="w-1.5 h-1.5 rounded-full ${isNegative ? 'bg-rose-500' : 'bg-emerald-500'}"></span>
        <span class="hidden xs:inline text-[10px] uppercase tracking-wider">Balance:</span>
        <span>${formatearMoneda(summary.netBalance, summary.currency)}</span>
      </div>

      <button onclick="navegarA('transactions')" class="p-2 bg-gradient-to-tr from-primary-650 to-indigo-650 hover:from-primary-600 hover:to-indigo-600 text-white rounded-xl shadow-md shadow-primary-500/10 hover:shadow-primary-500/25 transition-all focus:outline-none active:scale-95 cursor-pointer" title="Añadir Movimiento">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      </button>

      <span class="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden xs:block"></span>

      <button onclick="alternarTema()" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 rounded-xl transition-all focus:outline-none active:scale-95 cursor-pointer">
        ${iconoTema}
      </button>

      <button onclick="logout()" class="relative p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 rounded-xl transition-all focus:outline-none active:scale-95 cursor-pointer" title="Cerrar Sesión">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </button>
    </div>
  `;
}

// Función principal de redibujado de la interfaz según el estado
function redibujarInterfaz(appState) {
  // 1. Mostrar/ocultar spinner de carga
  const loader = document.getElementById('global-loader');
  if (loader) {
    if (appState.isLoading) {
      loader.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      loader.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  // 2. Renderizar Sidebar y Navbar
  renderizarSidebar(appState);
  renderizarNavbar(appState);

  // Guard para rutas privadas
  const rutasPublicas = ['landing', 'login', 'register'];
  if (!rutasPublicas.includes(appState.activeView) && !appState.token) {
    // skipHistory=true: la redirección forzada por auth NO debe crear entrada en el historial
    cambiarVista('login', true);
    return;
  }

  const appPublic = document.getElementById('app-public');
  const appPrivate = document.getElementById('app-private');
  const publicViewport = document.getElementById('public-viewport');
  const viewContainer = document.getElementById('view-content');

  if (rutasPublicas.includes(appState.activeView)) {
    appPublic.classList.remove('hidden');
    appPrivate.classList.add('hidden');
    appPrivate.classList.remove('flex');
    
    if (appState.activeView === 'landing') {
      publicViewport.innerHTML = mostrarLanding();
    } else if (appState.activeView === 'login') {
      publicViewport.innerHTML = mostrarLogin();
    } else if (appState.activeView === 'register') {
      publicViewport.innerHTML = mostrarRegister();
    }
  } else {
    appPublic.classList.add('hidden');
    appPrivate.classList.remove('hidden');
    appPrivate.classList.add('flex');
    
    switch (appState.activeView) {
      case 'dashboard':
        mostrarDashboard(appState);
        break;
      case 'transactions':
        mostrarMovimientos(appState);
        break;
      case 'reports':
        mostrarReportes(appState);
        break;
      case 'recommendations':
        mostrarRecomendaciones(appState);
        break;
      case 'settings':
        mostrarConfiguracion(appState);
        break;
      default:
        viewContainer.innerHTML = `<h2>Vista no encontrada</h2>`;
    }
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Registrar el callback de refresco del estado para que llame a redibujarInterfaz
  registrarCallbackUI(redibujarInterfaz);

  const RUTAS_VALIDAS = ['landing', 'login', 'register', 'dashboard', 'transactions', 'reports', 'recommendations', 'settings'];
  const RUTAS_PUBLICAS = ['landing', 'login', 'register'];

  // --- Historia del navegador (botones Atrás / Adelante) ---
  window.addEventListener('popstate', (event) => {
    let vista = null;

    if (event.state && event.state.vista) {
      // Estado guardado por nosotros con pushState / replaceState
      vista = event.state.vista;
    } else {
      // Fallback: leer el hash de la URL
      vista = window.location.hash.replace('#', '');
    }

    if (vista && RUTAS_VALIDAS.includes(vista)) {
      // Guard de auth: si la vista es privada y no hay sesión, ir a login sin agregar historial
      if (!RUTAS_PUBLICAS.includes(vista) && !state.token) {
        cambiarVista('login', true);
        return;
      }
      // skipHistory = true para no volver a hacer pushState (el navegador ya movió la URL)
      cambiarVista(vista, true);
    }
  });

  // ── FIX PRINCIPAL ──────────────────────────────────────────────────────────
  // Cuando la app carga, el navegador tiene UNA entrada vacía en su historial
  // (la URL original sin hash). Si solo hacemos pushState en cada navegación,
  // al presionar ⬅️ desde la primera vista el navegador regresa a esa entrada
  // vacía: event.state=null, hash='', nada funciona y el botón queda bloqueado.
  //
  // La solución: REEMPLAZAR esa entrada vacía con la vista inicial usando
  // replaceState. Así el historial parte desde una entrada conocida.
  // ───────────────────────────────────────────────────────────────────────────

  // Determinar vista inicial (puede venir del hash de la URL en una recarga)
  let vistaInicial = state.activeView; // valor por defecto del state
  const hashInicial = window.location.hash.replace('#', '');
  if (hashInicial && RUTAS_VALIDAS.includes(hashInicial)) {
    if (RUTAS_PUBLICAS.includes(hashInicial) || localStorage.getItem('token')) {
      vistaInicial = hashInicial;
      state.activeView = vistaInicial;
    }
  }

  // Reemplazar la entrada vacía del historial con la vista inicial real
  window.history.replaceState(
    { vista: vistaInicial },
    '',
    `${window.location.pathname}#${vistaInicial}`
  );

  // Cargar datos (dispara el primer render)
  cargarEstado();
});
