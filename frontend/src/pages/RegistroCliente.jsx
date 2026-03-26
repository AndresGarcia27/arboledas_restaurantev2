import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';

export default function RegistroCliente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [errores, setErrores] = useState({});
  
  const [paso, setPaso] = useState(1);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');

  const handleChange = (e) => {
    let valor = e.target.value;
    if (e.target.name === 'nombre') {
      valor = valor.trimStart(); 
    }
    setFormData({ ...formData, [e.target.name]: valor });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  };

  const handleSubmitRegistro = async (e) => {
    e.preventDefault();
    setErrores({}); 

    try {
      // 👇 Usando la variable de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setPaso(2);
      } else {
        if (data.errores) setErrores(data.errores);
        else alert(data.mensaje || 'Error en el registro');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const handleSubmitVerificacion = async (e) => {
    e.preventDefault();
    try {
      // 👇 Usando la variable de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clientes/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          codigo: codigoVerificacion
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Cuenta verificada con éxito! Bienvenido a Arboleda\'s.');
        navigate('/login');
      } else {
        alert(data.mensaje || 'Código incorrecto. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al verificar el código.');
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        
        {paso === 1 ? (
          <>
            <header className="admin-header"><h2>Registro Arboleda</h2></header>
            <form onSubmit={handleSubmitRegistro} className="admin-form">
              
              <label>Nombre Completo</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required 
                style={{ borderColor: errores.nombre ? '#f44336' : '#ccc', outline: 'none' }}
                onInvalid={(e) => e.target.setCustomValidity('Por favor, indícanos cómo te llamas.')}
                onInput={(e) => e.target.setCustomValidity('')} 
              />
              {errores.nombre && <span style={{color: '#f44336', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', display: 'block'}}>{errores.nombre[0]}</span>}

              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                style={{ borderColor: errores.email ? '#f44336' : '#ccc', outline: 'none' }}
                onInvalid={(e) => e.target.setCustomValidity('Necesitamos un correo válido para contactarte.')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
              {errores.email && <span style={{color: '#f44336', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', display: 'block'}}>{errores.email[0]}</span>}

              <label>Contraseña (mín 6 caracteres)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                style={{ borderColor: errores.password ? '#f44336' : '#ccc', outline: 'none' }}
                onInvalid={(e) => e.target.setCustomValidity('Crea una contraseña segura para tu cuenta.')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
              {errores.password && <span style={{color: '#f44336', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', display: 'block'}}>{errores.password[0]}</span>}

              <label>Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required 
                style={{ borderColor: errores.telefono ? '#f44336' : '#ccc', outline: 'none' }}
                onInvalid={(e) => e.target.setCustomValidity('Déjanos un número de teléfono para tus reservas.')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
              {errores.telefono && <span style={{color: '#f44336', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', display: 'block'}}>{errores.telefono[0]}</span>}

              <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>Crear Mi Cuenta</button>
              
              <footer className="link-footer">
                <Link to="/login" className="btn-secondary">¿Ya eres parte? Inicia Sesión</Link>
              </footer>
            </form>
          </>
        ) : (
          <>
            <header className="admin-header"><h2>Verifica tu Correo</h2></header>
            <form onSubmit={handleSubmitVerificacion} className="admin-form" style={{textAlign: 'center'}}>
              <p style={{marginBottom: '20px', color: '#555'}}>
                Hemos enviado un código de 6 dígitos a <strong>{formData.email}</strong>. 
                Por favor, revísalo e ingrésalo aquí.
              </p>

              <input 
                type="text" 
                maxLength="6" 
                value={codigoVerificacion} 
                onChange={(e) => setCodigoVerificacion(e.target.value.replace(/\D/g, ''))} 
                placeholder="000000"
                required
                style={{ 
                  fontSize: '2rem', textAlign: 'center', letterSpacing: '10px', padding: '15px', 
                  borderRadius: '10px', border: '2px solid #d4af37', marginBottom: '20px' 
                }}
              />

              <button type="submit" className="btn-primary">Verificar Cuenta</button>
            </form>
          </>
        )}

      </section>
    </main>
  );
}