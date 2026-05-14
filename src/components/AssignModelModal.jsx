import React, { useState } from 'react';

const AssignModelModal = ({ models, assignedModelIds, onAssign, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-card-premium large glass">
        <div className="modal-header-premium">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div>
            <h2>Asignar Modelos</h2>
            <p>Gestiona los participantes para esta temática.</p>
          </div>
        </div>
        
        <div className="modal-search-premium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: 'var(--accent)'}}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            className="search-input-premium" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="modal-list-premium grid-list">
          {filteredModels.map(model => {
            const isAssigned = assignedModelIds.includes(model.id);
            return (
              <div 
                key={model.id} 
                className={`list-item-premium interactive ${isAssigned ? 'selected' : ''}`}
                onClick={() => onAssign(model.id, isAssigned)}
              >
                <div className="item-avatar">
                  {model.name.charAt(0).toUpperCase()}
                </div>
                <div className="item-info">
                  <span className="item-name">{model.name}</span>
                  <span className="item-status">{isAssigned ? '✓ Asignado' : '+ Disponible'}</span>
                </div>
                <div className={`assignment-indicator ${isAssigned ? 'active' : ''}`}>
                  <div className="indicator-dot"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-actions-premium">
          <button className="btn-done-premium gradient" onClick={onCancel}>
            Listo, guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModelModal;
