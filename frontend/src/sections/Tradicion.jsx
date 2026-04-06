import { Leaf } from 'lucide-react';
import './Tradicion.css';

export const Tradicion = () => {
  return (
    <section id="tradicion" className="tradicion-section">
      <div className="container tradicion-container">
        
        {/* Columna de Texto */}
        <div className="tradicion-text">
          <div className="icon-wrapper">
            <Leaf color="#D4AF37" size={32} />
          </div>
          <h2>Nuestras Raíces</h2>
          <h3>Del origen a la mesa</h3>
          <p>
            Arboleda nace de un viaje por los rincones más profundos de Colombia. 
            Rescatamos recetas olvidadas de las abuelas y las fusionamos con 
            técnicas de alta cocina francesa.
          </p>
          <p>
            No servimos solo comida; servimos memoria. Cada ingrediente es 
            cultivado por campesinos locales, respetando los ciclos de la tierra.
          </p>
        </div>

        {/* Columna de Imágenes (Collage) */}
        <div className="tradicion-images">
          {/* Nueva imagen principal de alta calidad */}
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop" 
            className="img-main" 
            alt="Interior elegante del restaurante" 
          />
          <img 
            src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=400&auto=format&fit=crop" 
            className="img-accent" 
            alt="Ingredientes frescos" 
          />
        </div>

      </div>
    </section>
  );
};