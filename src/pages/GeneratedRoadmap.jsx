import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactFlow, { Background, Controls, ControlButton } from 'react-flow-renderer';
import CustomNode from '../components/CustomNode';
import '../styles/roadmap.css';

function GeneratedRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roadmapTopics, relatedTopics } = location.state || {};
  const [relatedTopicsModal, setRelatedTopicsModal] = useState(false);

  const handleShowModal = () => {
    setRelatedTopicsModal(true);
    localStorage.setItem('topicsModal', 'true');
  };

  const handleNewRoadmap = () => {
    const topicState = relatedTopicsModal ? {relatedTopics} : {};
    navigate('/roadmap', {state: {topicState}});
  };

  const closeModal = () => {
    setRelatedTopicsModal(false); 
  };

  const nodes = [];
  const edges = [];

  let idCounter = 0;
  const levelOffset = 600; 
  const nodeWidth = 500; 

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

  return (
    <div className="generated-roadmap-container">
      {roadmapTopics && (
          <div className="react-flow-container">
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              nodeTypes={{ custom: CustomNode }}
              fit>
              <Background />
              <Controls 
                style={{position: 'fixed', top: '10%', left: '3%', display: 'flex', flexDirection: 'row'}}
              >
              <ControlButton 
                className="control-button"
                onClick={() => handleShowModal()}
              >🔍</ControlButton>
              </Controls>
            </ReactFlow>
          </div>
      )}
      {relatedTopicsModal && (
        <div className="modal-overlay" onClick={closeModal}> 
          <div className="modal" onClick={(e) => e.stopPropagation()}> 
            <h1 className='modal-title'>¿Quieres crear una ruta de un tema relacionado? 🧐</h1>
            <ul>
              {relatedTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button onClick={() => handleNewRoadmap()} className='modal-button'>Sí 😃</button>
              <button onClick={closeModal} className='modal-button'>No 🙁</button> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedRoadmap;