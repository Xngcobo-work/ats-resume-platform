import React from 'react';
import { FileText, Mail, Phone, GraduationCap, Briefcase, ChevronRight, Trash2 } from 'lucide-react';

const SCORE_COLOR = (s) => {
  if (s >= 75) return 'var(--accent-success)';
  if (s >= 50) return 'var(--accent-warning)';
  return 'var(--accent-danger)';
};

function ScoreBar({ value, color }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );
}

export default function ResumeCard({ resume, onView, onDelete }) {
  const score = resume.overall_score ?? 0;
  const color = SCORE_COLOR(score);
  const skills = (resume.skills ?? []).slice(0, 4);
  const name = resume.candidate_name || resume.file_name;

  return (
    <div
      className="glass-card"
      style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
      onClick={() => onView(resume)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
          {/* Score ring */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            border: `2.5px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            background: `${color}18`,
            boxShadow: `0 0 14px ${color}30`,
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{score}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {resume.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Mail size={11} /> {resume.email}
                </span>
              )}
              {resume.years_experience != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={11} /> {resume.years_experience}y exp.
                </span>
              )}
              {resume.education_level && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <GraduationCap size={11} /> {resume.education_level}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <StatusBadge status={resume.status} />
          <button
            className="btn btn-icon btn-ghost btn-sm"
            onClick={(e) => { e.stopPropagation(); onDelete(resume); }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {resume.status === 'complete' && (
        <>
          {/* Score bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Overall', val: resume.overall_score },
              { label: 'Keywords', val: resume.keyword_score },
              { label: 'Experience', val: resume.experience_score },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: SCORE_COLOR(val) }}>{val ?? '-'}</span>
                </div>
                <ScoreBar value={val ?? 0} color={SCORE_COLOR(val ?? 0)} />
              </div>
            ))}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              {(resume.skills?.length ?? 0) > 4 && (
                <span className="pill pill-muted">+{resume.skills.length - 4}</span>
              )}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <FileText size={12} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{resume.file_name}</span>
        </div>
        {resume.status === 'complete' && (
          <button className="btn btn-ghost btn-sm" style={{ gap: '0.35rem', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); onView(resume); }}>
            View Analysis <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
