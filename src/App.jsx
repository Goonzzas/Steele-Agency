import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import ModelCard from './components/ModelCard';
import AddModelModal from './components/AddModelModal';
import AssignModelModal from './components/AssignModelModal';
import ThemeSelector from './components/ThemeSelector';
import AttendanceReport from './components/AttendanceReport';
import './App.css';

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Themes: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Members: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

function App() {
  const [view, setView] = useState('dashboard');
  const [models, setModels] = useState([]);
  const [themes, setThemes] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [themeAssignments, setThemeAssignments] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themeModelIds, setThemeModelIds] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      fetchThemeData(selectedTheme.id);
      setShowReport(false);
    }
  }, [selectedTheme]);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: themesData } = await supabase.from('themes').select('*').order('created_at', { ascending: false });
    const { data: modelsData } = await supabase.from('models').select('*').order('name');
    const { data: attData } = await supabase.from('attendance').select('*');
    const { data: assignData } = await supabase.from('theme_models').select('*');
    
    setThemes(themesData || []);
    setModels(modelsData || []);
    setAllAttendance(attData || []);
    setThemeAssignments(assignData || []);
    if (themesData?.length > 0) setSelectedTheme(themesData[0]);
    setLoading(false);
  };

  const fetchThemeData = async (themeId) => {
    const { data: assignedData } = await supabase.from('theme_models').select('model_id').eq('theme_id', themeId);
    setThemeModelIds(assignedData?.map(a => a.model_id) || []);
    const { data: attendanceData } = await supabase.from('attendance').select('*').eq('theme_id', themeId);
    setAttendance(attendanceData || []);
  };

  const addModelToSystem = async (name) => {
    const { data, error } = await supabase.from('models').insert([{ name }]).select();
    if (!error && data) {
      const newModel = data[0];
      setModels([...models, newModel].sort((a, b) => a.name.localeCompare(b.name)));
      if (selectedTheme) {
        await supabase.from('theme_models').insert([{ theme_id: selectedTheme.id, model_id: newModel.id }]);
        setThemeModelIds(prev => [...prev, newModel.id]);
        setThemeAssignments(prev => [...prev, { theme_id: selectedTheme.id, model_id: newModel.id }]);
      }
    }
    setShowAddModal(false);
  };

  const createTheme = async (name, day1, day2) => {
    const { data, error } = await supabase.from('themes').insert([{ name, day1, day2 }]).select();
    if (error) {
      alert("Error al crear temática: " + error.message);
      return;
    }
    if (data) {
      const newTheme = data[0];
      setThemes([newTheme, ...themes]);
      setSelectedTheme(newTheme);
      setView('themes');

      const assignments = models.map(m => ({ theme_id: newTheme.id, model_id: m.id }));
      await supabase.from('theme_models').insert(assignments);
      setThemeModelIds(models.map(m => m.id));
      setThemeAssignments(prev => [...prev, ...assignments]);
    }
  };

  const updateAttendance = async (modelId, updates) => {
    if (!selectedTheme) return;
    
    const existing = attendance.find(a => a.model_id === modelId);
    if (existing) {
      const { error } = await supabase.from('attendance').update(updates).eq('id', existing.id);
      if (!error) {
        const updated = attendance.map(a => a.id === existing.id ? { ...a, ...updates } : a);
        setAttendance(updated);
        setAllAttendance(allAttendance.map(a => a.id === existing.id ? { ...a, ...updates } : a));
      }
    } else {
      const { data, error } = await supabase.from('attendance').insert([{ 
        model_id: modelId, 
        theme_id: selectedTheme.id, 
        status: 'absent',
        ...updates 
      }]).select();
      if (!error && data) {
        setAttendance([...attendance, data[0]]);
        setAllAttendance([...allAttendance, data[0]]);
      }
    }
  };

  const deleteModelFromSystem = async (id) => {
    if (window.confirm('¿Eliminar modelo del sistema?')) {
      const { error } = await supabase.from('models').delete().eq('id', id);
      if (!error) setModels(models.filter(m => m.id !== id));
    }
  };

  const deleteTheme = async (id) => {
    if (window.confirm('¿Eliminar temática?')) {
      const { error } = await supabase.from('themes').delete().eq('id', id);
      if (!error) {
        const updatedThemes = themes.filter(t => t.id !== id);
        setThemes(updatedThemes);
        if (selectedTheme?.id === id) setSelectedTheme(updatedThemes[0] || null);
      }
    }
  };

  const toggleModelAssignment = async (modelId, currentlyAssigned) => {
    if (!selectedTheme) return;
    if (currentlyAssigned) {
      await supabase.from('theme_models').delete().eq('theme_id', selectedTheme.id).eq('model_id', modelId);
      setThemeModelIds(themeModelIds.filter(id => id !== modelId));
      setThemeAssignments(themeAssignments.filter(a => !(a.theme_id === selectedTheme.id && a.model_id === modelId)));
    } else {
      await supabase.from('theme_models').insert([{ theme_id: selectedTheme.id, model_id: modelId }]);
      setThemeModelIds([...themeModelIds, modelId]);
      setThemeAssignments([...themeAssignments, { theme_id: selectedTheme.id, model_id: modelId }]);
    }
  };

  const getModelStats = (modelId) => {
    const assignedThemeIds = themeAssignments.filter(a => a.model_id === modelId).map(a => a.theme_id);
    const modelAttData = allAttendance.filter(a => a.model_id === modelId);

    let assisted = 0;
    let justified = 0;
    let absent = 0;

    assignedThemeIds.forEach(themeId => {
      const themeRecords = modelAttData.filter(a => a.theme_id === themeId);
      if (themeRecords.some(r => r.status === 'assisted')) {
        assisted++;
      } else if (themeRecords.some(r => r.status === 'justified')) {
        justified++;
      } else {
        absent++;
      }
    });

    return { assisted, justified, absent };
  };

  const themeModels = models.filter(m => themeModelIds.includes(m.id));
  const filteredThemeModels = themeModels.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPresentToday = allAttendance.filter(a => a.status === 'assisted').length;

  if (loading) return <div className="loading">Cargando STEELE...</div>;

  return (
    <div className="app-layout">
      <nav className="nav-sidebar">
        <div className="nav-brand">STEELE</div>
        <div className="nav-items">
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <Icons.Dashboard /> <span>Dashboard</span>
          </button>
          <button className={`nav-btn ${view === 'themes' ? 'active' : ''}`} onClick={() => setView('themes')}>
            <Icons.Themes /> <span>Temáticas</span>
          </button>
          <button className={`nav-btn ${view === 'members' ? 'active' : ''}`} onClick={() => setView('members')}>
            <Icons.Members /> <span>Miembros</span>
          </button>
        </div>
      </nav>

      <div className="main-viewport">
        <Header />

        <div className="content-container">
          {view === 'dashboard' && (
            <div className="dashboard-v2">
              <div className="dashboard-hero">
                <div className="hero-text">
                  <h1>Panel de Control Steele</h1>
                  <p>Gestión integral de modelos y temáticas</p>
                </div>
                <div className="hero-stats">
                  <div className="h-stat">
                    <span className="h-val">{themes.length}</span>
                    <span className="h-lab">Temáticas</span>
                  </div>
                  <div className="h-stat">
                    <span className="h-val">{models.length}</span>
                    <span className="h-lab">Modelos</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid-v2">
                <div className="dash-card main-chart">
                  <div className="card-header">
                    <h3>Rendimiento por Temática</h3>
                    <span className="tag-premium">Asistencia %</span>
                  </div>
                  <div className="chart-container-v2">
                    {themes.slice(0, 5).reverse().map(theme => {
                      const themeAtt = allAttendance.filter(a => a.theme_id === theme.id && a.status === 'assisted').length;
                      const themeTotal = themeAssignments.filter(a => a.theme_id === theme.id).length;
                      const percentage = themeTotal > 0 ? (themeAtt / themeTotal) * 100 : 0;
                      return (
                        <div key={theme.id} className="chart-bar-row">
                          <span className="bar-label">{theme.name}</span>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="bar-val">{Math.round(percentage)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="dash-card top-models">
                  <div className="card-header">
                    <h3>Top Modelos</h3>
                    <Icons.Members />
                  </div>
                  <div className="top-models-list">
                    {models
                      .map(m => ({ ...m, stats: getModelStats(m.id) }))
                      .sort((a, b) => b.stats.assisted - a.stats.assisted)
                      .slice(0, 4)
                      .map((m, idx) => (
                        <div key={m.id} className="top-model-item">
                          <div className="tm-rank">{idx + 1}</div>
                          <div className="tm-info">
                            <span className="tm-name">{m.name}</span>
                            <span className="tm-stat">{m.stats.assisted} asistencias</span>
                          </div>
                          <div className="tm-badge">Premium</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'themes' && (
            <div className="themes-view-v4">
              <ThemeSelector themes={themes} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} onCreateTheme={createTheme} onDeleteTheme={deleteTheme} />
              
              <div className="theme-content-v4">
                {selectedTheme ? (
                  showReport ? (
                    <AttendanceReport theme={selectedTheme} models={themeModels} attendance={attendance} onBack={() => setShowReport(false)} />
                  ) : (
                    <>
                      <div className="theme-header-row-v4">
                        <div className="theme-title-area-v4">
                          <h2>Sesión: {selectedTheme.name}</h2>
                          <button className="btn-report-v4" onClick={() => setShowReport(true)}>Generar Reporte PDF</button>
                        </div>
                        <div className="theme-actions-area-v4">
                          <input type="text" className="search-box-v4" placeholder="Buscar modelo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          <button className="btn-manage-v4" onClick={() => setShowAssignModal(true)}>Selección de Modelos</button>
                        </div>
                      </div>
                      <div className="model-grid-v4">
                        {filteredThemeModels.map(model => (
                          <ModelCard 
                            key={model.id} 
                            model={model} 
                            theme={selectedTheme}
                            record={attendance.find(a => a.model_id === model.id)}
                            onUpdate={(updates) => updateAttendance(model.id, updates)}
                          />
                        ))}
                      </div>
                    </>
                  )
                ) : (
                  <div className="empty-state-v4"><p>Selecciona o crea una temática arriba para empezar.</p></div>
                )}
              </div>
            </div>
          )}

          {view === 'members' && (
            <div className="members-view">
              <div className="members-header">
                <h2>Gestión de Miembros</h2>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>Nuevo Miembro</button>
              </div>
              <div className="members-grid-v2">
                {models.map(model => {
                  const stats = getModelStats(model.id);
                  return (
                    <div key={model.id} className="member-card-v2">
                      <div className="member-main">
                        <div className="member-avatar-v2">{model.name.charAt(0)}</div>
                        <span className="member-name-v2">{model.name}</span>
                      </div>
                      <div className="member-stats-v2">
                        <div className="stat-pill assisted"><span>A</span> {stats.assisted}</div>
                        <div className="stat-pill absent"><span>F</span> {stats.absent}</div>
                        <div className="stat-pill justified"><span>J</span> {stats.justified}</div>
                      </div>
                      <button className="btn-delete-v2" onClick={() => deleteModelFromSystem(model.id)}>×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddModelModal onSave={addModelToSystem} onCancel={() => setShowAddModal(false)} />}
      {showAssignModal && <AssignModelModal models={models} assignedModelIds={themeModelIds} onAssign={toggleModelAssignment} onCancel={() => setShowAssignModal(false)} />}
    </div>
  );
}

export default App;
