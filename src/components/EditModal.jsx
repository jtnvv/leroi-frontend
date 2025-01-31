import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import "../styles/modal.css";

function EditModal({ onClose, userData }) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    birthDate: userData.birthDate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para enviar los datos actualizados al backend
    console.log("Datos actualizados:", formData);
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Modificar Datos</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nombre:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Apellido:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          <div className="modal-buttons">
            <Button type="submit">Guardar Cambios</Button>
            <Button className="cancel" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;