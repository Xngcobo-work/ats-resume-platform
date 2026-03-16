import React from 'react';
import {
  ArrowLeft, Download, Trash2, Mail, Phone, GraduationCap,
  Briefcase, User, Award, Zap, TrendingUp, Target,
  CheckCircle2, AlertTriangle, Lightbulb
} from 'lucide-react';
import { deleteResume } from '../lib/analyzeResume.js';

const S_COLOR = (s) => s >= 75 ? 'var(--accent-success)' : s >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)';
const S_LABEL = (s) => s >= 75 ? 'Excellent'             : s >= 50 ? 'Good'                  : 'Needs Work';

function ScoreGauge({ label, value, icon: Icon, accentColor }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1rem',
        border: `3px solid ${accentColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${accentColor}15`,
        boxShadow: `0 0 20px ${accentColor}30`,
      }}>
        <Icon size={20} color={accentColor} />
      </div>
      <div style={{ fontSize: '2.25rem', fontWeight: 900, color: accentColor, lineHeight: 1, letterSpacing: '-1px', marginBottom: '0.25rem' }}>
        {Math.round(value ?? 0)}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: accentColor, fontWeight: 700 }}>{S_LABEL(value ?? 0)}</div>
      <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
        <div className="progress-fill" style={{ width: `${value ?? 0}%`, background: accentColor }} />
      </div>
    </div>
  );
}

export default function AnalysisDetail({ resume, onBack }) {
  const handleDelete = async () => {
    if (!confirm('Delete this analysis? This cannot be undone.')) return;
    try {
      await deleteResume(resume);
      onBack();
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Failed to delete analysis: ${err.message}`);
    }
  };

  const handlePrint = () => window.print();

  const name = resume.candidate_name || resume.file_name || 'Unknown Candidate';

  return (
    <div className="animate-fade-in-up">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={handlePrint}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 900, color: '#fff',
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.875rem', letterSpacing: '-0.5px' }}>{name}</h1>
              <span className={`status-badge status-${resume.status}`}>{resume.status}</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {resume.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Mail size={14} /> {resume.email}
                </span>
              )}
              {resume.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Phone size={14} /> {resume.phone}
                </span>
              )}
              {resume.education_level && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <GraduationCap size={14} /> {resume.education_level}
                </span>
              )}
              {resume.years_experience != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Briefcase size={14} /> {resume.years_experience} years experience
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {resume.status !== 'complete' ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Analysis {resume.status}...</h3>
          <p className="text-secondary">This page will update automatically when ready.</p>
        </div>
      ) : (
        <>
          {/* Score gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <ScoreGauge label="Overall Match"      value={resume.overall_score}    icon={Award}      accentColor={S_COLOR(resume.overall_score)}    />
            <ScoreGauge label="Keyword Coverage"   value={resume.keyword_score}    icon={Target}     accentColor={S_COLOR(resume.keyword_score)}    />
            <ScoreGauge label="Experience Quality" value={resume.experience_score} icon={TrendingUp} accentColor={S_COLOR(resume.experience_score)} />
          </div>

          {/* AI Summary */}
          {resume.summary && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
                <Zap size={13} /> AI Summary
              </div>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{resume.summary}</p>
            </div>
          )}

          {/* Skills + Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-success)" /> Detected Skills
                <span className="pill pill-success" style={{ marginLeft: 'auto' }}>{(resume.skills ?? []).length}</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(resume.skills ?? []).length > 0
                  ? (resume.skills ?? []).map(s => <span key={s} className="skill-tag">{s}</span>)
                  : <span className="text-muted" style={{ fontSize: '0.85rem' }}>No skills detected.</span>}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="var(--accent-warning)" /> Recommended Skills
                <span className="pill pill-warning" style={{ marginLeft: 'auto' }}>{(resume.missing_skills ?? []).length}</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(resume.missing_skills ?? []).length > 0
                  ? (resume.missing_skills ?? []).map(s => <span key={s} className="skill-tag missing">{s}</span>)
                  : <span className="text-muted" style={{ fontSize: '0.85rem' }}>No gaps identified.</span>}
              </div>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> Strengths
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {(resume.strengths ?? []).length > 0
                  ? (resume.strengths ?? []).map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-success)', marginTop: '0.15rem', flexShrink: 0 }}>✓</span>
                      {s}
                    </li>
                  ))
                  : <li className="text-muted" style={{ fontSize: '0.85rem' }}>None identified.</li>}
              </ul>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={16} /> Improvements
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {(resume.improvements ?? []).length > 0
                  ? (resume.improvements ?? []).map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-warning)', marginTop: '0.15rem', flexShrink: 0 }}>→</span>
                      {s}
                    </li>
                  ))
                  : <li className="text-muted" style={{ fontSize: '0.85rem' }}>No improvements needed.</li>}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
