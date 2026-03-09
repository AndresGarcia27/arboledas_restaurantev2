import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CarritoSidebar.css';

export default function CarritoSidebar({ isOpen, onClose }) {
  const { cart, addToCart, removeFromCart, totalPrecio, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout'); // Aquí iremos a la pasarela de pagos después
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        
        <header className="cart-header">
          <div className="header-title">
            <ShoppingBag size={24} color="#d4af37" />
            <h2>Tu Pedido</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={28} />
          </button>
        </header>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Aún no has añadido delicias de la Arboleda.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.nombre} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.nombre}</h4>
                  <p className="cart-item-price">${item.precio.toLocaleString()}</p>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => removeFromCart(item.id, false)}><Minus size={14} /></button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                    </div>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id, true)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <footer className="cart-footer">
            <div className="total-row">
              <span>Total a pagar:</span>
              <span className="total-amount">${totalPrecio.toLocaleString()}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              PROCEDER AL PAGO
            </button>
            <button className="btn-clear" onClick={clearCart}>
              Vaciar Carrito
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}