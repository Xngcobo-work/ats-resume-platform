import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue]       = useState([]); // [{file, status, progress}]

  const ACCEPTED = ['application/pdf', 'application/msword', 'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => ACCEPTED.includes(f.type) || f.name.match(/\.(pdf|doc|docx|txt)$/i));
    if (!valid.length) return;

    const entries = valid.map(file => ({ id: Date.now() + Math.random(), file, status: 'queued', progress: '' }));
    setQueue(prev => [...prev, ...entries]);

    // Process each file
    entries.forEach(entry => {
      const update = (patch) => setQueue(prev => prev.map(q => q.id === entry.id ? { ...q, ...patch } : q));
      update({ status: 'uploading' });
      onUpload(entry.file, (step) => update({ progress: step }))
        .then(() => update({ status: 'done', progress: 'Complete!' }))
        .catch((err) => update({ status: 'error', progress: err.message || 'Error' }));
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [onUpload]);

  const handleFileInput = (e) => addFiles(e.target.files);

  const statusIcon = (status) => {
    if (status === 'done')     return <CheckCircle2 size={16} color="var(--accent-success)" />;
    if (status === 'error')    return <AlertCircle  size={16} color="var(--accent-danger)"  />;
    if (status === 'uploading') return <Loader2 size={16} color="var(--accent-primary)" style={{ animation: 'spin 0.8s linear infinite' }} />;
    return <FileText size={16} color="var(--text-muted)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <label
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: dragging ? 'pulse-ring 1s infinite' : 'none',
            transition: 'all 0.3s ease',
          }}>
            <Upload size={28} color={dragging ? '#818cf8' : 'var(--text-muted)'} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem' }}>
              {dragging ? 'Drop to analyze' : 'Drop resumes here'}
            </p>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              PDF, DOC, DOCX supported · Multiple files allowed
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={e => { e.preventDefault(); e.currentTarget.parentElement.parentElement.querySelector('input').click(); }}
          >
            Browse Files
          </button>
        </div>
      </label>

      {queue.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {queue.map(entry => (
            <div key={entry.id} className="glass-card" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {statusIcon(entry.status)}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.file.name}
                </p>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.1rem' }}>
                  {entry.progress || (entry.status === 'queued' ? 'Waiting...' : '')}
                </p>
              </div>
              {entry.status !== 'uploading' && (
                <button
                  className="btn btn-icon btn-ghost btn-sm"
                  onClick={() => setQueue(prev => prev.filter(q => q.id !== entry.id))}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
