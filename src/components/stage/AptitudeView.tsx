import React, { useEffect, useState } from 'react';
import {
  APTITUDE_CATEGORIES,
  APTITUDE_DEMO_QUESTION,
  APTITUDE_DURATIONS,
  APTITUDE_FAQS,
  APTITUDE_HOW_IT_WORKS,
  APTITUDE_STATS,
  AptitudeQuestion,
  drawMockQuestions,
} from '../../data/aptitudeData';

interface AptitudeViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onNavigateDSA: () => void;
  onNavigateSystemDesign: () => void;
  onNavigateDesignSystem: () => void;
}

interface PastAttempt {
  id: string;
  categorySlug: string;
  categoryLabel: string;
  durationMinutes: number;
  totalQuestions: number;
  score: number;
  answeredCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  questions: AptitudeQuestion[];
  answers: Record<number, number>;
}

const STORAGE_KEY_HISTORY = 'dpc_aptitude_history_v1';

function formatTimer(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const AptitudeView: React.FC<AptitudeViewProps> = ({
  theme,
  onToggleTheme,
  onNavigateHome,
  onNavigateDSA,
  onNavigateSystemDesign,
  onNavigateDesignSystem,
}) => {
  // Hero live demo state (matches module 17077 AptitudeDemo from dsa.chaicode.com/aptitude)
  const [demoSeconds, setDemoSeconds] = useState<number>(768); // 12:48
  const [demoStep, setDemoStep] = useState<0 | 1 | 2>(2);
  const [demoUserChoice, setDemoUserChoice] = useState<number | null>(null);

  // StartPanel state (matches module 19589 StartPanel)
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<15 | 30>(15);

  // View mode: 'landing' | 'exam' | 'review' | 'history'
  const [viewMode, setViewMode] = useState<'landing' | 'exam' | 'review' | 'history'>('landing');

  // Active exam state
  const [examQuestions, setExamQuestions] = useState<AptitudeQuestion[]>([]);
  const [examCategoryLabel, setExamCategoryLabel] = useState<string>('Random mix');
  const [examCategorySlug, setExamCategorySlug] = useState<string>('');
  const [examDurationMinutes, setExamDurationMinutes] = useState<15 | 30>(15);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(15 * 60);
  const [examInProgress, setExamInProgress] = useState<boolean>(false);
  const [instantReveal, setInstantReveal] = useState<boolean>(false);

  // Past attempts history
  const [pastAttempts, setPastAttempts] = useState<PastAttempt[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Hero demo animation loop (identical 9-second cycle as dsa.chaicode.com/aptitude)
  useEffect(() => {
    let tick = 0;
    const timer = window.setInterval(() => {
      tick = (tick + 1) % 9;
      setDemoSeconds((prev) => (prev <= 700 ? 768 : prev - 1));
      if (demoUserChoice === null) {
        setDemoStep(tick < 2 ? 0 : tick < 4 ? 1 : 2);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [demoUserChoice]);

  // Live exam countdown timer
  useEffect(() => {
    if (viewMode !== 'exam' || !examInProgress) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleFinishExam(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [viewMode, examInProgress]);

  const activeDurationObj =
    APTITUDE_DURATIONS.find((d) => d.minutes === selectedMinutes) || APTITUDE_DURATIONS[0];

  const handleStartMock = (overrideCategorySlug?: string, overrideMinutes?: 15 | 30) => {
    const catSlug = overrideCategorySlug !== undefined ? overrideCategorySlug : selectedCategory;
    const mins = overrideMinutes !== undefined ? overrideMinutes : selectedMinutes;
    const durObj = APTITUDE_DURATIONS.find((d) => d.minutes === mins) || APTITUDE_DURATIONS[0];
    const catObj = APTITUDE_CATEGORIES.find((c) => c.slug === catSlug);
    const label = catObj ? catObj.name : 'Random mix';

    const drawn = drawMockQuestions(catSlug || null, durObj.questions);
    setExamQuestions(drawn);
    setExamCategorySlug(catSlug);
    setExamCategoryLabel(label);
    setExamDurationMinutes(mins);
    setCurrentIndex(0);
    setUserAnswers({});
    setRemainingSeconds(mins * 60);
    setExamInProgress(true);
    setInstantReveal(false);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishExam = (finalRemainingOverride?: number) => {
    const rem = finalRemainingOverride !== undefined ? finalRemainingOverride : remainingSeconds;
    const totalSecs = examDurationMinutes * 60;
    const spent = Math.max(1, totalSecs - rem);

    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    const attempt: PastAttempt = {
      id: `attempt-${Date.now()}`,
      categorySlug: examCategorySlug,
      categoryLabel: examCategoryLabel,
      durationMinutes: examDurationMinutes,
      totalQuestions: examQuestions.length,
      score,
      answeredCount: Object.keys(userAnswers).length,
      timeSpentSeconds: spent,
      completedAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      questions: examQuestions,
      answers: { ...userAnswers },
    };

    const updated = [attempt, ...pastAttempts].slice(0, 25);
    setPastAttempts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }

    setExamInProgress(false);
    setViewMode('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPastAttempt = (attempt: PastAttempt) => {
    setExamQuestions(attempt.questions);
    setExamCategorySlug(attempt.categorySlug);
    setExamCategoryLabel(attempt.categoryLabel);
    setExamDurationMinutes(attempt.durationMinutes as 15 | 30);
    setUserAnswers(attempt.answers);
    setCurrentIndex(0);
    setExamInProgress(false);
    setViewMode('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (viewMode !== 'landing') {
      setViewMode('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgb(var(--paper))',
        color: 'rgb(var(--ink))',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'clip',
      }}
    >
      {/* Top Studio Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid rgb(var(--ink) / 0.1)',
          background: 'rgb(var(--paper) / 0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={onNavigateHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgb(var(--accent) / 0.16)',
                  border: '1px solid rgb(var(--accent) / 0.45)',
                  color: 'rgb(var(--accent))',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                DP
              </span>
              <span>
                Don&apos;t Paper <span style={{ color: 'rgb(var(--accent))' }}>Prep</span>
              </span>
            </button>

            <nav
              aria-label="Primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={onNavigateDSA}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgb(var(--sketch))',
                }}
              >
                DSA Visual
              </button>
              <button
                onClick={onNavigateSystemDesign}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgb(var(--sketch))',
                }}
              >
                System Design
              </button>
              <button
                onClick={() => setViewMode('landing')}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'rgb(var(--accent))',
                  background: 'rgb(var(--accent) / 0.12)',
                }}
              >
                Aptitude
              </button>
              <button
                onClick={onNavigateDesignSystem}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgb(var(--sketch))',
                }}
              >
                Design System
              </button>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {examInProgress && viewMode !== 'exam' && (
              <button
                onClick={() => setViewMode('exam')}
                style={{
                  padding: '0.42rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgb(var(--accent))',
                  background: 'rgb(var(--accent) / 0.14)',
                  color: 'rgb(var(--accent))',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ⏱ Resume ({formatTimer(remainingSeconds)})
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'history' ? 'landing' : 'history')}
              style={{
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid rgb(var(--ink) / 0.14)',
                background:
                  viewMode === 'history' ? 'rgb(var(--ink) / 0.08)' : 'rgb(var(--surface))',
                color: 'rgb(var(--ink))',
                fontSize: '12.5px',
                fontWeight: 600,
              }}
            >
              Past attempts ({pastAttempts.length})
            </button>

            <button
              onClick={onToggleTheme}
              title="Toggle theme"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid rgb(var(--ink) / 0.14)',
                background: 'rgb(var(--surface))',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => scrollToSection('start')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                background: 'rgb(var(--ink))',
                color: 'rgb(var(--paper))',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Start a mock
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          VIEW MODE: ACTIVE TIMED MOCK EXAM OR POST-EXAM WORKED ANSWER REVIEW
         ===================================================================== */}
      {(viewMode === 'exam' || viewMode === 'review') && examQuestions.length > 0 && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          {/* Top Breadcrumb + Mode Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => setViewMode('landing')}
                style={{
                  fontSize: '13px',
                  color: 'rgb(var(--mute))',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                ← Back to Aptitude overview
              </button>
              <span style={{ color: 'rgb(var(--mute))' }}>·</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgb(var(--accent))' }}>
                {examCategoryLabel} ({examDurationMinutes} min · {examQuestions.length} questions)
              </span>
            </div>

            {viewMode === 'exam' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={() => setInstantReveal((v) => !v)}
                  style={{
                    padding: '0.38rem 0.75rem',
                    borderRadius: '7px',
                    border: `1px solid ${
                      instantReveal ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.16)'
                    }`,
                    background: instantReveal
                      ? 'rgb(var(--accent) / 0.14)'
                      : 'rgb(var(--surface))',
                    color: instantReveal ? 'rgb(var(--accent))' : 'rgb(var(--sketch))',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {instantReveal ? '✓ Instant worked answer ON' : 'Peek worked answer'}
                </button>
                <button
                  onClick={() => handleFinishExam()}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: 'rgb(var(--accent))',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  Submit paper
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={() => handleStartMock(examCategorySlug, examDurationMinutes)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: 'rgb(var(--ink))',
                    color: 'rgb(var(--paper))',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  Draw a fresh paper →
                </button>
              </div>
            )}
          </div>

          {/* Review Summary Banner when in 'review' mode */}
          {viewMode === 'review' && (
            <div
              className="ui-card"
              style={{
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid rgb(var(--accent) / 0.35)',
                background:
                  'linear-gradient(135deg, rgb(var(--accent) / 0.1), rgb(var(--surface)))',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1.25rem',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgb(var(--accent))',
                    fontWeight: 700,
                  }}
                >
                  Paper complete · Worked review
                </p>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  {
                    examQuestions.filter((q, idx) => userAnswers[idx] === q.correctIndex)
                      .length
                  }{' '}
                  / {examQuestions.length}{' '}
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgb(var(--mute))' }}>
                    correct
                  </span>
                </h2>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgb(var(--mute))' }}>Accuracy</div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    marginTop: '0.15rem',
                  }}
                >
                  {Math.round(
                    (examQuestions.filter((q, i) => userAnswers[i] === q.correctIndex).length /
                      examQuestions.length) *
                      100
                  )}
                  %
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgb(var(--mute))' }}>Attempted</div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    marginTop: '0.15rem',
                  }}
                >
                  {Object.keys(userAnswers).length} / {examQuestions.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgb(var(--mute))' }}>Marking scheme</div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgb(var(--sketch))',
                    marginTop: '0.25rem',
                  }}
                >
                  +1 correct · 0 negative
                </div>
              </div>
            </div>
          )}

          {/* Main Live Exam Card (Styled identically to dsa.chaicode.com/aptitude AptitudeDemo card) */}
          {(() => {
            const q = examQuestions[currentIndex];
            const selectedOpt = userAnswers[currentIndex];
            const showWorked =
              viewMode === 'review' || (instantReveal && selectedOpt !== undefined);

            return (
              <div
                className="ui-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  border: '1px solid rgb(var(--ink) / 0.14)',
                  background: 'rgb(var(--surface))',
                  boxShadow: '0 30px 80px -40px rgba(0, 0, 0, 0.55)',
                }}
              >
                {/* Header: Category + Live Countdown Timer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <p style={{ fontSize: '13px', color: 'rgb(var(--mute))', fontWeight: 500 }}>
                    Aptitude mock · {q.categoryName}
                  </p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '7px',
                      border: '1px solid rgb(var(--ink) / 0.18)',
                      padding: '0.22rem 0.6rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color:
                        viewMode === 'exam' && remainingSeconds < 120
                          ? 'rgb(var(--dead-stroke))'
                          : 'rgb(var(--ink))',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      style={{ color: 'rgb(var(--accent))' }}
                    >
                      <circle cx="12" cy="13" r="8" />
                      <path d="M12 9v4l2.5 1.5M9 2h6" />
                    </svg>
                    {viewMode === 'exam' ? formatTimer(remainingSeconds) : 'Submitted'}
                  </span>
                </div>

                {/* Segmented Question Bar */}
                <div
                  style={{
                    marginTop: '0.9rem',
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  {examQuestions.map((_, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isCorrectInReview =
                      viewMode === 'review' &&
                      userAnswers[idx] === examQuestions[idx].correctIndex;
                    const isWrongInReview =
                      viewMode === 'review' &&
                      isAnswered &&
                      userAnswers[idx] !== examQuestions[idx].correctIndex;

                    let bg = 'rgb(var(--ink) / 0.12)';
                    if (viewMode === 'review') {
                      if (isCorrectInReview) bg = 'rgb(var(--done-stroke))';
                      else if (isWrongInReview) bg = 'rgb(var(--dead-stroke))';
                      else if (isCurrent) bg = 'rgb(var(--accent))';
                    } else {
                      if (isCurrent) bg = 'rgb(var(--accent))';
                      else if (isAnswered) bg = 'rgb(var(--accent) / 0.55)';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        title={`Question ${idx + 1}`}
                        style={{
                          height: '6px',
                          flex: 1,
                          borderRadius: '999px',
                          background: bg,
                          outline: isCurrent ? '2px solid rgb(var(--ink) / 0.35)' : 'none',
                          transition: 'background 180ms ease',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Question Meta & Prompt */}
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgb(var(--mute))',
                    marginTop: '1.35rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Question {currentIndex + 1} of {examQuestions.length} · {q.topic}
                </p>

                <p
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '16.5px',
                    lineHeight: 1.65,
                    color: 'rgb(var(--ink))',
                    fontWeight: 500,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {q.question}
                </p>

                {/* 2x2 Options Grid */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.65rem',
                  }}
                >
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selectedOpt === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let borderColor = 'rgb(var(--ink) / 0.14)';
                    let bg = 'transparent';
                    let textColor = 'rgb(var(--sketch))';

                    if (showWorked) {
                      if (isCorrect) {
                        borderColor = 'rgb(var(--done-stroke))';
                        bg = 'rgb(var(--done-bg) / 0.55)';
                        textColor = 'rgb(var(--ink))';
                      } else if (isChosen && !isCorrect) {
                        borderColor = 'rgb(var(--dead-stroke))';
                        bg = 'rgb(var(--dead-bg) / 0.55)';
                        textColor = 'rgb(var(--ink))';
                      }
                    } else if (isChosen) {
                      borderColor = 'rgb(var(--accent))';
                      bg = 'rgb(var(--accent) / 0.12)';
                      textColor = 'rgb(var(--ink))';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          if (viewMode === 'review') return;
                          setUserAnswers((prev) => ({
                            ...prev,
                            [currentIndex]: optIdx,
                          }));
                        }}
                        style={{
                          textAlign: 'left',
                          borderRadius: '10px',
                          border: `1.5px solid ${borderColor}`,
                          background: bg,
                          color: textColor,
                          padding: '0.8rem 1rem',
                          fontSize: '14.5px',
                          fontWeight: isChosen || (showWorked && isCorrect) ? 600 : 500,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.6rem',
                          transition: 'all 180ms ease',
                        }}
                      >
                        <span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              color: 'rgb(var(--mute))',
                              marginRight: '0.65rem',
                              fontWeight: 700,
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </span>
                        {showWorked && isCorrect && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              color: 'rgb(var(--done-stroke))',
                              fontWeight: 700,
                            }}
                          >
                            ✓ Correct
                          </span>
                        )}
                        {showWorked && isChosen && !isCorrect && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              color: 'rgb(var(--dead-stroke))',
                              fontWeight: 700,
                            }}
                          >
                            ✗ Your pick
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Worked Answer Box */}
                {showWorked && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      borderRadius: '10px',
                      border: '1px solid rgb(var(--ink) / 0.14)',
                      background: 'rgb(var(--surface-alt))',
                      padding: '1rem 1.15rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color:
                          selectedOpt === q.correctIndex
                            ? 'rgb(var(--done-stroke))'
                            : 'rgb(var(--accent))',
                      }}
                    >
                      {selectedOpt === q.correctIndex
                        ? 'Correct · worked answer'
                        : selectedOpt === undefined
                        ? 'Unanswered · worked answer'
                        : `Incorrect (Option ${String.fromCharCode(
                            65 + q.correctIndex
                          )} is correct) · worked answer`}
                    </p>
                    <p
                      style={{
                        marginTop: '0.35rem',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'rgb(var(--sketch))',
                      }}
                    >
                      {q.workedAnswer}
                    </p>
                  </div>
                )}

                {/* Exam Navigation Footer */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.1rem',
                    borderTop: '1px solid rgb(var(--ink) / 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      style={{
                        padding: '0.48rem 0.9rem',
                        borderRadius: '8px',
                        border: '1px solid rgb(var(--ink) / 0.16)',
                        opacity: currentIndex === 0 ? 0.4 : 1,
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      ← Previous
                    </button>
                    {viewMode === 'exam' && selectedOpt !== undefined && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserAnswers((prev) => {
                            const next = { ...prev };
                            delete next[currentIndex];
                            return next;
                          });
                        }}
                        style={{
                          padding: '0.48rem 0.85rem',
                          borderRadius: '8px',
                          color: 'rgb(var(--mute))',
                          fontSize: '12.5px',
                        }}
                      >
                        Clear response
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {currentIndex < examQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((i) => Math.min(examQuestions.length - 1, i + 1))
                        }
                        style={{
                          padding: '0.5rem 1.1rem',
                          borderRadius: '8px',
                          background: 'rgb(var(--ink))',
                          color: 'rgb(var(--paper))',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        Next question →
                      </button>
                    ) : viewMode === 'exam' ? (
                      <button
                        type="button"
                        onClick={() => handleFinishExam()}
                        style={{
                          padding: '0.5rem 1.15rem',
                          borderRadius: '8px',
                          background: 'rgb(var(--accent))',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        Submit & see worked answers →
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* All Questions Quick Grid Navigator */}
          <div
            className="ui-card"
            style={{
              marginTop: '1.25rem',
              padding: '1.15rem 1.35rem',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(var(--mute))' }}>
                Question Navigator
              </span>
              <span style={{ fontSize: '12px', color: 'rgb(var(--mute))' }}>
                {Object.keys(userAnswers).length} of {examQuestions.length} answered
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {examQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = userAnswers[idx] !== undefined;
                const isCorrect =
                  viewMode === 'review' && userAnswers[idx] === q.correctIndex;
                const isWrong =
                  viewMode === 'review' && isAnswered && userAnswers[idx] !== q.correctIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: isCurrent
                        ? '2px solid rgb(var(--accent))'
                        : '1px solid rgb(var(--ink) / 0.14)',
                      background: isCorrect
                        ? 'rgb(var(--done-bg))'
                        : isWrong
                        ? 'rgb(var(--dead-bg))'
                        : isAnswered
                        ? 'rgb(var(--accent) / 0.16)'
                        : 'rgb(var(--surface-alt))',
                      color: isCorrect
                        ? 'rgb(var(--done-stroke))'
                        : isWrong
                        ? 'rgb(var(--dead-stroke))'
                        : isAnswered
                        ? 'rgb(var(--accent))'
                        : 'rgb(var(--sketch))',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW MODE: PAST ATTEMPTS HISTORY (/aptitude/history)
         ===================================================================== */}
      {viewMode === 'history' && (
        <main
          style={{
            flex: 1,
            maxWidth: '1120px',
            width: '100%',
            margin: '0 auto',
            padding: '2.5rem 1.5rem 4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgb(var(--accent))',
                }}
              >
                Aptitude history
              </p>
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  marginTop: '0.3rem',
                }}
              >
                Your past attempts.
              </h1>
              <p style={{ fontSize: '15px', color: 'rgb(var(--sketch))', marginTop: '0.4rem' }}>
                Every mock paper you sit is saved locally in your browser with full worked solutions.
              </p>
            </div>
            <button
              onClick={() => setViewMode('landing')}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '9px',
                background: 'rgb(var(--ink))',
                color: 'rgb(var(--paper))',
                fontSize: '13.5px',
                fontWeight: 700,
              }}
            >
              ← Back to Aptitude
            </button>
          </div>

          {pastAttempts.length === 0 ? (
            <div
              className="ui-card"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                borderRadius: '16px',
              }}
            >
              <p style={{ fontSize: '1.15rem', fontWeight: 700 }}>No mock attempts recorded yet</p>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgb(var(--mute))',
                  maxWidth: '420px',
                  margin: '0.5rem auto 1.5rem',
                  lineHeight: 1.6,
                }}
              >
                Sit a 15-minute or 30-minute paper to benchmark your accuracy and unlock full worked-answer reviews.
              </p>
              <button
                onClick={() => {
                  setViewMode('landing');
                  setTimeout(() => scrollToSection('start'), 60);
                }}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: '9px',
                  background: 'rgb(var(--ink))',
                  color: 'rgb(var(--paper))',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Sit your first mock →
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {pastAttempts.map((attempt) => {
                const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);
                return (
                  <div
                    key={attempt.id}
                    className="ui-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px' }}>
                          {attempt.categoryLabel}
                        </span>
                        <span className="ui-chip">
                          {attempt.durationMinutes} min · {attempt.totalQuestions} Qs
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '12.5px',
                          color: 'rgb(var(--mute))',
                          marginTop: '0.3rem',
                        }}
                      >
                        Completed {attempt.completedAt} · Time spent:{' '}
                        {formatTimer(attempt.timeSpentSeconds)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: 'rgb(var(--ink))',
                          }}
                        >
                          {attempt.score}/{attempt.totalQuestions}{' '}
                          <span style={{ fontSize: '13px', color: 'rgb(var(--accent))' }}>
                            ({pct}%)
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'rgb(var(--mute))' }}>
                          {attempt.answeredCount} attempted
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenPastAttempt(attempt)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid rgb(var(--ink) / 0.18)',
                          background: 'rgb(var(--surface-alt))',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        Review worked answers →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW MODE: MAIN /aptitude LANDING PAGE (1:1 WITH dsa.chaicode.com/aptitude)
         ===================================================================== */}
      {viewMode === 'landing' && (
        <main style={{ flex: 1 }}>
          {/* SECTION 1: HERO + ANIMATED APTITUDE DEMO CARD */}
          <section
            style={{
              position: 'relative',
              background:
                'radial-gradient(65% 55% at 62% 18%, rgb(var(--accent) / 0.14), transparent 72%)',
            }}
          >
            {/* Subtle dot pattern */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage:
                  'radial-gradient(rgb(var(--ink) / 0.1) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                maskImage:
                  'radial-gradient(ellipse 80% 70% at 50% 35%, #000 40%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 70% at 50% 35%, #000 40%, transparent 100%)',
              }}
            />

            <div
              style={{
                position: 'relative',
                maxWidth: '1240px',
                margin: '0 auto',
                padding: '4.25rem 1.5rem 4.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                alignItems: 'center',
                gap: '3rem',
              }}
            >
              {/* Hero Left Copy */}
              <div>
                <p
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgb(var(--accent))',
                    letterSpacing: '0.01em',
                  }}
                >
                  Aptitude practice
                </p>
                <h1
                  style={{
                    marginTop: '1rem',
                    fontSize: 'clamp(2.5rem, 5.2vw, 4.1rem)',
                    fontWeight: 800,
                    lineHeight: 1.06,
                    letterSpacing: '-0.035em',
                    color: 'rgb(var(--ink))',
                  }}
                >
                  Sit the paper{' '}
                  <span style={{ color: 'rgb(var(--accent))' }}>before it sits you</span>.
                </h1>
                <p
                  style={{
                    marginTop: '1.5rem',
                    maxWidth: '36rem',
                    fontSize: '1.08rem',
                    lineHeight: 1.68,
                    color: 'rgb(var(--sketch))',
                  }}
                >
                  Timed mock tests across the categories placement rounds actually test. Fifteen
                  minutes or thirty, one category or a random mix, and every question comes back
                  afterwards with the correct answer and the working behind it.
                </p>

                <div
                  style={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <button
                    onClick={() => scrollToSection('start')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.8rem 1.4rem',
                      borderRadius: '10px',
                      background: 'rgb(var(--ink))',
                      color: 'rgb(var(--paper))',
                      fontSize: '14.5px',
                      fontWeight: 700,
                    }}
                  >
                    Start a mock
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => scrollToSection('categories')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.8rem 1.35rem',
                      borderRadius: '10px',
                      border: '1px solid rgb(var(--ink) / 0.16)',
                      background: 'rgb(var(--surface) / 0.6)',
                      color: 'rgb(var(--ink))',
                      fontSize: '14.5px',
                      fontWeight: 600,
                    }}
                  >
                    See the categories
                  </button>
                </div>

                <p style={{ marginTop: '1.25rem', fontSize: '13px', color: 'rgb(var(--mute))' }}>
                  <button
                    onClick={() => setViewMode('history')}
                    style={{
                      color: 'rgb(var(--mute))',
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                  >
                    Your past attempts
                  </button>
                </p>
              </div>

              {/* Hero Right: Live Animated AptitudeDemo Card */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  className="ui-card"
                  style={{
                    width: '100%',
                    maxWidth: '30rem',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    background: 'rgb(var(--surface))',
                    border: '1px solid rgb(var(--ink) / 0.13)',
                    boxShadow: '0 30px 80px -40px rgba(0, 0, 0, 0.6)',
                    userSelect: 'none',
                  }}
                >
                  {/* Card Top Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                      Aptitude mock · Quantitative
                    </p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.38rem',
                        borderRadius: '6px',
                        border: '1px solid rgb(var(--ink) / 0.18)',
                        padding: '0.15rem 0.5rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'rgb(var(--ink))',
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        aria-hidden="true"
                        style={{ color: 'rgb(var(--accent))' }}
                      >
                        <circle cx="12" cy="13" r="8" />
                        <path d="M12 9v4l2.5 1.5M9 2h6" />
                      </svg>
                      {formatTimer(demoSeconds)}
                    </span>
                  </div>

                  {/* 30-Segment Progress Bar */}
                  <div
                    aria-hidden="true"
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {Array.from({ length: 30 }, (_, idx) => (
                      <span
                        key={idx}
                        style={{
                          height: '4px',
                          flex: 1,
                          borderRadius: '999px',
                          background:
                            idx < 6
                              ? 'rgb(var(--accent))'
                              : idx === 6
                              ? 'rgb(var(--accent) / 0.5)'
                              : 'rgb(var(--ink) / 0.12)',
                        }}
                      />
                    ))}
                  </div>

                  {/* Question Header & Prompt */}
                  <p style={{ fontSize: '13px', color: 'rgb(var(--mute))', marginTop: '1.25rem' }}>
                    Question 7 of 30 · {APTITUDE_DEMO_QUESTION.topic}
                  </p>
                  <p
                    style={{
                      marginTop: '0.38rem',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: 'rgb(var(--ink))',
                    }}
                  >
                    {APTITUDE_DEMO_QUESTION.question}
                  </p>

                  {/* 2x2 Options */}
                  <div
                    style={{
                      marginTop: '1rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                    }}
                  >
                    {APTITUDE_DEMO_QUESTION.options.map((opt, idx) => {
                      const activeIndex =
                        demoUserChoice !== null
                          ? demoUserChoice
                          : demoStep >= 1
                          ? APTITUDE_DEMO_QUESTION.correctIndex
                          : -1;
                      const isSelected = activeIndex === idx;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setDemoUserChoice(idx);
                            setDemoStep(2);
                          }}
                          style={{
                            textAlign: 'left',
                            borderRadius: '8px',
                            border: isSelected
                              ? '1px solid rgb(var(--accent))'
                              : '1px solid rgb(var(--ink) / 0.12)',
                            background: isSelected
                              ? 'rgb(var(--accent) / 0.12)'
                              : 'transparent',
                            color: isSelected ? 'rgb(var(--ink))' : 'rgb(var(--sketch))',
                            padding: '0.62rem 0.75rem',
                            fontSize: '14px',
                            transition: 'all 300ms ease',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              color: 'rgb(var(--mute))',
                              marginRight: '0.5rem',
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Worked Answer Reveal */}
                  <div
                    style={{
                      marginTop: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgb(var(--ink) / 0.12)',
                      padding: '0.75rem 0.88rem',
                      transition: 'all 500ms ease',
                      opacity: demoStep === 2 ? 1 : 0,
                      transform: demoStep === 2 ? 'translateY(0)' : 'translateY(4px)',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: 'rgb(var(--accent))', fontWeight: 600 }}>
                      {demoUserChoice !== null &&
                      demoUserChoice !== APTITUDE_DEMO_QUESTION.correctIndex
                        ? 'Option C is correct · worked answer'
                        : 'Correct · worked answer'}
                    </p>
                    <p
                      style={{
                        marginTop: '0.25rem',
                        fontSize: '13.5px',
                        lineHeight: 1.55,
                        color: 'rgb(var(--sketch))',
                      }}
                    >
                      {APTITUDE_DEMO_QUESTION.workedAnswer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: 4-COLUMN STATS STRIP */}
          <section
            style={{
              borderTop: '1px solid rgb(var(--ink) / 0.1)',
              borderBottom: '1px solid rgb(var(--ink) / 0.1)',
            }}
          >
            <div
              style={{
                maxWidth: '1240px',
                margin: '0 auto',
                padding: '0 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              {APTITUDE_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '1.75rem 1.25rem',
                    borderLeft: idx > 0 ? '1px solid rgb(var(--ink) / 0.1)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(1.85rem, 3vw, 2.5rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      fontFamily: 'var(--font-mono)',
                      color: 'rgb(var(--ink))',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgb(var(--mute))', marginTop: '0.25rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: #start — START A MOCK INTERACTIVE PANEL */}
          <section id="start" style={{ padding: '4.5rem 1.5rem' }}>
            <div
              style={{
                maxWidth: '1240px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2.5rem',
                alignItems: 'start',
              }}
            >
              {/* Left Description */}
              <div style={{ maxWidth: '34rem' }}>
                <p
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgb(var(--accent))',
                  }}
                >
                  Start a mock
                </p>
                <h2
                  style={{
                    marginTop: '0.75rem',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.12,
                  }}
                >
                  Choose a category and a length.
                </h2>
                <p
                  style={{
                    marginTop: '1rem',
                    fontSize: '1.02rem',
                    lineHeight: 1.65,
                    color: 'rgb(var(--sketch))',
                  }}
                >
                  Drill one category until it is easy, or take a random mix to rehearse the real
                  paper. A fresh paper is drawn every time.
                </p>
              </div>

              {/* Right StartPanel Card */}
              <div
                className="ui-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  background: 'rgb(var(--surface))',
                  border: '1px solid rgb(var(--ink) / 0.13)',
                  boxShadow: '0 30px 80px -40px rgba(0, 0, 0, 0.45)',
                }}
              >
                <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgb(var(--ink))' }}>
                  Start a mock
                </p>

                {/* Category Pill Selector */}
                <div style={{ marginTop: '1.1rem' }}>
                  <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>Category</span>
                  <div
                    style={{
                      marginTop: '0.55rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('')}
                      style={{
                        borderRadius: '999px',
                        padding: '0.42rem 0.85rem',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        border:
                          selectedCategory === ''
                            ? '1px solid rgb(var(--accent))'
                            : '1px solid rgb(var(--ink) / 0.14)',
                        background:
                          selectedCategory === ''
                            ? 'rgb(var(--accent) / 0.15)'
                            : 'transparent',
                        color:
                          selectedCategory === ''
                            ? 'rgb(var(--accent))'
                            : 'rgb(var(--mute))',
                        transition: 'all 150ms ease',
                      }}
                    >
                      Random mix
                    </button>

                    {APTITUDE_CATEGORIES.map((cat) => {
                      const active = selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => setSelectedCategory(cat.slug)}
                          style={{
                            borderRadius: '999px',
                            padding: '0.42rem 0.85rem',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            border: active
                              ? '1px solid rgb(var(--accent))'
                              : '1px solid rgb(var(--ink) / 0.14)',
                            background: active ? 'rgb(var(--accent) / 0.15)' : 'transparent',
                            color: active ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                            transition: 'all 150ms ease',
                          }}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Selector */}
                <div style={{ marginTop: '1.35rem' }}>
                  <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>Duration</span>
                  <div
                    style={{
                      marginTop: '0.55rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    {APTITUDE_DURATIONS.map((dur) => {
                      const active = selectedMinutes === dur.minutes;
                      return (
                        <button
                          key={dur.minutes}
                          type="button"
                          onClick={() => setSelectedMinutes(dur.minutes)}
                          style={{
                            borderRadius: '9px',
                            padding: '0.55rem 1rem',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            border: active
                              ? '1px solid rgb(var(--accent))'
                              : '1px solid rgb(var(--ink) / 0.14)',
                            background: active ? 'rgb(var(--accent) / 0.15)' : 'transparent',
                            color: active ? 'rgb(var(--accent))' : 'rgb(var(--mute))',
                            transition: 'all 150ms ease',
                          }}
                        >
                          {dur.minutes} min · {dur.questions} questions
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start Action Bar */}
                <div
                  style={{
                    marginTop: '1.6rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleStartMock()}
                    style={{
                      padding: '0.68rem 1.35rem',
                      borderRadius: '9px',
                      background: 'rgb(var(--ink))',
                      color: 'rgb(var(--paper))',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    Start {selectedMinutes}-minute mock
                  </button>
                  <span style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
                    {activeDurationObj.questions} questions · no negative marking
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: #categories — THE PLACEMENT-STANDARD SET */}
          <section
            id="categories"
            style={{
              padding: '4.5rem 1.5rem',
              borderTop: '1px solid rgb(var(--ink) / 0.1)',
            }}
          >
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ maxWidth: '40rem' }}>
                <p
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgb(var(--accent))',
                  }}
                >
                  The categories
                </p>
                <h2
                  style={{
                    marginTop: '0.75rem',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                  }}
                >
                  The placement-standard set.
                </h2>
                <p
                  style={{
                    marginTop: '0.85rem',
                    fontSize: '1.02rem',
                    lineHeight: 1.65,
                    color: 'rgb(var(--sketch))',
                  }}
                >
                  Pick one to drill it, or take a random mix to simulate the real paper.
                </p>
              </div>

              <ol
                style={{
                  listStyle: 'none',
                  marginTop: '2.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
                  gap: '1rem',
                }}
              >
                {APTITUDE_CATEGORIES.map((cat) => (
                  <li key={cat.slug} style={{ height: '100%' }}>
                    <div
                      className="ui-card"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        scrollToSection('start');
                      }}
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.35rem',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'border-color 160ms ease, transform 160ms ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent))',
                          }}
                        >
                          {cat.number}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartMock(cat.slug, selectedMinutes);
                          }}
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'rgb(var(--accent))',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            background: 'rgb(var(--accent) / 0.12)',
                          }}
                        >
                          Drill →
                        </button>
                      </div>

                      <h3
                        style={{
                          marginTop: '0.6rem',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'rgb(var(--ink))',
                        }}
                      >
                        {cat.name}
                      </h3>

                      <p
                        style={{
                          marginTop: '0.45rem',
                          fontSize: '14px',
                          lineHeight: 1.58,
                          color: 'rgb(var(--sketch))',
                        }}
                      >
                        {cat.blurb}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
                        <div
                          aria-hidden="true"
                          style={{
                            height: '4px',
                            borderRadius: '999px',
                            background: 'rgb(var(--ink) / 0.1)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${cat.barWidthPercent}%`,
                              borderRadius: '999px',
                              background: 'rgb(var(--accent) / 0.75)',
                            }}
                          />
                        </div>
                        <p
                          style={{
                            marginTop: '0.5rem',
                            fontSize: '12.5px',
                            fontFamily: 'var(--font-mono)',
                            color: 'rgb(var(--mute))',
                          }}
                        >
                          {cat.liveQuestions} questions
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* SECTION 5: HOW A MOCK WORKS */}
          <section
            style={{
              padding: '4.5rem 1.5rem',
              borderTop: '1px solid rgb(var(--ink) / 0.1)',
            }}
          >
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ maxWidth: '40rem' }}>
                <p
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgb(var(--accent))',
                  }}
                >
                  How a mock works
                </p>
                <h2
                  style={{
                    marginTop: '0.75rem',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Practise the way the real round runs.
                </h2>
                <p
                  style={{
                    marginTop: '0.85rem',
                    fontSize: '1.02rem',
                    lineHeight: 1.65,
                    color: 'rgb(var(--sketch))',
                  }}
                >
                  The same pressure as the placement test, with a full review at the end so every
                  mistake teaches you something.
                </p>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  marginTop: '3rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '2rem',
                }}
              >
                {APTITUDE_HOW_IT_WORKS.map((item) => (
                  <li key={item.title}>
                    <span
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgb(var(--accent) / 0.12)',
                        color: 'rgb(var(--accent))',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {item.icon === 'clock' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="13" r="8" />
                          <path d="M12 9v4l2.5 1.5M9 2h6" />
                        </svg>
                      )}
                      {item.icon === 'target' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="5" />
                          <circle cx="12" cy="12" r="1" />
                        </svg>
                      )}
                      {item.icon === 'doc' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                          <path d="M14 3v5h5M9 13h6M9 17h4" />
                        </svg>
                      )}
                      {item.icon === 'chart' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />
                        </svg>
                      )}
                    </span>

                    <p
                      style={{
                        marginTop: '0.85rem',
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        color: 'rgb(var(--ink))',
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        marginTop: '0.35rem',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'rgb(var(--sketch))',
                      }}
                    >
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 6: QUESTIONS / FAQ */}
          <section
            style={{
              padding: '4.5rem 1.5rem',
              borderTop: '1px solid rgb(var(--ink) / 0.1)',
            }}
          >
            <div
              style={{
                maxWidth: '1240px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                alignItems: 'start',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgb(var(--accent))',
                  }}
                >
                  Questions
                </p>
                <h2
                  style={{
                    marginTop: '0.75rem',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Good to know.
                </h2>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgb(var(--ink) / 0.12)',
                  borderBottom: '1px solid rgb(var(--ink) / 0.12)',
                }}
              >
                {APTITUDE_FAQS.map((faq, idx) => (
                  <details
                    key={faq.question}
                    style={{
                      padding: '1.25rem 0',
                      borderTop: idx > 0 ? '1px solid rgb(var(--ink) / 0.1)' : 'none',
                    }}
                  >
                    <summary
                      style={{
                        cursor: 'pointer',
                        listStyle: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'rgb(var(--ink))',
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '999px',
                          border: '1px solid rgb(var(--ink) / 0.18)',
                          color: 'rgb(var(--mute))',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <div
                      style={{
                        marginTop: '0.75rem',
                        fontSize: '14.5px',
                        lineHeight: 1.65,
                        color: 'rgb(var(--sketch))',
                        maxWidth: '42rem',
                      }}
                    >
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: BOTTOM CALL TO ACTION CARD */}
          <section
            style={{
              padding: '5rem 1.5rem',
              borderTop: '1px solid rgb(var(--ink) / 0.1)',
            }}
          >
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '24px',
                  border: '1px solid rgb(var(--ink) / 0.16)',
                  padding: '4rem 1.5rem',
                  textAlign: 'center',
                  background:
                    'radial-gradient(60% 70% at 50% 0%, rgb(var(--accent) / 0.14), rgb(var(--surface)))',
                }}
              >
                <svg
                  width="80"
                  height="40"
                  viewBox="0 0 80 40"
                  style={{ margin: '0 auto', color: 'rgb(var(--mute))' }}
                  aria-hidden="true"
                >
                  <path
                    d="M22 38c-6-6 6-10 0-16s6-10 0-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 38c-6-6 6-10 0-16s6-10 0-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M58 38c-6-6 6-10 0-16s6-10 0-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <h2
                  style={{
                    marginTop: '1rem',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Sit one paper today.
                </h2>
                <p
                  style={{
                    maxWidth: '34rem',
                    margin: '0.85rem auto 0',
                    fontSize: '1.04rem',
                    lineHeight: 1.65,
                    color: 'rgb(var(--sketch))',
                  }}
                >
                  15 minutes is enough to find out where you stand. The review afterwards tells you
                  what to work on next.
                </p>

                <div
                  style={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <button
                    onClick={() => scrollToSection('start')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1.45rem',
                      borderRadius: '10px',
                      background: 'rgb(var(--ink))',
                      color: 'rgb(var(--paper))',
                      fontSize: '14.5px',
                      fontWeight: 700,
                    }}
                  >
                    Start a mock
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setViewMode('history')}
                    style={{
                      padding: '0.8rem 1.35rem',
                      borderRadius: '10px',
                      border: '1px solid rgb(var(--ink) / 0.16)',
                      background: 'rgb(var(--surface))',
                      color: 'rgb(var(--ink))',
                      fontSize: '14.5px',
                      fontWeight: 600,
                    }}
                  >
                    Your past attempts
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};
