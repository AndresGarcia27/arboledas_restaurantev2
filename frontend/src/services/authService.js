// src/services/authService.js

const API_URL = '[http://127.0.0.1:8000]'; // Cambia esto por la URL real de tu backend

export const loginUsuario = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Convertimos los datos a texto JSON para enviarlos
      body: JSON.stringify({ email, password }), 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // Si todo sale bien, guardamos el token en el navegador
    if (data.token) {
      localStorage.setItem('arboledas_token', data.token);
      localStorage.setItem('arboledas_user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUsuario = () => {
  // Para cerrar sesión, simplemente borramos los datos
  localStorage.removeItem('arboledas_token');
  localStorage.removeItem('arboledas_user');
};
// Añade esto al final de src/services/authService.js
export const obtenerCabecerasConToken = () => {
  const token = localStorage.getItem('arboledas_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};