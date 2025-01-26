import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "../components/ui/Button";
import "../styles/profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Simulamos la carga de los datos del usuario
      setUserData({
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@example.com",
        credits: 120,
        roadmapsCreated: 5,
        birthDate: "1990-06-15",
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* Contenedor del título */}
        <div className="profile-header">
          <h2>Perfil de Usuario</h2>
        </div>
        <div className="profile-main">
          {/* Imagen del usuario */}
          <div className="profile-image">
            <User />
          </div>

          {/* Campos del usuario */}
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
        </div>

        {/* Botón para cerrar sesión */}
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
        </div>
      </div>
    </div>
  );
}

export default Profile;
