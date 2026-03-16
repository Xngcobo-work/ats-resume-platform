import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const DEFAULT_FILTERS = {
  search: '',
  minScore: 0,
  status: 'all',
  skill: '',
  sort: 'newest',
};

export default function FilterBar({ onChange }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expanded, setExpanded] = useState(false);

  const update = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onChange(next);
  };

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    onChange(DEFAULT_FILTERS);
  };

  const hasActive = filters.search || filters.minScore > 0 || filters.status !== 'all' || filters.skill || filters.sort !== 'newest';

  return (
    <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
      {/* Top row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search candidate, email..."
            value={filters.search}
            onChange={e => update({ search: e.target.value })}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Status */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            className="input-field"
            value={filters.status}
            onChange={e => update({ status: e.target.value })}
            style={{ paddingRight: '2rem', minWidth: 130 }}
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>

        {/* Sort */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            className="input-field"
            value={filters.sort}
            onChange={e => update({ sort: e.target.value })}
            style={{ paddingRight: '2rem', minWidth: 140 }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score_desc">Highest Score</option>
            <option value="score_asc">Lowest Score</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>

        {/* More filters toggle */}
        <button className={`btn btn-sm ${expanded ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setExpanded(p => !p)} style={{ flexShrink: 0 }}>
          <SlidersHorizontal size={14} />
          Filters
          {hasActive && <span className="pill pill-primary" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>Active</span>}
        </button>

        {hasActive && (
          <button className="btn btn-icon btn-ghost btn-sm" onClick={reset} title="Clear filters">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Expanded row */}
      {expanded && (
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Min score */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Score</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{filters.minScore}</span>
            </label>
            <input
              type="range" min="0" max="100" step="5"
              value={filters.minScore}
              onChange={e => update({ minScore: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>

          {/* Required skill */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Must Have Skill
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. React, Python..."
              value={filters.skill}
              onChange={e => update({ skill: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Apply filters to a list of resume records.
 */
export function applyFilters(resumes, filters) {
  let list = [...resumes];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(r =>
      (r.candidate_name || '').toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.file_name || '').toLowerCase().includes(q)
    );
  }

  if (filters.status !== 'all') {
    list = list.filter(r => r.status === filters.status);
  }

  if (filters.minScore > 0) {
    list = list.filter(r => (r.overall_score ?? 0) >= filters.minScore);
  }

  if (filters.skill) {
    const sk = filters.skill.toLowerCase();
    list = list.filter(r =>
      (r.skills ?? []).some(s => s.toLowerCase().includes(sk))
    );
  }

  // Sort
  list.sort((a, b) => {
    if (filters.sort === 'score_desc') return (b.overall_score ?? 0) - (a.overall_score ?? 0);
    if (filters.sort === 'score_asc')  return (a.overall_score ?? 0) - (b.overall_score ?? 0);
    if (filters.sort === 'oldest')     return new Date(a.created_at) - new Date(b.created_at);
    return new Date(b.created_at) - new Date(a.created_at); // newest
  });

  return list;
}
