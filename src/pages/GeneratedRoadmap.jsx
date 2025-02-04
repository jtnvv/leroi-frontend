import { useLocation } from 'react-router-dom';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import CustomNode from '../components/CustomNode';
import '../styles/roadmap.css';

function GeneratedRoadmap() {
  const location = useLocation();
  const { roadmapTopics } = location.state || {};

  const nodes = [];
  const edges = [];

  let idCounter = 0;
  const levelOffset = 500; // Espacio entre niveles
  const nodeWidth = 400; // Ancho de los nodos

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
              fitView>
              <Background />
              <Controls/>
            </ReactFlow>
          </div>
      )}
    </div>
  );
}

export default GeneratedRoadmap;