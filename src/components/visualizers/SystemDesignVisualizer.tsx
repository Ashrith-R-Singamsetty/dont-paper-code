import React from 'react';
import { SdStep, UmlClassNode } from '../../types/curriculum';

interface SystemDesignVisualizerProps {
  step: SdStep;
}

interface BoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function getClassBox(node: UmlClassNode): BoxRect {
  const w = node.w ?? 230;
  const headerH = node.stereotype ? 44 : 32;
  const fieldsH = node.fields?.length ? node.fields.length * 18 + 12 : 0;
  const methodsH = node.methods?.length ? node.methods.length * 18 + 12 : 0;
  const h = Math.max(64, headerH + fieldsH + methodsH + 6);
  return {
    x: node.x,
    y: node.y,
    w,
    h,
    cx: node.x + w / 2,
    cy: node.y + h / 2,
  };
}

function clipRayToBox(box: BoxRect, targetX: number, targetY: number): { x: number; y: number } {
  const dx = targetX - box.cx;
  const dy = targetY - box.cy;
  if (dx === 0 && dy === 0) return { x: box.cx, y: box.cy };
  const hw = box.w / 2;
  const hh = box.h / 2;
  const scaleX = Math.abs(dx) > 0.001 ? hw / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.001 ? hh / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return {
    x: box.cx + dx * scale,
    y: box.cy + dy * scale,
  };
}

export const SystemDesignVisualizer: React.FC<SystemDesignVisualizerProps> = ({ step }) => {
  /* ==========================================================================
   * 1. UML CLASS DIAGRAM VIEW
   * ========================================================================== */
  if (step.view === 'class' && step.classes) {
    const boxes = new Map<string, BoxRect>();
    step.classes.forEach((c) => boxes.set(c.id, getClassBox(c)));

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ position: 'relative', width: '960px', height: '390px', margin: '0 auto' }}>
          {/* SVG Connector Layer */}
          <svg
            viewBox="0 0 960 390"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
          >
            <defs>
              {/* Hollow Triangle for Inheritance / Realization */}
              <marker
                id="uml-triangle"
                viewBox="0 0 12 12"
                refX="11"
                refY="6"
                markerWidth="10"
                markerHeight="10"
                orient="auto"
              >
                <path
                  d="M 1 1 L 11 6 L 1 11 Z"
                  fill="rgb(var(--paper))"
                  stroke="rgb(var(--ink))"
                  strokeWidth="1.6"
                />
              </marker>
              {/* Open Arrow for Association / Dependency */}
              <marker
                id="uml-open-arrow"
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="9"
                markerHeight="9"
                orient="auto"
              >
                <path
                  d="M 1 2 L 10 6 L 1 10"
                  fill="none"
                  stroke="rgb(var(--accent))"
                  strokeWidth="1.8"
                />
              </marker>
              {/* Filled Diamond for Composition */}
              <marker
                id="uml-diamond-filled"
                viewBox="0 0 14 10"
                refX="1"
                refY="5"
                markerWidth="11"
                markerHeight="9"
                orient="auto"
              >
                <path d="M 1 5 L 7 1 L 13 5 L 7 9 Z" fill="rgb(var(--ink))" />
              </marker>
              {/* Hollow Diamond for Aggregation */}
              <marker
                id="uml-diamond-hollow"
                viewBox="0 0 14 10"
                refX="1"
                refY="5"
                markerWidth="11"
                markerHeight="9"
                orient="auto"
              >
                <path
                  d="M 1 5 L 7 1 L 13 5 L 7 9 Z"
                  fill="rgb(var(--paper))"
                  stroke="rgb(var(--ink))"
                  strokeWidth="1.5"
                />
              </marker>
            </defs>

            {(step.relations ?? []).map((rel) => {
              const fromBox = boxes.get(rel.from);
              const toBox = boxes.get(rel.to);
              if (!fromBox || !toBox) return null;

              const start = clipRayToBox(fromBox, toBox.cx, toBox.cy);
              const end = clipRayToBox(toBox, fromBox.cx, fromBox.cy);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              const isDashed = rel.kind === 'implement' || rel.kind === 'depend';
              const stroke = rel.broken
                ? 'rgb(var(--dead-stroke))'
                : rel.active
                  ? 'rgb(var(--accent))'
                  : 'rgb(var(--ink) / 0.55)';

              let markerEnd: string | undefined;
              let markerStart: string | undefined;
              if (rel.kind === 'inherit' || rel.kind === 'implement') {
                markerEnd = 'url(#uml-triangle)';
              } else if (rel.kind === 'assoc' || rel.kind === 'depend') {
                markerEnd = 'url(#uml-open-arrow)';
              } else if (rel.kind === 'compose') {
                markerStart = 'url(#uml-diamond-filled)';
              } else if (rel.kind === 'aggregate') {
                markerStart = 'url(#uml-diamond-hollow)';
              }

              return (
                <g key={rel.id}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={stroke}
                    strokeWidth={rel.active ? 2.2 : 1.7}
                    strokeDasharray={isDashed ? '6 4' : undefined}
                    markerStart={markerStart}
                    markerEnd={markerEnd}
                  />
                  {rel.label && (
                    <g transform={`translate(${midX}, ${midY - 8})`}>
                      <rect
                        x={-rel.label.length * 3.4 - 6}
                        y={-10}
                        width={rel.label.length * 6.8 + 12}
                        height={16}
                        rx="4"
                        fill="rgb(var(--paper))"
                        stroke="rgb(var(--ink) / 0.15)"
                      />
                      <text
                        x={0}
                        y={1}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                        fill={stroke}
                      >
                        {rel.label}
                      </text>
                    </g>
                  )}
                  {rel.toMult && (
                    <text
                      x={end.x + (start.x < end.x ? -14 : 14)}
                      y={end.y - 8}
                      textAnchor="middle"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fontWeight="700"
                      fill="rgb(var(--accent))"
                    >
                      {rel.toMult}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Class Cards */}
          {step.classes.map((cls) => {
            const box = boxes.get(cls.id)!;
            let border = 'rgb(var(--ink) / 0.35)';
            let headerBg = 'rgb(var(--surface-alt))';

            if (cls.tint === 'active') {
              border = 'rgb(var(--accent))';
              headerBg = 'rgb(var(--active-bg))';
            } else if (cls.tint === 'done') {
              border = 'rgb(var(--done-stroke))';
              headerBg = 'rgb(var(--done-bg))';
            } else if (cls.tint === 'dead') {
              border = 'rgb(var(--dead-stroke))';
              headerBg = 'rgb(var(--dead-bg))';
            } else if (cls.tint === 'gold') {
              border = 'rgb(var(--gold-stroke))';
              headerBg = 'rgb(var(--gold-bg))';
            }

            return (
              <div
                key={cls.id}
                style={{
                  position: 'absolute',
                  left: `${box.x}px`,
                  top: `${box.y}px`,
                  width: `${box.w}px`,
                  borderRadius: '9px',
                  border: `2px solid ${border}`,
                  background: 'rgb(var(--surface))',
                  boxShadow: '0 3px 10px rgb(var(--ink) / 0.06)',
                  zIndex: 2,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '6px 10px',
                    background: headerBg,
                    borderBottom: '1px solid rgb(var(--ink) / 0.14)',
                    textAlign: 'center',
                  }}
                >
                  {cls.stereotype && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'rgb(var(--mute))',
                      }}
                    >
                      «{cls.stereotype}»
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      fontStyle: cls.stereotype === 'abstract' || cls.stereotype === 'interface' ? 'italic' : 'normal',
                    }}
                  >
                    {cls.name}
                  </div>
                </div>

                {/* Fields */}
                {cls.fields && cls.fields.length > 0 && (
                  <div
                    style={{
                      padding: '5px 9px',
                      borderBottom: cls.methods?.length ? '1px solid rgb(var(--ink) / 0.1)' : 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      lineHeight: 1.55,
                    }}
                  >
                    {cls.fields.map((f, idx) => (
                      <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Methods */}
                {cls.methods && cls.methods.length > 0 && (
                  <div
                    style={{
                      padding: '5px 9px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      lineHeight: 1.55,
                    }}
                  >
                    {cls.methods.map((m, idx) => (
                      <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ==========================================================================
   * 2. SEQUENCE DIAGRAM VIEW
   * ========================================================================== */
  if (step.view === 'sequence' && step.participants) {
    const count = step.participants.length;
    const colSpacing = 760 / Math.max(1, count);
    const messages = step.messages ?? [];
    const svgHeight = Math.max(270, 95 + messages.length * 46);

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 840 ${svgHeight}`}
          style={{ width: '100%', maxWidth: '840px', margin: '0 auto', display: 'block' }}
        >
          <defs>
            <marker id="seq-call" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--ink))" />
            </marker>
            <marker
              id="seq-active"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--accent))" />
            </marker>
            <marker id="seq-dead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--dead-stroke))" />
            </marker>
          </defs>

          {/* Participant Headers + Vertical Dashed Lifelines */}
          {step.participants.map((p, idx) => {
            const cx = 85 + idx * colSpacing;
            return (
              <g key={p.id}>
                <line
                  x1={cx}
                  y1={56}
                  x2={cx}
                  y2={svgHeight - 20}
                  stroke="rgb(var(--ink) / 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
                <rect
                  x={cx - 68}
                  y={14}
                  width="136"
                  height="38"
                  rx="8"
                  fill={p.active ? 'rgb(var(--active-bg))' : 'rgb(var(--surface))'}
                  stroke={p.active ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.35)'}
                  strokeWidth="1.8"
                />
                <text
                  x={cx}
                  y={37}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="11.5"
                  fontWeight="700"
                  fill="rgb(var(--ink))"
                >
                  {p.kind === 'actor' ? `👤 ${p.label}` : p.label}
                </text>
              </g>
            );
          })}

          {/* Messages */}
          {messages.map((msg, idx) => {
            const fromIdx = step.participants!.findIndex((p) => p.id === msg.from);
            const toIdx = step.participants!.findIndex((p) => p.id === msg.to);
            if (fromIdx === -1 || toIdx === -1) return null;

            const x1 = 85 + fromIdx * colSpacing;
            const x2 = 85 + toIdx * colSpacing;
            const y = 92 + idx * 44;
            const isActive = step.activeMessageId === msg.id || msg.status === 'active';
            const isDead = msg.status === 'dead';

            const stroke = isDead
              ? 'rgb(var(--dead-stroke))'
              : isActive
                ? 'rgb(var(--accent))'
                : 'rgb(var(--ink) / 0.7)';
            const marker = isDead ? 'url(#seq-dead)' : isActive ? 'url(#seq-active)' : 'url(#seq-call)';

            return (
              <g key={msg.id}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={stroke}
                  strokeWidth={isActive || isDead ? 2.3 : 1.6}
                  strokeDasharray={msg.kind === 'return' ? '5 4' : undefined}
                  markerEnd={marker}
                />
                <rect
                  x={(x1 + x2) / 2 - msg.label.length * 3.1 - 6}
                  y={y - 19}
                  width={msg.label.length * 6.2 + 12}
                  height="15"
                  rx="4"
                  fill="rgb(var(--paper))"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="10.5"
                  fontWeight={isActive || isDead ? '700' : '500'}
                  fill={stroke}
                >
                  {idx + 1}. {msg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  /* ==========================================================================
   * 3. STATE MACHINE & DISTRIBUTED HLD ARCHITECTURE TOPOLOGY VIEW
   * ========================================================================== */
  const nodes = step.nodes ?? [];
  const edges = step.edges ?? [];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox="0 0 880 340" style={{ width: '100%', maxWidth: '880px', margin: '0 auto', display: 'block' }}>
        <defs>
          <marker id="topo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--ink) / 0.65)" />
          </marker>
          <marker
            id="topo-arrow-active"
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
            id="topo-arrow-dead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--dead-stroke))" />
          </marker>
        </defs>

        {/* Directed Edges */}
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const x1 = fromNode.kind === 'start' ? fromNode.x + 12 : fromNode.x + 95;
          const y1 = fromNode.kind === 'start' ? fromNode.y : fromNode.y + 32;
          const x2 = toNode.x + 95;
          const y2 = toNode.y + 32;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.hypot(dx, dy) || 1;
          const startX = fromNode.kind === 'start' ? x1 : x1 + (dx / dist) * 85;
          const startY = fromNode.kind === 'start' ? y1 : y1 + (dy / dist) * 32;
          const endX = x2 - (dx / dist) * 88;
          const endY = y2 - (dy / dist) * 34;

          const isFired = step.firedEdgeId === edge.id || edge.active;
          const stroke = edge.rejected
            ? 'rgb(var(--dead-stroke))'
            : isFired
              ? 'rgb(var(--accent))'
              : 'rgb(var(--ink) / 0.45)';
          const marker = edge.rejected
            ? 'url(#topo-arrow-dead)'
            : isFired
              ? 'url(#topo-arrow-active)'
              : 'url(#topo-arrow)';

          return (
            <g key={edge.id}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={stroke}
                strokeWidth={isFired || edge.rejected ? 2.4 : 1.6}
                strokeDasharray={edge.dashed ? '5 4' : undefined}
                markerEnd={marker}
              />
              {edge.label && (
                <g transform={`translate(${(startX + endX) / 2}, ${(startY + endY) / 2 - 9})`}>
                  <rect
                    x={-edge.label.length * 3.1 - 5}
                    y={-10}
                    width={edge.label.length * 6.2 + 10}
                    height="15"
                    rx="4"
                    fill="rgb(var(--paper))"
                  />
                  <text
                    x={0}
                    y={1}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight={isFired ? '700' : '500'}
                    fill={stroke}
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          if (node.kind === 'start') {
            return <circle key={node.id} cx={node.x} cy={node.y} r="10" fill="rgb(var(--ink))" />;
          }

          const fill =
            node.tint === 'active'
              ? 'rgb(var(--active-bg))'
              : node.tint === 'done'
                ? 'rgb(var(--done-bg))'
                : node.tint === 'dead'
                  ? 'rgb(var(--dead-bg))'
                  : node.tint === 'gold'
                    ? 'rgb(var(--gold-bg))'
                    : 'rgb(var(--idle-bg))';
          const stroke =
            node.tint === 'active'
              ? 'rgb(var(--accent))'
              : node.tint === 'done'
                ? 'rgb(var(--done-stroke))'
                : node.tint === 'dead'
                  ? 'rgb(var(--dead-stroke))'
                  : node.tint === 'gold'
                    ? 'rgb(var(--gold-stroke))'
                    : 'rgb(var(--ink) / 0.35)';

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <rect width="190" height="64" rx="12" fill={fill} stroke={stroke} strokeWidth="2.2" />
              <text
                x="95"
                y="26"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="12.5"
                fontWeight="700"
                fill="rgb(var(--ink))"
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x="95"
                  y="44"
                  textAnchor="middle"
                  fontFamily="var(--font-sketch)"
                  fontSize="10.5"
                  fill="rgb(var(--mute))"
                >
                  {node.sublabel}
                </text>
              )}
              {node.metrics && (
                <g transform="translate(115, -10)">
                  <rect
                    width="82"
                    height="18"
                    rx="9"
                    fill="rgb(var(--surface))"
                    stroke={stroke}
                    strokeWidth="1.4"
                  />
                  <text
                    x="41"
                    y="12"
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="rgb(var(--ink))"
                  >
                    {node.metrics}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
