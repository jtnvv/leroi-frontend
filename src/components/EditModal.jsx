import { useState } from "react";
import { Button } from "../components/ui/Button";
import PropTypes from "prop-types";
import "../styles/modal.css";

EditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
}

function EditModal({ onClose, userData, onSave }) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
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
              required
            />
          </div>
          <div className="form-field">
            <label>Apellido:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
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