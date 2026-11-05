import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS } from '../../data/systemDesignLessons';
import { TrackKind } from '../../types/curriculum';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (track: TrackKind, id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const dsaMatches = DSA_PROBLEMS.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.companies.some((c) => c.toLowerCase().includes(q))
  );

  const sdMatches = SYSTEM_DESIGN_LESSONS.filter(
    (l) =>
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.subtitle.toLowerCase().includes(q) ||
      l.kind.toLowerCase().includes(q) ||
      l.companies.some((c) => c.toLowerCase().includes(q))
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh 1rem 1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sketch-border"
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'rgb(var(--paper))',
          overflow: 'hidden',
        }}
      >
        {/* Search Input Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.12)',
          }}
        >
          <Search size={17} style={{ color: 'rgb(var(--accent))' }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search DSA problems, LLD patterns, or HLD case studies..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
            }}
          />
          <button type="button" onClick={onClose} className="ui-chip">
            <X size={12} /> ESC
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.6rem' }}>
          {dsaMatches.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgb(var(--mute))',
                  padding: '0.25rem 0.5rem',
                }}
              >
                DSA Visual Problems ({dsaMatches.length})
              </div>
              {dsaMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect('dsa', item.id);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.65rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.title}</div>
                    <div style={{ fontSize: '11.5px', color: 'rgb(var(--mute))' }}>{item.subtitle}</div>
                  </div>
                  <span className="ui-chip">{item.difficulty}</span>
                </button>
              ))}
            </div>
          )}

          {sdMatches.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgb(var(--mute))',
                  padding: '0.25rem 0.5rem',
                }}
              >
                System Design — LLD &amp; HLD ({sdMatches.length})
              </div>
              {sdMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect('system-design', item.id);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.65rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.title}</div>
                    <div style={{ fontSize: '11.5px', color: 'rgb(var(--mute))' }}>{item.subtitle}</div>
                  </div>
                  <span className="ui-chip" style={{ textTransform: 'uppercase' }}>
                    {item.kind}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
