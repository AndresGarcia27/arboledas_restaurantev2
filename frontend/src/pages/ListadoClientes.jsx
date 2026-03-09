import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';

export default function ListadoClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('1'));
    if (!user || user.rol !== '1') {
      navigate('/login');
      return;
    }
    fetchClientes();
  }, [navigate]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error en Arboleda:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LA LÓGICA DE ELIMINACIÓN CORREGIDA ---
  const handleDelete = async (idAEliminar) => {
    const confirmacion = window.confirm("¿Realmente deseas eliminar este cliente de Arboleda's?");
    
    if (confirmacion) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/clientes/${idAEliminar}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // 1. Borramos al cliente del estado para que desaparezca de la vista de inmediato
          setClientes(clientes.filter(cliente => cliente.cliente_id !== idAEliminar));
          alert("Cliente eliminado con éxito.");
        } else {
          const errorData = await response.json();
          alert(errorData.mensaje || "No se pudo eliminar el registro.");
        }
      } catch (error) {
        console.error("Fallo de conexión:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  };

  if (loading) return <div className="admin-page"><p style={{color: '#c5a47e'}}>Cargando gestión...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-card" style={{ maxWidth: '1000px', width: '95%' }}>
        <header className="admin-header">
          <h2>Panel de Gestión: Clientes</h2>
          <Link to="/" className="btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }}>
            ← Volver al Inicio
          </Link>
        </header>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.cliente_id}>
                <td>{cliente.cliente_id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>
                  <span className={`badge ${cliente.rol}`}>
                    {cliente.rol}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Link to={`/editar-cliente/${cliente.cliente_id}`} className="btn-edit">
                    EDITAR
                  </Link>
                  <button 
                    onClick={() => handleDelete(cliente.cliente_id)} 
                    className="btn-delete"
                  >
                    ELIMINAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}