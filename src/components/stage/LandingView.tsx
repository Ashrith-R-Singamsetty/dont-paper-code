import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Code2, Cpu, Flame, Layers, Play, Search, Sun, Moon } from 'lucide-react';
import { DSA_PATTERNS, DSA_PROBLEMS } from '../../data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS, SYSTEM_DESIGN_MODULES } from '../../data/systemDesignLessons';
import { TrackKind } from '../../types/curriculum';

interface LandingViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onLaunchWorkspace: (track: TrackKind, itemId: string) => void;
  solvedIds: Set<string>;
}

const HERO_STEPS = [
  { L: 0, R: 5, sum: 10, note: 'nums[0] + nums[5] = 1 + 9 = 10 > 9 → move R left', matched: false },
  { L: 0, R: 4, sum: 9, note: 'nums[0] + nums[4] = 1 + 8 = 9 == target! Found in O(n)', matched: true },
];

export const LandingView: React.FC<LandingViewProps> = ({
  theme,
  onToggleTheme,
  onOpenSearch,
  onLaunchWorkspace,
  solvedIds,
}) => {
  const [heroStepIdx, setHeroStepIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroStepIdx((i) => (i + 1) % HERO_STEPS.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  const heroStep = HERO_STEPS[heroStepIdx];
  const heroArr = [1, 2, 4, 6, 8, 9];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          borderBottom: '1px solid rgb(var(--ink) / 0.1)',
          background: 'rgb(var(--paper) / 0.88)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgb(var(--accent))',
                color: 'rgb(var(--paper))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              !P
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-hand)', fontWeight: 800, fontSize: '1.05rem' }}>
                Don&apos;t Paper Code
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--mute))' }}>
                Visual DSA · Low-Level Design · Distributed HLD
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={onOpenSearch}
              className="sketch-border-soft"
              style={{
                padding: '0.4rem 0.75rem',
                background: 'rgb(var(--surface))',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '12.5px',
                color: 'rgb(var(--mute))',
              }}
            >
              <Search size={14} />
              <span>Search problems &amp; designs...</span>
              <span className="ui-chip">⌘K</span>
            </button>

            <span
              className="ui-chip"
              style={{
                padding: '0.35rem 0.65rem',
                borderColor: 'rgb(var(--gold-stroke) / 0.55)',
                background: 'rgb(var(--gold-bg))',
                fontWeight: 700,
              }}
            >
              <Flame size={13} style={{ color: 'rgb(var(--accent))' }} />
              {solvedIds.size} Solved
            </span>

            <button
              type="button"
              onClick={onToggleTheme}
              className="sketch-border-soft"
              title="Toggle light/dark theme"
              style={{
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgb(var(--surface))',
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1220px', width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {/* Hero Split Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.2rem',
            alignItems: 'center',
            marginBottom: '3.5rem',
          }}
        >
          {/* Left Pitch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className="ui-chip"
                style={{
                  borderColor: 'rgb(var(--accent) / 0.5)',
                  background: 'rgb(var(--accent) / 0.1)',
                  color: 'rgb(var(--accent))',
                  fontWeight: 700,
                }}
              >
                INTERACTIVE VISUAL LEARNING STUDIO
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(2.1rem, 4.2vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
              }}
            >
              Stop memorizing static solutions.{' '}
              <span style={{ color: 'rgb(var(--accent))' }}>Don&apos;t Paper Code.</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgb(var(--sketch))', lineHeight: 1.65 }}>
              Step through every pointer shift, recursive frame, UML class connector, and distributed Redis Lua lock
              before writing a single line of syntax. Built with a unified interactive stage for both{' '}
              <strong>DSA Patterns</strong> and <strong>System Design (LLD + HLD)</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('dsa', DSA_PROBLEMS[0].id)}
                className="cc-btn-solid"
              >
                <Play size={15} /> Launch DSA Stage
              </button>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('system-design', SYSTEM_DESIGN_LESSONS[0].id)}
                className="cc-btn-outline"
              >
                <Layers size={15} /> Explore System Design (LLD &amp; HLD)
              </button>
            </div>
          </div>

          {/* Right Live Interactive Preview Card */}
          <div className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.35rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--mute))' }}>
                LIVE STAGE PREVIEW · TWO SUM II (target = 9)
              </span>
              <span
                className="ui-chip"
                style={{
                  borderColor: heroStep.matched ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent))',
                  color: heroStep.matched ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent))',
                  fontWeight: 700,
                }}
              >
                {heroStep.matched ? '✓ Match [0, 4]' : `sum = ${heroStep.sum}`}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '1rem 0 1.6rem',
              }}
            >
              {heroArr.map((val, idx) => {
                const isL = idx === heroStep.L;
                const isR = idx === heroStep.R;
                const isActive = isL || isR;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      opacity: idx > heroStep.R ? 0.35 : 1,
                      transition: 'all 280ms ease',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '9px',
                        border: `2px solid ${
                          heroStep.matched && isActive
                            ? 'rgb(var(--done-stroke))'
                            : isActive
                              ? 'rgb(var(--accent))'
                              : 'rgb(var(--ink) / 0.25)'
                        }`,
                        background:
                          heroStep.matched && isActive
                            ? 'rgb(var(--done-bg))'
                            : isActive
                              ? 'rgb(var(--active-bg))'
                              : 'rgb(var(--idle-bg))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      {val}
                    </div>
                    {(isL || isR) && (
                      <span
                        style={{
                          marginTop: '5px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isL ? 'rgb(var(--accent))' : 'rgb(var(--accent2))',
                        }}
                      >
                        ↑{isL ? 'L' : 'R'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="sketch-border-soft"
              style={{
                padding: '0.65rem 0.85rem',
                background: 'rgb(var(--paper))',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
            >
              {heroStep.note}
            </div>
          </div>
        </section>

        {/* Two Core Tracks Section */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Track 1: DSA Visual Curriculum */}
          <div className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Code2 size={20} style={{ color: 'rgb(var(--accent))' }} />
                <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', fontWeight: 800 }}>
                  Track 1 · DSA Patterns
                </h2>
              </div>
              <span className="ui-chip">{DSA_PROBLEMS.length} Interactive Stages</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DSA_PATTERNS.map((pat) => {
                const problems = DSA_PROBLEMS.filter((p) => p.patternId === pat.id);
                return (
                  <div key={pat.id} className="sketch-border-soft" style={{ padding: '0.9rem', background: 'rgb(var(--paper))' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--accent))', fontWeight: 700 }}>
                      PATTERN {pat.number} · {pat.title.toUpperCase()}
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', margin: '0.2rem 0 0.65rem' }}>
                      {pat.tagline}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {problems.map((prob) => (
                        <button
                          key={prob.id}
                          type="button"
                          onClick={() => onLaunchWorkspace('dsa', prob.id)}
                          className="sketch-border-soft"
                          style={{
                            padding: '0.5rem 0.7rem',
                            background: 'rgb(var(--surface))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {solvedIds.has(prob.id) && (
                              <CheckCircle2 size={14} style={{ color: 'rgb(var(--done-stroke))' }} />
                            )}
                            {prob.title}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '11.5px', color: 'rgb(var(--accent))' }}>
                            {prob.render} <ArrowRight size={13} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 2: System Design (LLD + HLD) */}
          <div className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={20} style={{ color: 'rgb(var(--accent2))' }} />
                <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', fontWeight: 800 }}>
                  Track 2 · System Design (LLD &amp; HLD)
                </h2>
              </div>
              <span className="ui-chip">{SYSTEM_DESIGN_LESSONS.length} Visual Blueprints</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {SYSTEM_DESIGN_MODULES.map((mod) => {
                const lessons = SYSTEM_DESIGN_LESSONS.filter((l) => l.moduleId === mod.id);
                return (
                  <div key={mod.id} className="sketch-border-soft" style={{ padding: '0.9rem', background: 'rgb(var(--paper))' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--accent2))', fontWeight: 700 }}>
                      MODULE {mod.number} · {mod.title.toUpperCase()}
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', margin: '0.2rem 0 0.65rem' }}>
                      {mod.tagline}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {lessons.map((les) => (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => onLaunchWorkspace('system-design', les.id)}
                          className="sketch-border-soft"
                          style={{
                            padding: '0.5rem 0.7rem',
                            background: 'rgb(var(--surface))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {solvedIds.has(les.id) && (
                              <CheckCircle2 size={14} style={{ color: 'rgb(var(--done-stroke))' }} />
                            )}
                            {les.title}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '11.5px', color: 'rgb(var(--accent2))', textTransform: 'uppercase' }}>
                            {les.kind} <ArrowRight size={13} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
