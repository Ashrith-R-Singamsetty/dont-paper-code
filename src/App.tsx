import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Code2,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  Home,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Share2,
  Sparkles,
  Sun,
} from 'lucide-react';
import { DSA_PATTERNS, DSA_PROBLEMS } from './data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS, SYSTEM_DESIGN_MODULES } from './data/systemDesignLessons';
import { TrackKind } from './types/curriculum';
import { DsaVisualizer } from './components/visualizers/DsaVisualizer';
import { SystemDesignVisualizer } from './components/visualizers/SystemDesignVisualizer';
import { PracticePanel } from './components/stage/PracticePanel';
import { PlaybackBar } from './components/stage/PlaybackBar';
import { LandingView } from './components/stage/LandingView';
import { MarkdownRenderer } from './components/stage/MarkdownRenderer';

// Code-split heavy views into lazy chunks so initial load remains ultra-fast
const AptitudeView = React.lazy(() =>
  import('./components/stage/AptitudeView').then((m) => ({ default: m.AptitudeView }))
);
const DesignSystemView = React.lazy(() =>
  import('./components/stage/DesignSystemView').then((m) => ({ default: m.DesignSystemView }))
);
const CommandPalette = React.lazy(() =>
  import('./components/stage/CommandPalette').then((m) => ({ default: m.CommandPalette }))
);

type PageRoute = 'landing' | 'dsa' | 'system-design' | 'design-system' | 'aptitude';

interface QueryParams {
  step?: number;
  approach?: number;
  mode?: 'watch' | 'read';
}

function parseQueryParams(search: string): QueryParams {
  const params = new URLSearchParams(search);
  const stepVal = params.get('step');
  const approachVal = params.get('approach');
  const modeVal = params.get('mode');

  let step: number | undefined;
  if (stepVal !== null) {
    const parsed = parseInt(stepVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      step = parsed - 1; // Convert 1-based URL parameter to 0-based index
    }
  }

  let approach: number | undefined;
  if (approachVal !== null) {
    const parsed = parseInt(approachVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      approach = parsed - 1; // Convert 1-based URL parameter to 0-based index
    }
  }

  const mode = modeVal === 'read' || modeVal === 'watch' ? modeVal : undefined;
  return { step, approach, mode };
}

function parseLocationPath(pathname: string): {
  route: PageRoute;
  dsaId?: string;
  sdId?: string;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/design-system') {
    return { route: 'design-system' };
  }
  if (clean === '/aptitude' || clean.startsWith('/aptitude/')) {
    return { route: 'aptitude' };
  }
  if (clean === '/dsa' || clean.startsWith('/dsa/')) {
    const slug = clean.slice('/dsa/'.length);
    const match = slug ? DSA_PROBLEMS.find((p) => p.id === slug) : undefined;
    return { route: 'dsa', dsaId: match?.id };
  }
  if (
    clean === '/system-design' ||
    clean.startsWith('/system-design/') ||
    clean === '/lld' ||
    clean.startsWith('/lld/')
  ) {
    const parts = clean.split('/').filter(Boolean);
    const slug = parts.length >= 2 ? parts[parts.length - 1] : undefined;
    const match = slug ? SYSTEM_DESIGN_LESSONS.find((l) => l.id === slug) : undefined;
    return { route: 'system-design', sdId: match?.id };
  }
  return { route: 'landing' };
}

export const App: React.FC = () => {
  const initialParsed = useMemo(() => parseLocationPath(window.location.pathname), []);
  const initialQuery = useMemo(() => parseQueryParams(window.location.search), []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dpc:theme') as 'light' | 'dark') || 'dark';
  });
  const [viewMode, setViewMode] = useState<PageRoute>(initialParsed.route);
  const [track, setTrack] = useState<TrackKind>(
    initialParsed.route === 'dsa' ? 'dsa' : 'system-design'
  );
  const [selectedDsaId, setSelectedDsaId] = useState<string>(
    initialParsed.dsaId ?? DSA_PROBLEMS[0].id
  );
  const [selectedSdId, setSelectedSdId] = useState<string>(
    initialParsed.sdId ?? SYSTEM_DESIGN_LESSONS[0].id
  );

  const [approachIdx, setApproachIdx] = useState(initialQuery.approach ?? 0);
  const [stepIdx, setStepIdx] = useState(initialQuery.step ?? 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [sdMode, setSdMode] = useState<'watch' | 'read'>(initialQuery.mode ?? 'watch');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
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

  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
  };

  const toggleSidebarGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
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

  const navigateToPath = (pathWithSearch: string) => {
    if (`${window.location.pathname}${window.location.search}` !== pathWithSearch) {
      window.history.pushState({}, '', pathWithSearch);
    }
    const [path, search] = pathWithSearch.split('?');
    const parsed = parseLocationPath(path);
    const q = parseQueryParams(search ? `?${search}` : '');
    setViewMode(parsed.route);
    if (parsed.route === 'dsa') {
      setTrack('dsa');
      if (parsed.dsaId) setSelectedDsaId(parsed.dsaId);
    } else if (parsed.route === 'system-design') {
      setTrack('system-design');
      if (parsed.sdId) setSelectedSdId(parsed.sdId);
    }
    setApproachIdx(q.approach ?? 0);
    setStepIdx(q.step ?? 0);
    setSdMode(q.mode ?? 'watch');
    setPlaying(false);
  };

  const selectItem = (targetTrack: TrackKind, id: string, targetStep = 0, targetApproach = 0) => {
    setTrack(targetTrack);
    const nextPath = targetTrack === 'dsa' ? `/dsa/${id}` : `/system-design/${id}`;
    const nextSearch = `?step=${targetStep + 1}${targetApproach > 0 ? `&approach=${targetApproach + 1}` : ''}`;
    const fullUrl = `${nextPath}${nextSearch}`;
    if (`${window.location.pathname}${window.location.search}` !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
    }
    if (targetTrack === 'dsa') {
      setSelectedDsaId(id);
      setViewMode('dsa');
    } else {
      setSelectedSdId(id);
      setViewMode('system-design');
    }
    setApproachIdx(targetApproach);
    setStepIdx(targetStep);
    setPlaying(false);
    setSdMode('watch');
  };

  // Sync browser Back / Forward buttons (popstate)
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseLocationPath(window.location.pathname);
      const q = parseQueryParams(window.location.search);
      setViewMode(parsed.route);
      if (parsed.route === 'dsa') {
        setTrack('dsa');
        if (parsed.dsaId) setSelectedDsaId(parsed.dsaId);
      } else if (parsed.route === 'system-design') {
        setTrack('system-design');
        if (parsed.sdId) setSelectedSdId(parsed.sdId);
      }
      setApproachIdx(q.approach ?? 0);
      setStepIdx(q.step ?? 0);
      setSdMode(q.mode ?? 'watch');
      setPlaying(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Synchronize active step, approach, and mode to URL query parameters in real time
  useEffect(() => {
    if (viewMode !== 'dsa' && viewMode !== 'system-design') return;

    const currentPath = window.location.pathname;
    const params = new URLSearchParams();

    // 1-based index for clean, human-readable URLs: ?step=1, ?step=2...
    params.set('step', String(safeStepIdx + 1));
    if (safeApproachIdx > 0) {
      params.set('approach', String(safeApproachIdx + 1));
    }
    if (track === 'system-design' && sdMode === 'read') {
      params.set('mode', 'read');
    }

    const newSearch = `?${params.toString()}`;
    const newUrl = `${currentPath}${newSearch}`;

    if (`${window.location.pathname}${window.location.search}` !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [viewMode, safeStepIdx, safeApproachIdx, sdMode, track, selectedDsaId, selectedSdId]);

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
      if (viewMode !== 'dsa' && viewMode !== 'system-design') return;
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

  if (viewMode === 'aptitude') {
    return (
      <React.Suspense
        fallback={
          <div
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'rgb(var(--mute))',
            }}
          >
            Loading Aptitude Studio...
          </div>
        }
      >
        <AptitudeView
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onNavigateHome={() => navigateToPath('/')}
          onNavigateDSA={() => navigateToPath('/dsa')}
          onNavigateSystemDesign={() => navigateToPath('/system-design')}
          onNavigateDesignSystem={() => navigateToPath('/design-system')}
        />
        {searchOpen && (
          <CommandPalette
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelect={selectItem}
          />
        )}
      </React.Suspense>
    );
  }

  if (viewMode === 'design-system') {
    return (
      <React.Suspense
        fallback={
          <div
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'rgb(var(--mute))',
            }}
          >
            Loading Design System...
          </div>
        }
      >
        <DesignSystemView
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onNavigate={navigateToPath}
        />
        {searchOpen && (
          <CommandPalette
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelect={selectItem}
          />
        )}
      </React.Suspense>
    );
  }

  if (viewMode === 'landing') {
    return (
      <>
        <LandingView
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onOpenSearch={() => setSearchOpen(true)}
          onLaunchWorkspace={selectItem}
          onNavigate={navigateToPath}
          solvedIds={solvedIds}
        />
        <React.Suspense fallback={null}>
          {searchOpen && (
            <CommandPalette
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSelect={selectItem}
            />
          )}
        </React.Suspense>
      </>
    );
  }

  const activeItemId = track === 'dsa' ? currentDsa.id : currentSd.id;
  const activeTitle = track === 'dsa' ? currentDsa.title : currentSd.title;
  const activeStatement = track === 'dsa' ? currentDsa.statement : currentSd.statement;
  const activeCompanies = (track === 'dsa' ? currentDsa.companies : currentSd.companies) ?? [];
  const activeDifficulty =
    (track === 'dsa' ? currentDsa.leetcode?.difficulty ?? currentDsa.difficulty : currentSd.difficulty) ?? 'Medium';
  const activeKindLabel =
    track === 'dsa'
      ? `${currentDsa.kind === 'concept' ? 'Concept' : 'Problem'} · ${activeDifficulty}`
      : `${currentSd.kind === 'concept' ? 'Concept' : currentSd.kind === 'pattern' ? 'Pattern' : 'Case Study'} · ${activeDifficulty}`;

  const currentGroupTitle =
    track === 'dsa'
      ? DSA_PATTERNS.find((p) => p.id === currentDsa.patternId)?.title ?? 'DSA Visual'
      : SYSTEM_DESIGN_MODULES.find((m) => m.id === (currentSd.moduleId ?? currentSd.patternId))?.title ?? 'LLD Visual';

  const defaultRubric = {
    prompt: `Write the core pseudocode or design contract for "${activeTitle}".`,
    starterHint: '// Write your logic here...',
    requiredGroups: [{ concept: 'Core logic', keywords: ['(', '='], missingHint: 'Write a complete block.' }],
  };
  const activeRubric = (track === 'dsa' ? currentDsa.rubric : currentSd.rubric) ?? defaultRubric;

  const dsaStep = track === 'dsa' ? currentDsa.approaches[safeApproachIdx].steps[safeStepIdx] : null;
  const sdStep = track === 'system-design' ? currentSd.approaches[safeApproachIdx].steps[safeStepIdx] : null;

  const currentNarration = dsaStep ? dsaStep.narration : sdStep?.narration ?? '';
  const currentVars = dsaStep ? dsaStep.vars : sdStep?.vars ?? [];
  const currentCodeLines =
    track === 'dsa'
      ? currentDsa.approaches[safeApproachIdx].pseudocode
      : currentSd.approaches[safeApproachIdx].code;
  const currentCodeLine = (dsaStep ? dsaStep.codeLine : sdStep?.codeLine) ?? 1;
  const complexityBadge =
    track === 'dsa'
      ? `${currentDsa.approaches[safeApproachIdx].complexity.time} · ${currentDsa.approaches[safeApproachIdx].complexity.space}`
      : currentSd.approaches[safeApproachIdx].badge;

  const flatTrackList = track === 'dsa' ? DSA_PROBLEMS : SYSTEM_DESIGN_LESSONS;
  const currentItemIndex = flatTrackList.findIndex((i) => i.id === activeItemId);

  return (
    <div className="app-shell">
      {/* LEFT CURRICULUM SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        {/* Top Brand Row */}
        <div
          style={{
            padding: '0.75rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() => navigateToPath('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontWeight: 800,
                fontSize: '14.5px',
                color: 'rgb(var(--accent))',
              }}
            >
              Don&apos;t Paper
            </span>
            <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: '14.5px' }}>
              Visual
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            title="Collapse sidebar"
            style={{ color: 'rgb(var(--mute))', padding: '4px' }}
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        {/* Track Switcher Box (Matches "Track: LLD Visual" selector in screenshot) */}
        <div style={{ padding: '0 0.75rem 0.75rem', borderBottom: '1px solid rgb(var(--ink) / 0.08)' }}>
          <div
            className="sketch-border-soft"
            style={{
              padding: '0.45rem 0.65rem',
              background: 'rgb(var(--paper))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {track === 'dsa' ? (
                <Code2 size={15} style={{ color: 'rgb(var(--accent))' }} />
              ) : (
                <Cpu size={15} style={{ color: 'rgb(var(--accent))' }} />
              )}
              <div>
                <div style={{ fontSize: '9.5px', color: 'rgb(var(--mute))', textTransform: 'uppercase' }}>
                  Track
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                  {track === 'dsa' ? 'DSA Visual' : 'LLD & HLD Visual'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => selectItem('dsa', selectedDsaId)}
                className="ui-chip"
                style={{
                  padding: '2px 7px',
                  fontSize: '10px',
                  borderColor: track === 'dsa' ? 'rgb(var(--accent))' : 'transparent',
                  color: track === 'dsa' ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                }}
              >
                DSA
              </button>
              <button
                type="button"
                onClick={() => selectItem('system-design', selectedSdId)}
                className="ui-chip"
                style={{
                  padding: '2px 7px',
                  fontSize: '10px',
                  borderColor: track === 'system-design' ? 'rgb(var(--accent))' : 'transparent',
                  color: track === 'system-design' ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                }}
              >
                LLD
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Section Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem 0.6rem' }}>
          {track === 'dsa'
            ? DSA_PATTERNS.map((pat) => {
                const items = DSA_PROBLEMS.filter((p) => p.patternId === pat.id);
                const isCollapsed = Boolean(collapsedGroups[pat.id]);
                return (
                  <div key={pat.id} style={{ marginBottom: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleSidebarGroup(pat.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgb(var(--mute))',
                        padding: '0.25rem 0.35rem',
                        marginBottom: '0.2rem',
                      }}
                    >
                      <ChevronDown
                        size={11}
                        style={{
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                          transition: 'transform 160ms ease',
                        }}
                      />
                      <span>{pat.title}</span>
                    </button>
                    {!isCollapsed && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                                padding: '0.42rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: active ? 600 : 400,
                                background: active ? 'rgb(var(--ink) / 0.08)' : 'transparent',
                                color: active ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
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
                                <CheckCircle2 size={12} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            : SYSTEM_DESIGN_MODULES.map((mod) => {
                const items = SYSTEM_DESIGN_LESSONS.filter((l) => (l.moduleId ?? l.patternId) === mod.id);
                const isCollapsed = Boolean(collapsedGroups[mod.id]);
                return (
                  <div key={mod.id} style={{ marginBottom: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleSidebarGroup(mod.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgb(var(--mute))',
                        padding: '0.25rem 0.35rem',
                        marginBottom: '0.2rem',
                      }}
                    >
                      <ChevronDown
                        size={11}
                        style={{
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                          transition: 'transform 160ms ease',
                        }}
                      />
                      <span>{mod.title}</span>
                    </button>
                    {!isCollapsed && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                                padding: '0.42rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: active ? 600 : 400,
                                background: active ? 'rgb(var(--ink) / 0.08)' : 'transparent',
                                color: active ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
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
                                <CheckCircle2 size={12} style={{ color: 'rgb(var(--done-stroke))', flexShrink: 0 }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      </aside>

      {/* RIGHT MAIN STAGE */}
      <div className="stage-main">
        {/* Top Breadcrumb Bar (Matches "LLD Visual › Getting started" + right utility bar) */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            padding: '0.55rem 1.5rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.08)',
            background: 'rgb(var(--paper) / 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '12.5px' }}>
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="ui-chip"
                title="Open sidebar"
              >
                <PanelLeftOpen size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={() => navigateToPath('/')}
              style={{ color: 'rgb(var(--mute))', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Back to Home (/)"
            >
              <Home size={13} />
            </button>
            <span style={{ color: 'rgb(var(--mute))' }}>
              {track === 'dsa' ? '/dsa' : '/system-design'}
            </span>
            <span style={{ color: 'rgb(var(--mute) / 0.5)' }}>›</span>
            <span style={{ fontWeight: 600, color: 'rgb(var(--ink))' }}>{currentGroupTitle}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigateToPath(track === 'dsa' ? '/system-design' : '/dsa')}
              className="nav-link"
              style={{ padding: '0.25rem 0.6rem', fontSize: '12px' }}
            >
              {track === 'dsa' ? (
                <>
                  <Cpu size={13} style={{ color: 'rgb(var(--accent2))' }} />
                  <span>System Design</span>
                </>
              ) : (
                <>
                  <Code2 size={13} style={{ color: 'rgb(var(--accent))' }} />
                  <span>DSA Stages</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateToPath('/aptitude')}
              className="nav-link"
              style={{ padding: '0.25rem 0.6rem', fontSize: '12px' }}
            >
              <Sparkles size={13} style={{ color: 'rgb(var(--accent))' }} />
              <span>Aptitude</span>
            </button>

            <div style={{ width: '1px', height: '16px', background: 'rgb(var(--ink) / 0.1)', margin: '0 2px' }} />

            <button
              type="button"
              onClick={toggleHideSolutions}
              className="nav-link"
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '12px',
                color: hideSolutions ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
              }}
              title={hideSolutions ? 'Show solutions' : 'Hide solutions for practice'}
            >
              {hideSolutions ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{hideSolutions ? 'Solutions hidden' : 'Hide solutions'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="nav-search-btn"
              style={{ minWidth: 'auto', padding: '0.25rem 0.55rem', fontSize: '11.5px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Search size={12} />
                <span>Search</span>
              </div>
              <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgb(var(--mute))' }}>⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="nav-icon-btn"
              style={{ width: '28px', height: '28px' }}
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            </button>

            <div
              className="status-pill"
              style={{ padding: '0.2rem 0.55rem', fontSize: '11px' }}
              title={`${solvedIds.size} challenges solved`}
            >
              <Flame size={12} style={{ color: 'rgb(var(--accent))' }} /> {solvedIds.size}
            </div>
          </div>
        </header>

        {/* Stage Content Container */}
        <div style={{ padding: '0.9rem 1.75rem 1.1rem', maxWidth: '1380px', width: '100%', margin: '0 auto', flex: 1 }}>
          {/* Header Section (Matches screenshot: Category tag, Title, Description, ASKED AT, Approach row on left; step 1/13 + Watch/Read pill on right) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginBottom: '0.65rem',
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              <div
                style={{
                  fontSize: '11.5px',
                  color: 'rgb(var(--mute))',
                  marginBottom: '0.2rem',
                  fontWeight: 500,
                }}
              >
                {activeKindLabel}
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                {activeTitle}
              </h1>

              <p
                style={{
                  fontSize: '13.5px',
                  color: 'rgb(var(--mute))',
                  lineHeight: 1.55,
                  marginTop: '0.35rem',
                }}
              >
                {activeStatement}
              </p>

              {/* ASKED AT Row */}
              {activeCompanies.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    marginTop: '0.65rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.08em',
                      color: 'rgb(var(--mute))',
                      marginRight: '0.2rem',
                    }}
                  >
                    ASKED AT
                  </span>
                  {activeCompanies.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid rgb(var(--ink) / 0.14)',
                        color: 'rgb(var(--sketch))',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Approach Switcher + Step Dots Row (`1/2 The class diagram, structure ● • • • •`) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                  marginTop: '0.75rem',
                }}
              >
                {approaches.map((app, idx) => {
                  const isSelected = idx === safeApproachIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setApproachIdx(idx);
                        setStepIdx(0);
                        setPlaying(false);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '12.5px',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                        padding: approaches.length > 1 ? '0.25rem 0.6rem' : '0',
                        borderRadius: '6px',
                        background:
                          approaches.length > 1 && isSelected ? 'rgb(var(--ink) / 0.08)' : 'transparent',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'rgb(var(--mute))' }}>
                        {idx + 1}/{approaches.length}
                      </span>
                      <span>{app.label}</span>
                    </button>
                  );
                })}

                {/* Mini Step Dots */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '0.25rem' }}>
                  {Array.from({ length: Math.min(totalSteps, 18) }).map((_, dotIdx) => {
                    const isCurrent = dotIdx === safeStepIdx;
                    return (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => {
                          setPlaying(false);
                          setStepIdx(dotIdx);
                        }}
                        style={{
                          width: isCurrent ? '7px' : '5px',
                          height: isCurrent ? '7px' : '5px',
                          borderRadius: '999px',
                          background: isCurrent ? 'rgb(var(--ink))' : 'rgb(var(--ink) / 0.22)',
                          transition: 'all 160ms ease',
                        }}
                        title={`Step ${dotIdx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top-Right Step Pill + Share Button + Watch/Read Segmented Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                className="sketch-border-soft"
                style={{
                  padding: '0.28rem 0.65rem',
                  background: 'rgb(var(--surface))',
                  textAlign: 'center',
                  lineHeight: 1.15,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'rgb(var(--mute))' }}>
                  step
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                  {safeStepIdx + 1}/{totalSteps}
                </div>
              </div>

              {/* Share Step Link Button */}
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="sketch-border-soft"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: copiedShareLink ? 'rgb(var(--done-stroke) / 0.12)' : 'rgb(var(--surface))',
                  color: copiedShareLink ? 'rgb(var(--done-stroke))' : 'rgb(var(--sketch))',
                  borderColor: copiedShareLink ? 'rgb(var(--done-stroke) / 0.4)' : 'rgb(var(--ink) / 0.12)',
                  transition: 'all 150ms ease',
                }}
                title="Copy shareable link with exact step, approach and mode"
              >
                {copiedShareLink ? (
                  <>
                    <CheckCircle2 size={13} style={{ color: 'rgb(var(--done-stroke))' }} />
                    <span>Link copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} />
                    <span>Share step</span>
                  </>
                )}
              </button>

              {track === 'system-design' && (
                <div
                  className="sketch-border-soft"
                  style={{
                    display: 'inline-flex',
                    padding: '3px',
                    background: 'rgb(var(--surface))',
                    borderRadius: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSdMode('watch')}
                    style={{
                      padding: '0.32rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: sdMode === 'watch' ? 'rgb(var(--ink))' : 'transparent',
                      color: sdMode === 'watch' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                    }}
                  >
                    Watch
                  </button>
                  <button
                    type="button"
                    onClick={() => setSdMode('read')}
                    style={{
                      padding: '0.32rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: sdMode === 'read' ? 'rgb(var(--ink))' : 'transparent',
                      color: sdMode === 'read' ? 'rgb(var(--paper))' : 'rgb(var(--mute))',
                    }}
                  >
                    Read
                  </button>
                </div>
              )}
            </div>
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
              <MarkdownRenderer markdown={currentSd.theory ?? currentSd.theoryMarkdown ?? ''} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* CENTER SPLIT: Diagram Canvas on Left + Code & STATE Box on Right */}
              <div className="stage-split">
                {/* LEFT: Visual Diagram Stage */}
                <div
                  style={{
                    minHeight: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0.5rem 0.25rem',
                  }}
                >
                  {track === 'dsa' && dsaStep && (
                    <DsaVisualizer
                      renderMode={currentDsa.render ?? 'cells'}
                      step={dsaStep}
                      defaultInput={currentDsa.input}
                    />
                  )}
                  {track === 'system-design' && sdStep && <SystemDesignVisualizer step={sdStep} />}
                </div>

                {/* RIGHT: Code Panel + STATE Card (Stacked vertically just like screenshot) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

                  {/* STATE Card below Code Panel */}
                  <div
                    className="sketch-border"
                    style={{
                      background: 'rgb(var(--surface))',
                      padding: '0.85rem 1rem',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgb(var(--mute))',
                        marginBottom: '0.5rem',
                      }}
                    >
                      STATE
                    </div>

                    {currentVars && currentVars.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {currentVars.map(([k, v], i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              justifyContent: 'space-between',
                              gap: '0.75rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                            }}
                          >
                            <span style={{ color: 'rgb(var(--mute))' }}>{k}</span>
                            <span style={{ color: 'rgb(var(--ink))', fontWeight: 600, textAlign: 'right' }}>
                              {String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'rgb(var(--mute))' }}>
                        —
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM FULL-WIDTH NARRATION BAR (with ✦ sparkle icon) */}
              <div
                className="sketch-border"
                style={{
                  background: 'rgb(var(--surface))',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Sparkles size={16} style={{ color: 'rgb(var(--accent))', flexShrink: 0 }} />
                <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'rgb(var(--ink))' }}>
                  {currentNarration}
                </p>
              </div>

              {/* BOTTOM FULL-WIDTH PLAYBACK SCRUBBER BAR */}
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

              {/* Compact Prev / Next Lesson Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.25rem',
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
                  style={{
                    padding: '0.35rem 0.7rem',
                    opacity: currentItemIndex <= 0 ? 0.35 : 1,
                  }}
                >
                  <ChevronLeft size={13} />
                  {currentItemIndex > 0 ? flatTrackList[currentItemIndex - 1].title : 'Start of Track'}
                </button>

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
                    padding: '0.35rem 0.7rem',
                    opacity: currentItemIndex >= flatTrackList.length - 1 ? 0.35 : 1,
                  }}
                >
                  {currentItemIndex < flatTrackList.length - 1
                    ? flatTrackList[currentItemIndex + 1].title
                    : 'End of Track'}
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global ⌘K Command Palette (Lazy loaded on demand) */}
      <React.Suspense fallback={null}>
        {searchOpen && (
          <CommandPalette
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelect={selectItem}
          />
        )}
      </React.Suspense>
    </div>
  );
};
