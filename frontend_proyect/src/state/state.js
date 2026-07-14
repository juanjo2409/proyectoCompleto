// Estado Global Simple - Nivel Estudiante (Sin Clases, Pub/Sub ni Complejidades)
import { api } from '../api';

export const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  transactions: [],
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    currency: "USD"
  },
  recommendations: [],
  activeView: localStorage.getItem('token') ? 'dashboard' : 'landing', // dashboard, transactions, reports, recommendations, settings, landing, login, register
  isLoading: false,
  settings: {
    monthlyBudgetLimit: parseFloat(localStorage.getItem('finance_budget_limit')) || 2000.0,
    categories: JSON.parse(localStorage.getItem('finance_categories')) || {
      income: ['Salary', 'Freelance', 'Investments', 'Other'],
      expense: ['Rent', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Other']
    }
  }
};

// Función para inicializar el estado desde la API
export async function cargarEstado() {
  if (!state.token) {
    actualizarUI(); // Para renderizar login/landing
    return;
  }

  state.isLoading = true;
  actualizarUI(); // Refrescar loaders

  try {
    state.transactions = await api.obtenerTransacciones();
    await actualizarCalculos();
  } catch (error) {
    console.error("Error al inicializar los datos:", error);
    if (error.message.includes("servidor")) {
        // Podría ser error de token, let api handle it
    }
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

export async function login(username, password) {
  state.isLoading = true;
  actualizarUI();
  try {
    const data = await api.login(username, password);
    state.token = data.access_token;
    state.user = data.user;
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    await cargarEstado();
    cambiarVista('dashboard');
  } catch (err) {
    console.error("Login error:", err);
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
      errorEl.textContent = err.message || "Credenciales incorrectas o error de conexión.";
      errorEl.classList.remove('hidden');
    } else {
      alert(err.message);
    }
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

export async function register(username, password) {
  state.isLoading = true;
  actualizarUI();
  try {
    await api.register(username, password);
    alert("Registrado correctamente, ahora inicia sesión.");
    cambiarVista('login');
  } catch (err) {
    console.error("Register error:", err);
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
      errorEl.textContent = err.message || "Error al registrar el usuario.";
      errorEl.classList.remove('hidden');
    } else {
      alert(err.message);
    }
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

export function logout() {
  state.token = null;
  state.user = null;
  state.transactions = [];
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  cambiarVista('landing');
}

// Función para recalcular los balances y las sugerencias de ahorro
export async function actualizarCalculos() {
  // 1. Calcular balance
  const txs = state.transactions;
  let ingresos = 0;
  let gastos = 0;

  for (let i = 0; i < txs.length; i++) {
    const amount = parseFloat(txs[i].amount) || 0;
    if (txs[i].type === 'income') {
      ingresos += amount;
    } else {
      gastos += amount;
    }
  }

  state.summary.totalIncome = ingresos;
  state.summary.totalExpenses = gastos;
  state.summary.netBalance = ingresos - gastos;

  // 2. Calcular recomendaciones
  state.recommendations = await api.generarRecomendaciones(state.transactions, state.summary);
}

// Función para cambiar de vista activa
// skipHistory = true cuando se navega con los botones atrás/adelante del navegador
export function cambiarVista(nombreVista, skipHistory = false) {
  state.activeView = nombreVista;
  if (!skipHistory) {
    // Agrega la vista al historial del navegador usando hash
    const url = `${window.location.pathname}#${nombreVista}`;
    window.history.pushState({ vista: nombreVista }, '', url);
  }
  actualizarUI();
}

// Función para agregar un movimiento
export async function registrarMovimiento(nuevoMovimiento) {
  state.isLoading = true;
  actualizarUI();

  try {
    const txCreada = await api.crearTransaccion(nuevoMovimiento);
    state.transactions.push(txCreada);
    await actualizarCalculos();
  } catch (error) {
    alert("Error al registrar movimiento: " + error.message);
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

// Función para editar un movimiento existente
export async function editarMovimiento(id, datosActualizados) {
  state.isLoading = true;
  actualizarUI();

  try {
    const txEditada = await api.actualizarTransaccion(id, datosActualizados);
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      state.transactions[index] = txEditada;
    }
    await actualizarCalculos();
  } catch (error) {
    alert("Error al editar movimiento: " + error.message);
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

// Función para eliminar un movimiento
export async function eliminarMovimiento(id) {
  state.isLoading = true;
  actualizarUI();

  try {
    await api.borrarTransaccion(id);
    state.transactions = state.transactions.filter(t => t.id !== id);
    await actualizarCalculos();
  } catch (error) {
    alert("Error al eliminar movimiento: " + error.message);
  } finally {
    state.isLoading = false;
    actualizarUI();
  }
}

// Función para actualizar configuraciones
export function guardarConfiguracion(limitePresupuesto, nuevasCategorias) {
  if (limitePresupuesto !== undefined) {
    state.settings.monthlyBudgetLimit = limitePresupuesto;
    localStorage.setItem('finance_budget_limit', limitePresupuesto.toString());
  }
  if (nuevasCategorias !== undefined) {
    state.settings.categories = nuevasCategorias;
    localStorage.setItem('finance_categories', JSON.stringify(nuevasCategorias));
  }
  actualizarCalculos().then(() => actualizarUI());
}

// Función puente para notificar al enrutador principal en main.js que refresque el HTML
let callbackRenderizado = null;

export function registrarCallbackUI(callback) {
  callbackRenderizado = callback;
}

export function actualizarUI() {
  if (callbackRenderizado) {
    callbackRenderizado(state);
  }
}
