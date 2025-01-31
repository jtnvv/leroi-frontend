import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "../components/ui/Button";
import ConfirmModal from "../components/modal";
import EditModal from "../components/EditModal";
import "../styles/profile.css";
import "../styles/modal.css";
import "../styles/editmodal.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/user-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, [backendUrl]);

  const handleDeleteAccount = async () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "/login";
      return;
    }
  
    try {
      const response = await fetch(
        `${backendUrl}/delete-user/${encodeURIComponent(userData.email)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al borrar la cuenta");
      }
  
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al borrar la cuenta:", error);
      alert("Hubo un error al intentar borrar la cuenta.");
    } finally {
      setShowConfirmModal(false);
    }
  };
  

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>

      {/* Título fuera de la caja */}
      <h2 className="profile-title">Perfil de Usuario</h2>

      {/* Caja de perfil */}
      <div className="profile-box">
        {/* Sección izquierda: Ícono SVG */}
        <div className="profile-image">
          <User />
        </div>

        {/* Sección derecha: Campos de información */}
        <div className="profile-fields">
          <div className="profile-field">
            <strong>Nombre:</strong> {userData.firstName} {userData.lastName}
          </div>
          <div className="profile-field">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="profile-field">
            <strong>Saldo de Créditos:</strong> ${userData.credits}
          </div>
          <div className="profile-field">
            <strong>Roadmaps Creados:</strong> {userData.roadmapsCreated}
          </div>
          <div className="profile-field">
            <strong>Fecha de Nacimiento:</strong>{" "}
            {new Date(userData.birthDate).toLocaleDateString()}
          </div>
        </div>

        {/* Botones en la parte inferior derecha */}
        <div className="profile-footer">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Cerrar sesión
          </Button>
          <Button
            className="edit-button" 
            size="sm"
            onClick={() => setShowEditModal(true)} 
          >
            Modificar datos
          </Button>
          <Button
            className="delete-button"
            size="sm"
            onClick={handleDeleteAccount}
          >
            Borrar cuenta
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <ConfirmModal
          message="¿Estás seguro de que deseas borrar tu cuenta? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}



      {showEditModal && (
        <EditModal
          userData={userData}
          onClose={() => setShowEditModal(false)}
        />
      )}

    </div>
  );
}

export default Profile;