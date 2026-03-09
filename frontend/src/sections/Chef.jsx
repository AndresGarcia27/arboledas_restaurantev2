import './Chef.css';
import { Link } from 'react-router-dom';
<Link to="/clientes" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-bold">
  Admin Clientes
</Link>

export const Chef = () => {
  return (
    <section id="chef" className="chef-section">
      <div className="container chef-container">
        
        {/* Imagen del Chef */}
        <div className="chef-image">
          <img 
            src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=800&auto=format&fit=crop" 
            alt="Chef Principal" 
          />
        </div>

        {/* Texto */}
        <div className="chef-info">
          <h2>El Chef</h2>
          <h3>Alejandro Arboleda</h3>
          <p>
            "La cocina no es solo comida, es un lenguaje. En Arboleda, 
            buscamos reinterpretar la tradición colombiana con técnicas 
            de vanguardia, respetando siempre el producto local."
          </p>
          <div className="signature">Alejandro A.</div>
        </div>

      </div>
    </section>
  );
};