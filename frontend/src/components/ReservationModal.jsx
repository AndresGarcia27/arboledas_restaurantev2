import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import './ReservationModal.css';

export default function ReservationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [fecha, setFecha] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // 1. Bloqueo de fechas pasadas: Obtenemos el día de hoy (2026-03-05)
  const hoy = new Date().toISOString().split('T')[0];

  // 2. Generar horas dinámicas según el día seleccionado
  useEffect(() => {
    if (fecha) {
      const slots = [];
      // Creamos el objeto fecha asegurando que no haya desfase de zona horaria
      const dateObj = new Date(fecha + "T00:00:00");
      const esSabado = dateObj.getDay() === 6; // 6 es Sábado
      
      // Apertura 1:00 PM (13:00)
      // Cierre: 12 AM (24:00) entre semana / 2 AM (26:00) sábados
      const horaCierre = esSabado ? 26 : 24;

      for (let h = 13; h < horaCierre; h++) {
        const horaReal = h % 24;
        const ampm = (horaReal >= 12) ? 'PM' : 'AM';
        const hora12 = horaReal % 12 || 12;
        
        slots.push(`${hora12}:00 ${ampm}`);
        slots.push(`${hora12}:30 ${ampm}`);
      }
      setHorasDisponibles(slots);
    }
  }, [fecha]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2); 
  };

  const handleFinalClose = () => {
    setStep(1);
    setFecha('');
    onClose();
  };

  return (
    <div className="reservation-overlay" onClick={handleFinalClose}>
      <div className="reservation-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-res" onClick={handleFinalClose}>
          <X size={24} />
        </button>

        {step === 1 ? (
          <>
            <div className="res-header">
              <div className="section-badge" style={{margin: '0 auto 10px'}}></div>
              <h2>Reservar Mesa</h2>
              <p>Horario: 1:00 PM - {fecha && new Date(fecha + "T00:00:00").getDay() === 6 ? '2:00 AM' : '12:00 AM'}</p>
            </div>

            <form className="res-form" onSubmit={handleSubmit}>
              {/* FECHA: min={hoy} evita que elijan años pasados */}
              <div className="input-row-res">
                <label><Calendar size={16} /> Fecha</label>
                <input 
                  type="date" 
                  required 
                  className="res-input" 
                  min={hoy}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              {/* HORA: Se desbloquea solo al elegir fecha */}
              <div className="input-row-res">
                <label><Clock size={16} /> Hora</label>
                <select required className="res-input" disabled={!fecha}>
                  <option value="">{fecha ? "Selecciona hora" : "Primero elige una fecha"}</option>
                  {horasDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div className="input-row-res">
                <label><Users size={16} /> Personas</label>
                <select required className="res-input">
                  <option value="2">2 Personas</option>
                  <option value="3">3 Personas</option>
                  <option value="4">4 Personas</option>
                  <option value="5">5 Personas</option>
                  <option value="6">6+ (Grupo)</option>
                </select>
              </div>

              <button type="submit" className="btn-confirm-res" disabled={!fecha}>
                Confirmar Reserva
              </button>
            </form>
          </>
        ) : (
          <div className="res-success">
            <CheckCircle size={60} className="success-icon" style={{color: '#D4AF37', marginBottom: '20px'}} />
            <h2>¡Reserva Confirmada!</h2>
            <p>Hemos separado tu mesa para el <b>{fecha}</b>. Te esperamos en Arboleda.</p>
            <button className="btn-confirm-res" onClick={handleFinalClose}>Entendido</button>
          </div>
        )}
      </div>
    </div>
  );
}