import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Utensils, Calendar, LogOut, Home, Plus, Edit, Trash2, X, DollarSign, RefreshCw } from 'lucide-react';
import '../Admin.css';

export default function ListadoClientes() {
  const navigate = useNavigate();
  const [tabActual, setTabActual] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pedidos, setPedidos] = useState([]); // 👈 ESTADO PARA LAS VENTAS
  const [loading, setLoading] = useState(true);

  // --- ESTADOS PARA MODAL DE PRODUCTOS ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [productoForm, setProductoForm] = useState({ nombre: '', precio: '', categoria_id: 1, imagen: null });

  // --- ESTADOS PARA MODAL DE RESERVAS ---
  const [modalReserva, setModalReserva] = useState(false);
  const [modoReserva, setModoReserva] = useState('crear');
  const [reservaForm, setReservaForm] = useState({ cliente_id: '', fecha: '', hora: '', personas: 2, estado: 'pendiente' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
    if (!user || Number(user.rol || user.rol_id) !== 1) { navigate('/login'); return; }
    cargarDatos();
  }, [navigate, tabActual]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (tabActual === 'clientes') {
        const res = await fetch('http://127.0.0.1:8000/api/clientes');
        if (res.ok) setClientes(await res.json());
      } else if (tabActual === 'productos') {
        const res = await fetch('http://127.0.0.1:8000/api/productos');
        if (res.ok) setProductos(await res.json());
      } else if (tabActual === 'reservas') {
        const resCli = await fetch('http://127.0.0.1:8000/api/clientes');
        if (resCli.ok) setClientes(await resCli.json());
        
        const resRes = await fetch('http://127.0.0.1:8000/api/reservas');
        if (resRes.ok) setReservas(await resRes.json());
      } else if (tabActual === 'ventas') { // 👈 CARGAMOS LAS VENTAS DESDE LARAVEL
        const res = await fetch('http://127.0.0.1:8000/api/pedidos');
        if (res.ok) setPedidos(await res.json());
      }
    } catch (error) { console.error("Error:", error); } 
    finally { setLoading(false); }
  };

  // --- LÓGICA CLIENTES ---
  const handleDeleteCliente = async (id) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && (storedUser.id === id || storedUser.cliente_id === id)) {
      alert("¡No puedes eliminar tu propia cuenta de administrador mientras estás en sesión!");
      return;
    }
    if (window.confirm("¿Seguro que deseas eliminar a este cliente? Se borrarán también sus reservas y pedidos.")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/clientes/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' }});
        if (res.ok) { setClientes(clientes.filter(c => c.cliente_id !== id)); alert("¡Cliente eliminado con éxito!"); } 
        else { alert("No se pudo eliminar al cliente. Revisa la conexión."); }
      } catch (error) { console.error("Error al eliminar:", error); }
    }
  };

  // --- LÓGICA PRODUCTOS ---
  const handleDeleteProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este plato?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' }});
      if (res.ok) { setProductos(productos.filter(p => p.producto_id !== id)); alert("¡Plato eliminado!"); }
    }
  };
  const abrirModalCrear = () => { setModoModal('crear'); setProductoForm({ nombre: '', precio: '', categoria_id: 1, imagen: null }); setModalAbierto(true); };
  const abrirModalEdicion = (producto) => { setModoModal('editar'); setProductoForm({ ...producto, categoria_id: producto.categoria_id || 1, imagen: null }); setModalAbierto(true); };
  const guardarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', productoForm.nombre); formData.append('precio', productoForm.precio); formData.append('categoria_id', productoForm.categoria_id);
    if (productoForm.imagen) formData.append('imagen', productoForm.imagen);
    let url = 'http://127.0.0.1:8000/api/productos'; let method = 'POST';
    if (modoModal === 'editar') { url = `http://127.0.0.1:8000/api/productos/${productoForm.producto_id}`; formData.append('_method', 'PUT'); }
    const res = await fetch(url, { method: method, headers: { 'Accept': 'application/json' }, body: formData });
    if (res.ok) { setModalAbierto(false); alert("¡Plato guardado!"); cargarDatos(); }
  };

  // --- LÓGICA RESERVAS ---
  const handleDeleteReserva = async (id) => {
    if (window.confirm("¿Seguro que deseas cancelar y eliminar esta reserva?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/reservas/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' }});
      if (res.ok) { setReservas(reservas.filter(r => r.reserva_id !== id)); alert("¡Reserva eliminada!"); }
    }
  };

  const abrirCrearReserva = async () => { 
    setModoReserva('crear'); 
    setReservaForm({ cliente_id: '', fecha: '', hora: '', personas: 2, estado: 'pendiente' }); 
    setModalReserva(true); 
    try {
      const res = await fetch('http://127.0.0.1:8000/api/clientes');
      if (res.ok) setClientes(await res.json());
    } catch (error) { console.error("Error buscando clientes:", error); }
  };

  const abrirEditarReserva = (reserva) => { setModoReserva('editar'); setReservaForm(reserva); setModalReserva(true); };
  
  const guardarReserva = async (e) => {
    e.preventDefault();
    if (!reservaForm.cliente_id) { alert("Por favor, selecciona un cliente de la lista."); return; }
    let url = 'http://127.0.0.1:8000/api/reservas'; let method = 'POST';
    if (modoReserva === 'editar') { url = `http://127.0.0.1:8000/api/reservas/${reservaForm.reserva_id}`; method = 'PUT'; }
    try {
      const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(reservaForm) });
      if (res.ok) { setModalReserva(false); alert("¡Reserva guardada!"); cargarDatos(); }
      else { alert("Error al guardar la reserva. Verifica los datos."); }
    } catch (error) { console.error("Error guardando reserva:", error); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header"><h2>ARBOLEDA</h2><span>Panel Admin</span></div>
        <nav className="sidebar-nav">
          <button onClick={() => setTabActual('clientes')} className={tabActual === 'clientes' ? 'active' : ''}><Users size={20} /> Clientes</button>
          <button onClick={() => setTabActual('productos')} className={tabActual === 'productos' ? 'active' : ''}><Utensils size={20} /> Productos</button>
          <button onClick={() => setTabActual('reservas')} className={tabActual === 'reservas' ? 'active' : ''}><Calendar size={20} /> Reservas</button>
          {/* 👇 NUEVA PESTAÑA DE VENTAS 👇 */}
          <button onClick={() => setTabActual('ventas')} className={tabActual === 'ventas' ? 'active' : ''}><DollarSign size={20} /> Ventas</button>
          
          <hr style={{borderColor: '#333', margin: '20px 0'}} />
          <Link to="/" className="sidebar-link"><Home size={20} /> Volver al Sitio</Link>
          <button onClick={handleLogout} className="sidebar-link logout"><LogOut size={20} /> Salir</button>
        </nav>
      </aside>

      <main className="admin-main">
      <header className="main-header">
          <h1>{tabActual === 'clientes' ? 'Gestión de Clientes' : tabActual === 'productos' ? 'Gestión de Menú' : tabActual === 'reservas' ? 'Control de Reservas' : 'Historial de Ventas'}</h1>
          
          <div style={{display: 'flex', gap: '10px'}}>
            {/* 👇 NUEVO BOTÓN DE ACTUALIZAR 👇 */}
            <button onClick={cargarDatos} className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
              <RefreshCw size={18} /> Actualizar
            </button>

            {tabActual === 'productos' && <button onClick={abrirModalCrear} className="btn-add-gold"><Plus size={18} /> Nuevo Producto</button>}
            {tabActual === 'reservas' && <button onClick={abrirCrearReserva} className="btn-add-gold" style={{background: '#4CAF50', color: 'white'}}><Calendar size={18} /> Nueva Reserva</button>}
          </div>
        </header>

        <section className="table-container">
          {loading ? ( <div style={{color: '#d4af37', fontSize: '1.2rem'}}>Cargando datos...</div> ) : (
            <>
              {/* TABLA CLIENTES */}
              {tabActual === 'clientes' && (
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.cliente_id}>
                        <td>#{c.cliente_id}</td><td>{c.nombre}</td><td>{c.email}</td>
                        <td><span className={`badge rol-${c.rol}`}>{Number(c.rol) === 1 ? 'ADMIN' : 'CLIENTE'}</span></td>
                        <td>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <Link to={`/editar-cliente/${c.cliente_id}`} className="btn-icon edit" style={{color: '#4CAF50'}}><Edit size={18} /></Link>
                            <button onClick={() => handleDeleteCliente(c.cliente_id)} className="btn-icon delete" style={{color: '#f44336', background:'none', border:'none', cursor:'pointer'}}><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TABLA PRODUCTOS */}
              {tabActual === 'productos' && (
                <table className="admin-table">
                  <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {productos.length > 0 ? productos.map(p => (
                      <tr key={p.producto_id}>
                        <td><img src={p.imagen_url || 'https://via.placeholder.com/50'} alt={p.nombre} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} /></td>
                        <td><strong>{p.nombre}</strong></td><td>{p.categoria?.nombre || 'General'}</td><td>${Number(p.precio).toLocaleString()}</td>
                        <td><div style={{display: 'flex', gap: '10px'}}><button onClick={() => abrirModalEdicion(p)} className="btn-icon edit" style={{color: '#4CAF50', background:'none', border:'none', cursor:'pointer'}}><Edit size={18} /></button><button onClick={() => handleDeleteProducto(p.producto_id)} className="btn-icon delete" style={{color: '#f44336', background:'none', border:'none', cursor:'pointer'}}><Trash2 size={18} /></button></div></td>
                      </tr>
                    )) : <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#666'}}>No hay productos.</td></tr>}
                  </tbody>
                </table>
              )}

              {/* TABLA RESERVAS */}
              {tabActual === 'reservas' && (
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Cliente</th><th>Fecha y Hora</th><th>Personas</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {reservas.length > 0 ? reservas.map(r => (
                      <tr key={r.reserva_id}>
                        <td>#{r.reserva_id}</td>
                        <td><strong>{r.cliente?.nombre || 'Desconocido'}</strong></td>
                        <td>{r.fecha} - {r.hora}</td>
                        <td>{r.personas} pers.</td>
                        <td><span className={`badge ${r.estado === 'confirmada' ? 'rol-1' : r.estado === 'cancelada' ? 'rol-3' : 'rol-2'}`}>{r.estado ? r.estado.toUpperCase() : 'PENDIENTE'}</span></td>
                        <td>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <button onClick={() => abrirEditarReserva(r)} className="btn-icon edit" style={{color: '#4CAF50', background:'none', border:'none', cursor:'pointer'}}><Edit size={18} /></button>
                            <button onClick={() => handleDeleteReserva(r.reserva_id)} className="btn-icon delete" style={{color: '#f44336', background:'none', border:'none', cursor:'pointer'}}><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666'}}>No hay reservas por el momento.</td></tr>}
                  </tbody>
                </table>
              )}

              {/* 👇 NUEVA TABLA DE VENTAS 👇 */}
              {tabActual === 'ventas' && (
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Cliente</th><th>Producto</th><th>Total</th><th>Fecha</th><th>Estado</th></tr></thead>
                  <tbody>
                    {pedidos.length > 0 ? pedidos.map(pedido => (
                      <tr key={pedido.id || pedido.pedido_id}>
                        <td>#{pedido.id || pedido.pedido_id}</td>
                        <td><strong>{pedido.cliente?.nombre || 'Desconocido'}</strong></td>
                        <td>{pedido.producto?.nombre || `Producto #${pedido.producto_id}`}</td>
                        <td style={{ color: '#2e7d32', fontWeight: 'bold' }}>${parseFloat(pedido.total).toLocaleString()} COP</td>
                        <td>{pedido.fecha}</td>
                        <td>
                          <span className={`badge ${pedido.estado === 'pagado' ? 'rol-1' : 'rol-2'}`}>
                            {pedido.estado ? pedido.estado.toUpperCase() : 'PENDIENTE'}
                          </span>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666'}}>Todavía no hay ventas registradas.</td></tr>}
                  </tbody>
                </table>
              )}

            </>
          )}
        </section>
      </main>

      {/* --- MODALES (NO SE MODIFICARON) --- */}
      {/* ... (Se mantienen igual los modales de productos y reservas) ... */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: '#333'}}>{modoModal === 'crear' ? 'Añadir Nuevo Plato' : 'Editar Plato'}</h2>
              <button onClick={() => setModalAbierto(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#999'}}><X size={24} /></button>
            </div>
            <form onSubmit={guardarProducto} className="admin-form">
              <label>Nombre del Plato</label><input type="text" value={productoForm.nombre} onChange={(e) => setProductoForm({...productoForm, nombre: e.target.value})} required />
              <label>Precio ($)</label><input type="number" value={productoForm.precio} onChange={(e) => setProductoForm({...productoForm, precio: e.target.value})} required />
              <label>Categoría</label>
              <select value={productoForm.categoria_id} onChange={(e) => setProductoForm({...productoForm, categoria_id: e.target.value})} required style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc'}}>
                <option value="1">Platos Fuertes</option><option value="2">Postres</option><option value="3">Bebidas</option><option value="4">Entradas</option><option value="5">Licores</option>
              </select>
              <label>Imagen del Plato (Opcional)</label><input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => setProductoForm({...productoForm, imagen: e.target.files[0]})} style={{marginBottom: '15px'}}/>
              <button type="submit" className="btn-primary" style={{marginTop: '15px'}}>{modoModal === 'crear' ? 'Crear Plato' : 'Guardar Cambios'}</button>
            </form>
          </div>
        </div>
      )}

      {modalReserva && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: '#333'}}>{modoReserva === 'crear' ? 'Añadir Reserva Manual' : 'Editar Reserva'}</h2>
              <button onClick={() => setModalReserva(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#999'}}><X size={24} /></button>
            </div>
            <form onSubmit={guardarReserva} className="admin-form">
              <label>Cliente</label>
              <select value={reservaForm.cliente_id} onChange={(e) => setReservaForm({...reservaForm, cliente_id: e.target.value})} required style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc'}}>
                <option value="">Selecciona un cliente...</option>
                {clientes && clientes.length > 0 ? ( clientes.map(c => ( <option key={c.cliente_id} value={c.cliente_id}>{c.nombre} ({c.email})</option> )) ) : ( <option value="" disabled>No se encontraron clientes registrados...</option> )}
              </select>
              <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}><label>Fecha</label><input type="date" value={reservaForm.fecha} onChange={(e) => setReservaForm({...reservaForm, fecha: e.target.value})} required style={{width: '100%'}}/></div>
                <div style={{flex: 1}}><label>Hora</label><input type="time" value={reservaForm.hora} onChange={(e) => setReservaForm({...reservaForm, hora: e.target.value})} required style={{width: '100%'}}/></div>
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <div style={{flex: 1}}><label>N° Personas</label><input type="number" min="1" value={reservaForm.personas} onChange={(e) => setReservaForm({...reservaForm, personas: e.target.value})} required style={{width: '100%'}}/></div>
                <div style={{flex: 1}}><label>Estado</label>
                  <select value={reservaForm.estado} onChange={(e) => setReservaForm({...reservaForm, estado: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
                    <option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{marginTop: '20px', width: '100%'}}>{modoReserva === 'crear' ? 'Crear Reserva' : 'Guardar Cambios'}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}