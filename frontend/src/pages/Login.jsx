import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.cliente));
        
        // --- NUEVA LÓGICA DE REDIRECCIÓN POR ROL ---
        if (data.cliente.rol === '2') {
          navigate('/listado-clientes'); // Si es admin va a la gestión
        } else {
          navigate('/'); // Si es cliente va al inicio
        }

        window.location.reload(); 
        
      } else {
        alert(data.mensaje || 'Credenciales inválidas');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <header className="admin-header">
          <h2>Iniciar Sesión</h2>
        </header>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Email</label>
          <input type="email" name="email" placeholder="correo@ejemplo.com" onChange={handleChange} required />
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          <button type="submit" className="btn-primary">INGRESAR</button>
          <footer className="link-footer" style={{marginTop: '15px'}}>
            <Link to="/registro" className="btn-secondary">¿No tienes cuenta? Regístrate</Link>
          </footer>
        </form>
      </section>
    </main>
  );
}