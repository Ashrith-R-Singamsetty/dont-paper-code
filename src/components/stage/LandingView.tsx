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
  { L: 0, R: 4, sum: 9, note: 'nums[0] + nums[4] = 1 + 8 = 9 == target! Found in O(n)', matched: true },
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
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  const heroStep = HERO_STEPS[heroStepIdx];
  const heroArr = [1, 2, 4, 6, 8, 9];
  const q = quickFilter.trim().toLowerCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
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
              }}
            >
              !P
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-hand)', fontWeight: 800, fontSize: '1rem' }}>
                Don&apos;t Paper Code
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgb(var(--mute))' }}>
                Visual DSA · Low-Level Design · Distributed HLD
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate('/dsa')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.65rem', fontWeight: 600 }}
            >
              <Code2 size={12} style={{ color: 'rgb(var(--accent))' }} /> /dsa
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/system-design')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.65rem', fontWeight: 600 }}
            >
              <Cpu size={12} style={{ color: 'rgb(var(--accent2))' }} /> /system-design
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/design-system')}
              className="ui-chip"
              style={{ padding: '0.32rem 0.65rem', fontWeight: 600 }}
            >
              /design-system
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="sketch-border-soft"
              style={{
                padding: '0.35rem 0.7rem',
                background: 'rgb(var(--surface))',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '12px',
                color: 'rgb(var(--mute))',
              }}
            >
              <Search size={13} />
              <span>Jump to problem...</span>
              <span className="ui-chip">⌘K</span>
            </button>

            <span
              className="ui-chip"
              style={{
                padding: '0.32rem 0.6rem',
                borderColor: 'rgb(var(--gold-stroke) / 0.55)',
                background: 'rgb(var(--gold-bg))',
                fontWeight: 700,
              }}
            >
              <Flame size={12} style={{ color: 'rgb(var(--accent))' }} />
              {solvedIds.size} Solved
            </span>

            <button
              type="button"
              onClick={onToggleTheme}
              className="sketch-border-soft"
              title="Toggle light/dark theme"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgb(var(--surface))',
              }}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1180px', width: '100%', margin: '0 auto', padding: '1.75rem 1.5rem 2.75rem' }}>
        {/* Compact Hero Split Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          {/* Left Pitch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span
                className="ui-chip"
                style={{
                  borderColor: 'rgb(var(--accent) / 0.5)',
                  background: 'rgb(var(--accent) / 0.1)',
                  color: 'rgb(var(--accent))',
                  fontWeight: 700,
                }}
              >
                <Sparkles size={11} /> INTERACTIVE VISUAL LEARNING STUDIO
              </span>
              <span className="ui-chip">18 DSA Patterns · 184 Stages</span>
              <span className="ui-chip">10 LLD/HLD Modules · 48 Blueprints</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(1.85rem, 3.5vw, 2.65rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
              }}
            >
              Stop memorizing static solutions.{' '}
              <span style={{ color: 'rgb(var(--accent))' }}>Don&apos;t Paper Code.</span>
            </h1>

            <p style={{ fontSize: '0.96rem', color: 'rgb(var(--sketch))', lineHeight: 1.58 }}>
              Step through every pointer shift, recursive frame, UML class connector, and distributed Redis Lua lock
              before writing syntax. Built with a unified interactive stage for <strong>DSA Patterns</strong> and{' '}
              <strong>System Design (LLD + HLD)</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.15rem' }}>
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
          <div className="sketch-border" style={{ background: 'rgb(var(--surface))', padding: '1.1rem 1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--mute))' }}>
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
                gap: '0.5rem',
                padding: '0.65rem 0 1.15rem',
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
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
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
                        fontSize: '14px',
                      }}
                    >
                      {val}
                    </div>
                    {(isL || isR) && (
                      <span
                        style={{
                          marginTop: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10.5px',
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
                padding: '0.5rem 0.75rem',
                background: 'rgb(var(--paper))',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
              }}
            >
              {heroStep.note}
            </div>
          </div>
        </section>

        {/* Compact Curriculum Explorer Header (Tabs + Instant Filter) */}
        <section>
          <div
            className="sketch-border"
            style={{
              background: 'rgb(var(--surface))',
              padding: '0.85rem 1.15rem',
              marginBottom: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            {/* Segmented Track Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dsa');
                  setExpandedGroupId('two-pointers');
                }}
                className="sketch-border-soft"
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: activeTab === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--paper))',
                  color: activeTab === 'dsa' ? 'rgb(var(--paper))' : 'rgb(var(--ink))',
                  borderColor: activeTab === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.15)',
                }}
              >
                <Code2 size={15} />
                <span>DSA Patterns</span>
                <span
                  className="ui-chip"
                  style={{
                    background: activeTab === 'dsa' ? 'rgba(255,255,255,0.2)' : 'rgb(var(--surface))',
                    color: activeTab === 'dsa' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                    borderColor: 'transparent',
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
                className="sketch-border-soft"
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: activeTab === 'system-design' ? 'rgb(var(--accent2))' : 'rgb(var(--paper))',
                  color: activeTab === 'system-design' ? 'rgb(var(--paper))' : 'rgb(var(--ink))',
                  borderColor: activeTab === 'system-design' ? 'rgb(var(--accent2))' : 'rgb(var(--ink) / 0.15)',
                }}
              >
                <Cpu size={15} />
                <span>System Design (LLD &amp; HLD)</span>
                <span
                  className="ui-chip"
                  style={{
                    background: activeTab === 'system-design' ? 'rgba(255,255,255,0.2)' : 'rgb(var(--surface))',
                    color: activeTab === 'system-design' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                    borderColor: 'transparent',
                  }}
                >
                  {SYSTEM_DESIGN_MODULES.length} modules · {SYSTEM_DESIGN_LESSONS.length} lessons
                </span>
              </button>
            </div>

            {/* Inline Quick Filter */}
            <div
              className="sketch-border-soft"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.7rem',
                background: 'rgb(var(--paper))',
                minWidth: '240px',
              }}
            >
              <Search size={13} style={{ color: 'rgb(var(--mute))' }} />
              <input
                type="text"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                placeholder={
                  activeTab === 'dsa' ? 'Filter patterns or problems...' : 'Filter LLD/HLD modules or lessons...'
                }
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '12.5px',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Compact 3-Column Bento Grid of Patterns / Modules */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(335px, 1fr))',
              gap: '0.85rem',
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
                  const previewItems = isExpanded ? filteredProblems : filteredProblems.slice(0, 3);

                  return (
                    <div
                      key={pat.id}
                      className="sketch-border-soft"
                      style={{
                        background: 'rgb(var(--surface))',
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                        borderColor: isExpanded ? 'rgb(var(--accent) / 0.55)' : 'rgb(var(--ink) / 0.14)',
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span
                            className="ui-chip"
                            style={{
                              color: 'rgb(var(--accent))',
                              borderColor: 'rgb(var(--accent) / 0.35)',
                              fontWeight: 700,
                            }}
                          >
                            {pat.number}
                          </span>
                          <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.02rem', fontWeight: 800 }}>
                            {pat.title}
                          </h3>
                        </div>

                        <span className="ui-chip" style={{ fontSize: '10.5px' }}>
                          {solvedCount}/{allProblems.length}
                        </span>
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

                      {/* Compact Problem List (Top 3 or Expanded) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.15rem' }}>
                        {previewItems.map((prob) => (
                          <button
                            key={prob.id}
                            type="button"
                            onClick={() => onLaunchWorkspace('dsa', prob.id)}
                            style={{
                              padding: '0.38rem 0.55rem',
                              borderRadius: '6px',
                              background: 'rgb(var(--paper))',
                              border: '1px solid rgb(var(--ink) / 0.09)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {solvedIds.has(prob.id) && (
                                <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prob.title}
                              </span>
                            </span>
                            <ArrowRight size={12} style={{ color: 'rgb(var(--accent))', flexShrink: 0 }} />
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
                            paddingTop: '0.35rem',
                            borderTop: '1px dashed rgb(var(--ink) / 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent))',
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
                  const previewItems = isExpanded ? filteredLessons : filteredLessons.slice(0, 3);

                  return (
                    <div
                      key={mod.id}
                      className="sketch-border-soft"
                      style={{
                        background: 'rgb(var(--surface))',
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                        borderColor: isExpanded ? 'rgb(var(--accent2) / 0.55)' : 'rgb(var(--ink) / 0.14)',
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span
                            className="ui-chip"
                            style={{
                              color: 'rgb(var(--accent2))',
                              borderColor: 'rgb(var(--accent2) / 0.35)',
                              fontWeight: 700,
                            }}
                          >
                            {mod.number} · {mod.trackType}
                          </span>
                          <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.02rem', fontWeight: 800 }}>
                            {mod.title}
                          </h3>
                        </div>

                        <span className="ui-chip" style={{ fontSize: '10.5px' }}>
                          {solvedCount}/{allLessons.length}
                        </span>
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

                      {/* Compact Lesson List (Top 3 or Expanded) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.15rem' }}>
                        {previewItems.map((les) => (
                          <button
                            key={les.id}
                            type="button"
                            onClick={() => onLaunchWorkspace('system-design', les.id)}
                            style={{
                              padding: '0.38rem 0.55rem',
                              borderRadius: '6px',
                              background: 'rgb(var(--paper))',
                              border: '1px solid rgb(var(--ink) / 0.09)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {solvedIds.has(les.id) && (
                                <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {les.title}
                              </span>
                            </span>
                            <ArrowRight size={12} style={{ color: 'rgb(var(--accent2))', flexShrink: 0 }} />
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
                            paddingTop: '0.35rem',
                            borderTop: '1px dashed rgb(var(--ink) / 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent2))',
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
