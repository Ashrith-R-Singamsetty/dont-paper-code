import React, { useRef, useState } from 'react';
import { SdStep, UmlClassNode } from '../../types/curriculum';

interface SystemDesignVisualizerProps {
  step: SdStep;
  highlightedVar?: string | null;
}

const InteractiveDiagramCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setScale((s) => Math.min(2, Math.max(0.6, Number((s + delta).toFixed(2)))));
    } else {
      setPan((p) => ({ x: p.x - e.deltaX * 0.6, y: p.y - e.deltaY * 0.6 }));
    }
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onWheel={handleWheel}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '330px',
        maxHeight: '420px',
        overflow: 'auto',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          width: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: dragging ? 'none' : 'transform 120ms ease-out',
        }}
      >
        {children}
      </div>

      {/* Floating Zoom / Pan Reset Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 6px',
          borderRadius: '6px',
          background: 'rgb(var(--surface) / 0.88)',
          border: '1px solid rgb(var(--ink) / 0.14)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10.5px',
          color: 'rgb(var(--mute))',
          zIndex: 5,
        }}
      >
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.15).toFixed(2))))}
          style={{ padding: '0 4px', color: 'rgb(var(--ink))' }}
          title="Zoom Out"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetView}
          style={{ padding: '0 4px', color: 'rgb(var(--mute))' }}
          title="Reset Pan & Zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => Math.min(2, Number((s + 0.15).toFixed(2))))}
          style={{ padding: '0 4px', color: 'rgb(var(--ink))' }}
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
};

function getBoxHeight(c: UmlClassNode): number {
  const fCount = c.fields?.length ?? 0;
  const mCount = c.methods?.length ?? 0;
  const stereo = c.stereotype ? 16 : 0;
  const rowsHeight = (fCount + mCount) * 19 + (fCount > 0 && mCount > 0 ? 12 : 6);
  return Math.max(76, 36 + stereo + rowsHeight + 12);
}

export const SystemDesignVisualizer: React.FC<SystemDesignVisualizerProps> = ({ step, highlightedVar }) => {
  // 1. UML CLASS DIAGRAM RENDERER
  if (step.view === 'class') {
    const cd = step.classDiagram;
    const rawClasses = cd ? cd.classes : step.classes ?? [];
    const rawRelations = cd ? cd.relations : step.relations ?? [];
    const shownClassIds = cd?.shownClassIds;
    const shownRelIds = cd?.shownRelIds;
    const activeIds = new Set(cd?.activeIds ?? []);

    // Convert grid coordinates (0, 1, 2) to well-spaced canvas pixel coordinates
    const classes: Array<UmlClassNode & { isShown: boolean; isActive: boolean }> = rawClasses.map((c) => {
      const normX = c.x <= 12 ? c.x * 245 + 36 : c.x;
      const normY = c.y <= 12 ? c.y * 175 + 24 : c.y;
      const isShown = !shownClassIds || shownClassIds.includes(c.id);
      const isActive = activeIds.has(c.id) || c.tint === 'active';
      return {
        ...c,
        x: normX,
        y: normY,
        w: c.w ?? 195,
        isShown,
        isActive,
      };
    });

    const classMap = new Map(classes.map((c) => [c.id, c]));
    const maxY = classes.reduce((acc, c) => Math.max(acc, c.y + getBoxHeight(c) + 20), 340);

    return (
      <InteractiveDiagramCanvas>
        <svg viewBox={`0 0 760 ${maxY}`} style={{ width: '100%', height: 'auto', maxHeight: '340px', overflow: 'visible' }}>
          <defs>
            {/* Open triangle for extends / implements */}
            <marker id="uml-triangle" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto">
              <path d="M 1 1 L 11 6 L 1 11 z" fill="rgb(var(--surface))" stroke="rgb(var(--sketch))" strokeWidth="1.6" />
            </marker>
            {/* Filled diamond for composition */}
            <marker id="uml-diamond-filled" viewBox="0 0 14 10" refX="13" refY="5" markerWidth="10" markerHeight="8" orient="auto">
              <polygon points="1,5 7,1 13,5 7,9" fill="rgb(var(--sketch))" stroke="rgb(var(--sketch))" strokeWidth="1.2" />
            </marker>
            {/* Hollow diamond for aggregation */}
            <marker id="uml-diamond-hollow" viewBox="0 0 14 10" refX="13" refY="5" markerWidth="10" markerHeight="8" orient="auto">
              <polygon points="1,5 7,1 13,5 7,9" fill="rgb(var(--surface))" stroke="rgb(var(--sketch))" strokeWidth="1.5" />
            </marker>
            {/* Open arrow for association / dependency */}
            <marker id="uml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="rgb(var(--sketch))" strokeWidth="1.6" />
            </marker>
            <marker id="uml-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="rgb(var(--accent))" strokeWidth="1.8" />
            </marker>
          </defs>

          {/* UML Relationship Connectors */}
          {rawRelations.map((rel) => {
            const src = classMap.get(rel.from);
            const dst = classMap.get(rel.to);
            if (!src || !dst) return null;

            const isRelShown = !shownRelIds || shownRelIds.includes(rel.id);
            const isRelActive =
              rel.active ||
              (isRelShown && (activeIds.has(rel.id) || (activeIds.has(rel.from) && activeIds.has(rel.to))));

            const srcW = src.w ?? 195;
            const dstW = dst.w ?? 195;
            const srcH = getBoxHeight(src);
            const dstH = getBoxHeight(dst);

            const srcCx = src.x + srcW / 2;
            const srcCy = src.y + srcH / 2;
            const dstCx = dst.x + dstW / 2;
            const dstCy = dst.y + dstH / 2;

            let x1 = srcCx;
            let y1 = srcCy;
            let x2 = dstCx;
            let y2 = dstCy;

            if (Math.abs(dstCx - srcCx) > Math.abs(dstCy - srcCy)) {
              x1 = dstCx > srcCx ? src.x + srcW : src.x;
              x2 = dstCx > srcCx ? dst.x : dst.x + dstW;
            } else {
              y1 = dstCy > srcCy ? src.y + srcH : src.y;
              y2 = dstCy > srcCy ? dst.y : dst.y + dstH;
            }

            const isDashed = rel.kind === 'implement' || rel.kind === 'depend' || rel.broken;
            let markerEnd = 'url(#uml-arrow)';
            if (rel.kind === 'inherit' || rel.kind === 'implement') markerEnd = 'url(#uml-triangle)';
            else if (rel.kind === 'compose') markerEnd = 'url(#uml-diamond-filled)';
            else if (rel.kind === 'aggregate') markerEnd = 'url(#uml-diamond-hollow)';
            else if (isRelActive) markerEnd = 'url(#uml-arrow-active)';

            const stroke = rel.broken
              ? 'rgb(var(--dead-stroke))'
              : isRelActive
                ? 'rgb(var(--accent))'
                : 'rgb(var(--sketch) / 0.65)';

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g
                key={rel.id}
                style={{
                  opacity: isRelShown ? 1 : 0.16,
                  transition: 'opacity 300ms ease',
                }}
              >
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={isRelActive ? 2.2 : 1.5}
                  strokeDasharray={isDashed ? '5 4' : undefined}
                  markerEnd={markerEnd}
                />
                {rel.label && isRelShown && (
                  <g>
                    <rect
                      x={midX - (rel.label.length * 3.4 + 8)}
                      y={midY - 10}
                      width={rel.label.length * 6.8 + 16}
                      height={18}
                      rx={4}
                      fill="rgb(var(--paper))"
                      stroke={stroke}
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="9.5"
                      fontWeight="600"
                      fill={isRelActive ? 'rgb(var(--accent))' : 'rgb(var(--sketch))'}
                    >
                      {rel.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 3-Compartment UML Class Nodes (Shown at full opacity, Unshown ghosted at 0.16 like ChaiCode LLD) */}
          {classes.map((cls) => {
            const w = cls.w ?? 195;
            const h = getBoxHeight(cls);
            const headerH = cls.stereotype ? 44 : 32;
            const fCount = cls.fields?.length ?? 0;
            const mCount = cls.methods?.length ?? 0;

            const borderStroke = cls.isActive
              ? 'rgb(var(--accent))'
              : cls.tint === 'done'
                ? 'rgb(var(--done-stroke))'
                : cls.tint === 'dead'
                  ? 'rgb(var(--dead-stroke))'
                  : 'rgb(var(--ink) / 0.25)';

            const headerFill = cls.isActive
              ? 'rgb(var(--accent) / 0.16)'
              : cls.tint === 'done'
                ? 'rgb(var(--done-bg))'
                : 'rgb(var(--ink) / 0.04)';

            return (
              <g
                key={cls.id}
                style={{
                  opacity: cls.isShown ? 1 : 0.28,
                  transition: 'all 280ms ease',
                }}
              >
                {/* Outer Active Glow */}
                {cls.isActive && (
                  <rect
                    x={cls.x - 3}
                    y={cls.y - 3}
                    width={w + 6}
                    height={h + 6}
                    rx={10}
                    fill="none"
                    stroke="rgb(var(--accent) / 0.32)"
                    strokeWidth={2.5}
                  />
                )}

                {/* Main Class Box */}
                <rect
                  x={cls.x}
                  y={cls.y}
                  width={w}
                  height={h}
                  rx={7}
                  fill="rgb(var(--paper))"
                  stroke={borderStroke}
                  strokeWidth={cls.isActive ? 2.2 : 1.4}
                />

                {/* Header Tint */}
                <rect
                  x={cls.x + 1}
                  y={cls.y + 1}
                  width={w - 2}
                  height={headerH}
                  rx={6}
                  fill={headerFill}
                />

                {/* Stereotype («interface», «abstract», etc.) */}
                {cls.stereotype && (
                  <text
                    x={cls.x + w / 2}
                    y={cls.y + 15}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9.5"
                    fill="rgb(var(--mute))"
                  >
                    «{cls.stereotype}»
                  </text>
                )}

                {/* Class Name */}
                <text
                  x={cls.x + w / 2}
                  y={cls.y + (cls.stereotype ? 32 : 21)}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="13"
                  fontWeight="700"
                  fill="rgb(var(--ink))"
                >
                  {cls.name}
                </text>

                {/* Divider below class header */}
                <line
                  x1={cls.x}
                  y1={cls.y + headerH}
                  x2={cls.x + w}
                  y2={cls.y + headerH}
                  stroke={borderStroke}
                  strokeWidth="1.1"
                />

                {/* Fields Compartment */}
                {(cls.fields ?? []).map((f, idx) => (
                  <text
                    key={`f-${idx}`}
                    x={cls.x + 12}
                    y={cls.y + headerH + 16 + idx * 19}
                    fontFamily="var(--font-mono)"
                    fontSize="11"
                    fill="rgb(var(--sketch))"
                  >
                    {f}
                  </text>
                ))}

                {/* Divider between fields and methods */}
                {fCount > 0 && mCount > 0 && (
                  <line
                    x1={cls.x}
                    y1={cls.y + headerH + fCount * 19 + 8}
                    x2={cls.x + w}
                    y2={cls.y + headerH + fCount * 19 + 8}
                    stroke="rgb(var(--ink) / 0.14)"
                    strokeWidth="1"
                  />
                )}

                {/* Methods Compartment */}
                {(cls.methods ?? []).map((m, idx) => {
                  const baseOffset = headerH + (fCount > 0 ? fCount * 19 + 10 : 0);
                  return (
                    <text
                      key={`m-${idx}`}
                      x={cls.x + 12}
                      y={cls.y + baseOffset + 15 + idx * 19}
                      fontFamily="var(--font-mono)"
                      fontSize="11"
                      fill="rgb(var(--ink))"
                    >
                      {m}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </InteractiveDiagramCanvas>
    );
  }

  // 2. SEQUENCE DIAGRAM RENDERER
  if (step.view === 'sequence') {
    const seq = step.sequence;
    const actors = seq ? seq.actors : step.participants ?? [];
    const allMessages = seq ? seq.messages : step.messages ?? [];
    const shownCount = seq?.shownCount ?? allMessages.length;
    const activeIndex = seq?.activeIndex;

    const count = Math.max(1, actors.length);
    const spacing = Math.min(175, Math.floor(680 / count));
    const startX = Math.max(85, Math.floor((760 - (count - 1) * spacing) / 2));
    const totalHeight = Math.max(290, 95 + allMessages.length * 46 + 30);

    const participantX = new Map<string, number>();
    actors.forEach((p, idx) => {
      participantX.set(p.id, startX + idx * spacing);
    });

    // Determine which actors are active in the current message
    const activeMsg = activeIndex !== undefined ? allMessages[activeIndex] : undefined;

    return (
      <InteractiveDiagramCanvas>
        <svg viewBox={`0 0 760 ${totalHeight}`} style={{ width: '100%', height: 'auto', maxHeight: '360px' }}>
          <defs>
            <marker id="seq-call" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <polygon points="1,1 9,5 1,9" fill="rgb(var(--sketch))" />
            </marker>
            <marker id="seq-call-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <polygon points="1,1 9,5 1,9" fill="rgb(var(--accent))" />
            </marker>
            <marker id="seq-return" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="rgb(var(--mute))" strokeWidth="1.6" />
            </marker>
          </defs>

          {/* Participant Lifelines */}
          {actors.map((p) => {
            const cx = participantX.get(p.id) ?? 100;
            const isActorActive =
              p.active || (activeMsg && (activeMsg.from === p.id || activeMsg.to === p.id));
            return (
              <g key={p.id}>
                <line
                  x1={cx}
                  y1={56}
                  x2={cx}
                  y2={totalHeight - 18}
                  stroke={isActorActive ? 'rgb(var(--accent) / 0.5)' : 'rgb(var(--ink) / 0.18)'}
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
                <rect
                  x={cx - 64}
                  y={14}
                  width={128}
                  height={38}
                  rx={7}
                  fill={isActorActive ? 'rgb(var(--accent) / 0.15)' : 'rgb(var(--paper))'}
                  stroke={isActorActive ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.28)'}
                  strokeWidth={isActorActive ? 2 : 1.4}
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
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Horizontal Message Arrows (Shown at full opacity, future messages ghosted at 0.15) */}
          {allMessages.map((msg, idx) => {
            const x1 = participantX.get(msg.from) ?? 100;
            const x2 = participantX.get(msg.to) ?? 260;
            const y = 88 + idx * 44;
            const isShown = idx < shownCount;
            const isActive =
              isShown &&
              ((activeIndex !== undefined && idx === activeIndex) ||
                msg.id === step.activeMessageId ||
                msg.status === 'active');
            const isReturn = msg.kind === 'return';
            const isSelf = msg.from === msg.to || msg.kind === 'self';

            const stroke =
              msg.status === 'dead'
                ? 'rgb(var(--dead-stroke))'
                : isActive
                  ? 'rgb(var(--accent))'
                  : isReturn
                    ? 'rgb(var(--mute))'
                    : 'rgb(var(--sketch))';

            if (isSelf) {
              return (
                <g key={msg.id} style={{ opacity: isShown ? 1 : 0.14, transition: 'opacity 250ms ease' }}>
                  <path
                    d={`M ${x1} ${y - 6} L ${x1 + 38} ${y - 6} L ${x1 + 38} ${y + 12} L ${x1 + 4} ${y + 12}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    markerEnd={isActive ? 'url(#seq-call-active)' : 'url(#seq-call)'}
                  />
                  <text
                    x={x1 + 44}
                    y={y + 6}
                    fontFamily="var(--font-mono)"
                    fontSize="10.5"
                    fontWeight={isActive ? '700' : '500'}
                    fill={isActive ? 'rgb(var(--accent))' : 'rgb(var(--ink))'}
                  >
                    {msg.label}
                  </text>
                </g>
              );
            }

            const dir = x2 >= x1 ? 1 : -1;
            const midX = (x1 + x2) / 2;

            return (
              <g key={msg.id} style={{ opacity: isShown ? 1 : 0.14, transition: 'opacity 250ms ease' }}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2 - dir * 5}
                  y2={y}
                  stroke={stroke}
                  strokeWidth={isActive ? 2.3 : 1.5}
                  strokeDasharray={isReturn ? '5 4' : undefined}
                  markerEnd={
                    isReturn ? 'url(#seq-return)' : isActive ? 'url(#seq-call-active)' : 'url(#seq-call)'
                  }
                />
                <text
                  x={midX}
                  y={y - 7}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="10.5"
                  fontWeight={isActive ? '700' : '500'}
                  fill={isActive ? 'rgb(var(--accent))' : 'rgb(var(--ink))'}
                >
                  {msg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </InteractiveDiagramCanvas>
    );
  }

  // 3. STATE MACHINE & DISTRIBUTED HLD ARCHITECTURE RENDERER
  const st = step.state;
  const rawNodes = st ? st.nodes : step.nodes ?? [];
  const rawEdges = st ? st.edges : step.edges ?? [];
  const activeNodeId = st?.activeId;
  const firedEdgeId = st?.firedEdgeId ?? step.firedEdgeId;

  const nodes = rawNodes.map((n) => ({
    ...n,
    x: n.x <= 12 ? n.x * 230 + 40 : n.x,
    y: n.y <= 12 ? n.y * 135 + 45 : n.y,
    tint: n.id === activeNodeId ? 'active' : n.tint,
  }));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const maxY = nodes.reduce((acc, n) => Math.max(acc, n.y + 100), 330);

  return (
    <InteractiveDiagramCanvas>
      <svg viewBox={`0 0 760 ${maxY}`} style={{ width: '100%', height: 'auto', maxHeight: '360px' }}>
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 1 1 L 9 5 L 1 9 z" fill="rgb(var(--sketch))" />
          </marker>
          <marker id="arch-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 1 1 L 9 5 L 1 9 z" fill="rgb(var(--accent))" />
          </marker>
          <marker id="arch-arrow-dead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 1 1 L 9 5 L 1 9 z" fill="rgb(var(--dead-stroke))" />
          </marker>
        </defs>

        {/* Directed Edges */}
        {rawEdges.map((edge) => {
          const src = nodeMap.get(edge.from);
          const dst = nodeMap.get(edge.to);
          if (!src || !dst) return null;

          const isFired = edge.active || edge.id === firedEdgeId;

          if (edge.from === edge.to) {
            const cx = src.x + 75;
            const cy = src.y;
            return (
              <g key={edge.id}>
                <path
                  d={`M ${cx - 20} ${cy} C ${cx - 35} ${cy - 45}, ${cx + 35} ${cy - 45}, ${cx + 20} ${cy}`}
                  fill="none"
                  stroke={isFired ? 'rgb(var(--accent))' : 'rgb(var(--sketch) / 0.45)'}
                  strokeWidth={isFired ? 2.4 : 1.5}
                  markerEnd={isFired ? 'url(#arch-arrow-active)' : 'url(#arch-arrow)'}
                />
                {edge.label && (
                  <text
                    x={cx}
                    y={cy - 38}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="600"
                    fill={isFired ? 'rgb(var(--accent))' : 'rgb(var(--mute))'}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          }

          const srcCx = src.x + 75;
          const srcCy = src.y + 30;
          const dstCx = dst.x + 75;
          const dstCy = dst.y + 30;

          const dx = dstCx - srcCx;
          const dy = dstCy - srcCy;
          const len = Math.hypot(dx, dy) || 1;
          const x1 = srcCx + (dx / len) * 65;
          const y1 = srcCy + (dy / len) * 28;
          const x2 = dstCx - (dx / len) * 68;
          const y2 = dstCy - (dy / len) * 30;

          const stroke = edge.rejected
            ? 'rgb(var(--dead-stroke))'
            : isFired
              ? 'rgb(var(--accent))'
              : 'rgb(var(--sketch) / 0.45)';
          const marker = edge.rejected
            ? 'url(#arch-arrow-dead)'
            : isFired
              ? 'url(#arch-arrow-active)'
              : 'url(#arch-arrow)';

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={edge.id}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={stroke}
                strokeWidth={isFired || edge.rejected ? 2.4 : 1.5}
                strokeDasharray={edge.dashed ? '5 4' : undefined}
                markerEnd={marker}
              />
              {edge.label && (
                <g>
                  <rect
                    x={midX - (edge.label.length * 3.2 + 8)}
                    y={midY - 10}
                    width={edge.label.length * 6.4 + 16}
                    height={18}
                    rx={4}
                    fill="rgb(var(--paper))"
                    stroke={stroke}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9.5"
                    fontWeight={isFired ? '700' : '500'}
                    fill={
                      edge.rejected
                        ? 'rgb(var(--dead-stroke))'
                        : isFired
                          ? 'rgb(var(--accent))'
                          : 'rgb(var(--sketch))'
                    }
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* State / Architecture Nodes */}
        {nodes.map((node) => {
          const isActive = node.tint === 'active';
          const fill = isActive
            ? 'rgb(var(--active-bg))'
            : node.tint === 'done'
              ? 'rgb(var(--done-bg))'
              : node.tint === 'dead'
                ? 'rgb(var(--dead-bg))'
                : node.tint === 'gold'
                  ? 'rgb(var(--gold-bg))'
                  : 'rgb(var(--paper))';
          const stroke = isActive
            ? 'rgb(var(--accent))'
            : node.tint === 'done'
              ? 'rgb(var(--done-stroke))'
              : node.tint === 'dead'
                ? 'rgb(var(--dead-stroke))'
                : node.tint === 'gold'
                  ? 'rgb(var(--gold-stroke))'
                  : 'rgb(var(--ink) / 0.28)';

          return (
            <g key={node.id}>
              {isActive && (
                <rect
                  x={node.x - 3}
                  y={node.y - 3}
                  width={156}
                  height={64}
                  rx={node.kind === 'state' ? 28 : 11}
                  fill="none"
                  stroke="rgb(var(--accent) / 0.3)"
                  strokeWidth={2.5}
                />
              )}
              <rect
                x={node.x}
                y={node.y}
                width={150}
                height={58}
                rx={node.kind === 'state' ? 26 : 9}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <text
                x={node.x + 75}
                y={node.y + (node.sublabel ? 24 : 34)}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="12"
                fontWeight="700"
                fill="rgb(var(--ink))"
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={node.x + 75}
                  y={node.y + 42}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="9.5"
                  fill="rgb(var(--mute))"
                >
                  {node.sublabel}
                </text>
              )}
              {node.metrics && (
                <g>
                  <rect
                    x={node.x + 25}
                    y={node.y - 11}
                    width={100}
                    height={16}
                    rx={4}
                    fill="rgb(var(--paper))"
                    stroke={stroke}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x + 75}
                    y={node.y}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fontWeight="700"
                    fill={stroke}
                  >
                    {node.metrics}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </InteractiveDiagramCanvas>
  );
};
