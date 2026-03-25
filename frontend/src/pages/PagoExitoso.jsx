import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import '../Admin.css';

export default function PagoExitoso() {
  const { clearCart } = useCart() || {};
  const navigate = useNavigate();
  const location = useLocation(); 
  const [estado, setEstado] = useState('procesando');
  const pedidoGuardado = useRef(false); 

  useEffect(() => {
    const registrarPago = async () => {
      if (pedidoGuardado.current) return;
      
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get('payment_id');
      const status = searchParams.get('status');

      if (status !== 'approved') {
        setEstado('error');
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idCliente = storedUser ? (storedUser.cliente_id || storedUser.id) : null;

      // 👇 AQUÍ ESTÁ LA MAGIA: Sacamos el carrito de la "mochila" 👇
      const savedCart = JSON.parse(localStorage.getItem('temp_cart'));

      if (!idCliente || !savedCart || savedCart.length === 0) {
         setEstado('error');
         return;
      }

      pedidoGuardado.current = true;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            cliente_id: idCliente,
            cart: savedCart, // 👈 Enviamos el carrito recuperado
            payment_id: paymentId
          })
        });

        if (response.ok) {
          setEstado('exito');
          if (clearCart) clearCart(); 
          localStorage.removeItem('temp_cart'); // Borramos la mochila porque ya terminamos
        } else {
          setEstado('error_db');
        }
      } catch (error) {
        console.error(error);
        setEstado('error_db');
      }
    };

    registrarPago();
  }, [location, clearCart]);

  return (
    <div className="admin-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <div className="admin-card" style={{maxWidth: '500px', width: '100%', textAlign: 'center'}}>
        
        {estado === 'procesando' && <h2>Procesando tu pago...</h2>}
        
        {estado === 'exito' && (
          <div className="res-success">
            <CheckCircle size={60} style={{color: '#4CAF50', margin: '0 auto 20px'}} />
            <h2>¡Pago Exitoso!</h2>
            <p>Hemos recibido tu pedido. Nuestro equipo ya comenzó a prepararlo.</p>
            <button className="btn-primary" onClick={() => navigate('/')} style={{marginTop: '20px'}}>Volver al Inicio</button>
          </div>
        )}

        {estado.includes('error') && (
          <div>
            <h2 style={{color: '#f44336'}}>Hubo un problema procesando tu orden</h2>
            <p>Si pagaste en Mercado Pago, revisa tus pedidos o contáctanos.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Volver al Inicio</button>
          </div>
        )}

      </div>
    </div>
  );
}