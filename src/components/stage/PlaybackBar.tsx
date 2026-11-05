import React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

interface PlaybackBarProps {
  currentIndex: number;
  totalSteps: number;
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onScrub: (idx: number) => void;
  onChangeSpeed: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentIndex,
  totalSteps,
  playing,
  speed,
  onTogglePlay,
  onReset,
  onPrev,
  onNext,
  onScrub,
  onChangeSpeed,
}) => {
  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    onChangeSpeed(next);
  };

  return (
    <div
      className="sketch-border"
      style={{
        padding: '0.55rem 0.9rem',
        background: 'rgb(var(--surface))',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderRadius: '12px',
      }}
    >
      {/* Left Transport Controls (Circular ↻, <, White Circle ▶, >) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={onReset}
          title="Reset to step 1 (Home)"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '999px',
            border: '1px solid rgb(var(--ink) / 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
            color: 'rgb(var(--mute))',
          }}
        >
          <RotateCcw size={13} />
        </button>

        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          title="Previous Step (←)"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '999px',
            border: '1px solid rgb(var(--ink) / 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
            color: 'rgb(var(--ink))',
            opacity: currentIndex <= 0 ? 0.35 : 1,
          }}
        >
          <ChevronLeft size={15} />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          title="Play / Pause (Space)"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '999px',
            background: 'rgb(var(--ink))',
            color: 'rgb(var(--paper))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= totalSteps - 1}
          title="Next Step (→)"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '999px',
            border: '1px solid rgb(var(--ink) / 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
            color: 'rgb(var(--ink))',
            opacity: currentIndex >= totalSteps - 1 ? 0.35 : 1,
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Center Range Scrubber */}
      <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentIndex}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="scrubber"
          aria-label="Step scrubber"
        />
      </div>

      {/* Right Speed Pill (Click to cycle 0.5x → 1x → 1.5x → 2x) */}
      <button
        type="button"
        onClick={cycleSpeed}
        title="Click to cycle playback speed"
        className="sketch-border-soft"
        style={{
          padding: '0.25rem 0.65rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          fontWeight: 600,
          background: 'rgb(var(--paper))',
          color: 'rgb(var(--mute))',
        }}
      >
        {speed}x
      </button>
    </div>
  );
};
