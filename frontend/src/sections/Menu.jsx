import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ScrollText, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Menu.css';

export const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('entradas');
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart() || {};

  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
  const userRole = user ? Number(user.rol || user.rol_id) : null;

  // --- NUEVOS ESTADOS PARA EL MENÚ DINÁMICO ---
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tus datos originales ahora sirven como "Salvavidas" (Fallback)
  const fallbackItems = {
    entradas: [
      { id: 1, name: "Ceviche de Mango Biche", desc: "Mango biche, leche de tigre de coco.", price: "$28.000", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop" },
      { id: 2, name: "Carpaccio de Res", desc: "Lomito fino, alcaparras y trufa.", price: "$35.000", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop" },
      { id: 3, name: "Chicharrones de Pulpo", desc: "Pulpo crocante con papa criolla.", price: "$42.000", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop" }
    ],
    fuertes: [
      { id: 4, name: "Lomo al Trapo", desc: "Solomito envuelto en tela con sal marina.", price: "$65.000", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
      { id: 5, name: "Salmón Cítrico", desc: "Salsa de maracuyá y puré criollo.", price: "$58.000", img: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=600&auto=format&fit=crop" },
      { id: 6, name: "Risotto de Setas", desc: "Arroz arborio y hongos silvestres.", price: "$48.000", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop" }
    ],
    postres: [
      { id: 7, name: "Volcán de Chocolate", desc: "Bizcocho tibio con helado.", price: "$22.000", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop" },
      { id: 8, name: "Cheesecake de Frutos", desc: "Reducción de moras silvestres.", price: "$20.000", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop" }
    ],
    bebidas: [
        { id: 10, name: "Limonada de Coco", desc: "Cremosa y natural.", price: "$14.000", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop" }
    ],
    licores: [
        { id: 13, name: "Gin Tonic Botánico", desc: "Ginebra premium.", price: "$35.000", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop" }
    ]
  };

  // --- CARGAMOS LOS DATOS DESDE LARAVEL ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/productos');
        if (res.ok) {
          const data = await res.json();
          
          // Si hay datos en la BD, los organizamos por pestañas
          if (data.length > 0) {
            const agrupados = { entradas: [], fuertes: [], postres: [], bebidas: [], licores: [] };
            
            data.forEach(plato => {
              // Convertimos el nombre de la categoría o asumimos "fuertes"
              let catName = plato.categoria?.nombre?.toLowerCase() || 'fuertes';
              
              // Normalizamos para que encaje exacto en tus pestañas
              if(catName.includes('entrada')) catName = 'entradas';
              else if(catName.includes('postre')) catName = 'postres';
              else if(catName.includes('bebida')) catName = 'bebidas';
              else if(catName.includes('licor') || catName.includes('coctel')) catName = 'licores';
              else catName = 'fuertes';

              agrupados[catName].push({
                id: plato.producto_id,
                name: plato.nombre,
                desc: plato.descripcion || 'Especialidad de la casa.',
                price: `$${Number(plato.precio).toLocaleString()}`,
                img: plato.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'
              });
            });
            setMenuData(agrupados);
          } else {
            setMenuData(fallbackItems); // Si la BD está vacía, mostramos los falsos
          }
        }
      } catch (error) {
        console.error("Error conectando a Laravel:", error);
        setMenuData(fallbackItems); // Si el servidor cae, la web sigue viva
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleOrder = (item) => {
    if (!addToCart) return; 
    const precioNumerico = parseInt(item.price.replace(/[^0-9]/g, ''));
    addToCart({ id: item.id, nombre: item.name, precio: precioNumerico, img: item.img });
    setNotification(`Se agregó "${item.name}" a tu pedido.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = [
    { id: 'entradas', label: 'Entradas' },
    { id: 'fuertes', label: 'Platos Fuertes' },
    { id: 'postres', label: 'Postres' },
    { id: 'bebidas', label: 'Bebidas' }, 
    { id: 'licores', label: 'Licores' }
  ];

  // Esperamos a que cargue para no romper la pantalla
  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#d4af37'}}>Cargando la carta...</div>;

  // Extraemos solo los platos de la categoría que el usuario está viendo
  const itemsToShow = menuData[activeCategory] || [];

  return (
    <section id="carta" className="menu-section">
      <div className="container">
        <div className="section-badge"></div>
        <h2>Nuestra Carta</h2>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button key={cat.id} className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
           {itemsToShow.length > 0 ? itemsToShow.map((item) => (
             <div key={item.id} className="menu-item">
               <div className="menu-image-container"><img src={item.img} alt={item.name} /></div>
               <div className="menu-text">
                 <div className="menu-header"><h3>{item.name}</h3><span className="price">{item.price}</span></div>
                 <p>{item.desc}</p>
                 
                 {userRole === 2 ? (
                   <button className="btn-order" onClick={() => handleOrder(item)}>
                     <ShoppingBag size={16} /> Pedir
                   </button>
                 ) : (
                   <p className="msg-login-order">
                     {userRole === 1 
                       ? "Modo administrador activo." 
                       : "Inicia sesión para pedir."}
                   </p>
                 )}
               </div>
             </div>
           )) : (
             <p style={{color: '#999', textAlign: 'center', gridColumn: '1 / -1'}}>No hay platos en esta categoría por ahora.</p>
           )}
        </div>
        
        <div className="full-menu-container">
            <button className="btn-full-menu" onClick={() => setShowModal(true)}><ScrollText size={20} /> Ver Carta Completa</button>
        </div>
      </div>

      {notification && <div className="order-notification"><Check size={20} /> {notification}</div>}

      {/* MODAL CARTA COMPLETA */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}><X size={28} /></button>
            <div className="modal-header"><h2>ARBOLEDA</h2><p>MENÚ DE DEGUSTACIÓN</p></div>
            <div className="modal-body">
              {Object.entries(menuData).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="full-menu-category">
                    <h3 style={{textTransform: 'uppercase'}}>{category}</h3>
                    <ul>{items.map((item, index) => (
                        <li key={index}><span className="dish-name">{item.name}</span><div className="dotted-line"></div><span className="dish-price">{item.price}</span></li>
                    ))}</ul>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};