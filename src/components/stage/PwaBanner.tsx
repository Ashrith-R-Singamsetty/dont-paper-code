import React from 'react';
import { Download, Laptop, WifiOff, X } from 'lucide-react';
import { usePwa } from '../../pwa';

export const PwaBanner: React.FC = () => {
  const { isOnline, canInstall, installApp } = usePwa();
  const [dismissedInstall, setDismissedInstall] = React.useState(false);

  if (isOnline && (!canInstall || dismissedInstall)) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '380px',
      }}
    >
      {/* Offline Alert */}
      {!isOnline && (
        <div
          className="sketch-border"
          style={{
            background: 'rgb(var(--surface))',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            borderColor: 'rgb(var(--accent))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgb(var(--accent) / 0.15)',
              color: 'rgb(var(--accent))',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <WifiOff size={15} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700 }}>Offline Mode Active</div>
            <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>
              All 184 DSA stages and playlists are cached for offline practice.
            </div>
          </div>
        </div>
      )}

      {/* Install PWA Prompt */}
      {canInstall && !dismissedInstall && isOnline && (
        <div
          className="sketch-border"
          style={{
            background: 'rgb(var(--surface))',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            borderColor: 'rgb(var(--ink) / 0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgb(var(--accent) / 0.12)',
                color: 'rgb(var(--accent))',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Laptop size={15} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>Install Desktop / iPad App</div>
              <div style={{ fontSize: '10.5px', color: 'rgb(var(--mute))' }}>
                Study DSA offline on flights & commutes
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={installApp}
              className="cc-btn-solid"
              style={{ padding: '0.35rem 0.65rem', fontSize: '11.5px' }}
            >
              <Download size={12} /> Install
            </button>
            <button
              type="button"
              onClick={() => setDismissedInstall(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgb(var(--mute))',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
