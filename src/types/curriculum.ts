export type TrackKind = 'dsa' | 'system-design';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaRenderMode = 'cells' | 'bars' | 'list' | 'tree' | 'graph' | 'matrix' | 'heap';

export interface PointerBadge {
  name: string;
  index: number;
  color?: 'accent' | 'blue' | 'green' | 'red' | 'gold';
  lane?: number;
}

export interface ArrayRegion {
  start: number;
  end: number;
  label?: string;
  tint?: 'accent' | 'blue' | 'green' | 'gold';
}

export interface LinkedListArc {
  from: number;
  to: number | null; // null means points to NULL
  status?: 'idle' | 'active' | 'done' | 'broken';
  label?: string;
}

export interface TreeNodeData {
  id: string;
  val: string | number;
  x: number; // 0..100 percentage coordinate
  y: number;
  leftId?: string;
  rightId?: string;
  childrenIds?: string[];
  state?: 'idle' | 'active' | 'done' | 'dead' | 'gold';
  badge?: string;
}

export interface GraphNodeData {
  id: string;
  label: string;
  x: number; // 0..640 SVG coordinate
  y: number; // 0..250 SVG coordinate
  dist?: string | number;
  state?: 'idle' | 'active' | 'done' | 'gold' | 'dead';
}

export interface GraphEdgeData {
  from: string;
  to: string;
  weight?: number | string;
  directed?: boolean;
  state?: 'idle' | 'active' | 'done' | 'dead';
}

export interface MatrixData {
  rowLabels?: string[];
  colLabels?: string[];
  grid: Array<Array<string | number>>;
  activeCells?: Array<[number, number]>;
  doneCells?: Array<[number, number]>;
  readCells?: Array<[number, number]>;
  bestCells?: Array<[number, number]>;
}

export interface DsaStep {
  codeLine: number;
  narration: string;
  vars: Array<[string, string | number]>;
  arrValues?: Array<string | number>;
  highlights?: number[];
  reads?: number[];
  dimmed?: number[];
  doneIndices?: number[];
  swapPair?: [number, number];
  pointers?: PointerBadge[];
  regions?: ArrayRegion[];
  bestIndices?: number[];
  bestLabel?: string;
  waterLevels?: number[];
  listLinks?: LinkedListArc[];
  treeNodes?: TreeNodeData[];
  graphNodes?: GraphNodeData[];
  graphEdges?: GraphEdgeData[];
  matrix?: MatrixData;
  auxLabel?: string;
  auxItems?: Array<string | number>;
  callStack?: string[];
}

export interface PracticeRubric {
  prompt: string;
  starterHint: string;
  requiredGroups: Array<{
    concept: string;
    keywords: string[];
    missingHint: string;
  }>;
  forbiddenPatterns?: Array<{
    pattern: RegExp;
    reason: string;
  }>;
}

export interface DsaApproach {
  label: string;
  complexity: {
    time: string;
    space: string;
  };
  pseudocode: string[];
  steps: DsaStep[];
}

export interface DsaProblem {
  id: string;
  patternId: string;
  title: string;
  subtitle: string;
  kind: 'concept' | 'problem';
  difficulty: Difficulty;
  leetcodeId?: number;
  companies: string[];
  statement: string;
  inputDisplay: string;
  render: DsaRenderMode;
  approaches: DsaApproach[];
  rubric: PracticeRubric;
}

export interface DsaPattern {
  id: string;
  number: string;
  title: string;
  tagline: string;
}

/* ============================================================================
 * System Design (LLD + HLD) Types — Unified Step-by-Step Visual Engine
 * ============================================================================ */

export type SdDiagramView = 'class' | 'sequence' | 'state' | 'architecture';

export type UmlRelationKind =
  | 'inherit'
  | 'implement'
  | 'compose'
  | 'aggregate'
  | 'assoc'
  | 'depend';

export interface UmlClassNode {
  id: string;
  name: string;
  stereotype?: 'interface' | 'abstract' | 'service' | 'entity' | 'store' | 'controller';
  x: number;
  y: number;
  w?: number;
  fields?: string[];
  methods?: string[];
  tint?: 'idle' | 'active' | 'done' | 'dead' | 'gold';
  badge?: string;
}

export interface UmlClassEdge {
  id: string;
  from: string;
  to: string;
  kind: UmlRelationKind;
  label?: string;
  toMult?: string;
  active?: boolean;
  broken?: boolean;
}

export interface SequenceParticipant {
  id: string;
  label: string;
  kind?: 'actor' | 'service' | 'store' | 'object' | 'queue';
  active?: boolean;
}

export interface SequenceMessage {
  id: string;
  from: string;
  to: string;
  label: string;
  kind?: 'call' | 'return' | 'self' | 'create' | 'async';
  status?: 'active' | 'done' | 'dead';
  note?: string;
}

export interface StateOrArchNode {
  id: string;
  label: string;
  sublabel?: string;
  kind?: 'start' | 'state' | 'final' | 'client' | 'gateway' | 'service' | 'cache' | 'db' | 'queue';
  x: number;
  y: number;
  tint?: 'idle' | 'active' | 'done' | 'dead' | 'gold';
  metrics?: string;
}

export interface StateOrArchEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  active?: boolean;
  dashed?: boolean;
  rejected?: boolean;
}

export interface SdStep {
  view: SdDiagramView;
  codeLine: number;
  narration: string;
  vars?: Array<[string, string | number]>;
  classes?: UmlClassNode[];
  relations?: UmlClassEdge[];
  participants?: SequenceParticipant[];
  messages?: SequenceMessage[];
  activeMessageId?: string;
  nodes?: StateOrArchNode[];
  edges?: StateOrArchEdge[];
  firedEdgeId?: string;
}

export interface SdApproach {
  label: string;
  badge?: string;
  code: string[];
  steps: SdStep[];
}

export interface SystemDesignLesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  kind: 'concept' | 'lld' | 'hld' | 'case-study';
  difficulty: Difficulty;
  companies: string[];
  statement: string;
  theoryMarkdown: string;
  approaches: SdApproach[];
  rubric: PracticeRubric;
}

export interface SystemDesignModule {
  id: string;
  number: string;
  title: string;
  tagline: string;
  trackType: 'LLD' | 'HLD';
}
