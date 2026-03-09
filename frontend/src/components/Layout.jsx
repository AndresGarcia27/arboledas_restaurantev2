import { Link, Outlet } from 'react-router-dom';
import { Home, UserPlus } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-green-700">Arboleda's</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-700 transition-colors">
            <Home size={20} /> 
            Inicio
          </Link>
          <Link to="/registro" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-700 transition-colors">
            <UserPlus size={20} /> 
            Registrar Cliente
          </Link>
        </nav>
      </aside>

      {/* Contenedor Principal (Aquí cargan las demás pantallas) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}