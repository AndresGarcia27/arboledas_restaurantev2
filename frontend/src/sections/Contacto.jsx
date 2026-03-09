import { useState } from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReservationModal from '../components/ReservationModal'; 
import './Contacto.css';

export const Contacto = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <footer id="contacto" className="contacto-section">
      <div className="container">
        
        {/* Acceso discreto para Admin */}
        {user?.rol === '2' && (
          <div className="admin-access-footer">
            <Link to="/listado-clientes" className="btn-admin-link">
              Gestión de Clientes
            </Link>
          </div>
        )}

        <div className="footer-grid">
          
          <div className="footer-col">
            <h3>Visítanos</h3>
            <p className="address-item">
              <MapPin size={18} className="icon" />
              Calle 10A #43-07<br />El Poblado, Medellín
            </p>
            <p className="address-item">
              <Phone size={18} className="icon" />
              +57 (300) 123-4567
            </p>
            <button className="btn-reserve" onClick={() => setIsModalOpen(true)}>
              Reservar Mesa
            </button>
          </div>

          {/* HORARIOS SINCRONIZADOS CON EL MODAL */}
          <div className="footer-col">
            <h3>Horarios</h3>
            <ul className="hours-list">
              <li>
                <Clock size={16} className="icon-sm"/> 
                <span>Mar - Vie:</span> 1:00 PM - 12:00 AM
              </li>
              <li>
                <Clock size={16} className="icon-sm"/> 
                <span className="gold-text">Sábados:</span> 1:00 PM - 2:00 AM
              </li>
              <li>
                <Clock size={16} className="icon-sm"/> 
                <span>Domingo:</span> 1:00 PM - 12:00 AM
              </li>
              <li className="closed">Lunes: Cerrado por Mantenimiento</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Síguenos</h3>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook /></a>
            </div>
            <div className="map-placeholder" onClick={() => window.open('https://maps.google.com', '_blank')}>
              <span>Abrir en Google Maps</span>
            </div>
          </div>

        </div>

        <div className="footer-copyright">
          <p>© 2026 Arboleda Restaurante. Medellín, Antioquia.</p>
        </div>
      </div>

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </footer>
  );
};