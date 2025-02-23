import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Icono de eliminar
import "../styles/profile.css";

function RoadmapsSection() {
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const roadmapsResponse = await fetch(`${backendUrl}/user-roadmaps`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!roadmapsResponse.ok) {
          throw new Error("Error al obtener los roadmaps del usuario");
        }

        const roadmapsData = await roadmapsResponse.json();
        setUserRoadmaps(roadmapsData.data);
      } catch (error) {
        console.error("Error al obtener los roadmaps:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoadmaps();
  }, [backendUrl, authToken, navigate]);

  const handleRoadmapClick = (roadmap) => {
    navigate("/generatedRoadmap", { state: { roadmapTopics: JSON.parse(roadmap.prompt) } });
  };

  const handleDeleteImage = async (roadmapId) => {
    const authToken = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
    try {
      const response = await fetch(`${backendUrl}/delete-roadmap-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roadmap_id: roadmapId }),
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la imagen del roadmap: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message); 
      setUserRoadmaps((prevRoadmaps) =>
        prevRoadmaps.map((roadmap) =>
          roadmap.id_roadmap === roadmapId
            ? { ...roadmap, image: null } 
            : roadmap
        )
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000); 

    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">Cargando roadmaps...</div>
      </div>
    );
  }
  return (
    <div className="roadmaps-section">
      <h3>Roadmaps Creados</h3>
      {userRoadmaps.length > 0 ? (
        <div className="roadmaps-grid">
          {userRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id_roadmap}
              className="roadmap-card"
              onClick={() => handleRoadmapClick(roadmap)}
            >
              <div className="roadmap-card-header">
                <strong>{roadmap.nombre}</strong>
              </div>
              <div className="roadmap-card-body">
  <img
    src={roadmap.image || "ruta/a/imagen/por/defecto.png"}
    alt={`Imagen de ${roadmap.nombre}`}
    className="roadmap-image"
  />
 <p>Creado el: {new Date(Date.parse(roadmap.fecha_creacion)).toLocaleDateString()}</p>
 
  <div className="delete-icon-container">
    <FaTrash
      className="delete-icon"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteImage(roadmap.id_roadmap);
      }}
    />
  </div>
</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No has creado ningún roadmap aún.</p>
      )}
    </div>
  );
}

export default RoadmapsSection;