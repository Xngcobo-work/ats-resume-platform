import React, { useState } from 'react';
import { Sparkles, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AnalysisDetail from './components/AnalysisDetail';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'detail'
  const [selectedResume, setSelectedResume] = useState(null);

  const handleViewAnalysis = (resume) => {
    setSelectedResume(resume);
    setView('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedResume(null);
    setView('dashboard');
  };

  return (
    <>
      <nav className="navbar" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={handleBackToDashboard}
        >
          <div style={{ 
            background: 'var(--grad-primary)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Sparkles color="white" size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Resume<span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Parser</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className={`btn btn-sm ${view === 'dashboard' ? 'btn-ghost' : 'btn-ghost'}`} 
            onClick={handleBackToDashboard}
            style={{ color: view === 'dashboard' ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            <LayoutDashboard size={14} /> Dashboard
          </button>
        </div>
      </nav>

      <main className="container" style={{ padding: '3rem 2rem 6rem', maxWidth: '1200px' }}>
        {view === 'dashboard' && (
          <div className="animate-fade-in-up">
            <Dashboard onView={handleViewAnalysis} />
          </div>
        )}
        
        {view === 'detail' && selectedResume && (
          <AnalysisDetail 
            resume={selectedResume} 
            onBack={handleBackToDashboard} 
          />
        )}
      </main>
    </>
  );
}

export default App;
