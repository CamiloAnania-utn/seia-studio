// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://seia-studio-backend.onrender.com/api';

// --- SERVICIOS DEL CATÁLOGO ---
export const fetchCatalogo = async () => {
  const response = await fetch(`${API_URL}/catalogo`);
  if (!response.ok) throw new Error('Error al cargar el catálogo');
  return await response.json();
};

export const createCatalogoItem = async (data) => {
  const response = await fetch(`${API_URL}/catalogo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear el servicio');
  return await response.json();
};

// --- CATEGORÍAS DE GASTOS ---

// Obtener todas las categorías (para los gastos)
export const fetchCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return await response.json();
  } catch (error) {
    console.error('Error en fetchCategorias:', error);
    throw error;
  }
};

// Crear una categoría corrigiendo el alcance (scope)
export const createCategoria = async (data) => {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Error al crear la categoría');
    return await response.json();
    
  } catch (error) {
    console.error('Error en createCategoria:', error);
    throw error;
  }
};


// Enviar una nueva transacción (Ingreso o Egreso) al backend
export const crearTransaccion = async (transaccionData) => {
  try {
    const response = await fetch(`${API_URL}/transacciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaccionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearTransaccion:', error);
    throw error;
  }
};

// Obtener el historial completo de transacciones
export const fetchTransacciones = async () => {
  try {
    const response = await fetch(`${API_URL}/transacciones`);
    if (!response.ok) throw new Error('Error al obtener el historial');
    return await response.json();
  } catch (error) {
    console.error('Error en fetchTransacciones:', error);
    throw error;
  }
};

// --- ABMC CATÁLOGO (Edición y Baja) ---
export const updateCatalogoItem = async (id, data) => {
  const response = await fetch(`${API_URL}/catalogo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar el servicio');
  return await response.json();
};

export const deleteCatalogoItem = async (id) => {
  const response = await fetch(`${API_URL}/catalogo/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar el servicio');
  return await response.json();
};

// Editar una categoría existente corrigiendo el alcance (scope)
export const updateCategoria = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Error al actualizar la categoría');
    return await response.json();
    
  } catch (error) {
    console.error('Error en updateCategoria:', error);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar la categoría');
  return await response.json();
};

// NUEVO: Anular/Eliminar una transacción errónea
export const deleteTransaccion = async (id) => {
  const response = await fetch(`${API_URL}/transacciones/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al anular la transacción');
  return await response.json();
};