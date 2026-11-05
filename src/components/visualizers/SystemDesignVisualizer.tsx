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

function normalizeClassCoords(node: UmlClassNode): { x: number; y: number; w: number } {
  const w = node.w ?? 215;
  // In chaicode_lld_full.json, x is 0..3.2 and y is 0..2.2 grid units
  const isGrid = node.x <= 12 && node.y <= 12;
  const x = isGrid ? Math.round(node.x * 255 + 30) : node.x;
  const y = isGrid ? Math.round(node.y * 145 + 24) : node.y;
  return { x, y, w };
}

function getClassBox(node: UmlClassNode): BoxRect {
  const { x, y, w } = normalizeClassCoords(node);
  const headerH = node.stereotype ? 44 : 32;
  const fieldsH = node.fields?.length ? node.fields.length * 18 + 12 : 0;
  const methodsH = node.methods?.length ? node.methods.length * 18 + 12 : 0;
  const h = Math.max(62, headerH + fieldsH + methodsH + 6);
  return {
    x,
    y,
    w,
    h,
    cx: x + w / 2,
    cy: y + h / 2,
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
   * 1. UML CLASS DIAGRAM VIEW (Supports both step.classDiagram & step.classes)
   * ========================================================================== */
  const cd = step.classDiagram;
  const rawClasses = cd ? cd.classes : step.classes;
  const rawRelations = cd ? cd.relations : step.relations;

  if (step.view === 'class' && rawClasses) {
    const shownClassSet = cd?.shownClassIds ? new Set(cd.shownClassIds) : null;
    const shownRelSet = cd?.shownRelIds ? new Set(cd.shownRelIds) : null;
    const activeIdSet = new Set(cd?.activeIds ?? []);

    const visibleClasses = shownClassSet ? rawClasses.filter((c) => shownClassSet.has(c.id)) : rawClasses;
    const visibleRelations = (rawRelations ?? []).filter((r) => {
      if (shownRelSet && !shownRelSet.has(r.id)) return false;
      if (shownClassSet && (!shownClassSet.has(r.from) || !shownClassSet.has(r.to))) return false;
      return true;
    });

    const boxes = new Map<string, BoxRect>();
    visibleClasses.forEach((c) => boxes.set(c.id, getClassBox(c)));

    const maxBottom = Math.max(380, ...Array.from(boxes.values()).map((b) => b.y + b.h + 36));
    const maxRight = Math.max(920, ...Array.from(boxes.values()).map((b) => b.x + b.w + 36));

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        {cd?.note && (
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span className="ui-chip" style={{ color: 'rgb(var(--accent))', fontWeight: 700 }}>
              {cd.note}
            </span>
          </div>
        )}
        <div style={{ position: 'relative', width: `${maxRight}px`, height: `${maxBottom}px`, margin: '0 auto' }}>
          <svg
            viewBox={`0 0 ${maxRight} ${maxBottom}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
          >
            <defs>
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

            {visibleRelations.map((rel) => {
              const fromBox = boxes.get(rel.from);
              const toBox = boxes.get(rel.to);
              if (!fromBox || !toBox) return null;

              const start = clipRayToBox(fromBox, toBox.cx, toBox.cy);
              const end = clipRayToBox(toBox, fromBox.cx, fromBox.cy);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              const isDashed = rel.kind === 'implement' || rel.kind === 'depend';
              const isRelActive = rel.active || activeIdSet.has(rel.id);
              const stroke = rel.broken
                ? 'rgb(var(--dead-stroke))'
                : isRelActive
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
                    strokeWidth={isRelActive ? 2.4 : 1.7}
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

          {visibleClasses.map((cls) => {
            const box = boxes.get(cls.id)!;
            const isClsActive = activeIdSet.has(cls.id) || cls.tint === 'active';
            let border = 'rgb(var(--ink) / 0.35)';
            let headerBg = 'rgb(var(--surface-alt))';

            if (isClsActive) {
              border = 'rgb(var(--accent))';
              headerBg = 'rgb(var(--active-bg))';
            } else if (cls.tint === 'done' || cls.tint === 'green') {
              border = 'rgb(var(--done-stroke))';
              headerBg = 'rgb(var(--done-bg))';
            } else if (cls.tint === 'dead' || cls.tint === 'red') {
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
                  boxShadow: isClsActive
                    ? '0 6px 18px rgb(var(--accent) / 0.16)'
                    : '0 3px 10px rgb(var(--ink) / 0.06)',
                  zIndex: 2,
                  overflow: 'hidden',
                  transition: 'all 220ms ease',
                }}
              >
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
   * 2. SEQUENCE DIAGRAM VIEW (Supports both step.sequence & step.participants)
   * ========================================================================== */
  const seq = step.sequence;
  const participants = seq ? seq.actors : step.participants;
  const allMessages = seq ? seq.messages : step.messages ?? [];
  const shownMessages =
    seq?.shownCount !== undefined ? allMessages.slice(0, seq.shownCount) : allMessages;

  if (step.view === 'sequence' && participants) {
    const count = participants.length;
    const colSpacing = 740 / Math.max(1, count);
    const svgHeight = Math.max(270, 95 + shownMessages.length * 46);

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        {seq?.note && (
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span className="ui-chip" style={{ color: 'rgb(var(--accent))', fontWeight: 700 }}>
              {seq.note}
            </span>
          </div>
        )}
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

          {participants.map((p, idx) => {
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

          {shownMessages.map((msg, idx) => {
            const fromIdx = participants.findIndex((p) => p.id === msg.from);
            const toIdx = participants.findIndex((p) => p.id === msg.to);
            if (fromIdx === -1 || toIdx === -1) return null;

            const x1 = 85 + fromIdx * colSpacing;
            const x2 = 85 + toIdx * colSpacing;
            const y = 92 + idx * 44;
            const isActive =
              seq?.activeIndex === idx || step.activeMessageId === msg.id || msg.status === 'active';
            const isDead = msg.status === 'dead';

            const stroke = isDead
              ? 'rgb(var(--dead-stroke))'
              : isActive
                ? 'rgb(var(--accent))'
                : 'rgb(var(--ink) / 0.7)';
            const marker = isDead ? 'url(#seq-dead)' : isActive ? 'url(#seq-active)' : 'url(#seq-call)';

            // Handle self-call loop (from === to)
            if (fromIdx === toIdx) {
              return (
                <g key={msg.id || idx}>
                  <path
                    d={`M ${x1} ${y - 6} L ${x1 + 42} ${y - 6} L ${x1 + 42} ${y + 12} L ${x1 + 4} ${y + 12}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={isActive ? 2.2 : 1.6}
                    markerEnd={marker}
                  />
                  <text
                    x={x1 + 48}
                    y={y + 6}
                    fontFamily="var(--font-mono)"
                    fontSize="10.5"
                    fontWeight={isActive ? '700' : '500'}
                    fill={stroke}
                  >
                    {idx + 1}. {msg.label}
                  </text>
                </g>
              );
            }

            return (
              <g key={msg.id || idx}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={stroke}
                  strokeWidth={isActive || isDead ? 2.3 : 1.6}
                  strokeDasharray={msg.kind === 'return' || msg.kind === 'create' ? '5 4' : undefined}
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
  const st = step.state;
  const rawNodes = st ? st.nodes : step.nodes ?? [];
  const edges = st ? st.edges : step.edges ?? [];
  const activeNodeId = st?.activeId;
  const firedEdgeId = st?.firedEdgeId ?? step.firedEdgeId;

  const nodes = rawNodes.map((n) => {
    const isGrid = n.x <= 12 && n.y <= 12;
    return {
      ...n,
      x: isGrid ? Math.round(n.x * 235 + 45) : n.x,
      y: isGrid ? Math.round(n.y * 125 + 40) : n.y,
      tint: n.id === activeNodeId ? 'active' : n.tint,
    };
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {st?.label && (
        <div style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
          <span className="ui-chip" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
            State Machine · {st.label}
          </span>
        </div>
      )}
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

        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const isFired = firedEdgeId === edge.id || edge.active;
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

          // Self-loop state transition
          if (edge.from === edge.to) {
            const cx = fromNode.x + 85;
            const cy = fromNode.y;
            return (
              <g key={edge.id}>
                <path
                  d={`M ${cx - 25} ${cy} C ${cx - 45} ${cy - 44}, ${cx + 45} ${cy - 44}, ${cx + 25} ${cy}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isFired ? 2.4 : 1.6}
                  markerEnd={marker}
                />
                {edge.label && (
                  <text
                    x={cx}
                    y={cy - 36}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="700"
                    fill={stroke}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          }

          const x1 = fromNode.x + 85;
          const y1 = fromNode.y + 30;
          const x2 = toNode.x + 85;
          const y2 = toNode.y + 30;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.hypot(dx, dy) || 1;
          const startX = x1 + (dx / dist) * 78;
          const startY = y1 + (dy / dist) * 30;
          const endX = x2 - (dx / dist) * 82;
          const endY = y2 - (dy / dist) * 32;

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

        {nodes.map((node) => {
          if (node.kind === 'start' && !node.label) {
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
              <rect width="170" height="58" rx="12" fill={fill} stroke={stroke} strokeWidth="2.2" />
              <text
                x="85"
                y={node.sublabel ? '24' : '34'}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="12.5"
                fontWeight="700"
                fill="rgb(var(--ink))"
              >
                {node.kind === 'start' ? `● ${node.label}` : node.kind === 'final' ? `◎ ${node.label}` : node.label}
              </text>
              {node.sublabel && (
                <text
                  x="85"
                  y="42"
                  textAnchor="middle"
                  fontFamily="var(--font-sketch)"
                  fontSize="10.5"
                  fill="rgb(var(--mute))"
                >
                  {node.sublabel}
                </text>
              )}
              {node.metrics && (
                <g transform="translate(95, -10)">
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
