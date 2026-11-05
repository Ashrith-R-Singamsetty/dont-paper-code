import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Download,
  Flame,
  Moon,
  Play,
  RotateCcw,
  Sparkles,
  Sun,
  Trophy,
  Upload,
} from 'lucide-react';
import { DSA_PATTERNS, DSA_PROBLEMS } from '../../data/dsaProblems';
import { SYSTEM_DESIGN_LESSONS, SYSTEM_DESIGN_MODULES } from '../../data/systemDesignLessons';
import { CURATED_PLAYLISTS } from '../../data/playlists';
import { TrackKind } from '../../types/curriculum';

export interface SpacedItem {
  problemId: string;
  repetition: number;
  intervalDays: number;
  lastReviewedAt: number;
  nextReviewAt: number;
}

const STORAGE_SPACED = 'dpc:spaced_repetition';
const INTERVALS = [1, 3, 7, 16, 35, 90];

interface ProgressDashboardProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (path: string) => void;
  onLaunchWorkspace: (track: TrackKind, itemId: string) => void;
  solvedIds: Set<string>;
  onMarkSolved: (id: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  theme,
  onToggleTheme,
  onNavigate,
  onLaunchWorkspace,
  solvedIds,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'spaced-repetition' | 'playlists'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Spaced Repetition state
  const [spacedMap, setSpacedMap] = useState<Record<string, SpacedItem>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SPACED);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Ensure all solved problems have an initial spaced repetition entry
  const initializedSpaced = useMemo(() => {
    const nextMap = { ...spacedMap };
    let changed = false;
    const now = Date.now();

    solvedIds.forEach((id) => {
      if (!nextMap[id]) {
        nextMap[id] = {
          problemId: id,
          repetition: 1,
          intervalDays: 1,
          lastReviewedAt: now,
          nextReviewAt: now + 1 * 24 * 60 * 60 * 1000,
        };
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(STORAGE_SPACED, JSON.stringify(nextMap));
    }
    return nextMap;
  }, [solvedIds, spacedMap]);

  const handleReviewStep = (problemId: string, success: boolean) => {
    setSpacedMap((prev) => {
      const current = prev[problemId] ?? {
        problemId,
        repetition: 0,
        intervalDays: 1,
        lastReviewedAt: Date.now(),
        nextReviewAt: Date.now(),
      };

      const nextRep = success ? current.repetition + 1 : 1;
      const nextInterval = INTERVALS[Math.min(INTERVALS.length - 1, nextRep)];
      const now = Date.now();

      const updated: SpacedItem = {
        problemId,
        repetition: nextRep,
        intervalDays: nextInterval,
        lastReviewedAt: now,
        nextReviewAt: now + nextInterval * 24 * 60 * 60 * 1000,
      };

      const nextMap = { ...prev, [problemId]: updated };
      localStorage.setItem(STORAGE_SPACED, JSON.stringify(nextMap));
      showToast(
        success
          ? `Marked reviewed! Next review in ${nextInterval} days.`
          : 'Reset to active review queue (1 day).'
      );
      return nextMap;
    });
  };

  // Group problems by Spaced Repetition status
  const now = Date.now();
  const dueToday: SpacedItem[] = [];
  const upcoming: SpacedItem[] = [];
  const mastered: SpacedItem[] = [];

  Object.values(initializedSpaced).forEach((item) => {
    if (item.nextReviewAt <= now + 12 * 60 * 60 * 1000) {
      dueToday.push(item);
    } else if (item.intervalDays >= 7) {
      mastered.push(item);
    } else {
      upcoming.push(item);
    }
  });

  // Calculate high-level progress stats
  const totalDsa = DSA_PROBLEMS.length;
  const solvedDsaCount = DSA_PROBLEMS.filter((p) => solvedIds.has(p.id)).length;
  const dsaPercent = Math.round((solvedDsaCount / totalDsa) * 100);

  const totalSd = SYSTEM_DESIGN_LESSONS.length;
  const solvedSdCount = SYSTEM_DESIGN_LESSONS.filter((l) => solvedIds.has(l.id)).length;
  const sdPercent = Math.round((solvedSdCount / totalSd) * 100);

  const totalProblems = totalDsa + totalSd;
  const totalSolved = solvedDsaCount + solvedSdCount;
  const overallPercent = Math.round((totalSolved / totalProblems) * 100);

  // Export progress as JSON file
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      solvedIds: Array.from(solvedIds),
      spacedRepetition: initializedSpaced,
      theme,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dont-paper-code-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress backup downloaded successfully!');
  };

  // Import progress from JSON file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        if (Array.isArray(raw.solvedIds)) {
          localStorage.setItem('dpc:solved', JSON.stringify(raw.solvedIds));
          if (raw.spacedRepetition) {
            localStorage.setItem(STORAGE_SPACED, JSON.stringify(raw.spacedRepetition));
          }
          showToast(`Successfully restored ${raw.solvedIds.length} solved problems!`);
          setTimeout(() => window.location.reload(), 1200);
        } else {
          alert('Invalid backup file format: missing solvedIds array.');
        }
      } catch {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="nav-link"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BarChart3 size={16} style={{ color: 'rgb(var(--accent))' }} />
              <h1 style={{ fontFamily: 'var(--font-hand)', fontWeight: 800, fontSize: '1.1rem' }}>
                Candidate Progress &amp; Recall
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('/dsa')}
              className="nav-link"
            >
              <Code2 size={14} style={{ color: 'rgb(var(--accent))' }} />
              <span>DSA Stages</span>
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
              onClick={onToggleTheme}
              className="nav-icon-btn"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1220px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 3.5rem' }}>
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 100,
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              background: 'rgb(var(--ink))',
              color: 'rgb(var(--paper))',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <CheckCircle2 size={14} style={{ color: 'rgb(var(--done-stroke))' }} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* High-Level Mastery Metric Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Completion Card */}
          <div className="sketch-border-soft" style={{ background: 'rgb(var(--surface))', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', fontWeight: 600 }}>OVERALL MASTERY</span>
              <Award size={16} style={{ color: 'rgb(var(--accent))' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '2.2rem', fontWeight: 800 }}>
                {overallPercent}%
              </span>
              <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                ({totalSolved}/{totalProblems} solved)
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${overallPercent}%`, height: '100%', background: 'rgb(var(--accent))', transition: 'width 300ms ease' }} />
            </div>
          </div>

          {/* DSA Patterns Card */}
          <div className="sketch-border-soft" style={{ background: 'rgb(var(--surface))', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', fontWeight: 600 }}>DSA PATTERNS</span>
              <Code2 size={16} style={{ color: 'rgb(var(--accent))' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '2.2rem', fontWeight: 800 }}>
                {solvedDsaCount}
              </span>
              <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                / {totalDsa} stages ({dsaPercent}%)
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${dsaPercent}%`, height: '100%', background: 'rgb(var(--accent))', transition: 'width 300ms ease' }} />
            </div>
          </div>

          {/* System Design Card */}
          <div className="sketch-border-soft" style={{ background: 'rgb(var(--surface))', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', fontWeight: 600 }}>SYSTEM DESIGN</span>
              <Cpu size={16} style={{ color: 'rgb(var(--accent2))' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '2.2rem', fontWeight: 800 }}>
                {solvedSdCount}
              </span>
              <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                / {totalSd} lessons ({sdPercent}%)
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${sdPercent}%`, height: '100%', background: 'rgb(var(--accent2))', transition: 'width 300ms ease' }} />
            </div>
          </div>

          {/* Spaced Recall Due Card */}
          <div className="sketch-border-soft" style={{ background: 'rgb(var(--surface))', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', fontWeight: 600 }}>SPACED RECALL QUEUE</span>
              <Clock size={16} style={{ color: dueToday.length > 0 ? '#ef4444' : 'rgb(var(--done-stroke))' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '2.2rem', fontWeight: 800 }}>
                {dueToday.length}
              </span>
              <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                due for review today
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgb(var(--sketch))' }}>
              {mastered.length} mastered · {upcoming.length} upcoming
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Backup Controls Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgb(var(--ink) / 0.08)',
          }}
        >
          {/* Tab Switcher */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              background: 'rgb(var(--surface-alt))',
              border: '1px solid rgb(var(--ink) / 0.1)',
              borderRadius: '9px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '0.42rem 0.9rem',
                fontSize: '13px',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                borderRadius: '7px',
                background: activeTab === 'overview' ? 'rgb(var(--surface))' : 'transparent',
                color: activeTab === 'overview' ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                border: activeTab === 'overview' ? '1px solid rgb(var(--ink) / 0.12)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              Pattern Mastery Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('spaced-repetition')}
              style={{
                padding: '0.42rem 0.9rem',
                fontSize: '13px',
                fontWeight: activeTab === 'spaced-repetition' ? 700 : 500,
                borderRadius: '7px',
                background: activeTab === 'spaced-repetition' ? 'rgb(var(--surface))' : 'transparent',
                color: activeTab === 'spaced-repetition' ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                border: activeTab === 'spaced-repetition' ? '1px solid rgb(var(--ink) / 0.12)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Spaced Recall Queue</span>
              {dueToday.length > 0 && (
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  {dueToday.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('playlists')}
              style={{
                padding: '0.42rem 0.9rem',
                fontSize: '13px',
                fontWeight: activeTab === 'playlists' ? 700 : 500,
                borderRadius: '7px',
                background: activeTab === 'playlists' ? 'rgb(var(--surface))' : 'transparent',
                color: activeTab === 'playlists' ? 'rgb(var(--ink))' : 'rgb(var(--mute))',
                border: activeTab === 'playlists' ? '1px solid rgb(var(--ink) / 0.12)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              Curated Playlists
            </button>
          </div>

          {/* Backup & Restore Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handleExportBackup}
              className="sketch-border-soft"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.38rem 0.75rem',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgb(var(--surface))',
                cursor: 'pointer',
              }}
              title="Download your solved problems & review intervals as JSON"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </button>

            <label
              className="sketch-border-soft"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.38rem 0.75rem',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgb(var(--surface))',
                cursor: 'pointer',
              }}
              title="Restore previous progress from a JSON backup file"
            >
              <Upload size={13} />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Tab 1: Pattern Mastery Matrix */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              18 DSA Patterns Breakdown
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.85rem',
                marginBottom: '2.5rem',
              }}
            >
              {DSA_PATTERNS.map((pat) => {
                const problems = DSA_PROBLEMS.filter((p) => p.patternId === pat.id);
                const solvedCount = problems.filter((p) => solvedIds.has(p.id)).length;
                const percent = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

                return (
                  <div
                    key={pat.id}
                    className="sketch-border-soft curriculum-card"
                    style={{ background: 'rgb(var(--surface))', padding: '0.9rem 1rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--accent))', fontWeight: 700 }}>
                        {pat.number} · {pat.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>
                        {solvedCount}/{problems.length}
                      </span>
                    </div>

                    <div style={{ height: '4px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: percent === 100 ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent))',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onLaunchWorkspace('dsa', problems[0].id)}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: 'rgb(var(--accent))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <span>Jump to stage</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              10 System Design &amp; Architecture Modules
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {SYSTEM_DESIGN_MODULES.map((mod) => {
                const lessons = SYSTEM_DESIGN_LESSONS.filter((l) => l.moduleId === mod.id);
                const solvedCount = lessons.filter((l) => solvedIds.has(l.id)).length;
                const percent = lessons.length > 0 ? Math.round((solvedCount / lessons.length) * 100) : 0;

                return (
                  <div
                    key={mod.id}
                    className="sketch-border-soft curriculum-card"
                    style={{ background: 'rgb(var(--surface))', padding: '0.9rem 1rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--accent2))', fontWeight: 700 }}>
                        {mod.number} · {mod.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>
                        {solvedCount}/{lessons.length}
                      </span>
                    </div>

                    <div style={{ height: '4px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: percent === 100 ? 'rgb(var(--done-stroke))' : 'rgb(var(--accent2))',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onLaunchWorkspace('system-design', lessons[0].id)}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: 'rgb(var(--accent2))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <span>Jump to blueprint</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Spaced Recall Queue (SM-2 SuperMemo Engine) */}
        {activeTab === 'spaced-repetition' && (
          <div>
            <div style={{ marginBottom: '1.5rem', maxWidth: '720px' }}>
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', fontWeight: 800 }}>
                Spaced Repetition Active Recall Queue
              </h2>
              <p style={{ fontSize: '13px', color: 'rgb(var(--mute))', marginTop: '0.25rem', lineHeight: 1.5 }}>
                Retain algorithms permanently through scientifically spaced recall intervals (1d → 3d → 7d → 16d → 35d).
                Problems you review successfully move to longer intervals; problems you struggle with reset to tomorrow.
              </p>
            </div>

            {/* Section 1: Due Today */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: dueToday.length > 0 ? '#ef4444' : 'rgb(var(--done-stroke))',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {dueToday.length}
                </span>
                <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 800 }}>
                  Due for Review Today
                </h3>
              </div>

              {dueToday.length === 0 ? (
                <div
                  className="sketch-border-soft"
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'rgb(var(--surface))',
                    color: 'rgb(var(--mute))',
                    fontSize: '13px',
                  }}
                >
                  <CheckCircle2 size={24} style={{ color: 'rgb(var(--done-stroke))', margin: '0 auto 0.5rem' }} />
                  <div>All caught up! No algorithms due for review today.</div>
                  <div style={{ fontSize: '11.5px', marginTop: '0.25rem' }}>
                    Solve new problems to add them to your spaced recall queue.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
                  {dueToday.map((item) => {
                    const prob =
                      DSA_PROBLEMS.find((p) => p.id === item.problemId) ??
                      SYSTEM_DESIGN_LESSONS.find((l) => l.id === item.problemId);
                    if (!prob) return null;
                    const isDsa = Boolean(DSA_PROBLEMS.find((p) => p.id === item.problemId));

                    return (
                      <div
                        key={item.problemId}
                        className="sketch-border-soft"
                        style={{ background: 'rgb(var(--surface))', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--mute))' }}>
                              Repetition #{item.repetition} · Interval: {item.intervalDays}d
                            </div>
                            <h4 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 800, marginTop: '2px' }}>
                              {prob.title}
                            </h4>
                          </div>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              fontWeight: 700,
                              background: '#ef444422',
                              color: '#ef4444',
                            }}
                          >
                            DUE NOW
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => onLaunchWorkspace(isDsa ? 'dsa' : 'system-design', item.problemId)}
                            className="cc-btn-solid"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '12px' }}
                          >
                            <Play size={12} /> Practice Now
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewStep(item.problemId, true)}
                            className="sketch-border-soft"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '12px', fontWeight: 600, background: 'rgb(var(--paper))' }}
                            title="I remembered the approach cleanly (+interval)"
                          >
                            ✓ Remembered
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewStep(item.problemId, false)}
                            className="sketch-border-soft"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '12px', fontWeight: 600, background: 'rgb(var(--paper))' }}
                            title="I struggled or forgot (reset to 1d)"
                          >
                            <RotateCcw size={12} /> Forgot
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Upcoming in Next Days */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  Upcoming Reviews ({upcoming.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {upcoming.map((item) => {
                    const prob =
                      DSA_PROBLEMS.find((p) => p.id === item.problemId) ??
                      SYSTEM_DESIGN_LESSONS.find((l) => l.id === item.problemId);
                    if (!prob) return null;
                    const daysLeft = Math.max(1, Math.ceil((item.nextReviewAt - Date.now()) / (24 * 60 * 60 * 1000)));

                    return (
                      <div
                        key={item.problemId}
                        className="sketch-border-soft"
                        style={{ background: 'rgb(var(--surface))', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{prob.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgb(var(--mute))' }}>
                            Due in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                          </div>
                        </div>
                        <Calendar size={14} style={{ color: 'rgb(var(--mute))' }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Curated Playlists Completion */}
        {activeTab === 'playlists' && (
          <div>
            <div style={{ marginBottom: '1.5rem', maxWidth: '720px' }}>
              <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.35rem', fontWeight: 800 }}>
                Curated Study Tracks Progress
              </h2>
              <p style={{ fontSize: '13px', color: 'rgb(var(--mute))', marginTop: '0.25rem', lineHeight: 1.5 }}>
                Track your completion across high-yield curated playlists trusted by candidates aiming for top-tier tech offers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {CURATED_PLAYLISTS.map((pl) => {
                const totalInPl = pl.problemIds.length;
                const solvedInPl = pl.problemIds.filter((id) => solvedIds.has(id)).length;
                const percent = Math.round((solvedInPl / totalInPl) * 100);

                return (
                  <div
                    key={pl.id}
                    className="sketch-border-soft curriculum-card"
                    style={{ background: 'rgb(var(--surface))', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: `${pl.accentColor}18`,
                            color: pl.accentColor,
                            border: `1px solid ${pl.accentColor}35`,
                          }}
                        >
                          {pl.badge}
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem' }}>
                          {pl.title}
                        </h3>
                      </div>
                      <Trophy size={18} style={{ color: pl.accentColor }} />
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'rgb(var(--mute))', lineHeight: 1.45 }}>
                      {pl.tagline}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                        <span>Completion</span>
                        <span style={{ fontWeight: 700, color: pl.accentColor }}>
                          {solvedInPl}/{totalInPl} ({percent}%)
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgb(var(--ink) / 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: pl.accentColor, transition: 'width 300ms ease' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
