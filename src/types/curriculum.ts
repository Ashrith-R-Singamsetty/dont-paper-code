export type TrackKind = 'dsa' | 'system-design';

export type Difficulty = 'Intro' | 'Easy' | 'Medium' | 'Hard';

export type DsaRenderMode = 'cells' | 'bars' | 'list' | 'tree' | 'graph' | 'matrix' | 'heap';

export interface PointerBadge {
  name: string;
  index: number;
  color?: 'accent' | 'blue' | 'green' | 'red' | 'gold' | string;
  lane?: number;
}

export interface ArrayRegion {
  start: number;
  end: number;
  label?: string;
  tint?: 'accent' | 'blue' | 'green' | 'gold' | 'red' | 'gray' | string;
}

export interface LinkedListArc {
  from: number;
  to: number | null;
  status?: 'idle' | 'active' | 'done' | 'broken';
  label?: string;
}

export interface TreeNodeData {
  id: string;
  val: string | number;
  x: number;
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
  x: number;
  y: number;
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

export interface DsaBestMarker {
  indices: number[];
  label?: string;
}

export interface DsaAreaOverlay {
  left: number;
  right: number;
  height: number;
  label?: string;
}

export interface DsaAuxArray {
  label: string;
  values: Array<string | number>;
  highlights?: number[];
  dimmed?: number[];
  pointers?: PointerBadge[];
}

export interface DsaLevelLine {
  id: string;
  y: number;
  xStart: number;
  xEnd: number;
  color?: string;
  style?: string;
  label?: string;
}

export interface DsaStep {
  codeLine?: number; // 1-based line number in pseudocode
  narration: string;
  vars?: Array<[string, string | number]>;
  arrValues?: Array<string | number>;
  arrIds?: Array<string | number>;
  highlights?: number[];
  reads?: number[];
  dimmed?: number[];
  doneIndices?: number[];
  swapPair?: [number, number];
  pointers?: PointerBadge[];
  regions?: ArrayRegion[];
  best?: DsaBestMarker;
  bestIndices?: number[];
  bestLabel?: string;
  area?: DsaAreaOverlay;
  waterLevels?: number[];
  waterColumns?: number[];
  levels?: DsaLevelLine[];
  aux?: DsaAuxArray;
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
  subtitle?: string;
  kind: 'concept' | 'problem';
  difficulty?: Difficulty;
  leetcode?: {
    id: number;
    slug: string;
    difficulty: Difficulty;
  };
  leetcodeId?: number;
  companies?: string[];
  statement: string;
  input?: Array<string | number>;
  inputDisplay?: string;
  render?: DsaRenderMode;
  colorByValue?: boolean | Record<string, { bg: string; border: string; text: string }>;
  approaches: DsaApproach[];
  rubric?: PracticeRubric;
}

export interface DsaPattern {
  id: string;
  number: string;
  title: string;
  tagline: string;
}

/* ============================================================================
 * System Design (LLD + HLD) Types — Full ChaiCode LLD Schema + HLD Topology
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
  stereotype?: 'interface' | 'abstract' | 'service' | 'entity' | 'store' | 'controller' | string;
  x: number;
  y: number;
  w?: number;
  fields?: string[];
  methods?: string[];
  tint?: 'idle' | 'active' | 'done' | 'dead' | 'gold' | string;
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
  kind?: 'actor' | 'service' | 'store' | 'object' | 'queue' | string;
  tint?: string;
  active?: boolean;
}

export interface SequenceMessage {
  id: string;
  from: string;
  to: string;
  label: string;
  kind?: 'call' | 'return' | 'self' | 'create' | 'async' | string;
  status?: 'active' | 'done' | 'dead';
  note?: string;
}

export interface StateOrArchNode {
  id: string;
  label: string;
  sublabel?: string;
  kind?: 'start' | 'state' | 'final' | 'client' | 'gateway' | 'service' | 'cache' | 'db' | 'queue' | string;
  x: number;
  y: number;
  tint?: 'idle' | 'active' | 'done' | 'dead' | 'gold' | string;
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

export interface LldClassDiagramPayload {
  classes: UmlClassNode[];
  relations: UmlClassEdge[];
  shownClassIds?: string[];
  shownRelIds?: string[];
  activeIds?: string[];
  note?: string;
}

export interface LldSequencePayload {
  actors: SequenceParticipant[];
  messages: SequenceMessage[];
  shownCount?: number;
  activeIndex?: number;
  note?: string;
}

export interface LldStatePayload {
  nodes: StateOrArchNode[];
  edges: StateOrArchEdge[];
  activeId?: string;
  firedEdgeId?: string;
  label?: string;
}

export interface SdStep {
  view: SdDiagramView;
  codeLine?: number; // 1-based line index in code[]
  narration: string;
  vars?: Array<[string, string | number]>;
  classDiagram?: LldClassDiagramPayload;
  sequence?: LldSequencePayload;
  state?: LldStatePayload;
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
  moduleId?: string;
  patternId?: string;
  title: string;
  subtitle?: string;
  kind: 'concept' | 'pattern' | 'case-study' | 'lld' | 'hld' | string;
  difficulty: Difficulty | string;
  companies?: string[];
  statement: string;
  theory?: string;
  theoryMarkdown?: string;
  approaches: SdApproach[];
  rubric?: PracticeRubric;
}

export interface SystemDesignModule {
  id: string;
  number: string;
  title: string;
  tagline: string;
  trackType: 'LLD' | 'HLD';
}
