import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import archivo from '../assets/archivo.png';
import anim_tutorial from '../assets/Tutorial_CrearRoadmap.mp4';
import tutorial_logo from '../assets/Tutorial_logo.png';
import { toast } from 'react-hot-toast';
import '../styles/roadmap.css';

function Roadmap() {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);  
  const [helpModal, setHelpModal] = useState(false);
  const [base64, setBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileInfo, setShowFileInfo] = useState(false);
  const [userCredits, setUserCredits] = useState(null);
  const [previewCost, setPreviewCost] = useState("Calculando...");
  const [CanUserPay, setCanUserPay] = useState(true);
  const [topicsModal, setTopicsModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [roadmapTopics, setRoadmapTopics] = useState({});
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    if (base64) {
      // console.log("aca esta el base64", base64);
      setPreviewFile(true);
    }
  }, [base64]);

  useEffect(() => {
    if (fileUploaded) {
      console.log("Archivo subido:", fileUploaded.name);
    }
  }, [fileUploaded]);

  useEffect(() => {
    if (topics.length > 0) {
      console.log("Topics updated:", topics);
      setTopicsModal(true);
    }
  }, [topics]);

  useEffect(() => {
    if (Object.keys(roadmapTopics).length > 0) {
      console.log("Roadmap Topics:", roadmapTopics);
      setLoadingPage(false);
      setLoadingText("");
      navigate('/generatedRoadmap', {state: {roadmapTopics}});
    }
  }, [roadmapTopics, navigate]);

  const handleFileChange = async (e) => {
    setLoadingPage(true);
    setLoadingText("Cargando documento 🧐");
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50 MB

    if (file.size > maxSize) {
      toast.error('El archivo no puede ser mayor a 50 MB');
      return;
    }

    setFileUploaded(file);

    try {
      const base64String = await convertToBase64(file);
      setBase64(base64String);

      const dataToSend = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileBase64: base64String,
      };

      setShowFileInfo(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/preview-cost-process-file`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener la vista previa de costos');
      }

      const result = await response.json();
      const parseResult = JSON.parse(result);

      const credits_cost = parseInt(parseResult.credits_cost)
      const user_credits = parseInt(parseResult.user_credits)

      setPreviewCost("Costo: " + credits_cost.toLocaleString() + " Créditos");
      setUserCredits("Actualmente tienes " + user_credits.toLocaleString() + " créditos")
      
      setCanUserPay(credits_cost > user_credits);
      if (credits_cost > user_credits) {
        toast.error('Creditos Insuficientes 😔');
      } 

    } catch (error) {
      console.error('Error al obtener la vista previa de costos:', error);
      toast.error('Error al obtener el costo de procesamiento');
    }
    setLoadingPage(false);
    setLoadingText("");
  };

  const handleReset = () => {
    setFileUploaded(null);
    setPreviewCost("Calculando...");
    setShowFileInfo(false);
  };

  const handleSubmitFile = async () => {
    if (!base64 || !fileUploaded) {
      toast.error("No has subido ningún archivo");
      return;
    }
  
    setIsLoading(true);
    setLoadingPage(true);
    setLoadingText("Buscando temas relacionados... 📈🧠📚");
  
    const dataToSend = {
      fileName: fileUploaded.name,
      fileType: fileUploaded.type,
      fileSize: fileUploaded.size,
      fileBase64: base64,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/process-file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos al backend');
      }
  
      const result = await response.json();
      const parseResult = JSON.parse(result);

      setTopics(parseResult.themes);
      setIsLoading(false);
      setLoadingPage(false);
      setLoadingText("");


    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.error('Error al enviar el archivo');
    }
  };

  const handleSelecteTopic = async(topic) => {  
    setTopicsModal(false);
    setLoadingPage(true);
    setLoadingText("Estamos creando tu ruta de aprendizaje 😁");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el topic al backend');
      }
      const result = await response.json();
      const parseResult = JSON.parse(result);
      // console.log(parseResult);
      setRoadmapTopics(parseResult);
    } catch (error) {
      console.error('Error al enviar al generar la ruta:', error);
      toast.error('No pudimos generar tu ruta de aprendizaje 😔');
    }
  };

  return (
    <>
      <div>
        {/* Sección de carga del archivo */}
        {!showFileInfo ? (
          <div className="roadmap-container">
            <h1>Sube un archivo para generar tu ruta de aprendizaje</h1>
            <div className="file-upload" onClick={() => document.getElementById('fileInput').click()}>
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <img src={archivo} alt="Icono de carga" className="upload-icon" />
              <p>{'Sube tu archivo PDF (máx 50 MB)'}</p>
            </div>
          </div>
        ) : (
          <div className="file-info-container">

            {/* Contenedor derecho: Vista previa del PDF */}
            {previewFile && base64 && (
              <div className="pdf-preview">
                {/* <h3>Vista Previa</h3> */}
                <iframe
                  src={base64 + "#toolbar=0"}
                  title="Vista previa del PDF"
                  width="100%"
                  height="100%"
                />
              </div>
            )}

            {/* Contenedor izquierdo: Detalles del archivo */}
            <div className="file-details">
                <h2>Detalles del Archivo</h2>
                <p>Nombre: {fileUploaded.name}</p>
                <p>Tamaño: {(fileUploaded.size / (1024 * 1024)).toFixed(2)} MB</p>
              <div className="credits-cost">
                <h2>Costo de procesamiento</h2>
                <p className="preview-cost-label">{previewCost}</p>
                <p className="user-credits-label">{userCredits}</p>
              </div>
              

              {/* Contenedor para los botones */}
              <div className="buttons-container">
                <button className="generate-button" onClick={handleSubmitFile} disabled={CanUserPay}>
                  {isLoading ? 'Generando tu ruta de aprendizaje...' : 'Generar ruta de aprendizaje'}
                </button>
                <button className="reset-button" onClick={handleReset}>
                  Subir otro archivo
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <div className="help-icon" onClick={() => setHelpModal(true)}>
        <img src={tutorial_logo} alt="Ayuda" className="tutorial-icon" />
      </div>

      {/* Modal para el tutorial en video */}
      {helpModal && (
        <div className="preview-modal">
          <div className="preview-content">
            <video width="100%" height="100%" controls autoPlay muted>
              <source src={anim_tutorial} type="video/mp4"/>
              Tu navegador no soporta la reproducción de videos.
            </video>
            <button onClick={() => setHelpModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {topicsModal && (
        <div className="topics-modal">
            <h1>Temas detectados en tu archivo</h1>
              <div className="topics-content">
                {topics.map((topic, index) => (
                  <button className="topic-button" key={index} onClick={() => handleSelecteTopic(topic)}>
                    {topic}
                  </button>
                ))}
              </div>
        </div>
      )}
      {loadingPage && (
        <div className="loading-modal">
          <div className="loading-content">
            <h2>{loadingText}</h2>
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Roadmap;