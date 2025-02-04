import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="modal-button cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;