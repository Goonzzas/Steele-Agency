import React from 'react';

const AttendanceReport = ({ theme, models = [], attendance = [], onBack }) => {
  // Logic: 1 status per model for this theme
  const getThemeStatus = (modelId) => {
    const modelRecords = attendance.filter(a => a.model_id === modelId);
    
    // Priority 1: Assisted (even if just one session)
    if (modelRecords.some(r => r.status === 'assisted')) return 'A';
    
    // Priority 2: Justified
    if (modelRecords.some(r => r.status === 'justified')) return 'J';
    
    // Default: Absent
    return 'F';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="btn-back" onClick={onBack}>
          ← Volver
        </button>
        <div className="report-title">
          <h2>Reporte Final: {theme?.name || 'Temática'}</h2>
          <p>Estado global por miembro para esta temática</p>
        </div>
        <button className="btn-print" onClick={handlePrint}>
          Imprimir / PDF
        </button>
      </div>

      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th className="session-header">Estado en "{theme?.name}"</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => {
              const status = getThemeStatus(model.id);
              return (
                <tr key={model.id}>
                  <td className="model-name-cell">{model.name}</td>
                  <td className={`status-cell ${status}`}>
                    <span className="status-letter">{status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="report-footer">
        <div className="legend">
          <div className="legend-item"><span className="dot A"></span> <strong>A:</strong> Asistió</div>
          <div className="legend-item"><span className="dot F"></span> <strong>F:</strong> Faltó</div>
          <div className="legend-item"><span className="dot J"></span> <strong>J:</strong> Justificado</div>
        </div>
        <p className="report-note">* Si asistió a cualquier jornada de esta temática, se cuenta como Asistió.</p>
      </div>
    </div>
  );
};

export default AttendanceReport;
