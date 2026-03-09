import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';

export default function RegistroCliente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', telefono: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Bienvenido a Arboleda\'s! Ahora inicia sesión.');
        navigate('/login');
      } else {
        const errorMsg = data.errores_validacion 
          ? Object.values(data.errores_validacion).flat().join('\n') 
          : 'Error en el registro';
        alert(errorMsg);
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <header className="admin-header"><h2>Registro Arboleda</h2></header>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Nombre Completo</label>
          <input type="text" name="nombre" onChange={handleChange} required />
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
          <label>Contraseña (mín 6)</label>
          <input type="password" name="password" onChange={handleChange} required />
          <label>Teléfono</label>
          <input type="tel" name="telefono" onChange={handleChange} required />
          <button type="submit" className="btn-primary">Crear Mi Cuenta</button>
          <footer className="link-footer">
            <Link to="/login" className="btn-secondary">¿Ya eres parte? Inicia Sesión</Link>
          </footer>
        </form>
      </section>
    </main>
  );
}