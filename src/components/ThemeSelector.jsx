import React, { useState } from 'react';

const ThemeSelector = ({ themes, selectedTheme, onSelectTheme, onCreateTheme, onDeleteTheme }) => {
  const [newThemeName, setNewThemeName] = useState('');
  const [day1, setDay1] = useState('');
  const [day2, setDay2] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newThemeName && day1 && day2) {
      onCreateTheme(newThemeName, day1, day2);
      setNewThemeName('');
      setDay1('');
      setDay2('');
      setShowForm(false);
    }
  };

  return (
    <div className="theme-selector-top">
      <div className="theme-selector-header">
        <div className="header-left">
          <h3>Temáticas de la Agencia</h3>
          <p className="theme-count-label">{themes.length} Sesiones registradas</p>
        </div>
        <button className="btn-add-theme-v4" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nueva Temática'}
        </button>
      </div>

      {showForm && (
        <form className="new-theme-form-v4" onSubmit={handleSubmit}>
          <div className="form-row-v4">
            <div className="field-group">
              <label>Nombre</label>
              <input type="text" placeholder="Nombre..." value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} required />
            </div>
            <div className="field-group">
              <label>Día 1</label>
              <input type="date" value={day1} onChange={(e) => setDay1(e.target.value)} required />
            </div>
            <div className="field-group">
              <label>Día 2</label>
              <input type="date" value={day2} onChange={(e) => setDay2(e.target.value)} required />
            </div>
            <button type="submit" className="btn-save-v4">Crear</button>
          </div>
        </form>
      )}

      <div className="theme-scroller-v4">
        <div className="theme-list-v4">
          {themes.map((theme) => (
            <div 
              key={theme.id} 
              className={`theme-card-v4 ${selectedTheme?.id === theme.id ? 'active' : ''}`}
              onClick={() => onSelectTheme(theme)}
            >
              <div className="theme-card-info">
                <span className="theme-name-v4">{theme.name}</span>
                <span className="theme-dates-v4">{theme.day1} / {theme.day2}</span>
              </div>
              <button className="btn-delete-v4" onClick={(e) => { e.stopPropagation(); onDeleteTheme(theme.id); }}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
