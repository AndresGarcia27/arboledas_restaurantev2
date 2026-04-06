// src/services/authService.js

// Conectamos automáticamente con la URL de Railway que pusiste en tu .env
const API_URL = import.meta.env.VITE_API_URL; 

export const loginUsuario = async (email, password) => {
  try {
    // IMPORTANTE: Verifica si tu ruta en Laravel es /login o /auth/login.
    // Lo dejé como /login para que coincida con tu imagen anterior.
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // 👈 Línea mágica para evitar la pantalla roja de Laravel
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

export const obtenerCabecerasConToken = () => {
  const token = localStorage.getItem('arboledas_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // 👈 También la ponemos aquí para proteger el resto de la app
    'Authorization': token ? `Bearer ${token}` : ''
  };
};