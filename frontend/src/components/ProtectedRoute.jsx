import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  // 1. BLINDAJE: Leemos el usuario del localStorage de forma segura
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  // 2. EXTRACCIÓN SEGURA DEL ROL
  const userRole = user ? Number(user.rol || user.rol_id) : null;

  // 3. LÓGICA DE PROTECCIÓN:
  // Si no hay usuario O el rol no es 1 (Admin), lo mandamos al inicio
  if (!user || userRole !== 1) {
    return <Navigate to="/" />;
  }

  // Si es admin (Rol 1), lo dejamos pasar al contenido (children)
  return children;
};