import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, LogOut, Home } from 'lucide-react';
import '../Admin.css'; 

export default function PanelCliente() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [misReservas, setMisReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reservaForm, setReservaForm] = useState({ fecha: '', hora: '', personas: 2 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const usuarioLogueado = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
    
    if (!usuarioLogueado) { 
      navigate('/login'); 
      return; 
    }
    
    setUser(usuarioLogueado);
    cargarMisReservas(usuarioLogueado.id || usuarioLogueado.cliente_id);
  }, [navigate]);

  const cargarMisReservas = async (id) => {
    setLoading(true);
    try {
      // 👇 Usando la variable de entorno
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reservas?cliente_id=${id}`);
      if (res.ok) {
        setMisReservas(await res.json());
      }
    } catch (error) {
      console.error("Error cargando reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const hacerReserva = async (e) => {
    e.preventDefault();
    
    const datosParaEnviar = {
      ...reservaForm,
      cliente_id: user.id || user.cliente_id,
      estado: 'pendiente'
    };

    try {
      // 👇 Usando la variable de entorno
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(datosParaEnviar)
      });

      if (res.ok) {
        alert("¡Reserva solicitada con éxito! Revisa tu correo electrónico.");
        setReservaForm({ fecha: '', hora: '', personas: 2 }); 
        cargarMisReservas(user.id || user.cliente_id); 
      } else {
        alert("Hubo un error al procesar tu reserva.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  if (!user) return null;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>ARBOLEDA</h2>
          <span>Mi Perfil</span>
        </div>
        <nav className="sidebar-nav">
          <button className="active"><Calendar size={20} /> Mis Reservas</button>
          <hr style={{borderColor: '#333', margin: '20px 0'}} />
          <Link to="/" className="sidebar-link"><Home size={20} /> Ir al Restaurante</Link>
          <button onClick={handleLogout} className="sidebar-link logout"><LogOut size={20} /> Cerrar Sesión</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="main-header">
          <h1>Hola, {user.nombre} 👋</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px' }}>
          
          <section className="admin-card" style={{ height: 'fit-content' }}>
            <h3 style={{marginTop: 0, marginBottom: '20px'}}>Solicitar Nueva Mesa</h3>
            <form onSubmit={hacerReserva} className="admin-form">
              <label>Fecha</label>
              <input type="date" value={reservaForm.fecha} onChange={(e) => setReservaForm({...reservaForm, fecha: e.target.value})} required style={{width: '100%', marginBottom: '15px'}}/>
              
              <label>Hora</label>
              <input type="time" value={reservaForm.hora} onChange={(e) => setReservaForm({...reservaForm, hora: e.target.value})} required style={{width: '100%', marginBottom: '15px'}}/>
              
              <label>Número de Personas</label>
              <input type="number" min="1" value={reservaForm.personas} onChange={(e) => setReservaForm({...reservaForm, personas: e.target.value})} required style={{width: '100%', marginBottom: '20px'}}/>
              
              <button type="submit" className="btn-primary" style={{width: '100%'}}>Reservar Ahora</button>
            </form>
          </section>

          <section className="table-container">
            <h3 style={{marginTop: 0, marginBottom: '20px'}}>Mi Historial de Reservas</h3>
            {loading ? ( <div style={{color: '#d4af37'}}>Cargando...</div> ) : (
              <table className="admin-table">
                <thead><tr><th>Fecha y Hora</th><th>Personas</th><th>Estado</th></tr></thead>
                <tbody>
                  {misReservas.length > 0 ? misReservas.map(r => (
                    <tr key={r.reserva_id}>
                      <td>{r.fecha} - {r.hora}</td>
                      <td>{r.personas} pers.</td>
                      <td>
                        <span className={`badge ${r.estado === 'confirmada' ? 'rol-1' : r.estado === 'cancelada' ? 'rol-3' : 'rol-2'}`}>
                          {r.estado ? r.estado.toUpperCase() : 'PENDIENTE'}
                        </span>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#666'}}>Aún no tienes reservas con nosotros.</td></tr>}
                </tbody>
              </table>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}