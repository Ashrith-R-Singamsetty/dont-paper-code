import React, { useState } from 'react';
import { Check, FlaskConical, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import {
  CustomGeneratorConfig,
  SUPPORTED_ALGORITHMS,
  detectAlgorithmForProblem,
  generateCustomSteps,
} from '../../utils/customStepGenerator';
import { DsaApproach } from '../../types/curriculum';

interface CustomInputModalProps {
  open: boolean;
  onClose: () => void;
  problemId: string;
  patternId?: string;
  onApplyCustomApproach: (approach: DsaApproach) => void;
  onResetDefault: () => void;
  isCustomActive: boolean;
}

export const CustomInputModal: React.FC<CustomInputModalProps> = ({
  open,
  onClose,
  problemId,
  patternId,
  onApplyCustomApproach,
  onResetDefault,
  isCustomActive,
}) => {
  const initialAlgoKey = detectAlgorithmForProblem(problemId, patternId);
  const [selectedAlgoKey, setSelectedAlgoKey] = useState<string>(initialAlgoKey);

  const config: CustomGeneratorConfig =
    SUPPORTED_ALGORITHMS[selectedAlgoKey] ?? SUPPORTED_ALGORITHMS['two-sum-ii'];

  const [inputVal, setInputVal] = useState<string>(config.defaultInput);
  const [targetVal, setTargetVal] = useState<string>(
    config.defaultTarget !== undefined ? String(config.defaultTarget) : ''
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleSelectAlgo = (key: string) => {
    setSelectedAlgoKey(key);
    const nextCfg = SUPPORTED_ALGORITHMS[key];
    setInputVal(nextCfg.defaultInput);
    setTargetVal(nextCfg.defaultTarget !== undefined ? String(nextCfg.defaultTarget) : '');
    setErrorMsg(null);
  };

  const handleApplyPreset = (preset: { input: string; target?: number | string }) => {
    setInputVal(preset.input);
    if (preset.target !== undefined) {
      setTargetVal(String(preset.target));
    }
    setErrorMsg(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputVal.trim()) {
        setErrorMsg('Please enter an input array or string.');
        return;
      }
      const approach = generateCustomSteps(
        selectedAlgoKey,
        inputVal,
        targetVal ? Number(targetVal) : undefined
      );
      onApplyCustomApproach(approach);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate steps.';
      setErrorMsg(msg);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sketch-border"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgb(var(--paper))',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgb(var(--accent) / 0.15)',
                color: 'rgb(var(--accent))',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <FlaskConical size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Custom Test Case Studio</div>
              <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>
                Test your own inputs with automatic step-by-step pointer execution
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-chip"
            style={{ width: '28px', height: '28px', padding: 0, display: 'grid', placeItems: 'center' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Algorithm Type Picker */}
        <div>
          <label
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgb(var(--mute))',
              display: 'block',
              marginBottom: '0.35rem',
            }}
          >
            EXECUTION ENGINE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {Object.entries(SUPPORTED_ALGORITHMS).map(([key, item]) => {
              const active = selectedAlgoKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectAlgo(key)}
                  style={{
                    padding: '0.3rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-mono)',
                    border: active ? '1px solid rgb(var(--accent))' : '1px solid rgb(var(--ink) / 0.12)',
                    background: active ? 'rgb(var(--accent) / 0.12)' : 'transparent',
                    color: active ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                    cursor: 'pointer',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {item.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Quick-Buttons */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              color: 'rgb(var(--mute))',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Sparkles size={11} style={{ color: 'rgb(var(--accent))' }} />
            <span>QUICK PRESETS</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {config.presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="ui-chip"
                style={{ fontSize: '11px', padding: '0.25rem 0.55rem' }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.3rem',
              }}
            >
              {config.inputType === 'string'
                ? 'Input String'
                : config.inputType === 'parentheses'
                  ? 'Bracket Sequence'
                  : 'Input Array (comma-separated numbers)'}
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={config.placeholder}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '7px',
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--ink) / 0.2)',
                color: 'rgb(var(--ink))',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {config.defaultTarget !== undefined && (
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.3rem',
                }}
              >
                {config.targetLabel ?? 'Target Value'}
              </label>
              <input
                type="number"
                value={targetVal}
                onChange={(e) => setTargetVal(e.target.value)}
                placeholder="e.g. 10"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '7px',
                  background: 'rgb(var(--surface))',
                  border: '1px solid rgb(var(--ink) / 0.2)',
                  color: 'rgb(var(--ink))',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: 'rgb(var(--dead-stroke) / 0.12)',
                border: '1px solid rgb(var(--dead-stroke) / 0.4)',
                color: 'rgb(var(--dead-stroke))',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}
          >
            {isCustomActive ? (
              <button
                type="button"
                onClick={() => {
                  onResetDefault();
                  onClose();
                }}
                className="cc-btn-outline"
                style={{ fontSize: '12px', padding: '0.45rem 0.75rem' }}
              >
                <RotateCcw size={13} /> Reset to Author Solutions
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="ui-chip"
                style={{ padding: '0.45rem 0.75rem', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cc-btn-solid"
                style={{ padding: '0.45rem 0.95rem', fontSize: '12.5px' }}
              >
                <Play size={13} /> Generate & Step Through
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
