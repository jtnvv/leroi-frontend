import { useLocation } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import ReactFlow, { Background } from 'react-flow-renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes, faSearchPlus, faSearchMinus, faExpand } from '@fortawesome/free-solid-svg-icons';

import CustomNode from '../components/CustomNode';
import '../styles/roadmap.css';

function GeneratedRoadmap() {
  const location = useLocation();
  const { roadmapTopics } = location.state || {};
  const roadmapRef = useRef(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('json');
  const reactFlowInstance = useRef(null);

  const nodes = [];
  const edges = [];
  let idCounter = 0;
  const levelOffset = 500;
  const nodeWidth = 400;

  if (roadmapTopics) {
    Object.keys(roadmapTopics).forEach((topicKey, topicIndex) => {
      const topicNode = {
        id: `topic-${idCounter++}`,
        data: { label: topicKey, color: '#ffca00' },
        position: { x: 0, y: 500 },
        type: 'custom',
      };
      nodes.push(topicNode);

      const topic = roadmapTopics[topicKey];
      Object.keys(topic).forEach((subtopicKey, subtopicIndex) => {
        const subtopicNode = {
          id: `subtopic-${idCounter++}`,
          data: { label: subtopicKey, color: '#96E6B3' },
          position: { x: nodeWidth, y: topicIndex * levelOffset + subtopicIndex * levelOffset / 2 },
          type: 'custom',
        };
        nodes.push(subtopicNode);
        edges.push({ id: `e-${topicNode.id}-${subtopicNode.id}`, source: topicNode.id, target: subtopicNode.id });

        topic[subtopicKey].forEach((subSubtopic, index) => {
          const subSubtopicNode = {
            id: `subSubtopic-${idCounter++}`,
            data: { label: subSubtopic, color: '#FF92E6' },
            position: { x: nodeWidth * 2, y: topicIndex * levelOffset + subtopicIndex * levelOffset / 2 + index * 50 },
            type: 'custom',
          };
          nodes.push(subSubtopicNode);
          edges.push({ id: `e-${subtopicNode.id}-${subSubtopicNode.id}`, source: subtopicNode.id, target: subSubtopicNode.id });
        });
      });
    });
  }

  const handleDownload = async () => {
    if (selectedFormat === 'json') {
      const jsonData = JSON.stringify(roadmapTopics, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roadmap.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'image' || selectedFormat === 'pdf') {
      setTimeout(async () => {
        const roadmapElement = roadmapRef.current;
        const canvas = await html2canvas(roadmapElement, {
          scale: 2, // Aumentar la escala para mejorar la calidad
          useCORS: true, // Habilitar CORS si es necesario
          logging: true, // Habilitar logging para depuración
        });
        if (selectedFormat === 'image') {
          const image = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = image;
          a.download = 'roadmap.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else if (selectedFormat === 'pdf') {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape');
          pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
          pdf.save('roadmap.pdf');
        }
      }, 500);
    }
  };

  const onInit = (instance) => {
    reactFlowInstance.current = instance;
    setTimeout(() => {
      instance.fitView({ padding: 0.2, duration: 500 });
    }, 500); // Esperar un poco para que se carguen los nodos
  };
  
  const handleZoomIn = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomTo(reactFlowInstance.current.getZoom() + 0.2);
    }
  };
  
  const handleZoomOut = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomTo(reactFlowInstance.current.getZoom() - 0.2);
    }
  };
  
  const handleFitView = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({ padding: 0.2, duration: 500 });
    }
  };

  return (
    <div className="generated-roadmap-container">
      {roadmapTopics && (
        <>
          <button className="icon-button" onClick={() => setShowDownloadOptions(true)}>
            <FontAwesomeIcon icon={faDownload} className="download-icon" />
          </button>

          {showDownloadOptions && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-button" onClick={() => setShowDownloadOptions(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <h3>Seleccionar formato de descarga</h3>
                <div className="download-options">
                  <label className="format-option">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={selectedFormat === 'json'}
                      onChange={() => setSelectedFormat('json')}
                    />
                    <span>JSON</span>
                  </label>
                  <label className="format-option">
                    <input
                      type="radio"
                      name="format"
                      value="image"
                      checked={selectedFormat === 'image'}
                      onChange={() => setSelectedFormat('image')}
                    />
                    <span>Imagen</span>
                  </label>
                  <label className="format-option">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={selectedFormat === 'pdf'}
                      onChange={() => setSelectedFormat('pdf')}
                    />
                    <span>PDF</span>
                  </label>
                </div>
                <button className="download-button" onClick={handleDownload}>Descargar</button>
              </div>
            </div>
          )}

          <div className="react-flow-container" ref={roadmapRef}>
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              nodeTypes={{ custom: CustomNode }}
              fitView
              onInit={onInit} // Aquí se cambia de onLoad a onInit
            >
              <Background />
            </ReactFlow>
          </div>

          <div className="controls-container">
        <button className="control-button" onClick={handleZoomIn}>
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button className="control-button" onClick={handleZoomOut}>
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
        <button className="control-button" onClick={handleFitView}>
          <FontAwesomeIcon icon={faExpand} />
        </button>
      </div>
          
        </>
      )}
    </div>
  );
}

export default GeneratedRoadmap;