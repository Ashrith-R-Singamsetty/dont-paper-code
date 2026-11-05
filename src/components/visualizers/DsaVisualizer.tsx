import React from 'react';
import { DsaRenderMode, DsaStep } from '../../types/curriculum';

interface DsaVisualizerProps {
  renderMode: DsaRenderMode;
  step: DsaStep;
}

const POINTER_COLORS: Record<string, string> = {
  accent: 'rgb(var(--accent))',
  blue: 'rgb(var(--accent2))',
  green: 'rgb(var(--done-stroke))',
  red: 'rgb(var(--dead-stroke))',
  gold: 'rgb(var(--gold-stroke))',
};

export const DsaVisualizer: React.FC<DsaVisualizerProps> = ({ renderMode, step }) => {
  const values = step.arrValues ?? [];
  const highlights = new Set(step.highlights ?? []);
  const reads = new Set(step.reads ?? []);
  const dimmed = new Set(step.dimmed ?? []);
  const doneIndices = new Set(step.doneIndices ?? []);
  const bestIndices = new Set(step.bestIndices ?? []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%' }}>
      {/* Region Bracket Banner */}
      {step.regions && step.regions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {step.regions.map((reg, idx) => (
            <span
              key={idx}
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--accent) / 0.45)',
                background: 'rgb(var(--accent) / 0.1)',
                color: 'rgb(var(--accent))',
                fontWeight: 600,
              }}
            >
              Bracket [{reg.start}..{reg.end}]{reg.label ? ` · ${reg.label}` : ''}
            </span>
          ))}
          {step.bestLabel && (
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--gold-stroke) / 0.65)',
                background: 'rgb(var(--gold-bg))',
                color: 'rgb(var(--ink))',
                fontWeight: 700,
              }}
            >
              ★ {step.bestLabel}
            </span>
          )}
        </div>
      )}

      {/* 1. ARRAY CELLS VIEW */}
      {renderMode === 'cells' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.65rem',
            padding: '1.25rem 0.5rem 2.4rem',
          }}
        >
          {values.map((val, idx) => {
            const isHighlighted = highlights.has(idx);
            const isRead = reads.has(idx);
            const isDim = dimmed.has(idx);
            const isDone = doneIndices.has(idx);
            const isBest = bestIndices.has(idx);

            const inRegion = step.regions?.some((r) => idx >= r.start && idx <= r.end);
            const cellPointers = (step.pointers ?? []).filter((p) => p.index === idx);

            let bg = 'rgb(var(--idle-bg))';
            let border = 'rgb(var(--ink) / 0.25)';
            let scale = 'scale(1)';

            if (isDone) {
              bg = 'rgb(var(--done-bg))';
              border = 'rgb(var(--done-stroke))';
            } else if (isHighlighted) {
              bg = 'rgb(var(--active-bg))';
              border = 'rgb(var(--accent))';
              scale = 'scale(1.06)';
            } else if (isRead) {
              bg = 'rgb(var(--read-bg))';
              border = 'rgb(var(--accent2))';
            } else if (inRegion) {
              bg = 'rgb(var(--accent) / 0.07)';
              border = 'rgb(var(--accent) / 0.45)';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  opacity: isDim ? 0.35 : 1,
                  transform: scale,
                  transition: 'all 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Index label above cell */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgb(var(--mute))',
                    marginBottom: '4px',
                  }}
                >
                  [{idx}]
                </span>

                {/* Main Cell Box */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    border: `2px solid ${border}`,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    boxShadow: isBest ? '0 0 0 3px rgb(var(--gold-stroke) / 0.45)' : 'none',
                    position: 'relative',
                  }}
                >
                  {val}
                  {isBest && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        right: '-7px',
                        fontSize: '11px',
                        background: 'rgb(var(--gold-bg))',
                        border: '1px solid rgb(var(--gold-stroke))',
                        borderRadius: '999px',
                        padding: '0 4px',
                      }}
                    >
                      ★
                    </span>
                  )}
                </div>

                {/* Pointers stacked below */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    marginTop: '6px',
                    minHeight: '34px',
                  }}
                >
                  {cellPointers.map((p, pIdx) => {
                    const color = POINTER_COLORS[p.color ?? 'accent'];
                    return (
                      <div
                        key={pIdx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ lineHeight: 0.9 }}>↑</span>
                        <span
                          style={{
                            padding: '1px 6px',
                            borderRadius: '5px',
                            border: `1.5px solid ${color}`,
                            background: 'rgb(var(--surface))',
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. HISTOGRAM BARS + WATER VIEW */}
      {renderMode === 'bars' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '0.6rem',
            height: '220px',
            padding: '1.2rem 1rem 2.6rem',
          }}
        >
          {values.map((rawVal, idx) => {
            const numVal = Number(rawVal) || 0;
            const maxVal = Math.max(...values.map((v) => Number(v) || 1), 8);
            const barHeight = Math.max(14, Math.round((numVal / maxVal) * 140));
            const waterLevel = step.waterLevels?.[idx] ?? 0;
            const waterHeight = Math.round((waterLevel / maxVal) * 140);

            const isHighlighted = highlights.has(idx);
            const isDone = doneIndices.has(idx);
            const isDim = dimmed.has(idx);
            const cellPointers = (step.pointers ?? []).filter((p) => p.index === idx);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  opacity: isDim ? 0.35 : 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '4px',
                  }}
                >
                  {numVal}
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '142px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    position: 'relative',
                  }}
                >
                  {/* Water fill overlay */}
                  {waterHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '-5px',
                        right: '-5px',
                        height: `${waterHeight}px`,
                        background: 'rgb(var(--accent2) / 0.22)',
                        borderTop: '1.5px dashed rgb(var(--accent2))',
                        pointerEvents: 'none',
                        transition: 'height 260ms ease',
                      }}
                    />
                  )}
                  {/* Pillar */}
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      borderRadius: '6px 6px 2px 2px',
                      border: `2px solid ${
                        isDone
                          ? 'rgb(var(--done-stroke))'
                          : isHighlighted
                            ? 'rgb(var(--accent))'
                            : 'rgb(var(--ink) / 0.35)'
                      }`,
                      background: isDone
                        ? 'rgb(var(--done-bg))'
                        : isHighlighted
                          ? 'rgb(var(--active-bg))'
                          : 'rgb(var(--idle-bg))',
                      zIndex: 2,
                      transition: 'all 260ms ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgb(var(--mute))',
                    marginTop: '4px',
                  }}
                >
                  [{idx}]
                </span>
                {cellPointers.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    style={{
                      marginTop: '3px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      border: `1.5px solid ${POINTER_COLORS[p.color ?? 'accent']}`,
                      color: POINTER_COLORS[p.color ?? 'accent'],
                    }}
                  >
                    ↑{p.name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LINKED LIST WITH CURVED SVG POINTER ARCS */}
      {renderMode === 'list' && (
        <div style={{ width: '100%', overflowX: 'auto', padding: '0.5rem 0' }}>
          <svg viewBox="0 0 680 185" style={{ width: '100%', maxWidth: '680px', margin: '0 auto', display: 'block' }}>
            <defs>
              <marker id="ll-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--ink))" />
              </marker>
              <marker
                id="ll-arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--accent))" />
              </marker>
              <marker
                id="ll-arrow-done"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--done-stroke))" />
              </marker>
            </defs>

            {/* Draw Pointer Arcs */}
            {(step.listLinks ?? []).map((arc, i) => {
              const x1 = 95 + arc.from * 140;
              const y1 = 82;
              const stroke =
                arc.status === 'active'
                  ? 'rgb(var(--accent))'
                  : arc.status === 'done'
                    ? 'rgb(var(--done-stroke))'
                    : 'rgb(var(--ink) / 0.55)';
              const marker =
                arc.status === 'active'
                  ? 'url(#ll-arrow-active)'
                  : arc.status === 'done'
                    ? 'url(#ll-arrow-done)'
                    : 'url(#ll-arrow)';

              if (arc.to === null) {
                return (
                  <g key={i}>
                    <path
                      d={`M ${x1 - 28} ${y1} L ${x1 - 68} ${y1}`}
                      stroke={stroke}
                      strokeWidth="2.2"
                      fill="none"
                      markerEnd={marker}
                    />
                    <text
                      x={x1 - 74}
                      y={y1 + 4}
                      textAnchor="end"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      fill="rgb(var(--mute))"
                    >
                      NULL
                    </text>
                  </g>
                );
              }

              const x2 = 95 + arc.to * 140;
              const isForward = arc.to > arc.from;
              const pathD = isForward
                ? `M ${x1 + 30} ${y1} L ${x2 - 32} ${y1}`
                : `M ${x1 - 20} ${y1 - 24} Q ${(x1 + x2) / 2} ${y1 - 68} ${x2 + 20} ${y1 - 24}`;

              return (
                <g key={i}>
                  <path d={pathD} stroke={stroke} strokeWidth="2.2" fill="none" markerEnd={marker} />
                  {arc.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={isForward ? y1 - 8 : y1 - 48}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      fill={stroke}
                      fontWeight="700"
                    >
                      {arc.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw List Nodes */}
            {values.map((val, idx) => {
              const cx = 95 + idx * 140;
              const cy = 82;
              const isHighlighted = highlights.has(idx);
              const isDone = doneIndices.has(idx);
              const nodePointers = (step.pointers ?? []).filter((p) => p.index === idx);

              return (
                <g key={idx}>
                  <rect
                    x={cx - 30}
                    y={cy - 24}
                    width="60"
                    height="48"
                    rx="10"
                    fill={
                      isDone
                        ? 'rgb(var(--done-bg))'
                        : isHighlighted
                          ? 'rgb(var(--active-bg))'
                          : 'rgb(var(--idle-bg))'
                    }
                    stroke={
                      isDone
                        ? 'rgb(var(--done-stroke))'
                        : isHighlighted
                          ? 'rgb(var(--accent))'
                          : 'rgb(var(--ink) / 0.35)'
                    }
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="15"
                    fontWeight="700"
                    fill="rgb(var(--ink))"
                  >
                    {val}
                  </text>
                  {nodePointers.map((p, pIdx) => (
                    <text
                      key={pIdx}
                      x={cx}
                      y={cy + 44 + pIdx * 16}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="11"
                      fontWeight="700"
                      fill={POINTER_COLORS[p.color ?? 'accent']}
                    >
                      ↑ {p.name}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* 4. BINARY TREE VIEW */}
      {renderMode === 'tree' && step.treeNodes && (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 600 250" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block' }}>
            {/* Tree Edges */}
            {step.treeNodes.map((node) => {
              const x1 = (node.x / 100) * 600;
              const y1 = (node.y / 100) * 240;
              const left = step.treeNodes?.find((n) => n.id === node.leftId);
              const right = step.treeNodes?.find((n) => n.id === node.rightId);
              return (
                <g key={`edges-${node.id}`}>
                  {left && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={(left.x / 100) * 600}
                      y2={(left.y / 100) * 240}
                      stroke="rgb(var(--ink) / 0.32)"
                      strokeWidth="2"
                    />
                  )}
                  {right && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={(right.x / 100) * 600}
                      y2={(right.y / 100) * 240}
                      stroke="rgb(var(--ink) / 0.32)"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            {/* Tree Nodes */}
            {step.treeNodes.map((node) => {
              const cx = (node.x / 100) * 600;
              const cy = (node.y / 100) * 240;
              const fill =
                node.state === 'done'
                  ? 'rgb(var(--done-bg))'
                  : node.state === 'active'
                    ? 'rgb(var(--active-bg))'
                    : node.state === 'gold'
                      ? 'rgb(var(--gold-bg))'
                      : 'rgb(var(--idle-bg))';
              const stroke =
                node.state === 'done'
                  ? 'rgb(var(--done-stroke))'
                  : node.state === 'active'
                    ? 'rgb(var(--accent))'
                    : node.state === 'gold'
                      ? 'rgb(var(--gold-stroke))'
                      : 'rgb(var(--ink) / 0.35)';

              return (
                <g key={node.id}>
                  <circle cx={cx} cy={cy} r="22" fill={fill} stroke={stroke} strokeWidth="2.2" />
                  <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="14"
                    fontWeight="700"
                    fill="rgb(var(--ink))"
                  >
                    {node.val}
                  </text>
                  {node.badge && (
                    <text
                      x={cx + 28}
                      y={cy + 4}
                      fontFamily="var(--font-mono)"
                      fontSize="10"
                      fontWeight="700"
                      fill="rgb(var(--accent))"
                    >
                      ← {node.badge}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Auxiliary Data Structure / Call Stack Strip */}
      {(step.auxItems || step.callStack) && (
        <div
          className="sketch-border-soft"
          style={{
            padding: '0.65rem 0.9rem',
            background: 'rgb(var(--surface-alt))',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'rgb(var(--mute))',
              marginRight: '0.35rem',
            }}
          >
            {step.auxLabel ?? 'Call Stack'}:
          </span>
          {(step.auxItems ?? step.callStack ?? []).map((item, idx) => (
            <span
              key={idx}
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--accent2) / 0.4)',
                background: 'rgb(var(--read-bg))',
                fontWeight: 600,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
