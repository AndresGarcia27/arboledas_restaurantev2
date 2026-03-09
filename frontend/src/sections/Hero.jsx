import { useState } from 'react';
import ReservationModal from '../components/ReservationModal'; // Asegúrate que la ruta sea correcta
import './Hero.css';

export const Hero = () => {
  // Estado para abrir/cerrar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="inicio" className="hero-container">
      <div className="hero-overlay">
        <div className="hero-content fade-in">
          <div className="section-badge"></div>
          <p className="hero-tagline">SABORES DE ORIGEN</p>
          <h1>ARBOLEDA'S</h1>
          <p className="hero-desc">Una experiencia sensorial en el corazón de la ciudad.</p>
          <div className="hero-btns">
            <a href="#carta" className="btn-gold-fill">VER CARTA</a>
            
            {/* BOTÓN CONECTADO: Al hacer clic, abre el modal */}
            <button 
              className="btn-gold-outline"
              onClick={() => setIsModalOpen(true)}
            >
              RESERVAR MESA
            </button>
          </div>
        </div>
      </div>

      {/* RENDER DEL MODAL: Le pasamos el estado y la función para cerrar */}
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};