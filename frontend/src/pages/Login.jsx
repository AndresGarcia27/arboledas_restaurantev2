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
        // ✅ 1. Verificamos que sí llegue el usuario
        const userData = data.user;
        
        if (!userData) {
          throw new Error("Datos de usuario no recibidos");
        }

        localStorage.setItem('user', JSON.stringify(userData));
        if (data.token) localStorage.setItem('token', data.token);
        
        // ✅ 2. LÓGICA DE ROLES (EL SEMÁFORO INTELIGENTE)
        // Convertimos a Número por si Laravel lo manda como String
        const role = Number(userData.rol || userData.rol_id);

        if (role === 1) {
          navigate('/listado-clientes'); // Admin (Rol 1) va al Panel de Control
        } else {
          // 👇 AQUÍ ESTÁ LA MAGIA 👇
          navigate('/mis-reservas'); // Cliente (Rol 2) va directo a pedir su mesa
        }

        // Recargamos la página para que el Navbar actualice los botones
        window.location.reload(); 
        
      } else {
        // Mostramos el mensaje que viene del backend
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