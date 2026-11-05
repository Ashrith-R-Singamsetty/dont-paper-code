import { DsaProblem } from '../types/curriculum';

export interface CuratedPlaylist {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  badge: string;
  accentColor: string;
  iconName: 'Flame' | 'Trophy' | 'Sparkles' | 'Building2' | 'Cpu';
  problemIds: string[];
}

export const BLIND_75_IDS = [
  // Arrays & Hashing
  'two-sum',
  'contains-duplicate',
  'valid-anagram',
  'group-anagrams',
  'top-k-frequent',
  'product-except-self',
  'longest-consecutive',
  'encode-decode',
  // Two Pointers
  'valid-palindrome',
  'three-sum',
  'container-with-most-water',
  'trapping-rain-water',
  // Sliding Window
  'best-time-buy-sell-stock',
  'longest-substring-no-repeat',
  'longest-repeating-replacement',
  'min-window-substring',
  // Stack
  'valid-parentheses',
  'min-stack',
  'daily-temperatures',
  'largest-rectangle-histogram',
  // Binary Search
  'binary-search',
  'search-rotated-sorted',
  'find-min-rotated',
  'search-2d-matrix',
  // Linked List
  'reverse-linked-list',
  'merge-two-sorted-lists',
  'reorder-list',
  'remove-nth-from-end',
  'linked-list-cycle',
  'lru-cache',
  // Trees
  'invert-tree',
  'maximum-depth',
  'same-tree',
  'diameter',
  'balanced-binary-tree',
  'lowest-common-ancestor',
  'validate-bst',
  'binary-tree-max-path-sum',
  'serialize-deserialize',
  // Tries
  'implement-trie',
  'prefix-matching',
  // Heaps
  'find-median-from-data-stream',
  'median-from-data-stream',
  'merge-k-sorted-lists',
  'top-k-frequent',
  // Backtracking
  'combination-sum',
  'word-search',
  'subsets',
  // Graphs
  'number-of-islands',
  'clone-graph',
  'pacific-atlantic',
  'course-schedule',
  'graph-valid-tree',
  'connected-components',
  // Dynamic Programming
  'climbing-stairs',
  'coin-change',
  'longest-increasing-subsequence',
  'longest-common-subsequence',
  'word-break',
  'combination-sum',
  'house-robber',
  'house-robber-ii',
  'decode-ways',
  'unique-paths',
  'jump-game',
  'max-subarray',
  // Intervals
  'insert-interval',
  'merge-intervals',
  'non-overlapping-intervals',
  'meeting-rooms',
  'meeting-rooms-ii',
  // Bit Manipulation
  'number-of-1-bits',
  'counting-bits',
  'reverse-bits',
  'missing-number',
  'sum-of-two-integers',
];

export const NEETCODE_150_IDS = [
  ...BLIND_75_IDS,
  'two-sum-ii',
  'valid-triangle-number',
  'move-zeroes',
  'sort-colors',
  'rotate-array',
  'four-sum',
  'sliding-window-maximum',
  'permutation-in-string',
  'max-points-cards',
  'evaluate-rpn',
  'generate-parentheses',
  'longest-valid-parentheses',
  'add-two-numbers',
  'palindrome-linked-list',
  'swap-nodes-in-pairs',
  'koko-eating-bananas',
  'split-array-largest-sum',
  'kth-smallest-sorted-matrix',
  'calculate-tilt',
  'path-sum',
  'path-sum-ii',
  'rightmost-node',
  'zigzag-level-order',
  'kth-largest-element',
  'k-closest-points',
  'task-scheduler',
  'permutations',
  'letter-combinations',
  'palindrome-partitioning',
  'n-queens',
  'max-area-of-island',
  'rotting-oranges',
  'surrounded-regions',
  'course-schedule-ii',
  'redundant-connection',
  'word-ladder',
  'min-cost-climbing-stairs',
  'maximal-square',
  'maximum-product-subarray',
  'spiral-matrix',
  'rotate-image',
  'set-matrix-zeroes',
  'subarray-sum-equals-k',
  'single-number',
];

export const FAANG_FAVORITES_IDS = [
  'two-sum',
  'two-sum-ii',
  'three-sum',
  'trapping-rain-water',
  'container-with-most-water',
  'longest-substring-no-repeat',
  'min-window-substring',
  'sliding-window-maximum',
  'lru-cache',
  'merge-k-sorted-lists',
  'median-from-data-stream',
  'valid-parentheses',
  'largest-rectangle-histogram',
  'number-of-islands',
  'clone-graph',
  'course-schedule',
  'course-schedule-ii',
  'word-ladder',
  'alien-dictionary',
  'koko-eating-bananas',
  'search-rotated-sorted',
  'binary-tree-max-path-sum',
  'lowest-common-ancestor',
  'serialize-deserialize',
  'word-search',
  'coin-change',
  'longest-increasing-subsequence',
  'edit-distance',
  'merge-intervals',
  'meeting-rooms-ii',
  'spiral-matrix',
  'rotate-image',
  'subsets',
  'n-queens',
  'product-except-self',
];

export const TOP_150_IDS = [
  ...NEETCODE_150_IDS,
  'remove-duplicates-sorted',
  'merge-sorted-array',
  'majority-element',
  'gas-station',
  'jump-game-ii',
  'pascals-triangle',
  'partition-labels',
  'bus-routes',
  'island-perimeter',
];

export const CURATED_PLAYLISTS: CuratedPlaylist[] = [
  {
    id: 'blind-75',
    title: 'Blind 75 Essentials',
    shortTitle: 'Blind 75',
    tagline: 'The 75 definitive problems covering every core pattern asked by top tech interviewers.',
    badge: '75 Core Stages',
    accentColor: 'rgb(var(--accent))',
    iconName: 'Flame',
    problemIds: BLIND_75_IDS,
  },
  {
    id: 'neetcode-150',
    title: 'NeetCode 150 Roadmap',
    shortTitle: 'NeetCode 150',
    tagline: 'A comprehensive, structured curriculum building step-by-step from Arrays to Advanced DP.',
    badge: '150 Stages',
    accentColor: 'rgb(var(--accent2))',
    iconName: 'Trophy',
    problemIds: NEETCODE_150_IDS,
  },
  {
    id: 'faang-favorites',
    title: 'FAANG High-Yield',
    shortTitle: 'FAANG Favorites',
    tagline: 'The most frequently tested interview questions at Google, Meta, Amazon, and Apple.',
    badge: 'Top Tier',
    accentColor: '#10b981',
    iconName: 'Building2',
    problemIds: FAANG_FAVORITES_IDS,
  },
  {
    id: 'top-150',
    title: 'Top Interview 150',
    shortTitle: 'Top 150',
    tagline: 'The classic LeetCode interview question set designed to cover all algorithmic bases.',
    badge: 'Complete Suite',
    accentColor: '#8b5cf6',
    iconName: 'Sparkles',
    problemIds: TOP_150_IDS,
  },
];

export function getPlaylistMatches(playlistId: string | null, problem: DsaProblem): boolean {
  if (!playlistId || playlistId === 'all') return true;
  const pl = CURATED_PLAYLISTS.find((p) => p.id === playlistId);
  if (!pl) return true;
  return pl.problemIds.includes(problem.id);
}
