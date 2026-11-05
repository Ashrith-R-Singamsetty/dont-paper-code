import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Cpu,
  Flame,
  Layers,
  Moon,
  Palette,
  Play,
  Search,
  Sparkles,
  Sun,
  Type,
} from 'lucide-react';

interface DesignSystemViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (path: string) => void;
}

const COLOR_TOKENS = [
  { name: '--paper', label: 'Paper (Canvas Background)', cssVar: 'rgb(var(--paper))', role: 'Primary page & stage canvas background' },
  { name: '--surface', label: 'Surface (Elevated Card)', cssVar: 'rgb(var(--surface))', role: 'Cards, sidebars, code & state panels' },
  { name: '--ink', label: 'Ink (Primary Foreground)', cssVar: 'rgb(var(--ink))', role: 'Headings, primary text, active pill fill' },
  { name: '--sketch', label: 'Sketch (Secondary Ink)', cssVar: 'rgb(var(--sketch))', role: 'Diagram connectors, body copy, fields' },
  { name: '--mute', label: 'Mute (Metadata & Captions)', cssVar: 'rgb(var(--mute))', role: 'Breadcrumbs, line numbers, inactive labels' },
  { name: '--accent', label: 'Accent (Chai Amber / Orange)', cssVar: 'rgb(var(--accent))', role: 'Active pointer L, active UML box border, highlights' },
  { name: '--accent2', label: 'Accent 2 (Blueprint Blue)', cssVar: 'rgb(var(--accent2))', role: 'Secondary pointer R, System Design badges' },
];

const STATE_TOKENS = [
  { name: 'Idle State', bg: 'rgb(var(--idle-bg))', border: 'rgb(var(--ink) / 0.25)', text: 'rgb(var(--ink))', usage: 'Unvisited array cell / idle node' },
  { name: 'Active / Inspecting', bg: 'rgb(var(--active-bg))', border: 'rgb(var(--accent))', text: 'rgb(var(--accent))', usage: 'Current pointer target / active UML class' },
  { name: 'Done / Verified', bg: 'rgb(var(--done-bg))', border: 'rgb(var(--done-stroke))', text: 'rgb(var(--done-stroke))', usage: 'Sorted / finalized element / matched pair' },
  { name: 'Dead / Pruned', bg: 'rgb(var(--dead-bg))', border: 'rgb(var(--dead-stroke))', text: 'rgb(var(--dead-stroke))', usage: 'Rejected branch / 429 rate-limit drop / cycle' },
  { name: 'Gold / Best Answer', bg: 'rgb(var(--gold-bg))', border: 'rgb(var(--gold-stroke))', text: 'rgb(var(--gold-stroke))', usage: 'Best window / midpoint / target hit' },
  { name: 'Read / Lookup', bg: 'rgb(var(--read-bg))', border: 'rgb(var(--accent2))', text: 'rgb(var(--accent2))', usage: 'Auxiliary read / secondary pointer probe' },
];

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({
  theme,
  onToggleTheme,
  onNavigate,
}) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'rgb(var(--paper))' }}>
      {/* Sticky Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          borderBottom: '1px solid rgb(var(--ink) / 0.1)',
          background: 'rgb(var(--paper) / 0.9)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '0.7rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="ui-chip"
              style={{ padding: '0.3rem 0.65rem', cursor: 'pointer' }}
            >
              <ArrowLeft size={13} /> Home
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Palette size={16} style={{ color: 'rgb(var(--accent))' }} />
              <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 800, fontSize: '1.05rem' }}>
                Don&apos;t Paper Code · Design System
              </span>
              <span className="ui-chip">/design-system</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('/dsa')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.7rem' }}
            >
              <Code2 size={13} style={{ color: 'rgb(var(--accent))' }} /> /dsa
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/system-design')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.7rem' }}
            >
              <Cpu size={13} style={{ color: 'rgb(var(--accent2))' }} /> /system-design
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/aptitude')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.7rem' }}
            >
              <Sparkles size={13} style={{ color: 'rgb(var(--accent))' }} /> /aptitude
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="sketch-border-soft"
              style={{
                padding: '0.32rem 0.7rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgb(var(--surface))',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
              <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1180px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.25rem',
        }}
      >
        {/* Hero Intro */}
        <section>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.6rem' }}>
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--accent) / 0.5)',
                background: 'rgb(var(--accent) / 0.12)',
                color: 'rgb(var(--accent))',
                fontWeight: 700,
              }}
            >
              <Sparkles size={11} /> LIVING STYLE GUIDE &amp; TOKEN REGISTRY
            </span>
            <span className="ui-chip">Active Theme: {theme.toUpperCase()}</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 'clamp(1.85rem, 3vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Warm Ink-on-Paper Visual Design System
          </h1>
          <p style={{ fontSize: '0.96rem', color: 'rgb(var(--mute))', maxWidth: '760px', marginTop: '0.35rem', lineHeight: 1.6 }}>
            Single source of truth for the color tokens, typography scale, sketch borders, algorithm cell states,
            UML diagram primitives, and interactive stage controls powering <code>/dsa</code> and{' '}
            <code>/system-design</code>.
          </p>
        </section>

        {/* 1. Core Semantic Color Tokens */}
        <section className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={17} style={{ color: 'rgb(var(--accent))' }} />
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800 }}>
                1 · Core Semantic Color Tokens
              </h2>
            </div>
            <span className="ui-chip">src/styles/theme.css</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {COLOR_TOKENS.map((tok) => (
              <div
                key={tok.name}
                className="sketch-border-soft"
                style={{
                  background: 'rgb(var(--paper))',
                  padding: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: tok.cssVar,
                      border: '1.5px solid rgb(var(--ink) / 0.22)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                      {tok.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'rgb(var(--mute))' }}>{tok.label}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgb(var(--sketch))', lineHeight: 1.45 }}>
                  {tok.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Algorithmic & Diagram State Palette */}
        <section className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={17} style={{ color: 'rgb(var(--accent))' }} />
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800 }}>
                2 · Algorithmic Cell &amp; UML Node States
              </h2>
            </div>
            <span className="ui-chip">DSA + System Design Shared States</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {STATE_TOKENS.map((st) => (
              <div
                key={st.name}
                style={{
                  padding: '0.85rem',
                  borderRadius: '9px',
                  background: st.bg,
                  border: `2px solid ${st.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: st.text,
                  }}
                >
                  {st.name}
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgb(var(--sketch))' }}>{st.usage}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Typography Scale */}
        <section className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={17} style={{ color: 'rgb(var(--accent))' }} />
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800 }}>
                3 · Typography System
              </h2>
            </div>
            <span className="ui-chip">Onest · Manrope · JetBrains Mono</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="sketch-border-soft" style={{ padding: '0.9rem', background: 'rgb(var(--paper))' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--accent))', marginBottom: '4px' }}>
                --font-hand · Display &amp; Stage Headings (Onest / Inter 800)
              </div>
              <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.65rem', fontWeight: 800 }}>
                How to read these diagrams · Trapping Rain Water
              </div>
            </div>

            <div className="sketch-border-soft" style={{ padding: '0.9rem', background: 'rgb(var(--paper))' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--accent))', marginBottom: '4px' }}>
                --font-sketch · Narrative &amp; Problem Statements (Manrope 400–600)
              </div>
              <div style={{ fontFamily: 'var(--font-sketch)', fontSize: '14px', lineHeight: 1.6 }}>
                A class is a box in three parts: the name on top, its private data (−) in the middle, and its public
                operations (+) at the bottom.
              </div>
            </div>

            <div className="sketch-border-soft" style={{ padding: '0.9rem', background: 'rgb(var(--paper))' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--accent))', marginBottom: '4px' }}>
                --font-mono · Pseudocode, Pointers, UML Compartments &amp; State Inspector (JetBrains Mono)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                class Account implements Statement &#123; - balance: int; + withdraw(amt): boolean &#125;
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive UI Primitives & Visual Components */}
        <section className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={17} style={{ color: 'rgb(var(--accent))' }} />
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800 }}>
                4 · Interactive Stage Components &amp; Primitives
              </h2>
            </div>
            <span className="ui-chip">Reusable Primitives</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Buttons & Chips */}
            <div className="sketch-border-soft" style={{ padding: '1rem', background: 'rgb(var(--paper))' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--mute))', marginBottom: '0.75rem' }}>
                BUTTONS, BADGES &amp; CHIPS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                <button type="button" className="cc-btn-solid" onClick={() => onNavigate('/dsa')}>
                  <Play size={14} /> Primary Action (.cc-btn-solid)
                </button>
                <button type="button" className="cc-btn-outline" onClick={() => onNavigate('/system-design')}>
                  Secondary (.cc-btn-outline)
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                <span className="ui-chip">Default .ui-chip</span>
                <span
                  className="ui-chip"
                  style={{
                    borderColor: 'rgb(var(--accent) / 0.5)',
                    background: 'rgb(var(--accent) / 0.12)',
                    color: 'rgb(var(--accent))',
                    fontWeight: 700,
                  }}
                >
                  STEP 1/13
                </span>
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
                <span className="ui-chip">
                  <Search size={11} /> ⌘K
                </span>
                <span className="ui-chip" style={{ background: 'rgb(var(--gold-bg))', fontWeight: 700 }}>
                  <Flame size={12} style={{ color: 'rgb(var(--accent))' }} /> Streak
                </span>
              </div>
            </div>

            {/* Code Line Highlight + State Card Preview */}
            <div className="sketch-border-soft" style={{ padding: '1rem', background: 'rgb(var(--paper))' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--mute))', marginBottom: '0.6rem' }}>
                SYNCHRONIZED CODE LINE &amp; STATE INSPECTOR
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="code-line">
                  <span style={{ width: '18px', textAlign: 'right', color: 'rgb(var(--mute))', fontSize: '11px' }}>1</span>
                  <span>interface Statement &#123; print() &#125;</span>
                </div>
                <div className="code-line code-line-active">
                  <span style={{ width: '18px', textAlign: 'right', color: 'rgb(var(--mute))', fontSize: '11px' }}>2</span>
                  <span>class Account implements Statement &#123;</span>
                </div>
                <div className="code-line">
                  <span style={{ width: '18px', textAlign: 'right', color: 'rgb(var(--mute))', fontSize: '11px' }}>3</span>
                  <span>    - balance: int</span>
                </div>
              </div>

              <div
                className="sketch-border-soft"
                style={{
                  background: 'rgb(var(--surface))',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: 'rgb(var(--mute))' }}>+ / - / #</span>
                <span style={{ fontWeight: 700 }}>public / private / protected</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
