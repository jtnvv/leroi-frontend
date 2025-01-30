import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "../components/ui/Button";
import "../styles/profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/user-profile", {
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
  }, []);

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
      <div className="profile-box">
        <div className="profile-header">
          <h2>Perfil de Usuario</h2>
        </div>
        <div className="profile-main">
          <div className="profile-image">
            <User />
          </div>
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
