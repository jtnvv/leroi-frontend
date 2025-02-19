import { useLocation } from 'react-router-dom';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import html2canvas from 'html2canvas';
import CustomNode from '../components/CustomNode';
import '../styles/roadmap.css';

function GeneratedRoadmap() {
  const location = useLocation();
  const { roadmapTopics } = location.state || {};

  const nodes = [];
  const edges = [];

  let idCounter = 0;
  const levelOffset = 500; 
  const nodeWidth = 400; 

  Object.keys(roadmapTopics).forEach((topicKey, topicIndex) => {
    const topicNode = {
      id: `topic-${idCounter++}`,
      data: { label: topicKey, color: '#ffca00' },
      position: { x: 0, y: 500},
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

  const captureRoadmap = async () => {
    const roadmapElement = document.getElementById('roadmap-container');
    if (!roadmapElement) return;

    try {
      const canvas = await html2canvas(roadmapElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      await saveImageToDB(imgData);
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    }
  };

  const saveImageToDB = async (base64Image) => {
    const authToken = localStorage.getItem("token");

    if (!roadmapTopics || Object.keys(roadmapTopics).length === 0) {
      console.error("No hay datos del roadmap para guardar.");
      return;
    }

    const topic = Object.keys(roadmapTopics)[0]; 
    const roadmapData = JSON.stringify(roadmapTopics); 

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/save-roadmap-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          topic,  
          roadmap_data: roadmapData,  
          image_base64: base64Image  
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la imagen en la base de datos');
      }

      console.log('Roadmap guardado correctamente');
    } catch (error) {
      console.error('Error al enviar el roadmap al backend:', error);
    }
  };

  return (
    <div className="generated-roadmap-container">
      <button onClick={captureRoadmap} className="capture-button">
        Guardar Roadmap
      </button>

      <div id="roadmap-container" className="react-flow-container">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ custom: CustomNode }} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default GeneratedRoadmap;
