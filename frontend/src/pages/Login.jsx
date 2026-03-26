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
      // 👇 Usando la variable de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.user;
        
        if (!userData) {
          throw new Error("Datos de usuario no recibidos");
        }

        localStorage.setItem('user', JSON.stringify(userData));
        if (data.token) localStorage.setItem('token', data.token);
        
        const role = Number(userData.rol || userData.rol_id);

        if (role === 1) {
          navigate('/listado-clientes'); 
        } else {
          navigate('/mis-reservas'); 
        }

        window.location.reload(); 
        
      } else {
        alert(data.mensaje || data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Error detallado:", error);
      alert('Error al procesar el inicio de sesión');
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