import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../Admin.css'; 

export default function Checkout() {
  const { cart, totalPrecio } = useCart() || {};
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const safeCart = Array.isArray(cart) ? cart : [];
  const safeTotal = typeof totalPrecio === 'number' ? totalPrecio : 0;

  const pagarConMercadoPago = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert("Por favor inicia sesión para poder hacer tu pedido.");
      navigate('/login');
      return;
    }

    setCargando(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ cart: safeCart })
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        // 👇 AQUÍ ESTÁ LA MAGIA: Guardamos el carrito en la "mochila" antes de irnos 👇
        localStorage.setItem('temp_cart', JSON.stringify(safeCart));
        
        window.location.href = data.init_point;
      } else {
        alert("Hubo un error al conectar con Mercado Pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  if (safeCart.length === 0) {
    return (
      <div className="admin-page" style={{textAlign: 'center', paddingTop: '100px'}}>
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al Menú</button>
      </div>
    );
  }

  return (
    <div className="admin-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <div className="admin-card" style={{maxWidth: '500px', width: '100%', textAlign: 'center'}}>
        <h2>Finalizar Compra</h2>
        <div style={{margin: '20px 0', padding: '20px', background: '#f9f9f9', borderRadius: '10px'}}>
          <h3>Total a Pagar:</h3>
          <h2 style={{color: '#d4af37'}}>${safeTotal.toLocaleString()} COP</h2>
        </div>

        <button 
          onClick={pagarConMercadoPago} 
          className="btn-primary" 
          disabled={cargando}
          style={{background: '#009EE3', width: '100%', fontSize: '1.1rem'}}
        >
          {cargando ? 'Cargando plataforma...' : 'Pagar con Mercado Pago'}
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{width: '100%', marginTop: '10px'}}>
          Volver al restaurante
        </button>
      </div>
    </div>
  );
}