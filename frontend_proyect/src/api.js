// Capa de API Simplificada - Nivel Estudiante (Funciones Simples)

const usarMock = localStorage.getItem('finance_use_mock_api') === 'true';
const apiUrl = localStorage.getItem('finance_api_url') || 'http://localhost:8001/api/v1';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Datos iniciales de prueba
const transaccionesIniciales = [
  { id: "tx-1", type: "income", amount: 2800.0, category: "Salary", date: "2026-07-01", description: "Salario mensual", createdAt: "2026-07-01T08:00:00Z" },
  { id: "tx-2", type: "income", amount: 450.0, category: "Freelance", date: "2026-07-08", description: "Diseño de logo", createdAt: "2026-07-08T14:30:00Z" },
  { id: "tx-3", type: "expense", amount: 750.0, category: "Rent", date: "2026-07-02", description: "Pago del alquiler", createdAt: "2026-07-02T10:00:00Z" },
  { id: "tx-4", type: "expense", amount: 185.5, category: "Food", date: "2026-07-05", description: "Supermercado semanal", createdAt: "2026-07-05T18:15:00Z" },
  { id: "tx-5", type: "expense", amount: 65.0, category: "Transport", date: "2026-07-10", description: "Gasolina para el auto", createdAt: "2026-07-10T12:00:00Z" }
];

// Si no hay datos en LocalStorage, poner los datos iniciales
if (usarMock && !localStorage.getItem('finance_transactions')) {
  localStorage.setItem('finance_transactions', JSON.stringify(transaccionesIniciales));
}

// Función auxiliar para esperar unos milisegundos (simular red)
function esperar(ms = 350) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const api = {
  // Auth
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Error en credenciales");
    }
    return await res.json();
  },

  async register(username, password) {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Error al registrar");
    }
    return await res.json();
  },

  // Obtener todos los movimientos
  async obtenerTransacciones() {
    if (usarMock) {
      await esperar();
      const datosStr = localStorage.getItem('finance_transactions') || '[]';
      return JSON.parse(datosStr);
    } else {
      const respuesta = await fetch(apiUrl + '/transactions', { headers: getHeaders() });
      if (!respuesta.ok) {
        if (respuesta.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        let errorMsg = "Error en el servidor al obtener datos";
        try {
          const errJson = await respuesta.json();
          if (errJson && errJson.detail) errorMsg = errJson.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return await respuesta.json();
    }
  },

  // Crear un nuevo movimiento
  async crearTransaccion(nuevaTx) {
    if (usarMock) {
      await esperar();
      const txs = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
      const txConId = {
        ...nuevaTx,
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        amount: parseFloat(nuevaTx.amount),
        createdAt: new Date().toISOString()
      };
      txs.push(txConId);
      localStorage.setItem('finance_transactions', JSON.stringify(txs));
      return txConId;
    } else {
      const respuesta = await fetch(apiUrl + '/transactions', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(nuevaTx)
      });
      if (!respuesta.ok) {
        let errorMsg = "Error al crear en el servidor";
        try {
          const errJson = await respuesta.json();
          if (errJson && errJson.detail) errorMsg = errJson.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return await respuesta.json();
    }
  },

  // Actualizar un movimiento
  async actualizarTransaccion(id, datosActualizados) {
    if (usarMock) {
      await esperar();
      const txs = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
      const index = txs.findIndex(t => t.id === id);
      if (index === -1) throw new Error("No se encontró el movimiento");
      
      const txModificada = {
        ...txs[index],
        ...datosActualizados,
        amount: parseFloat(datosActualizados.amount)
      };
      txs[index] = txModificada;
      localStorage.setItem('finance_transactions', JSON.stringify(txs));
      return txModificada;
    } else {
      const respuesta = await fetch(`${apiUrl}/transactions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datosActualizados)
      });
      if (!respuesta.ok) {
        let errorMsg = "Error al actualizar en el servidor";
        try {
          const errJson = await respuesta.json();
          if (errJson && errJson.detail) errorMsg = errJson.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return await respuesta.json();
    }
  },

  // Eliminar un movimiento
  async borrarTransaccion(id) {
    if (usarMock) {
      await esperar();
      let txs = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
      txs = txs.filter(t => t.id !== id);
      localStorage.setItem('finance_transactions', JSON.stringify(txs));
      return { success: true };
    } else {
      const respuesta = await fetch(`${apiUrl}/transactions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!respuesta.ok) {
        let errorMsg = "Error al eliminar en el servidor";
        try {
          const errJson = await respuesta.json();
          if (errJson && errJson.detail) errorMsg = errJson.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return { success: true };
    }
  },

  // Genera recomendaciones de ahorro simples basadas en reglas de lógica tradicionales
  async generarRecomendaciones(transacciones, resumen) {
    const lista = [];
    const { totalIncome, totalExpenses, netBalance } = resumen;

    if (transacciones.length === 0) {
      lista.push({
        id: "rec-1",
        type: "info",
        title: "Ingresa tu primer movimiento",
        message: "Aún no tienes registros. Empieza agregando tus ingresos y gastos.",
        actionableTip: "Usa el botón de Registrar Movimiento para empezar."
      });
      return lista;
    }

    // Regla 1: Gastas más de lo que ganas
    if (netBalance < 0) {
      lista.push({
        id: "rec-2",
        type: "danger",
        title: "Gastos superiores a ingresos",
        message: "¡Cuidado! Estás gastando más dinero del que recibes este mes.",
        actionableTip: "Evita compras no esenciales e intenta recortar gastos de ocio."
      });
    }

    // Regla 2: Ratio de ahorro
    if (totalIncome > 0) {
      const porcentajeGasto = (totalExpenses / totalIncome) * 100;
      if (porcentajeGasto > 80) {
        lista.push({
          id: "rec-3",
          type: "warning",
          title: "Tasa de ahorro muy baja",
          message: `Estás gastando el ${porcentajeGasto.toFixed(0)}% de tus ingresos totales.`,
          actionableTip: "La regla de oro es ahorrar al menos el 20% de tus ingresos."
        });
      } else if (porcentajeGasto < 50) {
        lista.push({
          id: "rec-4",
          type: "success",
          title: "¡Excelente capacidad de ahorro!",
          message: `Estás ahorrando más de la mitad de tus ingresos este mes.`,
          actionableTip: "Considera invertir una parte de este ahorro mensual para hacerlo crecer."
        });
      }
    }

    // Regla 3: Comida fuera de casa
    let gastoComida = 0;
    for (let i = 0; i < transacciones.length; i++) {
      if (transacciones[i].type === 'expense' && transacciones[i].category === 'Food') {
        gastoComida += transacciones[i].amount;
      }
    }

    if (totalIncome > 0 && gastoComida > 0) {
      const porcentajeComida = (gastoComida / totalIncome) * 100;
      if (porcentajeComida > 25) {
        lista.push({
          id: "rec-5",
          type: "warning",
          title: "Elevado gasto en alimentación",
          message: `La comida representa el ${porcentajeComida.toFixed(0)}% de tus ingresos totales.`,
          actionableTip: "Organiza tu despensa y prefiere cocinar en casa para evitar comer fuera."
        });
      }
    }

    return lista;
  }
};
