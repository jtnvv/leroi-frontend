import "../styles/styles.css";
import "../styles/about.css";
import Footer from "../components/Footer";
import imagotipo from "../assets/imagotipo.png";

function About() {
    return(
    <>
        <section className="intro">
          <h3>Acerca de Leroi</h3>
          <div className="logo-container">
            <img src={imagotipo} className = "imagotipo" alt="Icono de Leroi" />
            
          </div>
        </section>

        <section className="vision-mission">
            <div className="vision-wrapper">
                <h3>Visión</h3>
                <div className="vision">
                    <p>
                        Para 2030 LEROI aspira a ser la plataforma líder en la creación de caminos de aprendizaje, facilitando el acceso al conocimiento académico. Inspirados por los valores de altruismo, compromiso y responsabilidad para transformar la forma en que las personas organizan su aprendizaje.
                    </p>
                </div>
            </div>
            <div className="mission-wrapper">
                <h3>Misión</h3>
                <div className="mission">
                    <p>
                        LEROI proporciona una herramienta de creación de rutas de aprendizaje que sirven de guía para formarse en temas basados en los documentos proporcionados por cada usuario, facilitando su proceso de aprendizaje.
                    </p>
                </div>
            </div>
        </section>

        <Footer />
    </>
    );
}

export default About;