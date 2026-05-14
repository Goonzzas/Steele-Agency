import React, { useState } from 'react';

const AddModelModal = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
      setName('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card-premium glass">
        <div className="modal-header-premium">
          <div className="header-icon bg-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: 'white'}}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div>
            <h2>Nuevo Miembro</h2>
            <p>Registra un modelo en el sistema global.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-premium">
          <div className="input-group-premium">
            <label>Nombre del Modelo</label>
            <div className="input-with-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                className="input-field-premium padded"
                placeholder="Nombre y apellido..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="modal-actions-premium">
            <button type="button" className="btn-cancel-premium" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-save-premium gradient">
              Añadir al Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModelModal;
