import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../Admin.css'; 

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const fetchCliente = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/clientes/${id}`);
      if (!response.ok) throw new Error("Cliente no encontrado");
      
      const data = await response.json();
      setFormData({
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
      });
    } catch (error) {
      console.error("Error cargando cliente:", error);
      alert("No se pudo cargar la información en Arboleda's.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cliente actualizado exitosamente!");
        navigate('/listado-clientes');
      } else {
        // Si hay error 500 o validación, mostramos el mensaje del servidor
        alert(data.mensaje || data.error || "Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      alert("Error de conexión con el servidor de Arboleda.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <header className="admin-header">
          <h2>Actualizar Datos del Cliente</h2>
          <p className="subtitle">ID de Gestión: # {id}</p>
        </header>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Número de Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="300 123 4567"
              required
            />
          </div>

          <footer className="form-actions" style={{ marginTop: '30px' }}>
            <button type="submit" className="btn-primary">
              GUARDAR CAMBIOS
            </button>
            <Link to="/listado-clientes" className="btn-secondary" style={{ display: 'block', marginTop: '15px' }}>
              ← Cancelar y Volver
            </Link>
          </footer>
        </form>
      </section>
    </main>
  );
}