import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('arboleda_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('arboleda_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
          return prev.map(item => item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id, all = false) => {
    setCart(prev => {
      if (all) return prev.filter(item => item.id !== id);
      return prev.map(item => item.id === id ? { ...item, cantidad: Math.max(0, item.cantidad - 1) } : item).filter(item => item.cantidad > 0);
    });
  };

  const clearCart = () => setCart([]);
  const totalPrecio = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);