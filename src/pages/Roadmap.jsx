import { useState, useEffect } from 'react';
import archivo from '../assets/archivo.png';
import { toast } from 'react-hot-toast';
import '../styles/roadmap.css';

function Roadmap() {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);  
  const [base64, setBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos al backend');
      }
  
      const result = await response.json();
      console.log('Respuesta del backend:', result);
      toast.success('Archivo enviado con éxito');

    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.error('Error al enviar el archivo');
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
    </>
  );
}

export default Roadmap;