import React from 'react';
import { DsaRenderMode, DsaStep } from '../../types/curriculum';

interface DsaVisualizerProps {
  renderMode?: DsaRenderMode;
  defaultInput?: Array<string | number>;
  step: DsaStep;
}

const POINTER_COLORS: Record<string, string> = {
  accent: 'rgb(var(--accent))',
  blue: 'rgb(var(--accent2))',
  green: 'rgb(var(--done-stroke))',
  red: 'rgb(var(--dead-stroke))',
  gold: 'rgb(var(--gold-stroke))',
};

export const DsaVisualizer: React.FC<DsaVisualizerProps> = ({
  renderMode = 'cells',
  defaultInput = [],
  step,
}) => {
  const values = step.arrValues ?? defaultInput;
  const highlights = new Set(step.highlights ?? []);
  const reads = new Set(step.reads ?? []);
  const dimmed = new Set(step.dimmed ?? []);
  const doneIndices = new Set(step.doneIndices ?? []);
  const bestIndices = new Set(step.best?.indices ?? step.bestIndices ?? []);
  const bestLabel = step.best?.label ?? step.bestLabel;

  const renderCellsRow = (compact = false) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: compact ? '0.45rem' : '0.65rem',
        padding: compact ? '0.5rem 0.5rem 1rem' : '1.1rem 0.5rem 2.2rem',
      }}
    >
      {values.map((val, idx) => {
        const isHighlighted = highlights.has(idx);
        const isRead = reads.has(idx);
        const isDim = dimmed.has(idx);
        const isDone = doneIndices.has(idx);
        const isBest = bestIndices.has(idx);
        const isSwapping = step.swapPair && (step.swapPair[0] === idx || step.swapPair[1] === idx);

        const inRegion = step.regions?.some((r) => idx >= r.start && idx <= r.end);
        const cellPointers = (step.pointers ?? []).filter((p) => p.index === idx);

        let bg = 'rgb(var(--idle-bg))';
        let border = 'rgb(var(--ink) / 0.25)';
        let scale = 'scale(1)';

        if (isSwapping || isBest) {
          bg = 'rgb(var(--gold-bg))';
          border = 'rgb(var(--gold-stroke))';
          scale = 'scale(1.06)';
        } else if (isDone) {
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

        const boxSize = compact ? '44px' : '54px';

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
              transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
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

            <div
              style={{
                width: boxSize,
                height: boxSize,
                borderRadius: '10px',
                border: `2px solid ${border}`,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: compact ? '0.95rem' : '1.1rem',
                fontWeight: 700,
                boxShadow: isBest ? '0 0 0 3px rgb(var(--gold-stroke) / 0.4)' : 'none',
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

            {cellPointers.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  marginTop: '5px',
                  minHeight: '30px',
                }}
              >
                {cellPointers.map((p, pIdx) => {
                  const color = POINTER_COLORS[p.color ?? 'accent'] ?? 'rgb(var(--accent))';
                  return (
                    <div
                      key={pIdx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ lineHeight: 0.9 }}>▲</span>
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
            )}
          </div>
        );
      })}
    </div>
  );

  const renderTreeSvg = (height = 245) => {
    const nodes = step.treeNodes ?? [];
    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 620 ${height}`}
          style={{ width: '100%', maxWidth: '620px', margin: '0 auto', display: 'block' }}
        >
          {nodes.map((node) => {
            const x1 = (node.x / 100) * 600 + 10;
            const y1 = (node.y / 100) * (height - 15);
            const childTargets = new Set<string>();
            if (node.leftId) childTargets.add(node.leftId);
            if (node.rightId) childTargets.add(node.rightId);
            (node.childrenIds ?? []).forEach((cid) => childTargets.add(cid));

            return (
              <g key={`edges-${node.id}`}>
                {Array.from(childTargets).map((cid) => {
                  const child = nodes.find((n) => n.id === cid);
                  if (!child) return null;
                  const x2 = (child.x / 100) * 600 + 10;
                  const y2 = (child.y / 100) * (height - 15);
                  const isEdgeActive = node.state === 'active' && (child.state === 'active' || child.state === 'gold');
                  return (
                    <line
                      key={`${node.id}-${cid}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isEdgeActive ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.3)'}
                      strokeWidth={isEdgeActive ? '2.5' : '1.9'}
                    />
                  );
                })}
              </g>
            );
          })}

          {nodes.map((node) => {
            const cx = (node.x / 100) * 600 + 10;
            const cy = (node.y / 100) * (height - 15);
            const fill =
              node.state === 'done'
                ? 'rgb(var(--done-bg))'
                : node.state === 'active'
                  ? 'rgb(var(--active-bg))'
                  : node.state === 'gold'
                    ? 'rgb(var(--gold-bg))'
                    : node.state === 'dead'
                      ? 'rgb(var(--dead-bg))'
                      : 'rgb(var(--idle-bg))';
            const stroke =
              node.state === 'done'
                ? 'rgb(var(--done-stroke))'
                : node.state === 'active'
                  ? 'rgb(var(--accent))'
                  : node.state === 'gold'
                    ? 'rgb(var(--gold-stroke))'
                    : node.state === 'dead'
                      ? 'rgb(var(--dead-stroke))'
                      : 'rgb(var(--ink) / 0.35)';

            const textStr = String(node.val);
            const isWide = textStr.length > 3;

            return (
              <g key={node.id}>
                {isWide ? (
                  <rect
                    x={cx - Math.max(26, textStr.length * 4.5)}
                    y={cy - 18}
                    width={Math.max(52, textStr.length * 9)}
                    height="36"
                    rx="10"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.1"
                  />
                ) : (
                  <circle cx={cx} cy={cy} r="21" fill={fill} stroke={stroke} strokeWidth="2.1" />
                )}
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={isWide ? '11.5' : '13.5'}
                  fontWeight="700"
                  fill="rgb(var(--ink))"
                >
                  {node.val}
                </text>
                {node.badge && (
                  <text
                    x={cx}
                    y={cy - 25}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="700"
                    fill="rgb(var(--accent))"
                  >
                    {node.badge}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Region / Swap / Best / Area Banner */}
      {(step.regions?.length || bestLabel || step.swapPair || step.area?.label || step.levels?.length) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center' }}>
          {step.regions?.map((reg, idx) => (
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
              [{reg.start}..{reg.end}]{reg.label ? ` · ${reg.label}` : ''}
            </span>
          ))}
          {step.area?.label && (
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--accent2) / 0.55)',
                background: 'rgb(var(--read-bg))',
                color: 'rgb(var(--accent2))',
                fontWeight: 700,
              }}
            >
              ▭ {step.area.label}
            </span>
          )}
          {step.levels?.map((lv) => (
            <span
              key={lv.id}
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--accent) / 0.45)',
                fontWeight: 600,
              }}
            >
              ― {lv.label ?? `${lv.id} = ${lv.y}`}
            </span>
          ))}
          {step.swapPair && (
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--gold-stroke))',
                background: 'rgb(var(--gold-bg))',
                fontWeight: 700,
              }}
            >
              ⇄ Swap [{step.swapPair[0]}] ↔ [{step.swapPair[1]}]
            </span>
          )}
          {bestLabel && (
            <span
              className="ui-chip"
              style={{
                borderColor: 'rgb(var(--gold-stroke) / 0.65)',
                background: 'rgb(var(--gold-bg))',
                color: 'rgb(var(--ink))',
                fontWeight: 700,
              }}
            >
              ★ {bestLabel}
            </span>
          )}
        </div>
      )}

      {/* 1. ARRAY CELLS VIEW */}
      {renderMode === 'cells' && renderCellsRow(false)}

      {/* 2. HISTOGRAM BARS + WATER VIEW */}
      {renderMode === 'bars' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '0.6rem',
            height: '230px',
            padding: '1.2rem 1rem 2.6rem',
          }}
        >
          {values.map((rawVal, idx) => {
            const numVal = Number(rawVal) || 0;
            const maxVal = Math.max(...values.map((v) => Number(v) || 1), 8);
            const barHeight = Math.max(8, Math.round((numVal / maxVal) * 140));

            let waterLevel = step.waterLevels?.[idx] ?? step.waterColumns?.[idx] ?? 0;
            if (
              !waterLevel &&
              step.area &&
              idx >= step.area.left &&
              idx <= step.area.right &&
              step.area.height > 0
            ) {
              waterLevel = step.area.height;
            }
            const waterHeight = Math.round((waterLevel / maxVal) * 140);

            const isHighlighted = highlights.has(idx);
            const isDone = doneIndices.has(idx);
            const isBest = bestIndices.has(idx);
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
                  {waterHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '-5px',
                        right: '-5px',
                        height: `${waterHeight}px`,
                        background: 'rgb(var(--accent2) / 0.24)',
                        borderTop: '1.5px dashed rgb(var(--accent2))',
                        pointerEvents: 'none',
                        transition: 'height 240ms ease',
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      borderRadius: '6px 6px 2px 2px',
                      border: `2px solid ${
                        isBest
                          ? 'rgb(var(--gold-stroke))'
                          : isDone
                            ? 'rgb(var(--done-stroke))'
                            : isHighlighted
                              ? 'rgb(var(--accent))'
                              : 'rgb(var(--ink) / 0.35)'
                      }`,
                      background: isBest
                        ? 'rgb(var(--gold-bg))'
                        : isDone
                          ? 'rgb(var(--done-bg))'
                          : isHighlighted
                            ? 'rgb(var(--active-bg))'
                            : 'rgb(var(--idle-bg))',
                      zIndex: 2,
                      transition: 'all 240ms ease',
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
                      border: `1.5px solid ${POINTER_COLORS[p.color ?? 'accent'] ?? 'rgb(var(--accent))'}`,
                      color: POINTER_COLORS[p.color ?? 'accent'] ?? 'rgb(var(--accent))',
                    }}
                  >
                    ▲{p.name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LINKED LIST WITH CURVED & CYCLE ARCS */}
      {renderMode === 'list' && (
        <div style={{ width: '100%', overflowX: 'auto', padding: '0.5rem 0' }}>
          <svg viewBox="0 0 700 195" style={{ width: '100%', maxWidth: '700px', margin: '0 auto', display: 'block' }}>
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

            {(step.listLinks ?? []).map((arc, i) => {
              const x1 = 95 + arc.from * 130;
              const y1 = 88;
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

              const x2 = 95 + arc.to * 130;
              const isForward = arc.to > arc.from;
              const pathD = isForward
                ? `M ${x1 + 30} ${y1} L ${x2 - 32} ${y1}`
                : `M ${x1 - 15} ${y1 - 24} Q ${(x1 + x2) / 2} ${y1 - 74} ${x2 + 15} ${y1 - 24}`;

              return (
                <g key={i}>
                  <path d={pathD} stroke={stroke} strokeWidth="2.2" fill="none" markerEnd={marker} />
                  {arc.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={isForward ? y1 - 10 : y1 - 52}
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

            {values.map((val, idx) => {
              const cx = 95 + idx * 130;
              const cy = 88;
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
                      fill={POINTER_COLORS[p.color ?? 'accent'] ?? 'rgb(var(--accent))'}
                    >
                      ▲ {p.name}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* 4. BINARY TREE / TRIE / DECISION TREE VIEW */}
      {renderMode === 'tree' && step.treeNodes && renderTreeSvg(250)}

      {/* 5. HEAP VIEW */}
      {renderMode === 'heap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {step.treeNodes && renderTreeSvg(195)}
          {values.length > 0 && renderCellsRow(true)}
        </div>
      )}

      {/* 6. WEIGHTED / DIRECTED GRAPH VIEW */}
      {renderMode === 'graph' && step.graphNodes && (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 640 250" style={{ width: '100%', maxWidth: '640px', margin: '0 auto', display: 'block' }}>
            <defs>
              <marker id="gr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--ink) / 0.55)" />
              </marker>
              <marker
                id="gr-arrow-active"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--accent))" />
              </marker>
              <marker
                id="gr-arrow-done"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--done-stroke))" />
              </marker>
            </defs>

            {(step.graphEdges ?? []).map((edge, idx) => {
              const u = step.graphNodes!.find((n) => n.id === edge.from);
              const v = step.graphNodes!.find((n) => n.id === edge.to);
              if (!u || !v) return null;

              const dx = v.x - u.x;
              const dy = v.y - u.y;
              const len = Math.hypot(dx, dy) || 1;
              const x1 = u.x + (dx / len) * 26;
              const y1 = u.y + (dy / len) * 26;
              const x2 = v.x - (dx / len) * 28;
              const y2 = v.y - (dy / len) * 28;

              const stroke =
                edge.state === 'active'
                  ? 'rgb(var(--accent))'
                  : edge.state === 'done'
                    ? 'rgb(var(--done-stroke))'
                    : 'rgb(var(--ink) / 0.35)';
              const marker = edge.directed
                ? edge.state === 'active'
                  ? 'url(#gr-arrow-active)'
                  : edge.state === 'done'
                    ? 'url(#gr-arrow-done)'
                    : 'url(#gr-arrow)'
                : undefined;

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={edge.state === 'active' || edge.state === 'done' ? '2.5' : '1.8'}
                    markerEnd={marker}
                  />
                  {edge.weight !== undefined && (
                    <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 8})`}>
                      <rect x="-12" y="-9" width="24" height="15" rx="4" fill="rgb(var(--paper))" />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize="10.5"
                        fontWeight="700"
                        fill={stroke}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {step.graphNodes.map((n) => {
              const fill =
                n.state === 'done'
                  ? 'rgb(var(--done-bg))'
                  : n.state === 'active'
                    ? 'rgb(var(--active-bg))'
                    : n.state === 'gold'
                      ? 'rgb(var(--gold-bg))'
                      : 'rgb(var(--idle-bg))';
              const stroke =
                n.state === 'done'
                  ? 'rgb(var(--done-stroke))'
                  : n.state === 'active'
                    ? 'rgb(var(--accent))'
                    : n.state === 'gold'
                      ? 'rgb(var(--gold-stroke))'
                      : 'rgb(var(--ink) / 0.4)';

              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r="24" fill={fill} stroke={stroke} strokeWidth="2.2" />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="13.5"
                    fontWeight="700"
                    fill="rgb(var(--ink))"
                  >
                    {n.label}
                  </text>
                  {n.dist !== undefined && (
                    <text
                      x={n.x}
                      y={n.y + 38}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="10.5"
                      fontWeight="700"
                      fill="rgb(var(--accent))"
                    >
                      d={n.dist}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* 7. 2D MATRIX / DP TABLE / GRID VIEW */}
      {renderMode === 'matrix' && step.matrix && (
        <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '0.5rem' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: '6px' }}>
            {step.matrix.colLabels && (
              <thead>
                <tr>
                  <th />
                  {step.matrix.colLabels.map((c, cIdx) => (
                    <th
                      key={cIdx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'rgb(var(--mute))',
                        paddingBottom: '4px',
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {step.matrix.grid.map((row, rIdx) => (
                <tr key={rIdx}>
                  {step.matrix?.rowLabels && (
                    <td
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'rgb(var(--mute))',
                        paddingRight: '8px',
                        textAlign: 'right',
                      }}
                    >
                      {step.matrix.rowLabels[rIdx]}
                    </td>
                  )}
                  {row.map((val, cIdx) => {
                    const isActive = step.matrix?.activeCells?.some(([r, c]) => r === rIdx && c === cIdx);
                    const isDone = step.matrix?.doneCells?.some(([r, c]) => r === rIdx && c === cIdx);
                    const isRead = step.matrix?.readCells?.some(([r, c]) => r === rIdx && c === cIdx);
                    const isBest = step.matrix?.bestCells?.some(([r, c]) => r === rIdx && c === cIdx);

                    let bg = 'rgb(var(--idle-bg))';
                    let border = 'rgb(var(--ink) / 0.22)';
                    if (isBest) {
                      bg = 'rgb(var(--gold-bg))';
                      border = 'rgb(var(--gold-stroke))';
                    } else if (isActive) {
                      bg = 'rgb(var(--active-bg))';
                      border = 'rgb(var(--accent))';
                    } else if (isDone) {
                      bg = 'rgb(var(--done-bg))';
                      border = 'rgb(var(--done-stroke))';
                    } else if (isRead) {
                      bg = 'rgb(var(--read-bg))';
                      border = 'rgb(var(--accent2))';
                    }

                    return (
                      <td
                        key={cIdx}
                        style={{
                          width: '46px',
                          height: '44px',
                          borderRadius: '8px',
                          border: `2px solid ${border}`,
                          background: bg,
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          fontWeight: 700,
                          transition: 'all 220ms ease',
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Auxiliary Array Strip (step.aux from chaicode_two_pointers_full.json) */}
      {step.aux && (
        <div
          className="sketch-border-soft"
          style={{
            padding: '0.7rem 0.9rem',
            background: 'rgb(var(--surface-alt))',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgb(var(--mute))',
              marginRight: '0.35rem',
            }}
          >
            {step.aux.label}:
          </span>
          {step.aux.values.length === 0 ? (
            <span className="ui-chip" style={{ color: 'rgb(var(--mute))' }}>
              [ empty ]
            </span>
          ) : (
            step.aux.values.map((v, i) => {
              const isAuxHi = step.aux?.highlights?.includes(i);
              const isAuxDim = step.aux?.dimmed?.includes(i);
              return (
                <span
                  key={i}
                  className="ui-chip"
                  style={{
                    borderColor: isAuxHi ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.18)',
                    background: isAuxHi ? 'rgb(var(--active-bg))' : 'rgb(var(--paper))',
                    opacity: isAuxDim ? 0.4 : 1,
                    fontWeight: 700,
                  }}
                >
                  {v}
                </span>
              );
            })
          )}
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
