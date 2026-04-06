import { useState } from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReservationModal from '../components/ReservationModal'; 
import './Contacto.css';

export const Contacto = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ 1. BLINDAJE DE LOCALSTORAGE: Ignoramos la "basura" si existe
  const storedUser = localStorage.getItem('user');
  const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

  // ✅ 2. EXTRACCIÓN SEGURA DEL ROL
  const userRole = user ? Number(user.rol || user.rol_id) : null;

  return (
    <footer id="contacto" className="contacto-section">
      <div className="container">
        
        {/* Acceso discreto para Admin (Corregido a Rol 1) */}
        {userRole === 1 && (
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
              Cl. 92 #50B-13<br /> Aranjuez, Medellín, Antioquia, Colombia
            </p>
            <p className="address-item">
              <Phone size={18} className="icon" />
              +57 42361106
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
            
            {/* 👇 NUEVO MAPA INTERACTIVO 👇 */}
            <div className="map-container">
              <iframe 
                title="Mapa de Arboleda Restaurante"
                src="https://maps.google.com/maps?q=Cl.%2092%20%2350B-13,%20Aranjuez,%20Medell%C3%ADn,%20Antioquia,%20Colombia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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