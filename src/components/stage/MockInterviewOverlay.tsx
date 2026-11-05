import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import { DsaStep } from '../../types/curriculum';

export interface MockInterviewStats {
  correctCount: number;
  totalQuestions: number;
  streak: number;
  maxStreak: number;
  timeSpentSeconds: number;
  completed: boolean;
}

interface MockInterviewOverlayProps {
  active: boolean;
  onExit: () => void;
  currentStepIdx: number;
  totalSteps: number;
  currentStep: DsaStep;
  nextStep?: DsaStep;
  onAdvanceStep: () => void;
  onLogSpacedRepetition?: () => void;
  problemTitle: string;
}

interface PredictionQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function derivePredictionQuestion(
  curr: DsaStep,
  next?: DsaStep,
  stepIdx = 0
): PredictionQuestion {
  if (!next) {
    return {
      prompt: 'Algorithm has reached its conclusion. What is the final returned outcome?',
      options: [
        'Return calculated indices / optimal answer',
        'Throw error / out of bounds exception',
        'Restart loop from index 0',
      ],
      correctIndex: 0,
      explanation: 'The loop invariants have satisfied termination conditions.',
    };
  }

  // Check pointer shifts between curr and next
  const currPointers = curr.pointers ?? [];
  const nextPointers = next.pointers ?? [];

  const currL = currPointers.find((p) => p.name === 'L')?.index;
  const nextL = nextPointers.find((p) => p.name === 'L')?.index;
  const currR = currPointers.find((p) => p.name === 'R')?.index;
  const nextR = nextPointers.find((p) => p.name === 'R')?.index;

  if (currL !== undefined && nextL !== undefined && nextL > currL) {
    return {
      prompt: 'Look at the current state. What is the optimal pointer transition for the next step?',
      options: [
        `Advance left pointer right: L++ (from index ${currL} to ${nextL})`,
        `Move right pointer left: R-- (from index ${currR ?? 0} to ${(currR ?? 1) - 1})`,
        'Swap elements at L and R',
        'Return solution immediately',
      ],
      correctIndex: 0,
      explanation: 'Increasing L increases the candidate sum / window in a sorted array.',
    };
  }

  if (currR !== undefined && nextR !== undefined && nextR < currR) {
    return {
      prompt: 'Look at the current state. What is the optimal pointer transition for the next step?',
      options: [
        `Move right pointer left: R-- (from index ${currR} to ${nextR})`,
        `Advance left pointer right: L++ (from index ${currL ?? 0} to ${(currL ?? 0) + 1})`,
        'Reset both pointers to origin',
        'Break loop without returning',
      ],
      correctIndex: 0,
      explanation: 'Decreasing R reduces the sum / contracts the boundary from the right.',
    };
  }

  // Check swap
  if (next.swapPair) {
    return {
      prompt: 'What operation must be executed on the array elements now?',
      options: [
        `Swap elements at indices [${next.swapPair[0]}] and [${next.swapPair[1]}]`,
        'Delete element at current pointer',
        'Double the array capacity',
        'No swap needed, advance pointers only',
      ],
      correctIndex: 0,
      explanation: 'A swap is required to maintain the partitioned invariant.',
    };
  }

  // Check match / best
  if (next.best || next.highlights?.length) {
    return {
      prompt: 'What invariant check occurred at this step?',
      options: [
        'Target condition met or new optimal result recorded',
        'Out-of-bounds error triggered',
        'Infinite loop detected',
      ],
      correctIndex: 0,
      explanation: 'The step achieved a key milestone or discovered an answer candidate.',
    };
  }

  // Fallback heuristic based on narration clues
  return {
    prompt: `Step ${stepIdx + 1} inspection: What is the algorithm's next rational decision?`,
    options: [
      'Evaluate next candidate element / update active invariant',
      'Immediately terminate algorithm with false',
      'Clear the state array',
    ],
    correctIndex: 0,
    explanation: 'The algorithm evaluates sequentially until termination conditions are reached.',
  };
}

export const MockInterviewOverlay: React.FC<MockInterviewOverlayProps> = ({
  active,
  onExit,
  currentStepIdx,
  totalSteps,
  currentStep,
  nextStep,
  onAdvanceStep,
  onLogSpacedRepetition,
  problemTitle,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [stats, setStats] = useState<MockInterviewStats>({
    correctCount: 0,
    totalQuestions: 0,
    streak: 0,
    maxStreak: 0,
    timeSpentSeconds: 0,
    completed: false,
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loggedToSpaced, setLoggedToSpaced] = useState(false);

  // Derive question for current transition
  const question = useMemo(() => {
    return derivePredictionQuestion(currentStep, nextStep, currentStepIdx);
  }, [currentStep, nextStep, currentStepIdx]);

  // Reset answer states on step change
  useEffect(() => {
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
  }, [currentStepIdx]);

  // Timer tick
  useEffect(() => {
    if (!active || !timerRunning || stats.completed) return;
    const interval = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [active, timerRunning, stats.completed]);

  // Check for completion
  useEffect(() => {
    if (active && currentStepIdx >= totalSteps - 1 && totalSteps > 0) {
      setStats((prev) => ({ ...prev, completed: true, timeSpentSeconds: seconds }));
      setTimerRunning(false);
    }
  }, [active, currentStepIdx, totalSteps, seconds]);

  if (!active) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setIsChecked(true);

    setStats((prev) => {
      const nextCorrect = correct ? prev.correctCount + 1 : prev.correctCount;
      const nextStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        correctCount: nextCorrect,
        totalQuestions: prev.totalQuestions + 1,
        streak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
      };
    });
  };

  const handleContinue = () => {
    onAdvanceStep();
  };

  const accuracyPct =
    stats.totalQuestions > 0 ? Math.round((stats.correctCount / stats.totalQuestions) * 100) : 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        marginBottom: '0.65rem',
      }}
    >
      {/* Top Interview Control Bar */}
      <div
        className="sketch-border"
        style={{
          background: 'rgb(var(--surface))',
          padding: '0.55rem 0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
          borderColor: 'rgb(var(--accent) / 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            style={{
              padding: '2px 7px',
              borderRadius: '5px',
              background: 'rgb(var(--accent) / 0.15)',
              color: 'rgb(var(--accent))',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} /> MOCK INTERVIEW
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'rgb(var(--ink))',
            }}
          >
            <Clock size={13} style={{ color: 'rgb(var(--accent))' }} />
            <span>{formatTimer(seconds)}</span>
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgb(var(--mute))',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                padding: '2px',
              }}
              title={timerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {timerRunning ? <Pause size={11} /> : <Play size={11} />}
            </button>
          </div>
        </div>

        {/* Live Score & Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              color: 'rgb(var(--mute))',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Flame size={13} style={{ color: stats.streak > 0 ? '#ff5722' : 'rgb(var(--mute))' }} />
            <span>Streak: {stats.streak}</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              color: 'rgb(var(--mute))',
            }}
          >
            Score: <strong style={{ color: 'rgb(var(--ink))' }}>{stats.correctCount * 100} pts</strong> ({accuracyPct}%)
          </div>

          <button
            type="button"
            onClick={onExit}
            className="ui-chip"
            style={{ padding: '0.2rem 0.5rem', fontSize: '11px' }}
            title="Exit Mock Interview mode"
          >
            <X size={12} /> Exit Mode
          </button>
        </div>
      </div>

      {/* Completion Modal / Card */}
      {stats.completed ? (
        <div
          className="sketch-border"
          style={{
            background: 'rgb(var(--surface))',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.75rem',
            borderColor: 'rgb(var(--accent))',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgb(var(--accent) / 0.15)',
              color: 'rgb(var(--accent))',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Trophy size={24} />
          </div>

          <div>
            <div style={{ fontSize: '17px', fontWeight: 800 }}>Interview Complete!</div>
            <div style={{ fontSize: '13px', color: 'rgb(var(--mute))' }}>
              Evaluation for &quot;{problemTitle}&quot;
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.85rem',
              width: '100%',
              maxWidth: '480px',
              margin: '0.5rem 0',
            }}
          >
            <div
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                background: 'rgb(var(--paper))',
                border: '1px solid rgb(var(--ink) / 0.1)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>GRADE</div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: accuracyPct >= 80 ? 'rgb(var(--accent))' : 'rgb(var(--ink))',
                }}
              >
                {accuracyPct >= 85 ? 'STRONG HIRE' : accuracyPct >= 65 ? 'HIRE' : 'LEAN HIRE'}
              </div>
            </div>

            <div
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                background: 'rgb(var(--paper))',
                border: '1px solid rgb(var(--ink) / 0.1)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>ACCURACY</div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{accuracyPct}%</div>
            </div>

            <div
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                background: 'rgb(var(--paper))',
                border: '1px solid rgb(var(--ink) / 0.1)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>TIME TAKEN</div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{formatTimer(seconds)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {onLogSpacedRepetition && (
              <button
                type="button"
                onClick={() => {
                  onLogSpacedRepetition();
                  setLoggedToSpaced(true);
                }}
                disabled={loggedToSpaced}
                className="cc-btn-outline"
                style={{ fontSize: '12px', padding: '0.45rem 0.85rem' }}
              >
                <CheckCircle2 size={13} style={{ color: loggedToSpaced ? 'rgb(var(--done-stroke))' : undefined }} />
                {loggedToSpaced ? 'Logged to Spaced Repetition!' : 'Log to Spaced Repetition'}
              </button>
            )}

            <button
              type="button"
              onClick={onExit}
              className="cc-btn-solid"
              style={{ fontSize: '12px', padding: '0.45rem 0.95rem' }}
            >
              Finish Interview
            </button>
          </div>
        </div>
      ) : (
        /* Prediction Question Prompt */
        <div
          className="sketch-border"
          style={{
            background: 'rgb(var(--surface))',
            padding: '0.85rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HelpCircle size={14} style={{ color: 'rgb(var(--accent))' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgb(var(--accent))',
              }}
            >
              PREDICT NEXT STEP · STEP {currentStepIdx + 1} OF {totalSteps}
            </span>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 600 }}>{question.prompt}</div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {question.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const showAsCorrect = isChecked && i === question.correctIndex;
              const showAsWrong = isChecked && isSelected && !isCorrect;

              let border = '1px solid rgb(var(--ink) / 0.12)';
              let bg = 'rgb(var(--paper))';
              let text = 'rgb(var(--ink))';

              if (showAsCorrect) {
                border = '1.5px solid rgb(var(--done-stroke))';
                bg = 'rgb(var(--done-bg))';
                text = 'rgb(var(--done-stroke))';
              } else if (showAsWrong) {
                border = '1.5px solid rgb(var(--dead-stroke))';
                bg = 'rgb(var(--dead-bg))';
                text = 'rgb(var(--dead-stroke))';
              } else if (isSelected) {
                border = '1.5px solid rgb(var(--accent))';
                bg = 'rgb(var(--accent) / 0.08)';
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isChecked}
                  onClick={() => setSelectedOption(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border,
                    background: bg,
                    color: text,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: isChecked ? 'default' : 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px solid currentColor',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Result Feedback & Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.6rem',
              marginTop: '0.2rem',
              flexWrap: 'wrap',
            }}
          >
            {isChecked ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {isCorrect ? (
                  <span
                    style={{
                      color: 'rgb(var(--done-stroke))',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={15} /> Correct! +100 XP
                  </span>
                ) : (
                  <span
                    style={{
                      color: 'rgb(var(--dead-stroke))',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <XCircle size={15} /> Incorrect. {question.explanation}
                  </span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'rgb(var(--mute))' }}>
                Select an option and click &quot;Check Prediction&quot; to test your algorithmic intuition.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isChecked ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheck}
                  className="cc-btn-solid"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '12px',
                    opacity: selectedOption === null ? 0.5 : 1,
                  }}
                >
                  Check Prediction
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="cc-btn-solid"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '12px' }}
                >
                  Continue to Next Step →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
