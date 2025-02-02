import { useState, useEffect } from 'react';
import archivo from '../assets/archivo.png';
import { toast } from 'react-hot-toast';
import '../styles/roadmap.css';

function Roadmap() {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);  
  const [base64, setBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoadmapGenerated, setIsRoadmapGenerated] = useState(false); // Estado de Roadmap generado

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50 MB

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
  
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem("token"); 
    console.log('Token obtenido del localStorage:', token);  // Verifica si el token está ahí
  
    if (!token) {
      toast.error('No se encontró el token del usuario.');
      return;
    }
  
    let email = '';
    try {
      if (token.split('.').length === 3) {
        const decodedPayload = token.split('.')[1]; // Tomamos la segunda parte del JWT (Payload)
        const decoded = atob(decodedPayload); // Decodificamos el Payload en Base64
        const parsed = JSON.parse(decoded); // Parseamos el JSON
        email = parsed.sub; // El correo está en el campo 'sub' del JWT
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
  
    const cleanedBase64 = base64.split(',')[1]; // Esto elimina la parte 'data:application/pdf;base64,'
  
    const dataToSend = {
      fileName: fileUploaded.name,
      fileType: fileUploaded.type,
      fileSize: fileUploaded.size,
      fileBase64: cleanedBase64,  // Usar la cadena base64 limpia
    };
  
    // Usamos FormData para enviar el archivo y correo al endpoint de análisis
    const formData = new FormData();
    formData.append("file", fileUploaded);
    formData.append("email", email);
  
    // Endpoint para procesar archivo (envía datos en formato JSON)
    const processFile = fetch(`${import.meta.env.VITE_BACKEND_URL}/process-file`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',  // Especificar que el cuerpo es JSON
      },
      body: JSON.stringify({
        fileName: fileUploaded.name,
        fileType: fileUploaded.type,
        fileSize: fileUploaded.size,
        fileBase64: cleanedBase64,  // Usar la cadena base64 limpia
      }),  // Enviamos el archivo con JSON
    });
  
    // Endpoint de análisis (usa FormData para el archivo y correo)
    const analyzeFile = fetch(`${import.meta.env.VITE_BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,  // Enviamos el archivo y correo con FormData
    });
  
    try {
      // Enviamos la petición de procesamiento del archivo
      const processResponse = await processFile;
      const processResult = await processResponse.json();
  
      if (processResponse.ok) {
        toast.success('¡Roadmap generado con éxito!');
        setIsRoadmapGenerated(true); // Aquí marcamos que el roadmap fue generado
        setIsLoading(false); // Detener la carga aquí, sin esperar por el análisis
      } else {
        toast.error(processResult.detail || 'Error al procesar el archivo en el primer endpoint.');
      }
  
      // Realizamos el análisis en segundo plano sin afectar el flujo principal
      const analyzeResponse = await analyzeFile;
      const analyzeResult = await analyzeResponse.json();
      if (analyzeResponse.ok) {
        if (analyzeResult.has_virus) {
          toast.error("El archivo contiene virus. El usuario ha sido eliminado.");
        }
      } else {
        toast.error(analyzeResult.detail || 'Error al procesar el archivo en el análisis.');
      }
  
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.error('Error al enviar el archivo');
      setIsLoading(false); // Detener la carga en caso de error
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
            {isLoading ? 'Generando Roadmap...' : 'Generar Roadmap'}

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
      {isRoadmapGenerated && !isLoading && (
        <p>¡El roadmap ha sido generado con éxito!</p>
      )}
    </>
  );
}

export default Roadmap;
