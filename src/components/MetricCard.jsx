import React from 'react';

export default function MetricCard({ title, value, icon, description, accentColor = 'var(--accent-primary)' }) {
  return (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="text-secondary" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{title}</h3>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-lg)', 
          background: `rgba(255, 255, 255, 0.03)`,
          border: '1px solid var(--glass-border)',
          color: accentColor
        }}>
          {icon}
        </div>
      </div>
      
      <div style={{ 
        fontSize: '3rem', 
        fontWeight: 700, 
        color: 'var(--text-primary)',
        lineHeight: 1,
        textShadow: `0 0 20px ${accentColor}40`
      }}>
        {value}
      </div>
      
      <div style={{ 
        height: '4px', 
        background: 'var(--glass-border)', 
        borderRadius: '2px', 
        overflow: 'hidden',
        marginTop: '0.5rem'
      }}>
        <div style={{ 
          height: '100%', 
          width: value.includes('%') ? value : '100%', 
          background: accentColor,
          borderRadius: '2px',
          boxShadow: `0 0 10px ${accentColor}`
        }} />
      </div>
      
      <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  );
}
