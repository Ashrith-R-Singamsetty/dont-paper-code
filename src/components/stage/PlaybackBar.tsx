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
  return (
    <div
      className="sketch-border"
      style={{
        padding: '0.75rem 1rem',
        background: 'rgb(var(--surface))',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.85rem',
      }}
    >
      {/* Left Transport Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={onReset}
          title="Reset to step 1 (Home)"
          className="sketch-border-soft"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
          }}
        >
          <RotateCcw size={14} />
        </button>

        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          title="Previous Step (←)"
          className="sketch-border-soft"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
            opacity: currentIndex <= 0 ? 0.35 : 1,
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          title="Play / Pause (Space)"
          style={{
            height: '34px',
            padding: '0 0.9rem',
            borderRadius: '8px',
            background: 'rgb(var(--accent))',
            color: 'rgb(var(--paper))',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= totalSteps - 1}
          title="Next Step (→)"
          className="sketch-border-soft"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--paper))',
            opacity: currentIndex >= totalSteps - 1 ? 0.35 : 1,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Center Range Scrubber */}
      <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentIndex}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="scrubber"
          aria-label="Step scrubber"
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            color: 'rgb(var(--mute))',
            whiteSpace: 'nowrap',
          }}
        >
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Speed Selector + Shortcut Hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeSpeed(s)}
            className="ui-chip"
            style={{
              borderColor: speed === s ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.14)',
              background: speed === s ? 'rgb(var(--accent) / 0.14)' : 'rgb(var(--paper))',
              color: speed === s ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
              fontWeight: speed === s ? 700 : 500,
            }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
