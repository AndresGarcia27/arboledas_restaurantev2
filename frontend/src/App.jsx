import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import { Hero } from './sections/Hero';
import { Menu } from './sections/Menu';
import { Chef } from './sections/Chef';
import { Tradicion } from './sections/Tradicion';
import { Contacto } from './sections/Contacto';
import Login from './pages/Login';
import RegistroCliente from './pages/RegistroCliente';
import ListadoClientes from './pages/ListadoClientes';
import EditarCliente from './pages/EditarCliente';
import { ProtectedRoute } from './components/ProtectedRoute';

// Asegúrate de que la ruta del archivo PanelCliente sea correcta según donde lo guardaste
import PanelCliente from './components/PanelCliente'; 

const PaginaRestaurante = () => (
  <>
    <Navbar />
    <div id="inicio"><Hero /></div>
    <div id="carta"><Menu /></div>
    <div id="chef"><Chef /></div>
    <div id="tradicion"><Tradicion /></div>
    <div id="contacto"><Contacto /></div>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaRestaurante />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroCliente />} />
        
        {/* Solo el admin puede entrar aquí */}
        <Route path="/listado-clientes" element={
          <ProtectedRoute>
            <ListadoClientes />
          </ProtectedRoute>
        } />
        
        <Route path="/editar-cliente/:id" element={<EditarCliente />} />

        {/* 👇 NUEVA RUTA PARA EL CLIENTE 👇 */}
        <Route path="/mis-reservas" element={
          <ProtectedRoute>
            <PanelCliente />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;