import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  // Leemos el usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Si no hay usuario o el rol no es 'admin', lo sacamos de aquí
  if (!user || user.rol !== '2') {
    return <Navigate to="/" />;
  }

  // Si es admin, lo dejamos pasar al contenido (children)
  return children;
};