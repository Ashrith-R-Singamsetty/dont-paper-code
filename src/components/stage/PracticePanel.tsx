import React, { useState } from 'react';
import { CheckCircle2, Code2, Eye, EyeOff, Maximize2, Sparkles, X } from 'lucide-react';
import { PracticeRubric } from '../../types/curriculum';

interface PracticePanelProps {
  itemId: string;
  approachLabel: string;
  complexityBadge?: string;
  codeLines: string[];
  activeLine: number;
  rubric: PracticeRubric;
  hideSolutionsGlobal: boolean;
  isSolved: boolean;
  onMarkSolved: (itemId: string) => void;
  highlightedVar?: string | null;
}

interface EvaluationResult {
  verdict: 'correct' | 'close';
  passedConcepts: string[];
  missingHints: string[];
  antiPatternWarning?: string;
}

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
};

export const PracticePanel: React.FC<PracticePanelProps> = ({
  itemId,
  approachLabel,
  complexityBadge,
  codeLines,
  activeLine,
  rubric,
  hideSolutionsGlobal,
  isSolved,
  onMarkSolved,
  highlightedVar,
}) => {
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [revealedLocally, setRevealedLocally] = useState(false);
  const [draft, setDraft] = useState<string>(() => {
    return localStorage.getItem(`dpc:draft:${itemId}`) ?? rubric.starterHint;
  });
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  // Sync draft when switching problems
  React.useEffect(() => {
    const saved = localStorage.getItem(`dpc:draft:${itemId}`);
    setDraft(saved ?? rubric.starterHint);
    setEvalResult(null);
    setRevealedLocally(false);
  }, [itemId, rubric.starterHint]);

  const updateDraft = (val: string) => {
    const clamped = val.slice(0, 1400);
    setDraft(clamped);
    localStorage.setItem(`dpc:draft:${itemId}`, clamped);
  };

  // Smart Editor Keybindings (from REA trace of module 99429)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end, value: v } = el;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        if (v.slice(lineStart, lineStart + 4) === '    ') {
          const next = v.slice(0, lineStart) + v.slice(lineStart + 4);
          updateDraft(next);
          requestAnimationFrame(() => el.setSelectionRange(Math.max(lineStart, s - 4), Math.max(lineStart, end - 4)));
        }
      } else {
        const next = v.slice(0, s) + '    ' + v.slice(end);
        updateDraft(next);
        requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4));
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const currentLine = v.slice(lineStart, s);
      const leadingSpaces = (currentLine.match(/^[ \t]*/) ?? [''])[0];
      const trimmed = currentLine.trimEnd();
      const extraIndent = /[:{(\[]$/.test(trimmed) ? '    ' : '';
      const insert = '\n' + leadingSpaces + extraIndent;
      const next = v.slice(0, s) + insert + v.slice(end);
      updateDraft(next);
      requestAnimationFrame(() => {
        const pos = s + insert.length;
        el.setSelectionRange(pos, pos);
      });
      return;
    }

    if (PAIRS[e.key] && s === end) {
      e.preventDefault();
      const close = PAIRS[e.key];
      const next = v.slice(0, s) + e.key + close + v.slice(end);
      updateDraft(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 1, s + 1));
    }
  };

  const handleEvaluate = () => {
    const normalized = draft.toLowerCase();
    const passedConcepts: string[] = [];
    const missingHints: string[] = [];

    for (const group of rubric.requiredGroups) {
      const matched = group.keywords.some((kw) => normalized.includes(kw.toLowerCase()));
      if (matched) {
        passedConcepts.push(group.concept);
      } else {
        missingHints.push(group.missingHint);
      }
    }

    let antiPatternWarning: string | undefined;
    if (rubric.forbiddenPatterns) {
      for (const fp of rubric.forbiddenPatterns) {
        if (fp.pattern.test(draft)) {
          antiPatternWarning = fp.reason;
          break;
        }
      }
    }

    const isAllPassed = missingHints.length === 0 && !antiPatternWarning;
    const result: EvaluationResult = {
      verdict: isAllPassed ? 'correct' : 'close',
      passedConcepts,
      missingHints,
      antiPatternWarning,
    };
    setEvalResult(result);

    if (isAllPassed) {
      onMarkSolved(itemId);
    }
  };

  const shouldMaskCode = hideSolutionsGlobal && !revealedLocally && !isSolved;

  return (
    <div className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1rem' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          paddingBottom: '0.75rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid rgb(var(--ink) / 0.1)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 size={16} style={{ color: 'rgb(var(--accent))' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'rgb(var(--mute))',
              fontWeight: 700,
            }}
          >
            {practiceOpen ? "Don't Paper Code · Practice" : approachLabel}
          </span>
          {complexityBadge && !practiceOpen && (
            <span className="ui-chip" style={{ color: 'rgb(var(--accent))', fontWeight: 700 }}>
              {complexityBadge}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {isSolved && (
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--done-stroke) / 0.5)',
                background: 'rgb(var(--done-bg))',
                color: 'rgb(var(--done-stroke))',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={12} /> Solved
            </span>
          )}
          <button
            type="button"
            onClick={() => setPracticeOpen((v) => !v)}
            className="ui-chip"
            style={{
              padding: '0.28rem 0.65rem',
              borderColor: practiceOpen ? 'rgb(var(--ink))' : 'rgb(var(--accent) / 0.55)',
              background: practiceOpen ? 'rgb(var(--ink))' : 'rgb(var(--accent) / 0.12)',
              color: practiceOpen ? 'rgb(var(--paper))' : 'rgb(var(--accent))',
              fontWeight: 700,
            }}
          >
            <Sparkles size={12} />
            {practiceOpen ? 'View Trace Code' : 'Practice Pseudocode'}
          </button>
        </div>
      </div>

      {/* Mode A: Interactive Practice Editor ("Don't Paper Code") */}
      {practiceOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '12.5px', color: 'rgb(var(--sketch))', lineHeight: 1.55 }}>{rubric.prompt}</p>

          <div style={{ position: 'relative' }}>
            <textarea
              value={draft}
              onChange={(e) => updateDraft(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              rows={8}
              spellCheck={false}
              placeholder="Write your pseudocode or interface contract here..."
              className="sketch-border-soft"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgb(var(--paper))',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: 1.65,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'rgb(var(--mute))',
              }}
            >
              Tab · Auto-Indent · {draft.length}/1400
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => updateDraft(rubric.starterHint)}
                className="ui-chip"
                style={{ padding: '0.3rem 0.65rem' }}
              >
                Reset Starter
              </button>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="ui-chip"
                style={{ padding: '0.3rem 0.65rem' }}
              >
                <Maximize2 size={11} /> Compare ⤢
              </button>
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              className="cc-btn-solid"
              style={{ padding: '0.45rem 1rem', fontSize: '12.5px' }}
            >
              Check Logic
            </button>
          </div>

          {/* Rubric Feedback Card */}
          {evalResult && (
            <div
              className="sketch-border-soft"
              style={{
                padding: '0.8rem',
                borderColor:
                  evalResult.verdict === 'correct'
                    ? 'rgb(var(--done-stroke) / 0.6)'
                    : 'rgb(var(--gold-stroke) / 0.6)',
                background:
                  evalResult.verdict === 'correct' ? 'rgb(var(--done-bg) / 0.55)' : 'rgb(var(--gold-bg) / 0.5)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                  {evalResult.verdict === 'correct'
                    ? '✓ Logic Verified — Ready for Production Code!'
                    : 'Almost there — refine your core invariants:'}
                </span>
                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    textDecoration: 'underline',
                    color: 'rgb(var(--accent))',
                  }}
                >
                  Side-by-side diff ⤢
                </button>
              </div>

              {evalResult.antiPatternWarning && (
                <div style={{ fontSize: '12px', color: 'rgb(var(--dead-stroke))', marginBottom: '0.35rem' }}>
                  ⚠ {evalResult.antiPatternWarning}
                </div>
              )}

              {evalResult.passedConcepts.map((c, i) => (
                <div key={i} style={{ fontSize: '12px', color: 'rgb(var(--done-stroke))' }}>
                  ✓ {c}
                </div>
              ))}
              {evalResult.missingHints.map((h, i) => (
                <div key={i} style={{ fontSize: '12px', color: 'rgb(var(--sketch))', marginTop: '2px' }}>
                  • Hint: {h}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Mode B: Synchronized Line-Highlighted Pseudocode Viewer */
        <div style={{ position: 'relative' }}>
          <div
            style={{
              filter: shouldMaskCode ? 'blur(6px)' : 'none',
              userSelect: shouldMaskCode ? 'none' : 'auto',
              transition: 'filter 200ms ease',
            }}
          >
            {codeLines.map((line, idx) => {
              const isActive =
                activeLine !== undefined && (idx + 1 === activeLine || (activeLine === 0 && idx === 0));
              const lineMentionsVar = Boolean(
                highlightedVar &&
                  highlightedVar.trim().length > 0 &&
                  new RegExp(`\\b${highlightedVar}\\b|\\[${highlightedVar}\\]`, 'i').test(line)
              );

              return (
                <div
                  key={idx}
                  className={`code-line ${isActive ? 'code-line-active' : ''}`}
                  style={{
                    background: lineMentionsVar
                      ? 'rgb(var(--accent) / 0.18)'
                      : isActive
                        ? 'rgb(var(--accent) / 0.14)'
                        : 'transparent',
                    borderLeftColor: lineMentionsVar
                      ? 'rgb(var(--accent))'
                      : isActive
                        ? 'rgb(var(--accent))'
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '18px',
                        textAlign: 'right',
                        color: 'rgb(var(--mute) / 0.65)',
                        fontSize: '11px',
                        userSelect: 'none',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: lineMentionsVar ? 'rgb(var(--ink))' : 'inherit',
                        fontWeight: lineMentionsVar ? 600 : 400,
                      }}
                    >
                      {line || ' '}
                    </span>
                  </div>

                  {lineMentionsVar && (
                    <span
                      className="ui-chip"
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'rgb(var(--accent))',
                        borderColor: 'rgb(var(--accent) / 0.45)',
                        background: 'rgb(var(--accent) / 0.12)',
                        padding: '1px 5px',
                        marginLeft: '0.5rem',
                        flexShrink: 0,
                      }}
                    >
                      ← uses {highlightedVar}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hide Solutions Mask Overlay */}
          {shouldMaskCode && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                background: 'rgb(var(--paper) / 0.55)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <EyeOff size={20} style={{ color: 'rgb(var(--accent))' }} />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Solution Hidden ("Don't Paper Code" Mode)</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPracticeOpen(true)}
                  className="cc-btn-solid"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '12px' }}
                >
                  Write Pseudocode First
                </button>
                <button
                  type="button"
                  onClick={() => setRevealedLocally(true)}
                  className="cc-btn-outline"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '12px' }}
                >
                  <Eye size={13} /> Reveal Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {compareOpen && (
        <div
          onClick={() => setCompareOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,0.55)',
             backdropFilter: 'blur(3px)',
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
              maxWidth: '820px',
              background: 'rgb(var(--paper))',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                SIDE-BY-SIDE PSEUDOCODE COMPARISON
              </span>
              <button type="button" onClick={() => setCompareOpen(false)} className="ui-chip">
                <X size={14} /> ESC
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgb(var(--mute))',
                    marginBottom: '6px',
                  }}
                >
                  YOUR PSEUDOCODE
                </div>
                <pre
                  className="sketch-border-soft"
                  style={{
                    padding: '0.8rem',
                    background: 'rgb(var(--surface))',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {draft || '(empty)'}
                </pre>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgb(var(--accent))',
                    marginBottom: '6px',
                  }}
                >
                  REFERENCE ({approachLabel})
                </div>
                <pre
                  className="sketch-border-soft"
                  style={{
                    padding: '0.8rem',
                    background: 'rgb(var(--surface))',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {codeLines.join('\n')}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
