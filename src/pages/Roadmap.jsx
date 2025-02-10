import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import archivo from '../assets/archivo.png';
import { toast } from 'react-hot-toast';
import '../styles/roadmap.css';

function Roadmap() {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);  
  const [base64, setBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [topicsModal, setTopicsModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [roadmapTopics, setRoadmapTopics] = useState({});

  const navigate = useNavigate();


  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error al convertir a base64:', error);
    };
  };

  useEffect(() => {
    if (base64) {
      console.log("aca esta el base64", base64);
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
      navigate('/generatedRoadmap', {state: {roadmapTopics}});
    }
  }, [roadmapTopics, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; 

    if (file.size > maxSize) {
      toast.error('El archivo no puede ser mayor a 50 MB');
      return;
    } else {
      setFileUploaded(file);
      console.log("Archivo seleccionado:", fileUploaded);
      convertToBase64(file);
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(false);
    document.getElementById('fileInput').value = ''; 
  };

  const handleSubmitFile = async () => {
    if (!base64 || !fileUploaded) {
      toast.error("No has subido ningún archivo");
      return;
    }
  
    setIsLoading(true);
    console.log("Enviando base64:", base64);
    console.log("Enviando archivo:", fileUploaded);

    const token = localStorage.getItem("token"); 

    if (!token) {
      toast.error('No se encontró el token del usuario.');
      return;
    }
  
    let email = '';
    try {
      if (token.split('.').length === 3) {
        const decodedPayload = token.split('.')[1]; 
        const decoded = atob(decodedPayload); 
        const parsed = JSON.parse(decoded); 
        email = parsed.sub; 
      } else {
        toast.error('El token JWT no tiene un formato válido.');
        return;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      toast.error('Error al decodificar el token');
      return;
    }
  
    if (!email) {
      toast.error('No se pudo obtener el correo del usuario.');
      return;
    }
  
     

    const dataToSend = {
      fileName: fileUploaded.name,
      fileType: fileUploaded.type,
      fileSize: fileUploaded.size,
      fileBase64: base64,
    };

    const formData = new FormData();
    formData.append("file", fileUploaded);
    formData.append("email", email);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/process-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos al backend');
      }
  
      const result = await response.json();
      const parseResult = JSON.parse(result);
      setTopics(parseResult);
      setIsLoading(false);

    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.error('Error al enviar el archivo');
    }

    const analyzeResponse = fetch(`${import.meta.env.VITE_BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });

    const analyzeResult = await analyzeResponse.json();
    if (analyzeResponse.ok && analyzeResult.has_virus) {
      toast.error("El archivo contiene virus. El usuario ha sido eliminado.");
    }

    setIsLoading(false);
  } ;
  
  const handleSelecteTopic = async(topic) => {  
    setTopicsModal(false);
    setLoadingPage(true);
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
      console.log(parseResult);
      setRoadmapTopics(parseResult);
    } catch (error) {
      console.error('Error al enviar al generar la ruta:', error);
      toast.error('No pudimos generar tu ruta de aprendizaje 😔');
    }
  };

  return (
    <>
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
          <p>{fileUploaded ? `Archivo subido: ${fileUploaded.name}` : 'Sube tu archivo pdf (max 50 MB)'}</p>
        </div>
        <button 
          className="generate-button" 
          disabled={isLoading}
          onClick={handleSubmitFile}>
            {isLoading ? 'Generando tu ruta de aprendizaje...' : 'Generar ruta de aprendizaje'}
        </button>
      </div>
      {previewFile && base64 && (
        <div className="preview-modal">
          <div className="preview-content">
            <iframe
              src={base64}
              title="Vista previa del PDF"
              width="90%"
              height="500px"
            />
            <button onClick={handleClosePreview}>Cerrar</button>
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
            <h2>Estamos creando tu ruta de aprendizaje 😁</h2>
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Roadmap;