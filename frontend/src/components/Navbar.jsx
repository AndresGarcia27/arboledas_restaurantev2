import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CarritoSidebar from './CarritoSidebar';
import '../Admin.css'; 

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar-arboleda">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo">ARBOLEDA</Link>
            <div className="nav-menu">
              <a href="#inicio">INICIO</a>
              <a href="#carta">CARTA</a>
              <a href="#contacto">CONTACTO</a>
            </div>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                {user.rol === '1' && (
                  <div className="cart-icon-container" onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', position: 'relative', marginRight: '25px' }}>
                    <ShoppingCart size={24} color="#d4af37" />
                    {itemCount > 0 && <span className="cart-badge-navbar">{itemCount}</span>}
                  </div>
                )}
                <span className="welcome-text">HOLA, {user.nombre}</span>
                {user.rol === '2' && <Link to="/listado-clientes" className="btn-admin-panel">GESTIÓN</Link>}
                <button onClick={handleLogout} className="btn-logout">CERRAR SESIÓN</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/registro" className="link-simple">REGISTRARSE</Link>
                <Link to="/login" className="btn-acceder-gold"><User size={18} /> ACCEDER</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <CarritoSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}