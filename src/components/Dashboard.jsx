import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Upload, RefreshCw, FileText,
  CheckCircle2, Clock, AlertCircle, TrendingUp, Users
} from 'lucide-react';
import ResumeCard from './ResumeCard.jsx';
import FilterBar, { applyFilters } from './FilterBar.jsx';
import UploadZone from './UploadZone.jsx';
import { loadAllResumes, analyzeResume, createPendingRecord, markError, deleteResume } from '../lib/analyzeResume.js';

export default function Dashboard({ onView }) {
  const [resumes, setResumes]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters]       = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchResumes = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await loadAllResumes();
      // Filter out items that are currently being deleted to avoid race conditions
      const filteredData = data.filter(r => !deletingIds.has(r.id));
      setResumes(filteredData);
      setFiltered(filters ? applyFilters(filteredData, filters) : filteredData);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => { fetchResumes(); }, []);

  // Auto-refresh every 8s while any resume is processing
  useEffect(() => {
    const processing = resumes.some(r => r.status === 'pending' || r.status === 'processing');
    if (!processing) return;
    const timer = setInterval(() => fetchResumes(true), 8000);
    return () => clearInterval(timer);
  }, [resumes, fetchResumes]);

  const handleFilterChange = (f) => {
    setFilters(f);
    setFiltered(applyFilters(resumes, f));
  };

  const handleUpload = async (file, onProgress) => {
    const record = await createPendingRecord(file.name);
    // Optimistically add to list
    setResumes(prev => [record, ...prev]);
    setFiltered(prev => [record, ...prev]);

    try {
      const updated = await analyzeResume(file, record.id, onProgress);
      // Replace record in state
      const fresh = await loadAllResumes();
      setResumes(fresh);
      setFiltered(filters ? applyFilters(fresh, filters) : fresh);
    } catch (err) {
      await markError(record.id, err.message);
      const fresh = await loadAllResumes();
      setResumes(fresh);
      setFiltered(filters ? applyFilters(fresh, filters) : fresh);
      throw err;
    }
  };

  const handleDelete = async (resume) => {
    if (!confirm(`Delete analysis for "${resume.candidate_name || resume.file_name}"?`)) return;
    
    // Add to deleting set to prevent polling from resurrecting this item
    setDeletingIds(prev => new Set(prev).add(resume.id));
    
    // Optimistically remove from UI
    setResumes(prev => prev.filter(r => r.id !== resume.id));
    setFiltered(prev => prev.filter(r => r.id !== resume.id));

    try {
      await deleteResume(resume);
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Failed to delete resume: ${err.message}`);
      // On failure, we should probably fetch to restore state, but let's just remove from deleting set
      const fresh = await loadAllResumes();
      setResumes(fresh);
      setFiltered(filters ? applyFilters(fresh, filters) : fresh);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(resume.id);
        return next;
      });
    }
  };

  // Stats
  const total      = resumes.length;
  const complete   = resumes.filter(r => r.status === 'complete').length;
  const errors     = resumes.filter(r => r.status === 'error').length;
  const avgScore   = complete
    ? Math.round(resumes.filter(r => r.status === 'complete').reduce((s, r) => s + (r.overall_score ?? 0), 0) / complete)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>
            <span className="text-gradient">Resume</span> Dashboard
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            Analyze, filter, and manage all uploaded candidate resumes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => fetchResumes(true)} disabled={refreshing}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowUpload(p => !p)}>
            <Upload size={15} />
            Upload Resumes
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Resumes',    icon: Users,        value: total,     color: 'var(--accent-primary)' },
          { label: 'Analyzed',         icon: CheckCircle2, value: complete,  color: 'var(--accent-success)' },
          { label: 'Avg Score',        icon: TrendingUp,   value: avgScore ? `${avgScore}%` : '—', color: '#f59e0b' },
          { label: 'Errors',           icon: AlertCircle,  value: errors,    color: 'var(--accent-danger)'  },
        ].map(({ label, icon: Icon, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}18` }}>
              <Icon size={16} color={color} />
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', animation: 'fade-in-up 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Upload & Analyze</h3>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowUpload(false)}>✕</button>
          </div>
          <UploadZone onUpload={handleUpload} />
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <FilterBar onChange={handleFilterChange} />
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          {filtered.length} of {total} resume{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Resume list */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FileText size={28} color="var(--text-muted)" /></div>
          <h3>{resumes.length === 0 ? 'No resumes yet' : 'No results'}</h3>
          <p className="text-muted" style={{ maxWidth: 360 }}>
            {resumes.length === 0
              ? 'Upload your first resume to get started with AI-powered analysis.'
              : 'Try adjusting your filter criteria.'}
          </p>
          {resumes.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
              <Upload size={15} /> Upload Resume
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filtered.map(r => (
            <ResumeCard key={r.id} resume={r} onView={onView} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
