import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import './ReservationModal.css';

export default function ReservationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState('2');
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (fecha) {
      const slots = [];
      const dateObj = new Date(fecha + "T00:00:00");
      const esSabado = dateObj.getDay() === 6; 
      
      const horaCierre = esSabado ? 26 : 24;

      for (let h = 13; h < horaCierre; h++) {
        const horaReal = h % 24;
        const ampm = (horaReal >= 12) ? 'PM' : 'AM';
        const hora12 = horaReal % 12 || 12;
        
        // 👇 EL TRUCO ESTÁ AQUÍ 👇
        // Formato visual para el cliente (Ej: "1:00 PM")
        const label00 = `${hora12}:00 ${ampm}`;
        const label30 = `${hora12}:30 ${ampm}`;

        // Formato militar para la base de datos (Ej: "13:00:00")
        const valor00 = `${String(horaReal).padStart(2, '0')}:00:00`;
        const valor30 = `${String(horaReal).padStart(2, '0')}:30:00`;
        
        // Guardamos las dos versiones: la que se ve y la que se envía
        slots.push({ etiqueta: label00, valorBD: valor00 });
        slots.push({ etiqueta: label30, valorBD: valor30 });
      }
      setHorasDisponibles(slots);
      setHora(slots[0]?.valorBD || ''); // Seleccionamos por defecto el valor militar
    }
  }, [fecha]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem('user');
    const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
    const idParaEnviar = user ? (user.cliente_id || user.id) : null;

    if (!user || !idParaEnviar) {
      alert("Tu sesión es antigua o está incompleta. Por favor, inicia sesión de nuevo para poder reservar.");
      localStorage.clear();
      onClose();
      navigate('/login');
      return;
    }

    setIsLoading(true);

    // 2. Preparamos los datos con el formato de hora militar
    const reservaData = {
      cliente_id: idParaEnviar, 
      fecha: fecha,
      hora: hora, // 👈 Ahora esto viaja a Laravel como "13:00:00", no como "1:00 PM"
      personas: parseInt(personas),
      estado: 'pendiente'
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reservaData)
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); 
      } else {
        alert(data.mensaje || "Hubo un problema al procesar la reserva.");
        console.error("Error del backend:", data);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalClose = () => {
    setStep(1);
    setFecha('');
    setHora('');
    setPersonas('2');
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

              <div className="input-row-res">
                <label><Clock size={16} /> Hora</label>
                <select required className="res-input" disabled={!fecha} value={hora} onChange={(e) => setHora(e.target.value)}>
                  <option value="">{fecha ? "Selecciona hora" : "Primero elige una fecha"}</option>
                  {/* 👇 Muestra la etiqueta bonita, pero toma el valor oculto 👇 */}
                  {horasDisponibles.map((h, index) => (
                    <option key={index} value={h.valorBD}>{h.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div className="input-row-res">
                <label><Users size={16} /> Personas</label>
                <select required className="res-input" value={personas} onChange={(e) => setPersonas(e.target.value)}>
                  <option value="2">2 Personas</option>
                  <option value="3">3 Personas</option>
                  <option value="4">4 Personas</option>
                  <option value="5">5 Personas</option>
                  <option value="6">6+ (Grupo)</option>
                </select>
              </div>

              <button type="submit" className="btn-confirm-res" disabled={!fecha || isLoading}>
                {isLoading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </>
        ) : (
          <div className="res-success">
            <CheckCircle size={60} className="success-icon" style={{color: '#D4AF37', marginBottom: '20px'}} />
            <h2>¡Reserva Confirmada!</h2>
            <p>Hemos separado tu mesa para el <b>{fecha}</b>. Te hemos enviado un correo con los detalles.</p>
            <button className="btn-confirm-res" onClick={handleFinalClose}>Entendido</button>
          </div>
        )}
      </div>
    </div>
  );
}