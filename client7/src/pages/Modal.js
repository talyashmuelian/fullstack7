import React from "react";
import "../css/Modal.css";

function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <p className="modal-message">{message}</p>
      </div>
    </div>
  );
}

export default Modal;
