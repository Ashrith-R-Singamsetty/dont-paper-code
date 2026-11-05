import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Cpu,
  Flame,
  Layers,
  Moon,
  Play,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { DSA_PATTERNS, DSA_PROBLEMS } from '../../data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS, SYSTEM_DESIGN_MODULES } from '../../data/systemDesignLessons';
import { TrackKind } from '../../types/curriculum';

interface LandingViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onLaunchWorkspace: (track: TrackKind, itemId: string) => void;
  onNavigate: (path: string) => void;
  solvedIds: Set<string>;
}

const HERO_STEPS = [
  { L: 0, R: 5, sum: 10, note: 'nums[0] + nums[5] = 1 + 9 = 10 > 9 → move R left', matched: false },
  { L: 0, R: 4, sum: 9, note: 'nums[0] + nums[4] = 1 + 8 = 9 == target! Found in O(n) time', matched: true },
];

export const LandingView: React.FC<LandingViewProps> = ({
  theme,
  onToggleTheme,
  onOpenSearch,
  onLaunchWorkspace,
  onNavigate,
  solvedIds,
}) => {
  const [heroStepIdx, setHeroStepIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<TrackKind>('dsa');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>('two-pointers');
  const [quickFilter, setQuickFilter] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroStepIdx((i) => (i + 1) % HERO_STEPS.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, []);

  const heroStep = HERO_STEPS[heroStepIdx];
  const heroArr = [1, 2, 4, 6, 8, 9];
  const q = quickFilter.trim().toLowerCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Polished Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          borderBottom: '1px solid rgb(var(--ink) / 0.08)',
          background: 'rgb(var(--paper) / 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '62px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgb(var(--accent))',
                color: 'rgb(var(--paper))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 2px 8px rgb(var(--accent) / 0.3)',
                flexShrink: 0,
              }}
            >
              !P
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 800,
                  fontSize: '1.02rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  color: 'rgb(var(--ink))',
                }}
              >
                Don&apos;t Paper Code
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgb(var(--mute))',
                  letterSpacing: '0.02em',
                }}
              >
                Visual DSA · Architecture Studio
              </div>
            </div>
          </button>

          {/* Clean Navigation & Utility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('/dsa')}
                className="nav-link"
              >
                <Code2 size={14} style={{ color: 'rgb(var(--accent))' }} />
                <span>DSA Patterns</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/system-design')}
                className="nav-link"
              >
                <Cpu size={14} style={{ color: 'rgb(var(--accent2))' }} />
                <span>System Design</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/aptitude')}
                className="nav-link"
              >
                <Sparkles size={14} style={{ color: 'rgb(var(--accent))' }} />
                <span>Aptitude</span>
              </button>
            </nav>

            {/* Subtle Divider */}
            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'rgb(var(--ink) / 0.1)',
                margin: '0 0.2rem',
              }}
            />

            {/* Clean Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="nav-search-btn"
              title="Jump to problem or pattern (Ctrl+K / ⌘K)"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={13} style={{ color: 'rgb(var(--mute))' }} />
                <span>Jump to problem...</span>
              </div>
              <kbd
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: 'rgb(var(--ink) / 0.07)',
                  border: '1px solid rgb(var(--ink) / 0.12)',
                  color: 'rgb(var(--mute))',
                  fontWeight: 600,
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Solved Stats Pill */}
            <div
              className="status-pill"
              title={`${solvedIds.size} challenges solved`}
            >
              <Flame size={12} style={{ color: 'rgb(var(--accent))' }} />
              <span>{solvedIds.size} Solved</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="nav-icon-btn"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1220px', width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 3.5rem' }}>
        {/* Hero Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '2.25rem',
            alignItems: 'center',
            marginBottom: '2.75rem',
          }}
        >
          {/* Left Pitch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Unified Announcement Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgb(var(--accent) / 0.08)',
                  border: '1px solid rgb(var(--accent) / 0.22)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgb(var(--accent))',
                  letterSpacing: '0.02em',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={11} />
                  INTERACTIVE VISUAL STUDIO
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor', opacity: 0.6 }} />
                <span style={{ color: 'rgb(var(--sketch))', fontWeight: 500 }}>
                  184 DSA Stages · 48 System Blueprints
                </span>
              </div>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(2.1rem, 3.8vw, 2.9rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                color: 'rgb(var(--ink))',
              }}
            >
              Stop memorizing static solutions.{' '}
              <span style={{ color: 'rgb(var(--accent))' }}>Don&apos;t Paper Code.</span>
            </h1>

            <p style={{ fontSize: '1rem', color: 'rgb(var(--sketch))', lineHeight: 1.62, maxWidth: '560px' }}>
              Step through every pointer shift, recursive frame, UML class connector, and distributed Redis Lua lock
              before writing syntax. Built with a unified interactive stage for <strong>DSA Patterns</strong> and{' '}
              <strong>System Design (LLD + HLD)</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('dsa', DSA_PROBLEMS[0].id)}
                className="cc-btn-solid"
              >
                <Play size={14} /> Launch DSA Stage
              </button>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('system-design', SYSTEM_DESIGN_LESSONS[0].id)}
                className="cc-btn-outline"
              >
                <Layers size={14} /> Explore System Design
              </button>
            </div>
          </div>

          {/* Right Live Interactive Preview Card */}
          <div
            className="sketch-border"
            style={{
              background: 'rgb(var(--surface))',
              padding: '1.2rem 1.35rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgb(var(--ink) / 0.05)',
            }}
          >
            {/* Window Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid rgb(var(--ink) / 0.08)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgb(var(--ink) / 0.18)' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgb(var(--ink) / 0.18)' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'rgb(var(--ink) / 0.18)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--mute))', marginLeft: '0.35rem' }}>
                  Two Sum II · Sorted Array Stage
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: 'rgb(var(--done-stroke) / 0.12)',
                    color: 'rgb(var(--done-stroke))',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                  LIVE PREVIEW
                </span>
                <span
                  className="ui-chip"
                  style={{
                    borderColor: heroStep.matched ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent) / 0.4)',
                    color: heroStep.matched ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent))',
                    fontWeight: 700,
                  }}
                >
                  {heroStep.matched ? '✓ Match [0, 4]' : `sum = ${heroStep.sum}`}
                </span>
              </div>
            </div>

            {/* Array Cells with Pointer Shifts */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '0.85rem 0 1.25rem',
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
                        width: '46px',
                        height: '46px',
                        borderRadius: '8px',
                        border: `2px solid ${
                          heroStep.matched && isActive
                            ? 'rgb(var(--done-stroke))'
                            : isActive
                              ? 'rgb(var(--accent))'
                              : 'rgb(var(--ink) / 0.18)'
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
                        fontSize: '15px',
                        boxShadow: isActive ? '0 2px 10px rgb(var(--accent) / 0.2)' : 'none',
                        transition: 'all 240ms ease',
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

            {/* Execution Console Output */}
            <div
              className="sketch-border-soft"
              style={{
                padding: '0.55rem 0.85rem',
                background: 'rgb(var(--paper))',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span>{heroStep.note}</span>
              <button
                type="button"
                onClick={() => setHeroStepIdx((i) => (i + 1) % HERO_STEPS.length)}
                style={{
                  fontSize: '10.5px',
                  color: 'rgb(var(--mute))',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  textDecoration: 'underline',
                }}
              >
                Step {heroStepIdx + 1}/2
              </button>
            </div>
          </div>
        </section>

        {/* Curriculum Explorer Header (Segmented Tabs + Quick Filter) */}
        <section>
          <div
            style={{
              marginBottom: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            {/* Segmented Track Switcher */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px',
                background: 'rgb(var(--surface-alt))',
                border: '1px solid rgb(var(--ink) / 0.1)',
                borderRadius: '9px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dsa');
                  setExpandedGroupId('two-pointers');
                }}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '13px',
                  fontWeight: activeTab === 'dsa' ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '7px',
                  background: activeTab === 'dsa' ? 'rgb(var(--surface))' : 'transparent',
                  color: activeTab === 'dsa' ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                  border: activeTab === 'dsa' ? '1px solid rgb(var(--ink) / 0.12)' : '1px solid transparent',
                  boxShadow: activeTab === 'dsa' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 150ms ease',
                  cursor: 'pointer',
                }}
              >
                <Code2 size={14} style={{ color: activeTab === 'dsa' ? 'rgb(var(--accent))' : 'inherit' }} />
                <span>DSA Patterns</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: activeTab === 'dsa' ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--ink) / 0.05)',
                    color: activeTab === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                    fontWeight: 600,
                  }}
                >
                  {DSA_PATTERNS.length} patterns · {DSA_PROBLEMS.length} stages
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('system-design');
                  setExpandedGroupId('lld-intro');
                }}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '13px',
                  fontWeight: activeTab === 'system-design' ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '7px',
                  background: activeTab === 'system-design' ? 'rgb(var(--surface))' : 'transparent',
                  color: activeTab === 'system-design' ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                  border: activeTab === 'system-design' ? '1px solid rgb(var(--ink) / 0.12)' : '1px solid transparent',
                  boxShadow: activeTab === 'system-design' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 150ms ease',
                  cursor: 'pointer',
                }}
              >
                <Cpu size={14} style={{ color: activeTab === 'system-design' ? 'rgb(var(--accent2))' : 'inherit' }} />
                <span>System Design</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: activeTab === 'system-design' ? 'rgb(var(--accent2) / 0.12)' : 'rgb(var(--ink) / 0.05)',
                    color: activeTab === 'system-design' ? 'rgb(var(--accent2))' : 'rgb(var(--mute))',
                    fontWeight: 600,
                  }}
                >
                  {SYSTEM_DESIGN_MODULES.length} modules · {SYSTEM_DESIGN_LESSONS.length} lessons
                </span>
              </button>
            </div>

            {/* Quick Filter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.42rem 0.8rem',
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--ink) / 0.14)',
                borderRadius: '8px',
                minWidth: '260px',
                transition: 'border-color 150ms ease',
              }}
            >
              <Search size={14} style={{ color: 'rgb(var(--mute))', flexShrink: 0 }} />
              <input
                type="text"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                placeholder={
                  activeTab === 'dsa' ? 'Filter patterns or problems...' : 'Filter modules or lessons...'
                }
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '12.5px',
                  width: '100%',
                  color: 'rgb(var(--ink))',
                }}
              />
              {quickFilter && (
                <button
                  type="button"
                  onClick={() => setQuickFilter('')}
                  style={{ color: 'rgb(var(--mute))', padding: '2px', display: 'flex', cursor: 'pointer', border: 'none', background: 'none' }}
                  title="Clear filter"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Bento Grid of Curriculum Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1rem',
              alignItems: 'start',
            }}
          >
            {activeTab === 'dsa'
              ? DSA_PATTERNS.map((pat) => {
                  const allProblems = DSA_PROBLEMS.filter((p) => p.patternId === pat.id);
                  const filteredProblems = q
                    ? allProblems.filter(
                        (p) =>
                          p.title.toLowerCase().includes(q) ||
                          (p.subtitle ?? '').toLowerCase().includes(q) ||
                          pat.title.toLowerCase().includes(q)
                      )
                    : allProblems;

                  if (q && filteredProblems.length === 0) return null;

                  const isExpanded = Boolean(q) || expandedGroupId === pat.id;
                  const solvedCount = allProblems.filter((p) => solvedIds.has(p.id)).length;
                  const percent = allProblems.length > 0 ? Math.round((solvedCount / allProblems.length) * 100) : 0;
                  const previewItems = isExpanded ? filteredProblems : filteredProblems.slice(0, 3);

                  return (
                    <div
                      key={pat.id}
                      className="sketch-border-soft curriculum-card"
                      style={{
                        background: 'rgb(var(--surface))',
                        padding: '1rem 1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        borderColor: isExpanded ? 'rgb(var(--accent) / 0.55)' : 'rgb(var(--ink) / 0.12)',
                      }}
                    >
                      {/* Card Header */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgb(var(--accent) / 0.1)',
                                color: 'rgb(var(--accent))',
                                border: '1px solid rgb(var(--accent) / 0.25)',
                              }}
                            >
                              {pat.number}
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 800 }}>
                              {pat.title}
                            </h3>
                          </div>

                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: solvedCount > 0 ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                            }}
                          >
                            {solvedCount}/{allProblems.length}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            height: '3px',
                            background: 'rgb(var(--ink) / 0.08)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              background: percent === 100 ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent))',
                              transition: 'width 250ms ease',
                            }}
                          />
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgb(var(--mute))',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {pat.tagline}
                      </p>

                      {/* Compact Problem List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.1rem' }}>
                        {previewItems.map((prob) => (
                          <button
                            key={prob.id}
                            type="button"
                            onClick={() => onLaunchWorkspace('dsa', prob.id)}
                            style={{
                              padding: '0.42rem 0.65rem',
                              borderRadius: '6px',
                              background: 'rgb(var(--paper))',
                              border: '1px solid rgb(var(--ink) / 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.45rem',
                              textAlign: 'left',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 140ms ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgb(var(--accent) / 0.4)';
                              e.currentTarget.style.background = 'rgb(var(--surface-alt))';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgb(var(--ink) / 0.08)';
                              e.currentTarget.style.background = 'rgb(var(--paper))';
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {solvedIds.has(prob.id) ? (
                                <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              ) : (
                                <span
                                  style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    background: 'rgb(var(--ink) / 0.25)',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prob.title}
                              </span>
                            </span>
                            <ArrowRight size={12} style={{ color: 'rgb(var(--mute))', flexShrink: 0, opacity: 0.7 }} />
                          </button>
                        ))}
                      </div>

                      {/* Footer Toggle */}
                      {filteredProblems.length > 3 && !q && (
                        <button
                          type="button"
                          onClick={() => setExpandedGroupId(isExpanded ? null : pat.id)}
                          style={{
                            marginTop: '0.15rem',
                            paddingTop: '0.4rem',
                            borderTop: '1px dashed rgb(var(--ink) / 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent))',
                            cursor: 'pointer',
                            background: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: 'none',
                          }}
                        >
                          <span>
                            {isExpanded ? 'Show fewer' : `View all ${filteredProblems.length} stages`}
                          </span>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      )}
                    </div>
                  );
                })
              : SYSTEM_DESIGN_MODULES.map((mod) => {
                  const allLessons = SYSTEM_DESIGN_LESSONS.filter((l) => l.moduleId === mod.id);
                  const filteredLessons = q
                    ? allLessons.filter(
                        (l) =>
                          l.title.toLowerCase().includes(q) ||
                          (l.subtitle ?? '').toLowerCase().includes(q) ||
                          mod.title.toLowerCase().includes(q)
                      )
                    : allLessons;

                  if (q && filteredLessons.length === 0) return null;

                  const isExpanded = Boolean(q) || expandedGroupId === mod.id;
                  const solvedCount = allLessons.filter((l) => solvedIds.has(l.id)).length;
                  const percent = allLessons.length > 0 ? Math.round((solvedCount / allLessons.length) * 100) : 0;
                  const previewItems = isExpanded ? filteredLessons : filteredLessons.slice(0, 3);

                  return (
                    <div
                      key={mod.id}
                      className="sketch-border-soft curriculum-card"
                      style={{
                        background: 'rgb(var(--surface))',
                        padding: '1rem 1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        borderColor: isExpanded ? 'rgb(var(--accent2) / 0.55)' : 'rgb(var(--ink) / 0.12)',
                      }}
                    >
                      {/* Card Header */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgb(var(--accent2) / 0.1)',
                                color: 'rgb(var(--accent2))',
                                border: '1px solid rgb(var(--accent2) / 0.25)',
                              }}
                            >
                              {mod.number} · {mod.trackType}
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 800 }}>
                              {mod.title}
                            </h3>
                          </div>

                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: solvedCount > 0 ? 'rgb(var(--accent2))' : 'rgb(var(--mute))',
                            }}
                          >
                            {solvedCount}/{allLessons.length}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            height: '3px',
                            background: 'rgb(var(--ink) / 0.08)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              background: percent === 100 ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent2))',
                              transition: 'width 250ms ease',
                            }}
                          />
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgb(var(--mute))',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {mod.tagline}
                      </p>

                      {/* Compact Lesson List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.1rem' }}>
                        {previewItems.map((les) => (
                          <button
                            key={les.id}
                            type="button"
                            onClick={() => onLaunchWorkspace('system-design', les.id)}
                            style={{
                              padding: '0.42rem 0.65rem',
                              borderRadius: '6px',
                              background: 'rgb(var(--paper))',
                              border: '1px solid rgb(var(--ink) / 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.45rem',
                              textAlign: 'left',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 140ms ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgb(var(--accent2) / 0.4)';
                              e.currentTarget.style.background = 'rgb(var(--surface-alt))';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgb(var(--ink) / 0.08)';
                              e.currentTarget.style.background = 'rgb(var(--paper))';
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {solvedIds.has(les.id) ? (
                                <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              ) : (
                                <span
                                  style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    background: 'rgb(var(--ink) / 0.25)',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {les.title}
                              </span>
                            </span>
                            <ArrowRight size={12} style={{ color: 'rgb(var(--mute))', flexShrink: 0, opacity: 0.7 }} />
                          </button>
                        ))}
                      </div>

                      {/* Footer Toggle */}
                      {filteredLessons.length > 3 && !q && (
                        <button
                          type="button"
                          onClick={() => setExpandedGroupId(isExpanded ? null : mod.id)}
                          style={{
                            marginTop: '0.15rem',
                            paddingTop: '0.4rem',
                            borderTop: '1px dashed rgb(var(--ink) / 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent2))',
                            cursor: 'pointer',
                            background: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: 'none',
                          }}
                        >
                          <span>
                            {isExpanded ? 'Show fewer' : `View all ${filteredLessons.length} lessons`}
                          </span>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      )}
                    </div>
                  );
                })}
          </div>
        </section>
      </main>
    </div>
  );
};
