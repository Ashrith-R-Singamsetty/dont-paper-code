import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  Home,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Search,
  Sun,
} from 'lucide-react';
import { DSA_PATTERNS, DSA_PROBLEMS } from './data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS, SYSTEM_DESIGN_MODULES } from './data/systemDesignLessons';
import { TrackKind } from './types/curriculum';
import { DsaVisualizer } from './components/visualizers/DsaVisualizer';
import { SystemDesignVisualizer } from './components/visualizers/SystemDesignVisualizer';
import { PracticePanel } from './components/stage/PracticePanel';
import { PlaybackBar } from './components/stage/PlaybackBar';
import { CommandPalette } from './components/stage/CommandPalette';
import { LandingView } from './components/stage/LandingView';
import { MarkdownRenderer } from './components/stage/MarkdownRenderer';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dpc:theme') as 'light' | 'dark') || 'light';
  });
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');
  const [track, setTrack] = useState<TrackKind>('dsa');
  const [selectedDsaId, setSelectedDsaId] = useState<string>(DSA_PROBLEMS[0].id);
  const [selectedSdId, setSelectedSdId] = useState<string>(SYSTEM_DESIGN_LESSONS[0].id);

  const [approachIdx, setApproachIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [sdMode, setSdMode] = useState<'watch' | 'read'>('watch');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hideSolutions, setHideSolutions] = useState<boolean>(() => {
    return localStorage.getItem('dpc:hideSolutions') === '1';
  });
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('dpc:solved');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  // Sync theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dpc:theme', theme);
  }, [theme]);

  const toggleHideSolutions = () => {
    setHideSolutions((prev) => {
      const next = !prev;
      localStorage.setItem('dpc:hideSolutions', next ? '1' : '0');
      return next;
    });
  };

  const handleMarkSolved = (id: string) => {
    setSolvedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('dpc:solved', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Current active item
  const currentDsa = useMemo(
    () => DSA_PROBLEMS.find((p) => p.id === selectedDsaId) ?? DSA_PROBLEMS[0],
    [selectedDsaId]
  );
  const currentSd = useMemo(
    () => SYSTEM_DESIGN_LESSONS.find((l) => l.id === selectedSdId) ?? SYSTEM_DESIGN_LESSONS[0],
    [selectedSdId]
  );

  const approaches = track === 'dsa' ? currentDsa.approaches : currentSd.approaches;
  const safeApproachIdx = Math.min(approachIdx, approaches.length - 1);
  const currentApproach = approaches[safeApproachIdx];
  const totalSteps = currentApproach.steps.length;
  const safeStepIdx = Math.min(stepIdx, Math.max(0, totalSteps - 1));

  // Reset approach & step when switching items
  const selectItem = (targetTrack: TrackKind, id: string) => {
    setTrack(targetTrack);
    if (targetTrack === 'dsa') {
      setSelectedDsaId(id);
    } else {
      setSelectedSdId(id);
    }
    setApproachIdx(0);
    setStepIdx(0);
    setPlaying(false);
    setSdMode('watch');
    setViewMode('workspace');
  };

  // Auto-advance timer when playing
  useEffect(() => {
    if (!playing) return;
    const intervalMs = Math.round(1400 / speed);
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev < totalSteps - 1) return prev + 1;
        setPlaying(false);
        return prev;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [playing, speed, totalSteps]);

  // Global keyboard shortcuts (⌘K, Space, ←, →, Home)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (viewMode !== 'workspace') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPlaying(false);
        setStepIdx((s) => Math.min(totalSteps - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPlaying(false);
        setStepIdx((s) => Math.max(0, s - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPlaying(false);
        setStepIdx(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode, totalSteps]);

  if (viewMode === 'landing') {
    return (
      <>
        <LandingView
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onOpenSearch={() => setSearchOpen(true)}
          onLaunchWorkspace={selectItem}
          solvedIds={solvedIds}
        />
        <CommandPalette
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelect={selectItem}
        />
      </>
    );
  }

  const activeItemId = track === 'dsa' ? currentDsa.id : currentSd.id;
  const activeTitle = track === 'dsa' ? currentDsa.title : currentSd.title;
  const activeSubtitle = track === 'dsa' ? currentDsa.subtitle : currentSd.subtitle;
  const activeStatement = track === 'dsa' ? currentDsa.statement : currentSd.statement;
  const activeCompanies = track === 'dsa' ? currentDsa.companies : currentSd.companies;
  const activeDifficulty = track === 'dsa' ? currentDsa.difficulty : currentSd.difficulty;
  const activeRubric = track === 'dsa' ? currentDsa.rubric : currentSd.rubric;

  const dsaStep = track === 'dsa' ? currentDsa.approaches[safeApproachIdx].steps[safeStepIdx] : null;
  const sdStep = track === 'system-design' ? currentSd.approaches[safeApproachIdx].steps[safeStepIdx] : null;

  const currentNarration = dsaStep ? dsaStep.narration : sdStep?.narration ?? '';
  const currentVars = dsaStep ? dsaStep.vars : sdStep?.vars ?? [];
  const currentCodeLines =
    track === 'dsa'
      ? currentDsa.approaches[safeApproachIdx].pseudocode
      : currentSd.approaches[safeApproachIdx].code;
  const currentCodeLine = dsaStep ? dsaStep.codeLine : sdStep?.codeLine ?? 0;
  const complexityBadge =
    track === 'dsa'
      ? `${currentDsa.approaches[safeApproachIdx].complexity.time} · ${currentDsa.approaches[safeApproachIdx].complexity.space}`
      : currentSd.approaches[safeApproachIdx].badge;

  // Flat list of items in current track for Prev / Next Problem navigation
  const flatTrackList = track === 'dsa' ? DSA_PROBLEMS : SYSTEM_DESIGN_LESSONS;
  const currentItemIndex = flatTrackList.findIndex((i) => i.id === activeItemId);

  return (
    <div className="app-shell">
      {/* LEFT CURRICULUM SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textAlign: 'left' }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgb(var(--accent))',
                color: 'rgb(var(--paper))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '12px',
              }}
            >
              !P
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '13.5px' }}>Don&apos;t Paper Code</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgb(var(--mute))' }}>
                ← Home Studio
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            title="Collapse sidebar"
            className="ui-chip"
          >
            <PanelLeftClose size={13} />
          </button>
        </div>

        {/* Track Switcher Tabs (DSA vs System Design) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.35rem',
            padding: '0.65rem 0.75rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.1)',
          }}
        >
          <button
            type="button"
            onClick={() => selectItem('dsa', selectedDsaId)}
            className="sketch-border-soft"
            style={{
              padding: '0.42rem 0.5rem',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: track === 'dsa' ? 'rgb(var(--accent) / 0.14)' : 'transparent',
              borderColor: track === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.12)',
              color: track === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
            }}
          >
            <Code2 size={13} /> DSA
          </button>
          <button
            type="button"
            onClick={() => selectItem('system-design', selectedSdId)}
            className="sketch-border-soft"
            style={{
              padding: '0.42rem 0.5rem',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: track === 'system-design' ? 'rgb(var(--accent2) / 0.15)' : 'transparent',
              borderColor: track === 'system-design' ? 'rgb(var(--accent2))' : 'rgb(var(--ink) / 0.12)',
              color: track === 'system-design' ? 'rgb(var(--accent2))' : 'rgb(var(--mute))',
            }}
          >
            <Cpu size={13} /> SysDesign
          </button>
        </div>

        {/* Curriculum Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {track === 'dsa'
            ? DSA_PATTERNS.map((pat) => {
                const items = DSA_PROBLEMS.filter((p) => p.patternId === pat.id);
                return (
                  <div key={pat.id} style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'rgb(var(--mute))',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {pat.number} · {pat.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {items.map((item) => {
                        const active = item.id === currentDsa.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectItem('dsa', item.id)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.48rem 0.6rem',
                              borderRadius: '7px',
                              fontSize: '12.5px',
                              fontWeight: active ? 700 : 500,
                              background: active ? 'rgb(var(--accent) / 0.12)' : 'transparent',
                              color: active ? 'rgb(var(--accent))' : 'rgb(var(--ink))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </span>
                            {solvedIds.has(item.id) && (
                              <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            : SYSTEM_DESIGN_MODULES.map((mod) => {
                const items = SYSTEM_DESIGN_LESSONS.filter((l) => l.moduleId === mod.id);
                return (
                  <div key={mod.id} style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'rgb(var(--mute))',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {mod.number} · {mod.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {items.map((item) => {
                        const active = item.id === currentSd.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectItem('system-design', item.id)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.48rem 0.6rem',
                              borderRadius: '7px',
                              fontSize: '12.5px',
                              fontWeight: active ? 700 : 500,
                              background: active ? 'rgb(var(--accent2) / 0.14)' : 'transparent',
                              color: active ? 'rgb(var(--accent2))' : 'rgb(var(--ink))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </span>
                            {solvedIds.has(item.id) && (
                              <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
        </div>
      </aside>

      {/* RIGHT MAIN STAGE */}
      <div className="stage-main">
        {/* Top Stage Bar */}
        <header
          style={{
            padding: '0.7rem 1.25rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.1)',
            background: 'rgb(var(--surface))',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="ui-chip"
                title="Open sidebar"
              >
                <PanelLeftOpen size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode('landing')}
              className="ui-chip"
              title="Back to Home"
            >
              <Home size={12} /> Home
            </button>
            <span
              className="ui-chip"
              style={{
                borderColor: track === 'dsa' ? 'rgb(var(--accent) / 0.5)' : 'rgb(var(--accent2) / 0.5)',
                color: track === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--accent2))',
                fontWeight: 700,
              }}
            >
              {track === 'dsa' ? 'DSA STAGE' : `SYSTEM DESIGN · ${currentSd.kind.toUpperCase()}`}
            </span>
            <span className="ui-chip">{activeDifficulty}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* System Design Watch vs Read Toggle */}
            {track === 'system-design' && (
              <div
                className="sketch-border-soft"
                style={{ display: 'inline-flex', padding: '2px', background: 'rgb(var(--paper))' }}
              >
                <button
                  type="button"
                  onClick={() => setSdMode('watch')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: sdMode === 'watch' ? 'rgb(var(--accent))' : 'transparent',
                    color: sdMode === 'watch' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                  }}
                >
                  <Play size={11} /> Watch Diagram
                </button>
                <button
                  type="button"
                  onClick={() => setSdMode('read')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: sdMode === 'read' ? 'rgb(var(--accent))' : 'transparent',
                    color: sdMode === 'read' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                  }}
                >
                  <BookOpen size={11} /> Read Notes
                </button>
              </div>
            )}

            {/* Hide Solutions Toggle */}
            <button
              type="button"
              onClick={toggleHideSolutions}
              className="ui-chip"
              style={{
                padding: '0.3rem 0.65rem',
                borderColor: hideSolutions ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.15)',
                background: hideSolutions ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--paper))',
                color: hideSolutions ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                fontWeight: 600,
              }}
            >
              {hideSolutions ? <EyeOff size={12} /> : <Eye size={12} />}
              {hideSolutions ? 'Solutions Hidden' : 'Hide Solutions'}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="ui-chip"
              style={{ padding: '0.3rem 0.65rem' }}
            >
              <Search size={12} /> ⌘K
            </button>

            <span className="ui-chip" style={{ background: 'rgb(var(--gold-bg))', fontWeight: 700 }}>
              <Flame size={12} style={{ color: 'rgb(var(--accent))' }} /> {solvedIds.size}
            </span>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="ui-chip"
              style={{ padding: '0.3rem 0.5rem' }}
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            </button>
          </div>
        </header>

        {/* Stage Content Container */}
        <div style={{ padding: '1.25rem', maxWidth: '1400px', width: '100%', margin: '0 auto', flex: 1 }}>
          {/* Title & Problem Statement Banner */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div>
                <h1 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.55rem', fontWeight: 800 }}>
                  {activeTitle}
                </h1>
                <p style={{ fontSize: '13.5px', color: 'rgb(var(--mute))', marginTop: '2px' }}>
                  {activeSubtitle}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {activeCompanies.map((c) => (
                  <span key={c} className="ui-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="sketch-border-soft"
              style={{
                marginTop: '0.75rem',
                padding: '0.7rem 0.95rem',
                background: 'rgb(var(--surface))',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgb(var(--sketch))',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <span>{activeStatement}</span>
              {track === 'dsa' && (
                <span
                  className="ui-chip"
                  style={{
                    borderColor: 'rgb(var(--accent) / 0.35)',
                    background: 'rgb(var(--paper))',
                    fontWeight: 600,
                  }}
                >
                  {currentDsa.inputDisplay}
                </span>
              )}
            </div>
          </div>

          {/* Approach Selector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {approaches.map((app, idx) => {
              const isSelected = idx === safeApproachIdx;
              const badgeText =
                'complexity' in app ? `${app.complexity.time} · ${app.complexity.space}` : app.badge;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setApproachIdx(idx);
                    setStepIdx(0);
                    setPlaying(false);
                  }}
                  className="sketch-border-soft"
                  style={{
                    padding: '0.48rem 0.9rem',
                    background: isSelected ? 'rgb(var(--active-bg))' : 'rgb(var(--surface))',
                    borderColor: isSelected ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.14)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <span>{app.label}</span>
                  {badgeText && (
                    <span
                      className="ui-chip"
                      style={{
                        borderColor: isSelected ? 'rgb(var(--accent) / 0.5)' : 'rgb(var(--ink) / 0.12)',
                        color: isSelected ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                      }}
                    >
                      {badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Read Mode (Markdown Architecture Theory) vs Watch Mode (Interactive Stage) */}
          {track === 'system-design' && sdMode === 'read' ? (
            <div
              className="sketch-border"
              style={{
                background: 'rgb(var(--surface))',
                padding: '1.75rem',
                maxWidth: '880px',
                lineHeight: 1.75,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'rgb(var(--accent))',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                SYSTEM DESIGN ARCHITECTURE NOTES · {currentSd.title.toUpperCase()}
              </div>
              <MarkdownRenderer markdown={currentSd.theoryMarkdown} />
            </div>
          ) : (
            <div className="stage-split">
              {/* LEFT COLUMN: Interactive Canvas + Narration + Scrubber */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', minWidth: 0 }}>
                {/* Main Visual Canvas */}
                <div
                  className="sketch-border"
                  style={{
                    background: 'rgb(var(--surface))',
                    padding: '1.25rem',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {track === 'dsa' && dsaStep && (
                    <DsaVisualizer renderMode={currentDsa.render} step={dsaStep} />
                  )}
                  {track === 'system-design' && sdStep && <SystemDesignVisualizer step={sdStep} />}
                </div>

                {/* Step Narration + Live State Variables Strip */}
                <div
                  className="sketch-border"
                  style={{
                    background: 'rgb(var(--surface))',
                    padding: '0.95rem 1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.7rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                    <span
                      className="ui-chip"
                      style={{
                        borderColor: 'rgb(var(--accent) / 0.5)',
                        background: 'rgb(var(--accent) / 0.12)',
                        color: 'rgb(var(--accent))',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      STEP {safeStepIdx + 1}/{totalSteps}
                    </span>
                    <p style={{ fontSize: '13.5px', fontWeight: 500, lineHeight: 1.55 }}>
                      {currentNarration}
                    </p>
                  </div>

                  {/* State Variables Inspector */}
                  {currentVars && currentVars.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.45rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px dashed rgb(var(--ink) / 0.12)',
                      }}
                    >
                      {currentVars.map(([k, v], i) => (
                        <span key={i} className="ui-chip" style={{ background: 'rgb(var(--paper))' }}>
                          <span style={{ color: 'rgb(var(--mute))' }}>{k}:</span>{' '}
                          <strong style={{ color: 'rgb(var(--ink))' }}>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Playback Scrubber Bar */}
                <PlaybackBar
                  currentIndex={safeStepIdx}
                  totalSteps={totalSteps}
                  playing={playing}
                  speed={speed}
                  onTogglePlay={() => setPlaying((p) => !p)}
                  onReset={() => {
                    setPlaying(false);
                    setStepIdx(0);
                  }}
                  onPrev={() => {
                    setPlaying(false);
                    setStepIdx((s) => Math.max(0, s - 1));
                  }}
                  onNext={() => {
                    setPlaying(false);
                    setStepIdx((s) => Math.min(totalSteps - 1, s + 1));
                  }}
                  onScrub={(idx) => {
                    setPlaying(false);
                    setStepIdx(idx);
                  }}
                  onChangeSpeed={setSpeed}
                />
              </div>

              {/* RIGHT COLUMN: Synchronized Code + "Don't Paper Code" Practice Engine */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <PracticePanel
                  itemId={activeItemId}
                  approachLabel={currentApproach.label}
                  complexityBadge={complexityBadge}
                  codeLines={currentCodeLines}
                  activeLine={currentCodeLine}
                  rubric={activeRubric}
                  hideSolutionsGlobal={hideSolutions}
                  isSolved={solvedIds.has(activeItemId)}
                  onMarkSolved={handleMarkSolved}
                />

                {/* Prev / Next Problem Footer Card */}
                <div
                  className="sketch-border-soft"
                  style={{
                    padding: '0.7rem 0.9rem',
                    background: 'rgb(var(--surface))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    type="button"
                    disabled={currentItemIndex <= 0}
                    onClick={() => {
                      if (currentItemIndex > 0) {
                        selectItem(track, flatTrackList[currentItemIndex - 1].id);
                      }
                    }}
                    className="ui-chip"
                    style={{ opacity: currentItemIndex <= 0 ? 0.35 : 1, padding: '0.35rem 0.65rem' }}
                  >
                    <ChevronLeft size={13} /> Prev Topic
                  </button>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--mute))' }}>
                    {currentItemIndex + 1} of {flatTrackList.length} in {track.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    disabled={currentItemIndex >= flatTrackList.length - 1}
                    onClick={() => {
                      if (currentItemIndex < flatTrackList.length - 1) {
                        selectItem(track, flatTrackList[currentItemIndex + 1].id);
                      }
                    }}
                    className="ui-chip"
                    style={{
                      opacity: currentItemIndex >= flatTrackList.length - 1 ? 0.35 : 1,
                      padding: '0.35rem 0.65rem',
                    }}
                  >
                    Next Topic <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Universal ⌘K Command Palette */}
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={selectItem}
      />
    </div>
  );
};
