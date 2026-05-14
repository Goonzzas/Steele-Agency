import React from 'react';

const ModelCard = ({ model, record, theme, onUpdate }) => {
  const status = record?.status || 'absent';
  const shift = record?.shift || '';

  const handleSelection = (selectedShift) => {
    // If clicking the same shift, reset to absent
    if (status === 'assisted' && String(shift) === String(selectedShift)) {
      onUpdate({ status: 'absent', date: null, shift: null });
      return;
    }

    // Assign the date based on the theme's defined days
    const selectedDate = selectedShift === 1 ? theme.day1 : theme.day2;
    onUpdate({ 
      status: 'assisted', 
      date: selectedDate, 
      shift: selectedShift 
    });
  };

  const toggleJustified = () => {
    if (status === 'justified') {
      onUpdate({ status: 'absent', date: null, shift: null });
    } else {
      onUpdate({ status: 'justified', date: null, shift: null });
    }
  };

  return (
    <div className="model-card-horizontal-v3">
      <div className="model-info-v3">
        <div className="member-avatar-v2">{model.name.charAt(0)}</div>
        <span className="member-name-v2">{model.name}</span>
      </div>

      <div className="selection-buttons-v3">
        <button 
          className={`btn-sel ${status === 'assisted' && String(shift) === '1' ? 'active-a' : ''}`}
          onClick={() => handleSelection(1)}
        >
          Jornada 1
          <span className="btn-subtext">{theme.day1 || 'Sin fecha'}</span>
        </button>

        <button 
          className={`btn-sel ${status === 'assisted' && String(shift) === '2' ? 'active-a' : ''}`}
          onClick={() => handleSelection(2)}
        >
          Jornada 2
          <span className="btn-subtext">{theme.day2 || 'Sin fecha'}</span>
        </button>

        <button 
          className={`btn-sel ${status === 'justified' ? 'active-j' : ''}`}
          onClick={toggleJustified}
        >
          Justificación
        </button>
      </div>

      <div className="status-badge-v3">
        <div className={`status-dot ${status}`}></div>
        <span>{status === 'assisted' ? 'Asistió' : status === 'justified' ? 'Justificado' : 'Faltó'}</span>
      </div>
    </div>
  );
};

export default ModelCard;
