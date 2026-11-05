import { DsaPattern, DsaProblem } from '../types/curriculum';

export const DSA_PATTERNS: DsaPattern[] = [
  {
    id: 'two-pointers',
    number: '01',
    title: 'Two Pointers',
    tagline: 'Shrink search space in O(n) with converging or 3-way partition indices.',
  },
  {
    id: 'sliding-window',
    number: '02',
    title: 'Sliding Window',
    tagline: 'Maintain dynamic window invariants [L..R] over contiguous subarrays.',
  },
  {
    id: 'linked-lists',
    number: '03',
    title: 'Linked Lists & Fast/Slow Pointers',
    tagline: 'Re-wire next pointers in-place and detect cycles with Floyd Tortoise & Hare.',
  },
  {
    id: 'binary-search',
    number: '04',
    title: 'Binary Search (Rotated & Answer Space)',
    tagline: 'Halve the search space on sorted arrays or monotonic feasibility predicates.',
  },
  {
    id: 'monotonic-stack',
    number: '05',
    title: 'Stacks & Monotonic Stack',
    tagline: 'Find next greater/smaller elements in O(n) by maintaining sorted stack order.',
  },
  {
    id: 'prefix-hash',
    number: '06',
    title: 'Prefix Sum & Hash Maps',
    tagline: 'Answer range queries and subarray sum = K in O(1) via prefix complements.',
  },
  {
    id: 'intervals-greedy',
    number: '07',
    title: 'Intervals & Greedy',
    tagline: 'Sort by start/end times to coalesce overlapping ranges in a single sweep.',
  },
  {
    id: 'heaps-topk',
    number: '08',
    title: 'Heaps & Priority Queues (Top-K)',
    tagline: 'Maintain the K largest/smallest stream elements in O(n log k) via Min/Max-Heap.',
  },
  {
    id: 'trees-tries',
    number: '09',
    title: 'Binary Trees, BFS & Prefix Tries',
    tagline: 'Recursive subtree DFS, level-order queue traversal, and prefix tree indexing.',
  },
  {
    id: 'graphs-toposort',
    number: '10',
    title: 'Graphs, Grid Islands & Shortest Path',
    tagline: 'Flood-fill 2D matrices, relax weighted edges with Dijkstra, and run Kahn TopoSort.',
  },
  {
    id: 'backtracking',
    number: '11',
    title: 'Backtracking & Decision Trees',
    tagline: 'Explore include/exclude state-space trees and prune invalid branches early.',
  },
  {
    id: 'dynamic-programming',
    number: '12',
    title: '1D & 2D Dynamic Programming',
    tagline: 'Cache overlapping subproblems across 1D state arrays and 2D DP tables.',
  },
];

export const DSA_PROBLEMS: DsaProblem[] = [
  /* ==========================================================================
   * PATTERN 01: TWO POINTERS
   * ========================================================================== */
  {
    id: 'two-sum-sorted',
    patternId: 'two-pointers',
    title: 'Two Sum II — Input Array Is Sorted',
    subtitle: 'Find two numbers in a sorted array that add up to target = 9.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 167,
    companies: ['Amazon', 'Google', 'Meta', 'Apple'],
    statement:
      'Given a sorted array of integers nums = [1, 2, 4, 6, 8, 9] and target = 9, return the indices of the two numbers that sum to target using O(1) extra space.',
    inputDisplay: 'nums = [1, 2, 4, 6, 8, 9], target = 9',
    render: 'cells',
    rubric: {
      prompt:
        'Write pseudocode for the O(n) Two-Pointers approach: place L at 0 and R at n - 1, compare nums[L] + nums[R] with target, and move L or R inward.',
      starterHint: `L = 0, R = n - 1\nwhile L < R:\n    sum = nums[L] + nums[R]\n    # compare sum with target...`,
      requiredGroups: [
        {
          concept: 'Two boundary pointers (L and R)',
          keywords: ['left', 'right', 'l', 'r', 'low', 'high'],
          missingHint: 'Initialize two pointers at the start (0) and end (n - 1).',
        },
        {
          concept: 'Loop while L < R',
          keywords: ['while', '<'],
          missingHint: 'Loop while L < R so each iteration narrows the search space.',
        },
        {
          concept: 'Compare sum against target and move pointer',
          keywords: ['target', 'sum', '+', '-'],
          missingHint: 'Increment L when sum < target; decrement R when sum > target.',
        },
      ],
    },
    approaches: [
      {
        label: '1 · Brute Force',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        pseudocode: [
          'for i from 0 to n - 2:',
          '  for j from i + 1 to n - 1:',
          '    if nums[i] + nums[j] == target:',
          '      return [i, j]',
        ],
        steps: [
          {
            codeLine: 0,
            narration: 'Anchor i = 0 (value 1) and scan j across every remaining index.',
            vars: [['i', 0], ['j', 1], ['sum', 3], ['target', 9]],
            arrValues: [1, 2, 4, 6, 8, 9],
            highlights: [0, 1],
            pointers: [
              { name: 'i', index: 0, color: 'accent' },
              { name: 'j', index: 1, color: 'blue' },
            ],
          },
          {
            codeLine: 2,
            narration: 'At i = 0, j = 4: nums[0] + nums[4] = 1 + 8 = 9 == target.',
            vars: [['i', 0], ['j', 4], ['sum', 9], ['target', 9]],
            arrValues: [1, 2, 4, 6, 8, 9],
            doneIndices: [0, 4],
            bestIndices: [0, 4],
            bestLabel: '1 + 8 = 9',
            pointers: [
              { name: 'i', index: 0, color: 'green' },
              { name: 'j', index: 4, color: 'green' },
            ],
          },
        ],
      },
      {
        label: '2 · Two Pointers (Optimal)',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'L = 0, R = n - 1',
          'while L < R:',
          '  sum = nums[L] + nums[R]',
          '  if sum == target: return [L, R]',
          '  if sum < target: L += 1',
          '  else: R -= 1',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'L = 0 (1), R = 5 (9) -> sum = 10 > 9. Since array is sorted, 9 is too large even with the smallest element! Decrement R.',
            vars: [['L', 0], ['R', 5], ['sum', 10], ['target', 9]],
            arrValues: [1, 2, 4, 6, 8, 9],
            reads: [0, 5],
            regions: [{ start: 0, end: 5, label: '10 > 9 → R -= 1' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent' },
              { name: 'R', index: 5, color: 'red' },
            ],
          },
          {
            codeLine: 3,
            narration: 'R moves to 4 (value 8). Now nums[0] + nums[4] = 1 + 8 = 9 == target! Solved in O(n) time.',
            vars: [['L', 0], ['R', 4], ['sum', 9], ['return', '[0, 4]']],
            arrValues: [1, 2, 4, 6, 8, 9],
            dimmed: [5],
            doneIndices: [0, 4],
            bestIndices: [0, 4],
            bestLabel: 'Match [0, 4]',
            pointers: [
              { name: 'L', index: 0, color: 'green' },
              { name: 'R', index: 4, color: 'green' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'valid-palindrome',
    patternId: 'two-pointers',
    title: 'Valid Palindrome',
    subtitle: 'Verify mirror symmetry in-place by skipping non-alphanumeric characters.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 125,
    companies: ['Meta', 'Microsoft', 'Apple', 'Bloomberg'],
    statement:
      'Given a string s, return true if it is a palindrome after converting uppercase letters into lowercase and skipping non-alphanumeric characters in O(1) space.',
    inputDisplay: 's = "r a c e , c a r"',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(1)-space Two-Pointers pseudocode: skip non-alphanumeric chars from both ends, compare lowercase chars, and advance L and R inward.',
      starterHint: `L = 0, R = len(s) - 1\nwhile L < R:\n    # skip non-alphanumeric and compare...`,
      requiredGroups: [
        {
          concept: 'Two inward pointers L and R',
          keywords: ['l', 'r', 'left', 'right'],
          missingHint: 'Use two pointers starting at 0 and len(s) - 1.',
        },
        {
          concept: 'Case-insensitive character comparison',
          keywords: ['!=', 'false', 'lower', 'return'],
          missingHint: 'Compare lower(s[L]) != lower(s[R]) and return false on mismatch.',
        },
        {
          concept: 'Advance both pointers inward',
          keywords: ['+ 1', '- 1', '+=', '-='],
          missingHint: 'Increment L and decrement R after each match.',
        },
      ],
    },
    approaches: [
      {
        label: 'In-Place Two Pointers',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'L = 0, R = len(s) - 1',
          'while L < R:',
          '  while L < R and not isAlnum(s[L]): L += 1',
          '  while L < R and not isAlnum(s[R]): R -= 1',
          '  if lower(s[L]) != lower(s[R]): return false',
          '  L += 1; R -= 1',
          'return true',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'Outer pairs "r"=="r", "a"=="a", "c"=="c" all match. At L=3 ("e") and R=4 (","), R hits punctuation.',
            vars: [['L', 3], ['R', 4], ['s[L]', 'e'], ['s[R]', ',']],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            doneIndices: [0, 1, 2, 5, 6, 7],
            highlights: [3, 4],
            pointers: [
              { name: 'L', index: 3, color: 'accent' },
              { name: 'R', index: 4, color: 'red' },
            ],
          },
          {
            codeLine: 6,
            narration: 'Skip "," so R decrements to 3. Now L == R == 3 ("e") -> valid palindrome confirmed in O(1) space!',
            vars: [['L', 3], ['R', 3], ['result', 'true']],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            doneIndices: [0, 1, 2, 3, 5, 6, 7],
            dimmed: [4],
            bestIndices: [3],
            bestLabel: 'Palindrome = true',
            pointers: [
              { name: 'L', index: 3, color: 'green' },
              { name: 'R', index: 3, color: 'green' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'container-most-water',
    patternId: 'two-pointers',
    title: 'Container With Most Water',
    subtitle: 'Maximize water area = (R - L) * min(height[L], height[R]) by always moving the shorter wall.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 11,
    companies: ['Amazon', 'Google', 'Flipkart', 'Adobe'],
    statement:
      'Find two vertical lines that together with the x-axis form a container holding the maximum amount of water.',
    inputDisplay: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
    render: 'bars',
    rubric: {
      prompt:
        'Write pseudocode for Container With Most Water in O(n) time: compute area, update maxArea, and advance whichever pointer has the smaller height.',
      starterHint: `L = 0, R = n - 1, maxArea = 0\nwhile L < R:\n    area = (R - L) * min(height[L], height[R])\n    # update maxArea and move shorter wall...`,
      requiredGroups: [
        {
          concept: 'Area calculation (R - L) * min(height[L], height[R])',
          keywords: ['min', 'area', '*'],
          missingHint: 'Compute width * min(height[L], height[R]).',
        },
        {
          concept: 'Track maxArea',
          keywords: ['max', 'best'],
          missingHint: 'Update maxArea = max(maxArea, area).',
        },
        {
          concept: 'Advance the shorter wall pointer',
          keywords: ['height', '<', 'l', 'r', 'left', 'right'],
          missingHint: 'If height[L] < height[R] increment L, else decrement R.',
        },
      ],
    },
    approaches: [
      {
        label: 'Two Pointers (Move Shorter Wall)',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'L = 0, R = n - 1, maxArea = 0',
          'while L < R:',
          '  w = R - L; h = min(height[L], height[R])',
          '  maxArea = max(maxArea, w * h)',
          '  if height[L] < height[R]: L += 1',
          '  else: R -= 1',
          'return maxArea',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'Widest container L = 0 (h=1), R = 8 (h=7). Area = 8 × min(1, 7) = 8. Since height[L]=1 is the bottleneck, advance L -> 1.',
            vars: [['L', 0], ['R', 8], ['area', 8], ['maxArea', 8]],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlights: [0, 8],
            waterLevels: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            pointers: [
              { name: 'L', index: 0, color: 'accent' },
              { name: 'R', index: 8, color: 'blue' },
            ],
          },
          {
            codeLine: 3,
            narration: 'At L = 1 (h=8) and R = 8 (h=7): width = 7, height = min(8, 7) = 7 -> Area = 49! New maxArea = 49.',
            vars: [['L', 1], ['R', 8], ['area', 49], ['maxArea', 49]],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            dimmed: [0],
            doneIndices: [1, 8],
            bestIndices: [1, 8],
            bestLabel: 'Max Area = 49',
            waterLevels: [0, 7, 7, 7, 7, 7, 7, 7, 7],
            pointers: [
              { name: 'L', index: 1, color: 'green' },
              { name: 'R', index: 8, color: 'green' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sort-colors-dnf',
    patternId: 'two-pointers',
    title: 'Sort Colors (Dutch National Flag)',
    subtitle: 'Partition 0s, 1s, and 2s in a single O(n) pass using low, mid, and high pointers.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 75,
    companies: ['Microsoft', 'Amazon', 'Apple', 'Nvidia'],
    statement:
      'Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place in a single pass without using library sort.',
    inputDisplay: 'nums = [2, 0, 2, 1, 1, 0]',
    render: 'cells',
    rubric: {
      prompt:
        'Write Edsger Dijkstra’s 3-way Dutch National Flag partition: maintain low, mid, high; swap 0s to low, advance mid on 1s, and swap 2s to high.',
      starterHint: `low = 0, mid = 0, high = n - 1\nwhile mid <= high:\n    if nums[mid] == 0: # swap with low...\n    elif nums[mid] == 1: # advance mid...\n    else: # swap with high...`,
      requiredGroups: [
        {
          concept: 'Three pointers: low, mid, high',
          keywords: ['low', 'mid', 'high'],
          missingHint: 'Initialize low = 0, mid = 0, and high = n - 1.',
        },
        {
          concept: 'Swap nums[mid] == 0 with low and increment both',
          keywords: ['0', 'swap', 'low'],
          missingHint: 'When nums[mid] == 0, swap(nums[low], nums[mid]) and increment both low and mid.',
        },
        {
          concept: 'Swap nums[mid] == 2 with high and decrement high only',
          keywords: ['2', 'high', '-'],
          missingHint: 'When nums[mid] == 2, swap(nums[mid], nums[high]) and decrement high without incrementing mid.',
        },
      ],
    },
    approaches: [
      {
        label: 'Dutch National Flag (3-Pointer)',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'low = 0, mid = 0, high = n - 1',
          'while mid <= high:',
          '  if nums[mid] == 0: swap(low++, mid++)',
          '  elif nums[mid] == 1: mid += 1',
          '  else: swap(mid, high--)',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'nums[mid=0] is 2 -> swap nums[0] with nums[high=5] (0) and decrement high to 4. Keep mid at 0 to inspect the swapped 0!',
            vars: [['low', 0], ['mid', 0], ['high', 4]],
            arrValues: [0, 0, 2, 1, 1, 2],
            swapPair: [0, 5],
            doneIndices: [5],
            pointers: [
              { name: 'low', index: 0, color: 'green' },
              { name: 'mid', index: 0, color: 'accent' },
              { name: 'high', index: 4, color: 'blue' },
            ],
          },
          {
            codeLine: 2,
            narration: 'After advancing through 0s and 1s, mid crosses high. Array is partitioned into [0,0 | 1,1 | 2,2] in one pass!',
            vars: [['low', 2], ['mid', 4], ['high', 3]],
            arrValues: [0, 0, 1, 1, 2, 2],
            doneIndices: [0, 1, 2, 3, 4, 5],
            bestIndices: [0, 1, 2, 3, 4, 5],
            bestLabel: '3-Way Partitioned',
            pointers: [
              { name: 'low', index: 2, color: 'green' },
              { name: 'high', index: 3, color: 'blue' },
              { name: 'mid', index: 4, color: 'accent' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 02: SLIDING WINDOW
   * ========================================================================== */
  {
    id: 'sliding-window-unique',
    patternId: 'sliding-window',
    title: 'Longest Substring Without Repeating Characters',
    subtitle: 'Expand R to grow the window; shrink L whenever a duplicate enters the Set.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 3,
    companies: ['Amazon', 'Meta', 'Netflix', 'Uber'],
    statement:
      'Given a string s, find the length of the longest substring without duplicate characters in O(n) time.',
    inputDisplay: 's = "a b c a b c b b"',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(n) Sliding Window pseudocode: maintain a Set of characters in window [L..R], shrink L while s[R] is in the Set, and update maxLen.',
      starterHint: `L = 0, maxLen = 0, seen = Set()\nfor R from 0 to n - 1:\n    while s[R] in seen:\n        seen.remove(s[L]); L += 1\n    # add s[R] and update maxLen...`,
      requiredGroups: [
        {
          concept: 'Window pointers L and R',
          keywords: ['l', 'r', 'left', 'right'],
          missingHint: 'Maintain left pointer L and right loop index R.',
        },
        {
          concept: 'Evict s[L] while duplicate exists in Set',
          keywords: ['while', 'seen', 'set', 'remove'],
          missingHint: 'Use a while loop to remove s[L] and increment L while s[R] is in the Set.',
        },
        {
          concept: 'Update maxLen = max(maxLen, R - L + 1)',
          keywords: ['max', '1', '-'],
          missingHint: 'Update maxLen = max(maxLen, R - L + 1).',
        },
      ],
    },
    approaches: [
      {
        label: 'Sliding Window + HashSet',
        complexity: { time: 'O(n)', space: 'O(min(n, Σ))' },
        pseudocode: [
          'L = 0, maxLen = 0, window = Set()',
          'for R from 0 to n - 1:',
          '  while s[R] in window:',
          '    window.remove(s[L]); L += 1',
          '  window.add(s[R])',
          '  maxLen = max(maxLen, R - L + 1)',
          'return maxLen',
        ],
        steps: [
          {
            codeLine: 5,
            narration: 'Expand R from 0 to 2: window ["a", "b", "c"] has 3 unique chars -> maxLen = 3.',
            vars: [['L', 0], ['R', 2], ['maxLen', 3]],
            arrValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
            highlights: [0, 1, 2],
            bestIndices: [0, 1, 2],
            bestLabel: 'Len = 3 ("abc")',
            regions: [{ start: 0, end: 2, label: '"abc"' }],
            auxLabel: 'Set',
            auxItems: ['a', 'b', 'c'],
            pointers: [
              { name: 'L', index: 0, color: 'accent' },
              { name: 'R', index: 2, color: 'blue' },
            ],
          },
          {
            codeLine: 3,
            narration: 'R = 3 ("a") collides with s[0]="a". Evict s[0], advance L -> 1, and restore unique window [1..3] = "bca".',
            vars: [['L', 1], ['R', 3], ['maxLen', 3]],
            arrValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
            dimmed: [0],
            doneIndices: [1, 2, 3],
            regions: [{ start: 1, end: 3, label: '"bca" (Unique)' }],
            auxLabel: 'Set',
            auxItems: ['b', 'c', 'a'],
            pointers: [
              { name: 'L', index: 1, color: 'accent' },
              { name: 'R', index: 3, color: 'blue' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'min-size-subarray-sum',
    patternId: 'sliding-window',
    title: 'Minimum Size Subarray Sum',
    subtitle: 'Find the shortest contiguous subarray with sum >= target (7) by shrinking L greedily.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 209,
    companies: ['Goldman Sachs', 'Amazon', 'Meta', 'Bloomberg'],
    statement:
      'Given an array of positive integers nums and a positive integer target = 7, return the minimal length of a subarray whose sum is greater than or equal to target.',
    inputDisplay: 'nums = [2, 3, 1, 2, 4, 3], target = 7',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(n) variable-size Sliding Window: add nums[R] to windowSum, and while windowSum >= target, record minLen = min(minLen, R - L + 1) and subtract nums[L++].',
      starterHint: `L = 0, windowSum = 0, minLen = INF\nfor R from 0 to n - 1:\n    windowSum += nums[R]\n    while windowSum >= target:\n        # update minLen and shrink L...`,
      requiredGroups: [
        {
          concept: 'Accumulate windowSum += nums[R]',
          keywords: ['sum', '+='],
          missingHint: 'Add nums[R] to the running windowSum on each step.',
        },
        {
          concept: 'While windowSum >= target shrink from left',
          keywords: ['while', '>=', 'target'],
          missingHint: 'While windowSum >= target, update minLen and subtract nums[L] as L advances.',
        },
        {
          concept: 'Track minimum length R - L + 1',
          keywords: ['min', '1', '-'],
          missingHint: 'Update minLen = min(minLen, R - L + 1).',
        },
      ],
    },
    approaches: [
      {
        label: 'Dynamic Shrinking Window',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'L = 0, sum = 0, minLen = ∞',
          'for R from 0 to n - 1:',
          '  sum += nums[R]',
          '  while sum >= target:',
          '    minLen = min(minLen, R - L + 1)',
          '    sum -= nums[L]; L += 1',
          'return minLen',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'Expand R to 3: window [0..3] = [2, 3, 1, 2] reaches sum = 8 >= 7 -> minLen = 4. Now shrink L!',
            vars: [['L', 0], ['R', 3], ['sum', 8], ['minLen', 4]],
            arrValues: [2, 3, 1, 2, 4, 3],
            highlights: [0, 1, 2, 3],
            regions: [{ start: 0, end: 3, label: 'sum = 8 >= 7 (len 4)' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent' },
              { name: 'R', index: 3, color: 'blue' },
            ],
          },
          {
            codeLine: 4,
            narration: 'At end of array, window [4..5] = [4, 3] has sum = 7 >= 7 with length = 2! Optimal minLen = 2.',
            vars: [['L', 4], ['R', 5], ['sum', 7], ['minLen', 2]],
            arrValues: [2, 3, 1, 2, 4, 3],
            dimmed: [0, 1, 2, 3],
            doneIndices: [4, 5],
            bestIndices: [4, 5],
            bestLabel: 'Shortest Len = 2 ([4, 3])',
            regions: [{ start: 4, end: 5, label: 'sum = 7 (len 2)' }],
            pointers: [
              { name: 'L', index: 4, color: 'green' },
              { name: 'R', index: 5, color: 'green' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 03: LINKED LISTS & FAST/SLOW POINTERS
   * ========================================================================== */
  {
    id: 'reverse-linked-list',
    patternId: 'linked-lists',
    title: 'Reverse Linked List',
    subtitle: 'Re-wire next pointers in-place using prev, curr, and nxt without allocating nodes.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 206,
    companies: ['Microsoft', 'Amazon', 'Apple', 'Bloomberg'],
    statement:
      'Given the head of a singly linked list 10 -> 20 -> 30 -> 40, reverse the list in-place in O(n) time and O(1) space.',
    inputDisplay: 'head = 10 -> 20 -> 30 -> 40 -> NULL',
    render: 'list',
    rubric: {
      prompt:
        'Write the iterative 3-pointer linked list reversal: save nxt = curr.next, flip curr.next = prev, then advance prev = curr and curr = nxt.',
      starterHint: `prev = null, curr = head\nwhile curr != null:\n    nxt = curr.next\n    # flip pointer and advance...`,
      requiredGroups: [
        {
          concept: 'Save nxt = curr.next before overwriting',
          keywords: ['next', 'nxt', 'temp'],
          missingHint: 'Save nxt = curr.next before changing curr.next.',
        },
        {
          concept: 'Reverse pointer curr.next = prev',
          keywords: ['curr.next', 'prev'],
          missingHint: 'Set curr.next = prev.',
        },
        {
          concept: 'Advance prev and curr',
          keywords: ['prev =', 'curr ='],
          missingHint: 'Advance prev = curr and curr = nxt.',
        },
      ],
    },
    approaches: [
      {
        label: 'Iterative 3-Pointer Flip',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'prev = NULL, curr = head',
          'while curr != NULL:',
          '  nxt = curr.next',
          '  curr.next = prev',
          '  prev = curr; curr = nxt',
          'return prev',
        ],
        steps: [
          {
            codeLine: 3,
            narration: 'Save nxt = 30, then flip 20.next backward to 10 (prev).',
            vars: [['prev', '10'], ['curr', '20'], ['nxt', '30']],
            arrValues: [10, 20, 30, 40],
            doneIndices: [0],
            highlights: [1],
            pointers: [
              { name: 'prev', index: 0, color: 'green' },
              { name: 'curr', index: 1, color: 'accent' },
              { name: 'nxt', index: 2, color: 'blue' },
            ],
            listLinks: [
              { from: 0, to: null, status: 'done' },
              { from: 1, to: 0, status: 'active', label: 'flip' },
              { from: 2, to: 3, status: 'idle' },
            ],
          },
          {
            codeLine: 5,
            narration: 'All links reversed! 40 -> 30 -> 20 -> 10 -> NULL. Return prev (40) as new head.',
            vars: [['prev (head)', '40'], ['curr', 'NULL']],
            arrValues: [10, 20, 30, 40],
            doneIndices: [0, 1, 2, 3],
            bestIndices: [3],
            bestLabel: 'New Head = 40',
            pointers: [{ name: 'prev (head)', index: 3, color: 'green' }],
            listLinks: [
              { from: 0, to: null, status: 'done' },
              { from: 3, to: 2, status: 'done' },
              { from: 2, to: 1, status: 'done' },
              { from: 1, to: 0, status: 'done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'linked-list-cycle',
    patternId: 'linked-lists',
    title: "Linked List Cycle (Floyd's Tortoise & Hare)",
    subtitle: 'Advance slow by 1 step and fast by 2 steps; if a cycle exists, fast laps slow inside the loop.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 141,
    companies: ['Amazon', 'Microsoft', 'Spotify', 'Apple'],
    statement:
      'Given head of a linked list where tail node 40 loops back to node 20, determine if the linked list has a cycle in O(1) memory.',
    inputDisplay: 'head = 10 -> 20 -> 30 -> 40 ↺ (back to 20)',
    render: 'list',
    rubric: {
      prompt:
        'Write Floyd’s Cycle Detection algorithm: advance slow = slow.next and fast = fast.next.next while fast and fast.next are non-null; return true if slow == fast.',
      starterHint: `slow = head, fast = head\nwhile fast != null and fast.next != null:\n    # advance slow by 1, fast by 2, and check collision...`,
      requiredGroups: [
        {
          concept: 'Guard while fast and fast.next are not null',
          keywords: ['while', 'fast', 'fast.next'],
          missingHint: 'Check while fast != null and fast.next != null so fast.next.next is safe.',
        },
        {
          concept: 'Move slow by 1 and fast by 2 (fast.next.next)',
          keywords: ['slow.next', 'fast.next.next'],
          missingHint: 'Advance slow = slow.next and fast = fast.next.next.',
        },
        {
          concept: 'Detect collision slow == fast',
          keywords: ['==', 'true', 'return'],
          missingHint: 'If slow == fast inside the loop, return true.',
        },
      ],
    },
    approaches: [
      {
        label: "Floyd's Fast & Slow Pointers",
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'slow = head, fast = head',
          'while fast != NULL and fast.next != NULL:',
          '  slow = slow.next',
          '  fast = fast.next.next',
          '  if slow == fast: return true',
          'return false',
        ],
        steps: [
          {
            codeLine: 3,
            narration: 'Step 1: slow moves 10 -> 20 (+1), fast jumps 10 -> 30 (+2). Notice tail 40 loops back to 20.',
            vars: [['slow', '20'], ['fast', '30'], ['cycle', '40 -> 20']],
            arrValues: [10, 20, 30, 40],
            highlights: [1, 2],
            pointers: [
              { name: 'slow', index: 1, color: 'accent' },
              { name: 'fast', index: 2, color: 'blue' },
            ],
            listLinks: [
              { from: 0, to: 1, status: 'idle' },
              { from: 1, to: 2, status: 'idle' },
              { from: 2, to: 3, status: 'idle' },
              { from: 3, to: 1, status: 'active', label: 'cycle ↺' },
            ],
          },
          {
            codeLine: 4,
            narration: 'After wrapping around 40 -> 20 -> 30, fast catches slow at node 30 (slow == fast)! Cycle detected in O(1) space.',
            vars: [['slow', '30'], ['fast', '30'], ['collision', 'true']],
            arrValues: [10, 20, 30, 40],
            doneIndices: [2],
            bestIndices: [2],
            bestLabel: 'Collision at 30!',
            pointers: [
              { name: 'slow==fast', index: 2, color: 'green' },
            ],
            listLinks: [
              { from: 0, to: 1, status: 'idle' },
              { from: 1, to: 2, status: 'done' },
              { from: 2, to: 3, status: 'done' },
              { from: 3, to: 1, status: 'done', label: 'cycle confirmed' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 04: BINARY SEARCH (ROTATED & ANSWER SPACE)
   * ========================================================================== */
  {
    id: 'search-rotated-sorted',
    patternId: 'binary-search',
    title: 'Search in Rotated Sorted Array',
    subtitle: 'At any mid, at least one half [L..mid] or [mid..R] is guaranteed to be strictly sorted.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 33,
    companies: ['Meta', 'Google', 'Amazon', 'LinkedIn'],
    statement:
      'Given a rotated sorted array nums = [4, 5, 6, 7, 0, 1, 2] and target = 0, find the index of target in O(log n) time.',
    inputDisplay: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
    render: 'cells',
    rubric: {
      prompt:
        'Write O(log n) Binary Search for a rotated sorted array: check if nums[mid] == target, identify whether the left half (nums[L] <= nums[mid]) is sorted, and check if target lies within the sorted half.',
      starterHint: `L = 0, R = n - 1\nwhile L <= R:\n    mid = (L + R) // 2\n    if nums[mid] == target: return mid\n    if nums[L] <= nums[mid]: # left half sorted...`,
      requiredGroups: [
        {
          concept: 'Midpoint calculation and direct hit check',
          keywords: ['mid', 'target', '=='],
          missingHint: 'Compute mid = (L + R) // 2 and check if nums[mid] == target.',
        },
        {
          concept: 'Identify which half is sorted (nums[L] <= nums[mid])',
          keywords: ['<=', 'nums[l]', 'nums[mid]', 'left'],
          missingHint: 'Check if nums[L] <= nums[mid] to determine if the left half is sorted.',
        },
        {
          concept: 'Update L = mid + 1 or R = mid - 1',
          keywords: ['mid + 1', 'mid - 1'],
          missingHint: 'Narrow the search range to L = mid + 1 or R = mid - 1.',
        },
      ],
    },
    approaches: [
      {
        label: 'Modified Binary Search O(log n)',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        pseudocode: [
          'L = 0, R = n - 1',
          'while L <= R:',
          '  mid = (L + R) // 2',
          '  if nums[mid] == target: return mid',
          '  if nums[L] <= nums[mid]: // Left half sorted',
          '    if nums[L] <= target < nums[mid]: R = mid - 1',
          '    else: L = mid + 1',
          '  else: // Right half sorted',
          '    if nums[mid] < target <= nums[R]: L = mid + 1',
          '    else: R = mid - 1',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'L = 0 (4), R = 6 (2), mid = 3 (7). Left half [4, 5, 6, 7] is sorted, and target = 0 is NOT in [4..7], so jump L = mid + 1 = 4!',
            vars: [['L', 0], ['mid', 3], ['R', 6], ['target', 0]],
            arrValues: [4, 5, 6, 7, 0, 1, 2],
            highlights: [3],
            regions: [{ start: 0, end: 3, label: 'Sorted Half [4..7]' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent' },
              { name: 'mid', index: 3, color: 'gold' },
              { name: 'R', index: 6, color: 'blue' },
            ],
          },
          {
            codeLine: 3,
            narration: 'Now L = 4, R = 6 -> mid = 5 (1). Right half sorted; narrow R = 4 -> nums[4] == 0 found in O(log n)!',
            vars: [['L', 4], ['mid', 4], ['R', 4], ['return', 4]],
            arrValues: [4, 5, 6, 7, 0, 1, 2],
            dimmed: [0, 1, 2, 3, 5, 6],
            doneIndices: [4],
            bestIndices: [4],
            bestLabel: 'Found target at [4]',
            pointers: [{ name: 'mid*', index: 4, color: 'green' }],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 05: MONOTONIC STACK
   * ========================================================================== */
  {
    id: 'daily-temperatures',
    patternId: 'monotonic-stack',
    title: 'Daily Temperatures (Monotonic Decreasing Stack)',
    subtitle: 'Maintain a stack of unresolved cooler days; pop and resolve as soon as a warmer day arrives.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 739,
    companies: ['Amazon', 'Meta', 'Apple', 'TikTok'],
    statement:
      'Given daily temperatures = [73, 74, 75, 71, 69, 72, 76, 73], return an array answer such that answer[i] is the number of days you have to wait after day i to get a warmer temperature.',
    inputDisplay: 'temps = [73, 74, 75, 71, 69, 72, 76, 73]',
    render: 'bars',
    rubric: {
      prompt:
        'Write the O(n) Monotonic Decreasing Stack algorithm: iterate i over temperatures, pop indices prev from stack while T[i] > T[stack.top()], set ans[prev] = i - prev, and push i.',
      starterHint: `stack = [], ans = [0] * n\nfor i from 0 to n - 1:\n    while stack and T[i] > T[stack.top()]:\n        # pop prev and compute wait days...`,
      requiredGroups: [
        {
          concept: 'Monotonic stack storing indices',
          keywords: ['stack', 'push', 'append', 'pop'],
          missingHint: 'Store day indices on a stack and push i after resolving cooler days.',
        },
        {
          concept: 'While T[i] > T[stack.top()] pop and resolve',
          keywords: ['while', '>'],
          missingHint: 'Pop from the stack in a while loop whenever the current temperature is warmer than stack.top().',
        },
        {
          concept: 'Distance calculation i - prev',
          keywords: ['- prev', '- idx', 'i -'],
          missingHint: 'Compute wait days as i - prevIndex.',
        },
      ],
    },
    approaches: [
      {
        label: 'Monotonic Decreasing Stack',
        complexity: { time: 'O(n)', space: 'O(n)' },
        pseudocode: [
          'stack = [], ans = [0] * n',
          'for i from 0 to n - 1:',
          '  while stack and T[i] > T[stack.top()]:',
          '    prev = stack.pop()',
          '    ans[prev] = i - prev',
          '  stack.push(i)',
          'return ans',
        ],
        steps: [
          {
            codeLine: 5,
            narration: 'Days 2 (75°), 3 (71°), and 4 (69°) are strictly decreasing, so their indices [2, 3, 4] wait on the monotonic stack.',
            vars: [['i', 4], ['T[i]', '69°'], ['ans', '[1, 1, 0, 0, 0, 0, 0, 0]']],
            arrValues: [73, 74, 75, 71, 69, 72, 76, 73],
            doneIndices: [0, 1],
            highlights: [2, 3, 4],
            auxLabel: 'Monotonic Stack (idx:temp)',
            auxItems: ['2:75°', '3:71°', '4:69°'],
            pointers: [{ name: 'i', index: 4, color: 'accent' }],
          },
          {
            codeLine: 4,
            narration: 'Day 5 arrives at 72°! 72° > 69° (pop idx 4, wait=1) and 72° > 71° (pop idx 3, wait=2). Then push idx 5 (72°).',
            vars: [['i', 5], ['T[i]', '72°'], ['resolved', 'idx 4 (+1d), idx 3 (+2d)']],
            arrValues: [73, 74, 75, 71, 69, 72, 76, 73],
            doneIndices: [0, 1, 3, 4],
            highlights: [5],
            bestIndices: [3, 4],
            bestLabel: 'Popped 69° & 71°',
            auxLabel: 'Monotonic Stack (idx:temp)',
            auxItems: ['2:75°', '5:72°'],
            pointers: [{ name: 'i (72°)', index: 5, color: 'green' }],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 06: PREFIX SUM & HASH MAPS
   * ========================================================================== */
  {
    id: 'subarray-sum-equals-k',
    patternId: 'prefix-hash',
    title: 'Subarray Sum Equals K',
    subtitle: 'If prefixSum[R] - prefixSum[L-1] == k, then prefixSum[R] - k must exist in our frequency map.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 560,
    companies: ['Meta', 'Google', 'Amazon', 'Citadel'],
    statement:
      'Given an integer array nums = [1, 2, 3, -1, 2] and k = 3, return the total number of subarrays whose sum equals k in O(n) time.',
    inputDisplay: 'nums = [1, 2, 3, -1, 2], k = 3',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(n) Prefix Sum + HashMap algorithm: seed map with {0: 1}, accumulate prefixSum += x, add map.get(prefixSum - k, 0) to count, and increment map[prefixSum].',
      starterHint: `count = 0, prefix = 0, freq = {0: 1}\nfor x in nums:\n    prefix += x\n    # lookup (prefix - k) and update freq...`,
      requiredGroups: [
        {
          concept: 'Initialize prefix frequency map with {0: 1}',
          keywords: ['0', '1', 'freq', 'map', 'dict'],
          missingHint: 'Initialize the frequency map with {0: 1} to handle subarrays starting at index 0.',
        },
        {
          concept: 'Lookup complement (prefix - k)',
          keywords: ['prefix - k', 'sum - k', '- k'],
          missingHint: 'Add freq[prefix - k] to count before recording the current prefix.',
        },
        {
          concept: 'Record current prefixSum in frequency map',
          keywords: ['+=', 'freq[', 'map['],
          missingHint: 'Increment freq[prefix] += 1.',
        },
      ],
    },
    approaches: [
      {
        label: 'Prefix Sum Complement Map',
        complexity: { time: 'O(n)', space: 'O(n)' },
        pseudocode: [
          'count = 0, prefix = 0, freq = { 0: 1 }',
          'for i, x in enumerate(nums):',
          '  prefix += x',
          '  count += freq.get(prefix - k, 0)',
          '  freq[prefix] = freq.get(prefix, 0) + 1',
          'return count',
        ],
        steps: [
          {
            codeLine: 3,
            narration: 'At i = 1 (x = 2): prefix = 3. Complement prefix - k = 3 - 3 = 0 exists in freq ({0:1}) -> subarray [1, 2] found! count = 1.',
            vars: [['i', 1], ['prefix', 3], ['prefix - k', 0], ['count', 1]],
            arrValues: [1, 2, 3, -1, 2],
            doneIndices: [0, 1],
            regions: [{ start: 0, end: 1, label: 'sum = 3' }],
            auxLabel: 'Prefix Freq Map',
            auxItems: ['0:1', '1:1', '3:1'],
            pointers: [{ name: 'i', index: 1, color: 'accent' }],
          },
          {
            codeLine: 3,
            narration: 'At i = 2 (x = 3): prefix = 6, complement 6 - 3 = 3 is in freq! And at i = 4 (x = 2): prefix = 7, complement 4 is in freq! Total = 3 subarrays.',
            vars: [['i', 4], ['prefix', 7], ['prefix - k', 4], ['count', 3]],
            arrValues: [1, 2, 3, -1, 2],
            doneIndices: [0, 1, 2, 3, 4],
            bestIndices: [2, 3, 4],
            bestLabel: 'Total = 3 Subarrays',
            auxLabel: 'Prefix Freq Map',
            auxItems: ['0:1', '1:1', '3:1', '6:1', '5:1', '7:1'],
            pointers: [{ name: 'i', index: 4, color: 'green' }],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 07: INTERVALS & GREEDY
   * ========================================================================== */
  {
    id: 'merge-intervals',
    patternId: 'intervals-greedy',
    title: 'Merge Overlapping Intervals',
    subtitle: 'Sort intervals by start time; coalesce whenever next.start <= current.end.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 56,
    companies: ['Google', 'Meta', 'Uber', 'Salesforce'],
    statement:
      'Given an array of intervals = [[1,3], [2,6], [8,10], [15,18]], merge all overlapping intervals and return the non-overlapping ranges.',
    inputDisplay: 'intervals = [[1,3], [2,6], [8,10], [15,18]]',
    render: 'cells',
    rubric: {
      prompt:
        'Write pseudocode for Merge Intervals: sort by start time, compare curr.start <= merged.last.end, and either extend merged.last.end = max(end1, end2) or append curr.',
      starterHint: `intervals.sort(key=start)\nmerged = [intervals[0]]\nfor start, end in intervals[1:]:\n    # check overlap with merged[-1]...`,
      requiredGroups: [
        {
          concept: 'Sort intervals by start coordinate',
          keywords: ['sort'],
          missingHint: 'Sort intervals by their start time first.',
        },
        {
          concept: 'Overlap condition next.start <= prev.end',
          keywords: ['<=', 'end', 'start'],
          missingHint: 'Check if curr.start <= merged[-1].end.',
        },
        {
          concept: 'Extend end using max(prev.end, curr.end)',
          keywords: ['max', 'append', 'push'],
          missingHint: 'Update merged[-1].end = max(merged[-1].end, curr.end) on overlap, else append.',
        },
      ],
    },
    approaches: [
      {
        label: 'Sort + Linear Coalesce',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        pseudocode: [
          'intervals.sort(by = start)',
          'merged = [intervals[0]]',
          'for curr in intervals[1:]:',
          '  if curr.start <= merged[-1].end:',
          '    merged[-1].end = max(merged[-1].end, curr.end)',
          '  else: merged.append(curr)',
          'return merged',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'Inspect [2,6]: since start 2 <= prev.end 3, merge [1,3] and [2,6] into [1, max(3,6)] = [1,6]!',
            vars: [['prev', '[1, 3]'], ['curr', '[2, 6]'], ['merged[-1]', '[1, 6]']],
            arrValues: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
            highlights: [0, 1],
            regions: [{ start: 0, end: 1, label: 'Coalesced → [1,6]' }],
            auxLabel: 'merged[]',
            auxItems: ['[1,6]'],
            pointers: [{ name: 'curr', index: 1, color: 'accent' }],
          },
          {
            codeLine: 6,
            narration: '[8,10] (8 > 6) and [15,18] (15 > 10) are disjoint. Final output has 3 clean intervals.',
            vars: [['result', '[[1,6], [8,10], [15,18]]']],
            arrValues: ['[1,6]', '[8,10]', '[15,18]'],
            doneIndices: [0, 1, 2],
            bestIndices: [0],
            bestLabel: '3 Disjoint Intervals',
            auxLabel: 'merged[]',
            auxItems: ['[1,6]', '[8,10]', '[15,18]'],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 08: HEAPS & PRIORITY QUEUES (TOP-K)
   * ========================================================================== */
  {
    id: 'kth-largest-min-heap',
    patternId: 'heaps-topk',
    title: 'Kth Largest Element (Min-Heap of Size K)',
    subtitle: 'Keep a Min-Heap capped at size k; the root heap[0] is always the kth largest seen so far!',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 215,
    companies: ['Meta', 'Amazon', 'Google', 'LinkedIn'],
    statement:
      'Find the k = 3rd largest element in nums = [3, 2, 1, 5, 6, 4] without sorting the entire array, using a Min-Heap of capacity k = 3.',
    inputDisplay: 'nums = [3, 2, 1, 5, 6, 4], k = 3',
    render: 'heap',
    rubric: {
      prompt:
        'Write the O(n log k) Min-Heap Top-K algorithm: push each number into minHeap, pop the smallest whenever len(minHeap) > k, and return minHeap[0].',
      starterHint: `minHeap = []\nfor num in nums:\n    heappush(minHeap, num)\n    if len(minHeap) > k:\n        # evict smallest...`,
      requiredGroups: [
        {
          concept: 'Push elements into a Min-Heap',
          keywords: ['heap', 'push', 'add', 'offer'],
          missingHint: 'Push incoming elements into a Min-Heap.',
        },
        {
          concept: 'Evict smallest when size exceeds k',
          keywords: ['>', 'k', 'pop', 'poll'],
          missingHint: 'When len(minHeap) > k, pop the minimum element so only the k largest remain.',
        },
        {
          concept: 'Return heap root (kth largest)',
          keywords: ['return', '0', 'peek', 'top'],
          missingHint: 'Return the root of the Min-Heap (minHeap[0] / peek()).',
        },
      ],
    },
    approaches: [
      {
        label: 'Min-Heap of Capacity K',
        complexity: { time: 'O(n log k)', space: 'O(k)' },
        pseudocode: [
          'minHeap = []',
          'for x in nums:',
          '  heappush(minHeap, x)',
          '  if len(minHeap) > k:',
          '    heappop(minHeap) // evicts smallest!',
          'return minHeap[0]',
        ],
        steps: [
          {
            codeLine: 4,
            narration: 'After pushing 3, 2, 1, 5: heap size is 4 > k(3). Pop minimum (1) and sift-up so [2, 3, 5] remain in the Min-Heap.',
            vars: [['x', 5], ['evicted', 1], ['heapRoot (3rd largest)', 2]],
            arrValues: [2, 3, 5],
            highlights: [0],
            treeNodes: [
              { id: 'h0', val: 2, x: 50, y: 22, leftId: 'h1', rightId: 'h2', state: 'active', badge: 'min root' },
              { id: 'h1', val: 3, x: 30, y: 72, state: 'idle' },
              { id: 'h2', val: 5, x: 70, y: 72, state: 'done' },
            ],
          },
          {
            codeLine: 5,
            narration: 'After processing 6 and 4, Min-Heap holds the top 3 largest elements [4, 5, 6]. Root heap[0] = 4 is the 3rd largest!',
            vars: [['k', 3], ['heap', '[4, 5, 6]'], ['return (kth largest)', 4]],
            arrValues: [4, 5, 6],
            doneIndices: [0, 1, 2],
            bestIndices: [0],
            bestLabel: '3rd Largest = 4',
            treeNodes: [
              { id: 'h0', val: 4, x: 50, y: 22, leftId: 'h1', rightId: 'h2', state: 'gold', badge: '★ 3rd Largest' },
              { id: 'h1', val: 5, x: 30, y: 72, state: 'done' },
              { id: 'h2', val: 6, x: 70, y: 72, state: 'done' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 09: BINARY TREES, BFS & PREFIX TRIES
   * ========================================================================== */
  {
    id: 'invert-binary-tree',
    patternId: 'trees-tries',
    title: 'Invert Binary Tree (Recursive DFS)',
    subtitle: 'Recursively swap left and right children at every node in the tree.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 226,
    companies: ['Google', 'Amazon', 'Meta', 'Bloomberg'],
    statement:
      'Given the root of a binary tree [4, 2, 7, 1, 3, 6, 9], invert the tree and return its root.',
    inputDisplay: 'root = [4, 2, 7, 1, 3, 6, 9]',
    render: 'tree',
    rubric: {
      prompt:
        'Write recursive pseudocode for Invert Binary Tree: handle null base case, swap node.left and node.right, and recurse on both children.',
      starterHint: `function invertTree(node):\n    if node == null: return null\n    # swap children and recurse...`,
      requiredGroups: [
        {
          concept: 'Base case for null node',
          keywords: ['null', 'none', 'if'],
          missingHint: 'Return null when node is null.',
        },
        {
          concept: 'Swap left and right pointers',
          keywords: ['left', 'right'],
          missingHint: 'Swap node.left and node.right.',
        },
        {
          concept: 'Recurse on left and right subtrees',
          keywords: ['invert', 'recurse', 'dfs'],
          missingHint: 'Recursively call invertTree(node.left) and invertTree(node.right).',
        },
      ],
    },
    approaches: [
      {
        label: 'Recursive DFS Swap',
        complexity: { time: 'O(n)', space: 'O(h) stack' },
        pseudocode: [
          'fn invertTree(node):',
          '  if node == null: return null',
          '  node.left, node.right = node.right, node.left',
          '  invertTree(node.left); invertTree(node.right)',
          '  return node',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'At root 4: swap left child (2) and right child (7). Entire subtrees move with their roots.',
            vars: [['node', 4], ['left', 7], ['right', 2]],
            callStack: ['invertTree(4)'],
            treeNodes: [
              { id: 'n4', val: 4, x: 50, y: 18, leftId: 'n7', rightId: 'n2', state: 'active', badge: 'swap L↔R' },
              { id: 'n7', val: 7, x: 26, y: 50, leftId: 'n6', rightId: 'n9', state: 'gold' },
              { id: 'n2', val: 2, x: 74, y: 50, leftId: 'n1', rightId: 'n3', state: 'gold' },
              { id: 'n6', val: 6, x: 14, y: 82, state: 'idle' },
              { id: 'n9', val: 9, x: 38, y: 82, state: 'idle' },
              { id: 'n1', val: 1, x: 62, y: 82, state: 'idle' },
              { id: 'n3', val: 3, x: 86, y: 82, state: 'idle' },
            ],
          },
          {
            codeLine: 4,
            narration: 'Recurse into 7 and 2: swap (6 ↔ 9) and (1 ↔ 3). Full mirror tree complete!',
            vars: [['bfsOrder', '[4, 7, 2, 9, 6, 3, 1]']],
            callStack: ['invertTree(4) -> done'],
            treeNodes: [
              { id: 'n4', val: 4, x: 50, y: 18, leftId: 'n7', rightId: 'n2', state: 'done', badge: 'Inverted' },
              { id: 'n7', val: 7, x: 26, y: 50, leftId: 'n9', rightId: 'n6', state: 'done' },
              { id: 'n2', val: 2, x: 74, y: 50, leftId: 'n3', rightId: 'n1', state: 'done' },
              { id: 'n9', val: 9, x: 14, y: 82, state: 'done' },
              { id: 'n6', val: 6, x: 38, y: 82, state: 'done' },
              { id: 'n3', val: 3, x: 62, y: 82, state: 'done' },
              { id: 'n1', val: 1, x: 86, y: 82, state: 'done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'prefix-trie-search',
    patternId: 'trees-tries',
    title: 'Implement Prefix Trie (Autocomplete Tree)',
    subtitle: 'Share common character prefixes along root-to-leaf paths for O(L) lookup regardless of dictionary size.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 208,
    companies: ['Google', 'Amazon', 'Microsoft', 'Stripe'],
    statement:
      'Design a Trie supporting insert(word), search(word), and startsWith(prefix) for words ["cat", "car", "dog"].',
    inputDisplay: 'words = ["cat", "car", "dog"], query = startsWith("ca")',
    render: 'tree',
    rubric: {
      prompt:
        'Write pseudocode for TrieNode (children map + isEnd boolean) and insert(word): walk character by character creating missing child nodes, then mark node.isEnd = true.',
      starterHint: `class TrieNode:\n    children = {}, isEnd = false\n\nfunction insert(word):\n    curr = root\n    for ch in word:\n        # create child if missing and advance...`,
      requiredGroups: [
        {
          concept: 'TrieNode children map/array and isEnd flag',
          keywords: ['children', 'isend', 'end'],
          missingHint: 'Each TrieNode needs a children map/array and an isEnd boolean marker.',
        },
        {
          concept: 'Character-by-character traversal & creation',
          keywords: ['for', 'ch', 'curr'],
          missingHint: 'Iterate through each character ch in word and advance curr = curr.children[ch].',
        },
        {
          concept: 'Mark terminal node isEnd = true',
          keywords: ['true', 'isend', 'end'],
          missingHint: 'Set curr.isEnd = true after the loop finishes.',
        },
      ],
    },
    approaches: [
      {
        label: 'Prefix Tree Walk O(L)',
        complexity: { time: 'O(L) per query', space: 'O(Σ · L)' },
        pseudocode: [
          'insert(word):',
          '  curr = root',
          '  for ch in word:',
          '    if ch not in curr.children: curr.children[ch] = TrieNode()',
          '    curr = curr.children[ch]',
          '  curr.isEnd = true',
        ],
        steps: [
          {
            codeLine: 4,
            narration: '"cat" and "car" share the prefix path root -> "c" -> "a" before branching into terminal leaves "t*" and "r*".',
            vars: [['inserted', '["cat", "car", "dog"]'], ['sharedPrefix', '"ca"']],
            auxLabel: 'Matched Autocomplete Completions for "ca"',
            auxItems: ['"cat" (isEnd=true)', '"car" (isEnd=true)'],
            treeNodes: [
              { id: 'root', val: 'root', x: 50, y: 14, childrenIds: ['c', 'd'], state: 'active' },
              { id: 'c', val: 'c', x: 32, y: 40, childrenIds: ['ca'], state: 'active' },
              { id: 'd', val: 'd', x: 70, y: 40, childrenIds: ['do'], state: 'idle' },
              { id: 'ca', val: 'a', x: 32, y: 66, childrenIds: ['cat', 'car'], state: 'gold', badge: 'prefix "ca"' },
              { id: 'do', val: 'o', x: 70, y: 66, childrenIds: ['dog'], state: 'idle' },
              { id: 'cat', val: 't*', x: 20, y: 90, state: 'done', badge: 'isEnd' },
              { id: 'car', val: 'r*', x: 44, y: 90, state: 'done', badge: 'isEnd' },
              { id: 'dog', val: 'g*', x: 70, y: 90, state: 'idle' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 10: GRAPHS, GRID ISLANDS & SHORTEST PATH
   * ========================================================================== */
  {
    id: 'number-of-islands',
    patternId: 'graphs-toposort',
    title: 'Number of Islands (2D Matrix Flood-Fill)',
    subtitle: 'Scan the 2D grid; whenever you hit unvisited land "1", increment islands and DFS/BFS sink connected land to "0".',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 200,
    companies: ['Amazon', 'Bloomberg', 'Google', 'Meta'],
    statement:
      'Given an m × n 2D binary grid of "1"s (land) and "0"s (water), return the number of connected islands (4-directional).',
    inputDisplay: '4×5 binary grid of "1" (land) and "0" (water)',
    render: 'matrix',
    rubric: {
      prompt:
        'Write pseudocode for Number of Islands: iterate (r, c) over the grid; when grid[r][c] == "1", increment count and run DFS/BFS in 4 directions marking visited land as "0".',
      starterHint: `count = 0\nfor r in 0..R-1:\n  for c in 0..C-1:\n    if grid[r][c] == '1':\n      count += 1; dfs(r, c)`,
      requiredGroups: [
        {
          concept: 'Trigger flood-fill on unvisited land ("1")',
          keywords: ['1', 'count', 'dfs', 'bfs'],
          missingHint: 'When grid[r][c] == "1", increment island count and launch DFS/BFS.',
        },
        {
          concept: 'Boundary and water base-case guard in DFS',
          keywords: ['< 0', 'r', 'c', '0', 'return'],
          missingHint: 'Check out-of-bounds or grid[r][c] == "0" as the base case.',
        },
        {
          concept: 'Sink visited cell (grid[r][c] = "0") and explore 4 neighbors',
          keywords: ['r + 1', 'r - 1', 'c + 1', 'c - 1'],
          missingHint: 'Mark grid[r][c] = "0" and recurse on all 4 cardinal neighbors.',
        },
      ],
    },
    approaches: [
      {
        label: 'In-Place DFS Island Sinking',
        complexity: { time: 'O(R · C)', space: 'O(R · C) stack' },
        pseudocode: [
          'islands = 0',
          'for r in 0..R-1, c in 0..C-1:',
          '  if grid[r][c] == "1":',
          '    islands += 1; dfsSink(r, c)',
          'fn dfsSink(r, c):',
          '  if outOfBounds or grid[r][c] == "0": return',
          '  grid[r][c] = "0" // sink land!',
          '  for (dr, dc) in [(1,0),(-1,0),(0,1),(0,-1)]: dfsSink(r+dr, c+dc)',
        ],
        steps: [
          {
            codeLine: 3,
            narration: 'Hit land at (0,0) -> Island #1! Flood-fill sinks the top-left 5-cell island so none of its cells are counted twice.',
            vars: [['r, c', '(0, 0)'], ['islands', 1], ['sunkCells', 5]],
            matrix: {
              rowLabels: ['r0', 'r1', 'r2', 'r3'],
              colLabels: ['c0', 'c1', 'c2', 'c3', 'c4'],
              grid: [
                ['1', '1', '0', '0', '0'],
                ['1', '1', '0', '0', '0'],
                ['0', '0', '1', '0', '0'],
                ['0', '0', '0', '1', '1'],
              ],
              activeCells: [[0, 0], [0, 1], [1, 0], [1, 1]],
            },
          },
          {
            codeLine: 3,
            narration: 'Continue scan: (2,2) triggers Island #2, and (3,3)-(3,4) triggers Island #3. Total = 3 islands!',
            vars: [['islands', 3], ['status', 'Complete']],
            bestLabel: '3 Connected Islands Found',
            matrix: {
              rowLabels: ['r0', 'r1', 'r2', 'r3'],
              colLabels: ['c0', 'c1', 'c2', 'c3', 'c4'],
              grid: [
                ['✓', '✓', '0', '0', '0'],
                ['✓', '✓', '0', '0', '0'],
                ['0', '0', '✓', '0', '0'],
                ['0', '0', '0', '✓', '✓'],
              ],
              doneCells: [[0, 0], [0, 1], [1, 0], [1, 1]],
              bestCells: [[2, 2], [3, 3], [3, 4]],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dijkstra-shortest-path',
    patternId: 'graphs-toposort',
    title: "Dijkstra's Shortest Path (Weighted Graph)",
    subtitle: 'Greedily pop the closest unvisited vertex u from a Min-Heap and relax edges dist[v] = min(dist[v], dist[u] + w).',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 743,
    companies: ['Google', 'Uber', 'Amazon', 'Lyft'],
    statement:
      'Given a directed weighted graph with non-negative edge weights, compute shortest distances from source A to all nodes.',
    inputDisplay: 'Edges: A→B(4), A→C(1), C→B(2), B→D(1), C→D(5)',
    render: 'graph',
    rubric: {
      prompt:
        'Write Dijkstra’s algorithm using a Min-Heap priority queue: initialize dist[src] = 0, pop (d, u), skip stale entries (d > dist[u]), and push relaxed neighbors when d + w < dist[v].',
      starterHint: `dist = {src: 0}, pq = [(0, src)]\nwhile pq:\n    d, u = heappop(pq)\n    if d > dist[u]: continue\n    # relax neighbors (v, w)...`,
      requiredGroups: [
        {
          concept: 'Priority Queue / Min-Heap ordered by distance',
          keywords: ['pq', 'heap', 'pop'],
          missingHint: 'Use a Min-Heap priority queue storing (distance, node).',
        },
        {
          concept: 'Edge relaxation check d + w < dist[v]',
          keywords: ['<', 'dist', '+'],
          missingHint: 'Check if dist[u] + weight < dist[v] before updating dist[v].',
        },
        {
          concept: 'Push updated (dist[v], v) to priority queue',
          keywords: ['push', 'offer', 'add'],
          missingHint: 'Push the newly relaxed (dist[v], v) pair onto the priority queue.',
        },
      ],
    },
    approaches: [
      {
        label: 'Lazy Min-Heap Relaxation',
        complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
        pseudocode: [
          'dist = { A: 0, B: ∞, C: ∞, D: ∞ }; pq = [(0, A)]',
          'while pq:',
          '  d, u = heappop(pq)',
          '  if d > dist[u]: continue',
          '  for (v, w) in adj[u]:',
          '    if d + w < dist[v]:',
          '      dist[v] = d + w; heappush(pq, (dist[v], v))',
        ],
        steps: [
          {
            codeLine: 5,
            narration: 'Pop (0, A): relax A→B (dist[B]=4) and A→C (dist[C]=1). Next pop is C (d=1), which relaxes C→B to 1 + 2 = 3 < 4!',
            vars: [['popped', 'C (d=1)'], ['relax C→B', '1 + 2 = 3 < 4'], ['dist[B]', 3]],
            auxLabel: 'Min-Heap PQ',
            auxItems: ['(3, B)', '(4, B stale)', '(6, D)'],
            graphNodes: [
              { id: 'A', label: 'A', x: 100, y: 125, dist: 0, state: 'done' },
              { id: 'B', label: 'B', x: 320, y: 55, dist: 3, state: 'gold' },
              { id: 'C', label: 'C', x: 320, y: 195, dist: 1, state: 'active' },
              { id: 'D', label: 'D', x: 540, y: 125, dist: 6, state: 'idle' },
            ],
            graphEdges: [
              { from: 'A', to: 'B', weight: 4, directed: true, state: 'idle' },
              { from: 'A', to: 'C', weight: 1, directed: true, state: 'done' },
              { from: 'C', to: 'B', weight: 2, directed: true, state: 'active' },
              { from: 'B', to: 'D', weight: 1, directed: true, state: 'idle' },
              { from: 'C', to: 'D', weight: 5, directed: true, state: 'idle' },
            ],
          },
          {
            codeLine: 6,
            narration: 'Pop (3, B) and relax B→D: dist[D] = 3 + 1 = 4 < 6! Optimal shortest path A → C → B → D has total cost 4.',
            vars: [['dist[A]', 0], ['dist[C]', 1], ['dist[B]', 3], ['dist[D]', 4]],
            bestLabel: 'Shortest Path A→C→B→D = 4',
            auxLabel: 'Min-Heap PQ',
            auxItems: ['Empty (All settled)'],
            graphNodes: [
              { id: 'A', label: 'A', x: 100, y: 125, dist: 0, state: 'done' },
              { id: 'B', label: 'B', x: 320, y: 55, dist: 3, state: 'done' },
              { id: 'C', label: 'C', x: 320, y: 195, dist: 1, state: 'done' },
              { id: 'D', label: 'D', x: 540, y: 125, dist: 4, state: 'done' },
            ],
            graphEdges: [
              { from: 'A', to: 'B', weight: 4, directed: true, state: 'idle' },
              { from: 'A', to: 'C', weight: 1, directed: true, state: 'done' },
              { from: 'C', to: 'B', weight: 2, directed: true, state: 'done' },
              { from: 'B', to: 'D', weight: 1, directed: true, state: 'done' },
              { from: 'C', to: 'D', weight: 5, directed: true, state: 'idle' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 11: BACKTRACKING & DECISION TREES
   * ========================================================================== */
  {
    id: 'subsets-backtracking',
    patternId: 'backtracking',
    title: 'Subsets (Include / Exclude Decision Tree)',
    subtitle: 'At index i, branch into two choices: include nums[i] in path or skip it, collecting all 2ⁿ leaves.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 78,
    companies: ['Meta', 'Amazon', 'Google', 'Apple'],
    statement:
      'Given an integer array nums = [1, 2] of unique elements, return all possible subsets (the power set).',
    inputDisplay: 'nums = [1, 2] → [[], [1], [2], [1,2]]',
    render: 'tree',
    rubric: {
      prompt:
        'Write recursive Backtracking for Subsets: at index i == n record a copy of path; otherwise push nums[i], recurse(i + 1), pop nums[i] (backtrack), and recurse(i + 1).',
      starterHint: `function dfs(i, path):\n    if i == len(nums):\n        res.append(path.copy()); return\n    # Choice 1: include nums[i]\n    # Choice 2: exclude nums[i] (backtrack)...`,
      requiredGroups: [
        {
          concept: 'Base case recording a copy of current path',
          keywords: ['copy', 'append', 'res', 'return'],
          missingHint: 'Append a copy of path when reaching the base case.',
        },
        {
          concept: 'Include choice: push nums[i] and recurse(i + 1)',
          keywords: ['push', 'append', 'i + 1'],
          missingHint: 'Add nums[i] to path and recurse on i + 1.',
        },
        {
          concept: 'Backtrack step: pop() before exploring exclude branch',
          keywords: ['pop', 'remove'],
          missingHint: 'Pop nums[i] from path to undo the choice before the exclude branch.',
        },
      ],
    },
    approaches: [
      {
        label: 'Binary Include/Exclude Decision Tree',
        complexity: { time: 'O(n · 2ⁿ)', space: 'O(n) stack' },
        pseudocode: [
          'fn backtrack(i, path):',
          '  if i == len(nums): res.add(copy(path)); return',
          '  path.push(nums[i]); backtrack(i + 1, path) // Include',
          '  path.pop();         backtrack(i + 1, path) // Exclude',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'Each level i branches left (Include nums[i]) and right (Exclude nums[i]), generating all 2² = 4 subsets at the leaves.',
            vars: [['depth', '2'], ['leaves', '4 subsets']],
            auxLabel: 'Power Set res[]',
            auxItems: ['[1, 2]', '[1]', '[2]', '[]'],
            treeNodes: [
              { id: 'r', val: '[]', x: 50, y: 15, leftId: 'inc1', rightId: 'exc1', state: 'active', badge: 'i=0 (1)' },
              { id: 'inc1', val: '[1]', x: 26, y: 48, leftId: 'l1', rightId: 'l2', state: 'gold', badge: '+1' },
              { id: 'exc1', val: '[]', x: 74, y: 48, leftId: 'l3', rightId: 'l4', state: 'idle', badge: 'skip 1' },
              { id: 'l1', val: '[1,2]', x: 14, y: 84, state: 'done' },
              { id: 'l2', val: '[1]', x: 38, y: 84, state: 'done' },
              { id: 'l3', val: '[2]', x: 62, y: 84, state: 'done' },
              { id: 'l4', val: '[]', x: 86, y: 84, state: 'done' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * PATTERN 12: 1D & 2D DYNAMIC PROGRAMMING
   * ========================================================================== */
  {
    id: 'house-robber-dp',
    patternId: 'dynamic-programming',
    title: 'House Robber (1D Dynamic Programming)',
    subtitle: 'At house i, choose max(skip i → dp[i-1], rob i → nums[i] + dp[i-2]).',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 198,
    companies: ['Amazon', 'Google', 'Cisco', 'Microsoft'],
    statement:
      'Given nums = [2, 7, 9, 3, 1] representing cash in each house, maximize total loot without robbing two adjacent houses.',
    inputDisplay: 'nums = [2, 7, 9, 3, 1]',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(n) time, O(1) space House Robber recurrence: track prev2 (dp[i-2]) and prev1 (dp[i-1]), compute curr = max(prev1, prev2 + x), and shift.',
      starterHint: `prev2 = 0, prev1 = 0\nfor x in nums:\n    curr = max(prev1, prev2 + x)\n    # shift prev2, prev1...`,
      requiredGroups: [
        {
          concept: 'Bellman recurrence max(dp[i-1], dp[i-2] + nums[i])',
          keywords: ['max', '+'],
          missingHint: 'Use the recurrence max(prev1, prev2 + nums[i]).',
        },
        {
          concept: 'State rolling / DP array transition',
          keywords: ['prev', 'dp'],
          missingHint: 'Roll prev2 = prev1 and prev1 = curr (or fill dp[i]).',
        },
      ],
    },
    approaches: [
      {
        label: 'Bottom-Up DP Recurrence',
        complexity: { time: 'O(n)', space: 'O(1)' },
        pseudocode: [
          'prev2 = 0, prev1 = 0',
          'for x in nums:',
          '  curr = max(prev1, prev2 + x)',
          '  prev2 = prev1; prev1 = curr',
          'return prev1',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'At index 2 (cash = 9): max(skip=7, rob=2+9=11) -> 11! At index 4 (cash = 1): max(11, 11+1=12) -> 12!',
            vars: [['robbedIndices', '[0, 2, 4]'], ['loot', '2 + 9 + 1 = 12']],
            arrValues: [2, 7, 9, 3, 1],
            doneIndices: [0, 2, 4],
            dimmed: [1, 3],
            bestIndices: [0, 2, 4],
            bestLabel: 'Max Loot = 12',
            auxLabel: 'dp[] table',
            auxItems: ['dp[0]=2', 'dp[1]=7', 'dp[2]=11', 'dp[3]=11', 'dp[4]=12'],
          },
        ],
      },
    ],
  },
  {
    id: 'longest-common-subsequence',
    patternId: 'dynamic-programming',
    title: 'Longest Common Subsequence (2D DP Grid)',
    subtitle: 'If chars match, take 1 + diagonal dp[i-1][j-1]; otherwise take max(top dp[i-1][j], left dp[i][j-1]).',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 1143,
    companies: ['Amazon', 'Google', 'Meta', 'Atlassian'],
    statement:
      'Given two strings text1 = "ace" and text2 = "abcde", return the length of their longest common subsequence (3, "ace").',
    inputDisplay: 'text1 = "ace", text2 = "abcde"',
    render: 'matrix',
    rubric: {
      prompt:
        'Write the 2D DP recurrence for Longest Common Subsequence: when text1[i-1] == text2[j-1], set dp[i][j] = 1 + dp[i-1][j-1]; else set dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      starterHint: `for i in 1..m:\n  for j in 1..n:\n    if text1[i-1] == text2[j-1]:\n      dp[i][j] = 1 + dp[i-1][j-1]\n    else:\n      dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
      requiredGroups: [
        {
          concept: 'Character match case: 1 + dp[i-1][j-1] (diagonal)',
          keywords: ['==', '1 +', 'i-1', 'j-1', 'i - 1'],
          missingHint: 'When characters match, add 1 to the diagonal cell dp[i-1][j-1].',
        },
        {
          concept: 'Mismatch case: max(dp[i-1][j], dp[i][j-1])',
          keywords: ['else', 'max'],
          missingHint: 'When characters differ, take max(dp[i-1][j], dp[i][j-1]).',
        },
      ],
    },
    approaches: [
      {
        label: '2D Bottom-Up Tabulation',
        complexity: { time: 'O(m · n)', space: 'O(m · n)' },
        pseudocode: [
          'dp = zeros((m + 1) × (n + 1))',
          'for i in 1..m, j in 1..n:',
          '  if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]',
          '  else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
          'return dp[m][n]',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'Matches at ("a","a"), ("c","c"), and ("e","e") add +1 along the diagonal; mismatches propagate max(top, left). Bottom-right cell dp[3][5] = 3!',
            vars: [['LCS', '"ace"'], ['dp[3][5]', 3]],
            bestLabel: 'LCS Length = 3 ("ace")',
            matrix: {
              rowLabels: ['∅', 'a', 'c', 'e'],
              colLabels: ['∅', 'a', 'b', 'c', 'd', 'e'],
              grid: [
                [0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1],
                [0, 1, 1, 2, 2, 2],
                [0, 1, 1, 2, 2, 3],
              ],
              doneCells: [[1, 1], [2, 3]],
              bestCells: [[3, 5]],
            },
          },
        ],
      },
    ],
  },
];
