import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import './AuthModal.css';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Registro

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Encabezado */}
        <div className="auth-header">
          <h2>{isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h2>
          <p>{isLogin ? 'Accede a tus reservas y beneficios.' : 'Únete a la experiencia Arboleda.'}</p>
        </div>

        {/* Formulario */}
        <form className="auth-form">
          
          {/* Campo Nombre (Solo en Registro) */}
          {!isLogin && (
            <div className="input-group slide-in">
              <User size={20} className="input-icon" />
              <input type="text" placeholder="Nombre Completo" required />
            </div>
          )}

          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input type="email" placeholder="Correo Electrónico" required />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input type="password" placeholder="Contraseña" required />
          </div>

          <button type="submit" className="btn-submit">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Switcher Login/Registro */}
        <div className="auth-footer">
          <p>
            {isLogin ? '¿Aún no eres miembro?' : '¿Ya tienes cuenta?'}
            <span style={{cursor: 'pointer', color: '#D4AF37'}} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? ' Regístrate aquí' : ' Inicia Sesión'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};