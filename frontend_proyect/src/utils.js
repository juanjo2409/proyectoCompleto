// Utilidades Simples de Formateo y Mensajería - Nivel Estudiante

export function formatearMoneda(monto, divisa = 'USD') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: divisa,
    minimumFractionDigits: 2
  }).format(monto);
}

export function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  // Se añade T00:00:00 para evitar desajustes horarios
  const fecha = new Date(fechaStr + 'T00:00:00');
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(fecha);
}

// Colores de categoría en formato de texto
export function obtenerColorBadge(categoria) {
  const colores = {
    Salary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-350 border-emerald-200 dark:border-emerald-800',
    Freelance: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-350 border-teal-200 dark:border-teal-800',
    Investments: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-350 border-cyan-200 dark:border-cyan-800',
    Rent: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-350 border-rose-200 dark:border-rose-800',
    Food: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-350 border-amber-200 dark:border-amber-800',
    Transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-350 border-blue-200 dark:border-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-350 border-purple-200 dark:border-purple-800',
    Utilities: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-350 border-indigo-200 dark:border-indigo-800',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-650'
  };
  return colores[categoria] || colores['Other'];
}

// Colores para las tarjetas de recomendación
export function obtenerEstilosAlerta(tipo) {
  const estilos = {
    warning: {
      border: 'border-amber-200 dark:border-amber-800/60',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      text: 'text-amber-800 dark:text-amber-300',
      icon: 'text-amber-500 dark:text-amber-400'
    },
    success: {
      border: 'border-emerald-200 dark:border-emerald-800/60',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: 'text-emerald-500 dark:text-emerald-400'
    },
    danger: {
      border: 'border-rose-200 dark:border-rose-800/60',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      text: 'text-rose-800 dark:text-rose-300',
      icon: 'text-rose-500 dark:text-rose-400'
    },
    info: {
      border: 'border-sky-200 dark:border-sky-800/60',
      bg: 'bg-sky-50/50 dark:bg-sky-950/20',
      text: 'text-sky-800 dark:text-sky-300',
      icon: 'text-sky-500 dark:text-sky-400'
    }
  };
  return estilos[tipo] || estilos.info;
}

// Mostrar una alerta visual (Toast) simple en pantalla
export function mostrarNotificacion(mensaje, tipo = 'success') {
  const contenedor = document.getElementById('toast-container');
  if (!contenedor) return;

  const toast = document.createElement('div');
  
  // Colores de borde y texto según tipo
  let clasesAdicionales = '';
  if (tipo === 'success') {
    clasesAdicionales = 'border-emerald-200 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300';
  } else if (tipo === 'error') {
    clasesAdicionales = 'border-rose-200 text-rose-800 dark:border-rose-800 dark:text-rose-300';
  } else {
    clasesAdicionales = 'border-sky-200 text-sky-800 dark:border-sky-800 dark:text-sky-300';
  }

  toast.className = `animate-toast flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm pointer-events-auto bg-white dark:bg-slate-900 ${clasesAdicionales}`;
  
  const iconSvg = tipo === 'success'
    ? `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    : tipo === 'error'
    ? `<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    : `<svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span class="text-sm font-medium">${mensaje}</span>
  `;

  contenedor.appendChild(toast);

  // Desaparecer después de 3 segundos
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
