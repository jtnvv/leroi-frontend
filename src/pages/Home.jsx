import "../styles/home.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";  

function Home() {
  return (
    <>
      {/* Hook*/}
      <section className="hook">
        <div className="hook-content">
          <h1>Convierte tus documentos en rutas de aprendizaje personalizadas</h1>
          <Link to="/upload" className="cta-button">Sube tu primer documento</Link>
        </div>
      </section>

      {/* Features*/}
      <section className="features">
        <h2>¿Quién es Leroi?</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Asistente de aprendizaje</h3>
            <p>
            Leroi automatiza la creación de planes de estudio, reduciendo significativamente el tiempo dedicado a planificar qué y cómo estudiar.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📂</div>
            <h3>Organizador</h3>
            <p>
            Leroi identifica y organiza subtemas jerárquicamente, proporcionando un camino lógico y progresivo para el aprendizaje.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalizador experto</h3>
            <p>
            Leroi permite a los usuarios cargar sus propios documentos (libros, artículos, apuntes) y generar rutas de aprendizaje adaptadas a ese contenido específico.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Adaptable y flexible</h3>
            <p>
            Los roadmaps de Leroi  son ajustables según las necesidades del usuario, como plazos, etapas, y materiales adicionales. Hace que el aprendizaje sea flexible y eficiente.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2>Adquiere créditos</h2>
        <div className="pricing-container">
          <div className="pricing-card">
            <h3>Principiante</h3>
            <p className="price">250 créditos</p>
            <ul>
              <li>Ideal para probar Leroi</li>
              <li>Procesa hasta 5 documentos </li>
              <li>Descarga tus roadmaps</li>
            </ul>
            <Link to="/pricing" className="cta-button">Adquiere este plan</Link> 
          </div>
          <div className="pricing-card">
            <h3>Intermedio</h3>
            <p className="price">750 créditos</p>
            <ul>
              <li>Suficiente para generar entre 5 y 8 roadmaps medianos</li>
              <li>Ideal para estudiantes </li>
              <li>Prueba funciones avanzadas</li>
            </ul>
            <Link to="/pricing" className="cta-button">Adquiere este plan</Link> 
          </div>
          <div className="pricing-card">
            <h3>Avanzado</h3>
            <p className="price">1500 créditos</p>
            <ul>
              <li>Almacenamiento extensivo</li>
              <li>Procesa documentos grandes</li>
              <li>Prueba funciones experimentales</li>
            </ul>
            <Link to="/pricing" className="cta-button">Adquiere este plan</Link> 
          </div>
        </div>
      </section>

      {/* El footer*/}
      <Footer />
    </>
  );
}

export default Home;
