import { DsaPattern, DsaProblem } from '../types/curriculum';

export const DSA_PATTERNS: DsaPattern[] = [
  {
    id: 'two-pointers',
    number: '01',
    title: 'Two Pointers',
    tagline: 'Shrink search space in O(n) with converging or multi-lane indices.',
  },
  {
    id: 'sliding-window-lists',
    number: '02',
    title: 'Sliding Window & Linked Lists',
    tagline: 'Maintain dynamic window invariants and re-wire pointer references in-place.',
  },
  {
    id: 'trees-graphs',
    number: '03',
    title: 'Trees & Graph Traversal',
    tagline: 'Recursive subtree transformations and weighted shortest-path relaxation.',
  },
];

export const DSA_PROBLEMS: DsaProblem[] = [
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
      'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number (9). Return their indices in O(1) extra space.',
    inputDisplay: 'nums = [1, 2, 4, 6, 8, 9], target = 9',
    render: 'cells',
    rubric: {
      prompt:
        'Write pseudocode for the O(n) Two-Pointers approach. Initialize left and right pointers at both ends and move them based on comparing their sum to target.',
      starterHint: `left = 0, right = n - 1\nwhile left < right:\n    sum = nums[left] + nums[right]\n    # compare sum with target...`,
      requiredGroups: [
        {
          concept: 'Two boundary pointers (left/L and right/R)',
          keywords: ['left', 'right', 'l', 'r', 'low', 'high'],
          missingHint: 'Initialize two pointers at the start (0) and end (n - 1) of the sorted array.',
        },
        {
          concept: 'Loop while pointers have not crossed',
          keywords: ['while', '<'],
          missingHint: 'Loop while left < right so every step narrows the search window.',
        },
        {
          concept: 'Sum comparison and pointer movement',
          keywords: ['target', 'sum', '+', '-'],
          missingHint: 'Compare nums[left] + nums[right] against target: increment left if too small, decrement right if too large.',
        },
      ],
      forbiddenPatterns: [
        {
          pattern: /for\s+.*\s+in.*for\s+/is,
          reason: 'Nested loops run in O(n²). Use converging pointers to exploit the sorted order in O(n).',
        },
      ],
    },
    approaches: [
      {
        label: 'Brute Force',
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
            narration: 'Start Brute Force: anchor i = 0 (value 1) and scan every j > i.',
            vars: [
              ['i', 0],
              ['j', 1],
              ['target', 9],
              ['sum', 3],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            highlights: [0, 1],
            pointers: [
              { name: 'i', index: 0, color: 'accent', lane: 0 },
              { name: 'j', index: 1, color: 'blue', lane: 1 },
            ],
          },
          {
            codeLine: 2,
            narration: 'Check i = 0, j = 2: 1 + 4 = 5 != 9. Brute force ignores that the array is sorted.',
            vars: [
              ['i', 0],
              ['j', 2],
              ['target', 9],
              ['sum', 5],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            highlights: [0, 2],
            dimmed: [1],
            pointers: [
              { name: 'i', index: 0, color: 'accent', lane: 0 },
              { name: 'j', index: 2, color: 'blue', lane: 1 },
            ],
          },
          {
            codeLine: 2,
            narration: 'Check i = 0, j = 4: 1 + 8 = 9 == target! Found after scanning across the array.',
            vars: [
              ['i', 0],
              ['j', 4],
              ['target', 9],
              ['sum', 9],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            doneIndices: [0, 4],
            bestIndices: [0, 4],
            bestLabel: '1 + 8 = 9',
            pointers: [
              { name: 'i', index: 0, color: 'green', lane: 0 },
              { name: 'j', index: 4, color: 'green', lane: 1 },
            ],
          },
        ],
      },
      {
        label: 'Two Pointers (Optimal)',
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
            codeLine: 0,
            narration: 'Place L at index 0 (smallest = 1) and R at index 5 (largest = 9).',
            vars: [
              ['L', 0],
              ['R', 5],
              ['target', 9],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            highlights: [0, 5],
            regions: [{ start: 0, end: 5, label: 'Search Window [0..5]', tint: 'accent' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 5, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 2,
            narration: 'Compute sum = nums[0] + nums[5] = 1 + 9 = 10. Since 10 > 9, index 5 can never pair with anything >= 1.',
            vars: [
              ['L', 0],
              ['R', 5],
              ['sum', 10],
              ['target', 9],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            reads: [0, 5],
            regions: [{ start: 0, end: 5, label: '10 > 9 (Too Large)', tint: 'accent' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 5, color: 'red', lane: 0 },
            ],
          },
          {
            codeLine: 5,
            narration: 'Decrement R to 4 (value 8), eliminating index 5 in O(1) time.',
            vars: [
              ['L', 0],
              ['R', 4],
              ['sum', 9],
              ['target', 9],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            highlights: [0, 4],
            dimmed: [5],
            regions: [{ start: 0, end: 4, label: 'Search Window [0..4]', tint: 'blue' }],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 4, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 3,
            narration: 'nums[0] + nums[4] = 1 + 8 = 9 == target! Return [0, 4] in just 2 comparisons.',
            vars: [
              ['L', 0],
              ['R', 4],
              ['sum', 9],
              ['return', '[0, 4]'],
            ],
            arrValues: [1, 2, 4, 6, 8, 9],
            doneIndices: [0, 4],
            dimmed: [5],
            bestIndices: [0, 4],
            bestLabel: 'Match [0, 4]',
            pointers: [
              { name: 'L', index: 0, color: 'green', lane: 0 },
              { name: 'R', index: 4, color: 'green', lane: 0 },
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
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    inputDisplay: 's = "r a c e , c a r"',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(1)-space Two-Pointers pseudocode for Valid Palindrome: skip non-alphanumeric characters from both ends, compare lowercase chars, and move inward.',
      starterHint: `L = 0, R = len(s) - 1\nwhile L < R:\n    # skip non-alphanumeric and compare...`,
      requiredGroups: [
        {
          concept: 'Two inward pointers L and R',
          keywords: ['l', 'r', 'left', 'right'],
          missingHint: 'Use two pointers starting at 0 and len(s) - 1.',
        },
        {
          concept: 'Compare characters and return false on mismatch',
          keywords: ['!=', 'false', 'lower', 'return'],
          missingHint: 'Check if lower(s[L]) != lower(s[R]) and return False immediately on mismatch.',
        },
        {
          concept: 'Advance both pointers inward',
          keywords: ['+ 1', '- 1', '+=', '-=', '++', '--'],
          missingHint: 'Increment L and decrement R after each matching character pair.',
        },
      ],
    },
    approaches: [
      {
        label: 'Filter + Reverse Copy',
        complexity: { time: 'O(n)', space: 'O(n)' },
        pseudocode: [
          'cleaned = [ch.lower() for ch in s if ch.isalnum()]',
          'reversed_copy = cleaned[::-1]',
          'return cleaned == reversed_copy',
        ],
        steps: [
          {
            codeLine: 0,
            narration: 'Scan s and allocate a new array cleaned containing only alphanumeric lowercase chars.',
            vars: [
              ['len(s)', 8],
              ['len(cleaned)', 7],
              ['extra_space', 'O(n)'],
            ],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            highlights: [0, 1, 2, 3, 5, 6, 7],
            dimmed: [4],
            auxLabel: 'cleaned[] copy in heap',
            auxItems: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
          },
          {
            codeLine: 2,
            narration: 'Reverse cleaned[] into a second O(n) buffer and compare element-by-element. Works, but wastes memory.',
            vars: [
              ['cleaned', 'racecar'],
              ['reversed', 'racecar'],
              ['result', 'true'],
            ],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            doneIndices: [0, 1, 2, 3, 5, 6, 7],
            dimmed: [4],
            auxLabel: 'reversed_copy[]',
            auxItems: ['r', 'a', 'c', 'e', 'c', 'a', 'r'],
          },
        ],
      },
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
            codeLine: 0,
            narration: 'Compare outer characters directly: s[0] = "r" and s[7] = "r" match!',
            vars: [
              ['L', 0],
              ['R', 7],
              ['s[L]', 'r'],
              ['s[R]', 'r'],
            ],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            highlights: [0, 7],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 7, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 5,
            narration: 'Step inward through "a" == "a" and "c" == "c" until L = 3 ("e") and R = 4 (",").',
            vars: [
              ['L', 3],
              ['R', 4],
              ['s[L]', 'e'],
              ['s[R]', ','],
            ],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            doneIndices: [0, 1, 2, 5, 6, 7],
            highlights: [3, 4],
            pointers: [
              { name: 'L', index: 3, color: 'accent', lane: 0 },
              { name: 'R', index: 4, color: 'red', lane: 0 },
            ],
          },
          {
            codeLine: 3,
            narration: 's[4] = "," is not alphanumeric — decrement R to 3. Now L == R == 3, loop ends and returns true in O(1) space!',
            vars: [
              ['L', 3],
              ['R', 3],
              ['s[L]', 'e'],
              ['result', 'true'],
            ],
            arrValues: ['r', 'a', 'c', 'e', ',', 'c', 'a', 'r'],
            doneIndices: [0, 1, 2, 3, 5, 6, 7],
            dimmed: [4],
            bestIndices: [3],
            bestLabel: 'Palindrome Verified',
            pointers: [
              { name: 'L', index: 3, color: 'green', lane: 0 },
              { name: 'R', index: 3, color: 'green', lane: 1 },
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
      'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    inputDisplay: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
    render: 'bars',
    rubric: {
      prompt:
        'Write pseudocode for Container With Most Water in O(n) time. Compute area at each step, update maxArea, and advance whichever pointer has the smaller height.',
      starterHint: `L = 0, R = n - 1, maxArea = 0\nwhile L < R:\n    area = (R - L) * min(height[L], height[R])\n    # update maxArea and move shorter wall...`,
      requiredGroups: [
        {
          concept: 'Area formula (R - L) * min(height[L], height[R])',
          keywords: ['min', 'area', '*'],
          missingHint: 'Compute width * min(height[L], height[R]).',
        },
        {
          concept: 'Track maximum area seen so far',
          keywords: ['max', 'best'],
          missingHint: 'Update maxArea = max(maxArea, area) on every iteration.',
        },
        {
          concept: 'Move the shorter wall inward',
          keywords: ['height', '<', 'left', 'right', 'l', 'r'],
          missingHint: 'If height[L] < height[R], increment L; otherwise decrement R.',
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
            narration: 'Start widest container L = 0 (h=1), R = 8 (h=7). Width = 8, bounded by shorter left wall h = 1 -> area = 8.',
            vars: [
              ['L', 0],
              ['R', 8],
              ['area', '8 × 1 = 8'],
              ['maxArea', 8],
            ],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            highlights: [0, 8],
            waterLevels: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 8, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 4,
            narration: 'height[L]=1 < height[R]=7: keeping L=0 can never beat height 1, so advance L -> 1 (height 8)! Now area = 7 × min(8, 7) = 49.',
            vars: [
              ['L', 1],
              ['R', 8],
              ['area', '7 × 7 = 49'],
              ['maxArea', 49],
            ],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            dimmed: [0],
            highlights: [1, 8],
            bestIndices: [1, 8],
            bestLabel: 'Max Area = 49',
            waterLevels: [0, 7, 7, 7, 7, 7, 7, 7, 7],
            pointers: [
              { name: 'L', index: 1, color: 'accent', lane: 0 },
              { name: 'R', index: 8, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 5,
            narration: 'Now height[R]=7 < height[L]=8, so decrement R -> 6 (height 8). Area = 5 × min(8, 8) = 40 < 49.',
            vars: [
              ['L', 1],
              ['R', 6],
              ['area', '5 × 8 = 40'],
              ['maxArea', 49],
            ],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            dimmed: [0, 7, 8],
            highlights: [1, 6],
            bestIndices: [1, 8],
            bestLabel: 'Best = 49',
            waterLevels: [0, 8, 8, 8, 8, 8, 8, 0, 0],
            pointers: [
              { name: 'L', index: 1, color: 'accent', lane: 0 },
              { name: 'R', index: 6, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 6,
            narration: 'Pointers converge and confirm maxArea = 49 between indices 1 and 8.',
            vars: [
              ['bestL', 1],
              ['bestR', 8],
              ['maxArea', 49],
            ],
            arrValues: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            doneIndices: [1, 8],
            bestIndices: [1, 8],
            bestLabel: 'Optimal Area = 49',
            waterLevels: [0, 7, 7, 7, 7, 7, 7, 7, 7],
            pointers: [
              { name: 'L*', index: 1, color: 'green', lane: 0 },
              { name: 'R*', index: 8, color: 'green', lane: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sliding-window-unique',
    patternId: 'sliding-window-lists',
    title: 'Longest Substring Without Repeating Characters',
    subtitle: 'Expand R to grow the window; shrink L whenever a duplicate enters the Set.',
    kind: 'problem',
    difficulty: 'Medium',
    leetcodeId: 3,
    companies: ['Amazon', 'Meta', 'Netflix', 'Uber'],
    statement:
      'Given a string s, find the length of the longest substring without duplicate characters in O(n) time using a sliding window.',
    inputDisplay: 's = "a b c a b c b b"',
    render: 'cells',
    rubric: {
      prompt:
        'Write the O(n) Sliding Window pseudocode: maintain a Set/Map of characters in window [L..R], shrink L while s[R] is a duplicate, and update maxLen = max(maxLen, R - L + 1).',
      starterHint: `L = 0, maxLen = 0, seen = Set()\nfor R from 0 to n - 1:\n    while s[R] in seen:\n        # remove s[L] and advance L...`,
      requiredGroups: [
        {
          concept: 'Window pointers L and R',
          keywords: ['l', 'r', 'left', 'right'],
          missingHint: 'Maintain left pointer L and right loop index R.',
        },
        {
          concept: 'Shrink window on duplicate using Set/Map',
          keywords: ['while', 'seen', 'set', 'map', 'remove', 'delete'],
          missingHint: 'Use a while loop to remove s[L] and increment L whenever s[R] is already in the window.',
        },
        {
          concept: 'Update max window length (R - L + 1)',
          keywords: ['max', '1', '-'],
          missingHint: 'Update maxLen = max(maxLen, R - L + 1) after restoring window uniqueness.',
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
            narration: 'Expand R from 0 to 2: window ["a", "b", "c"] has all unique characters. maxLen = 3.',
            vars: [
              ['L', 0],
              ['R', 2],
              ['windowLen', 3],
              ['maxLen', 3],
            ],
            arrValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
            highlights: [0, 1, 2],
            bestIndices: [0, 1, 2],
            bestLabel: 'Len = 3 ("abc")',
            regions: [{ start: 0, end: 2, label: 'Window [0..2] = "abc"', tint: 'green' }],
            auxLabel: 'HashSet window',
            auxItems: ['a', 'b', 'c'],
            pointers: [
              { name: 'L', index: 0, color: 'accent', lane: 0 },
              { name: 'R', index: 2, color: 'blue', lane: 0 },
            ],
          },
          {
            codeLine: 2,
            narration: 'Advance R to 3 ("a"). Collision! "a" is already in Set. We must evict s[L]="a" and increment L -> 1.',
            vars: [
              ['L', 0],
              ['R', 3],
              ['duplicate', "'a'"],
              ['maxLen', 3],
            ],
            arrValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
            reads: [0, 3],
            regions: [{ start: 0, end: 3, label: 'Collision on "a"', tint: 'accent' }],
            auxLabel: 'HashSet window',
            auxItems: ['a', 'b', 'c'],
            pointers: [
              { name: 'L', index: 0, color: 'red', lane: 0 },
              { name: 'R', index: 3, color: 'red', lane: 0 },
            ],
          },
          {
            codeLine: 5,
            narration: 'After evicting index 0, L = 1 and window [1..3] = "bca" is unique again! maxLen stays 3.',
            vars: [
              ['L', 1],
              ['R', 3],
              ['windowLen', 3],
              ['maxLen', 3],
            ],
            arrValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
            dimmed: [0],
            doneIndices: [1, 2, 3],
            regions: [{ start: 1, end: 3, label: 'Valid Window [1..3] = "bca"', tint: 'blue' }],
            auxLabel: 'HashSet window',
            auxItems: ['b', 'c', 'a'],
            pointers: [
              { name: 'L', index: 1, color: 'accent', lane: 0 },
              { name: 'R', index: 3, color: 'blue', lane: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'reverse-linked-list',
    patternId: 'sliding-window-lists',
    title: 'Reverse Linked List',
    subtitle: 'Re-wire next pointers in-place using prev, curr, and nextTemp without allocating nodes.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 206,
    companies: ['Microsoft', 'Amazon', 'Apple', 'Bloomberg'],
    statement:
      'Given the head of a singly linked list 10 -> 20 -> 30 -> 40, reverse the list in-place in O(n) time and O(1) extra space.',
    inputDisplay: 'head = 10 -> 20 -> 30 -> 40 -> NULL',
    render: 'list',
    rubric: {
      prompt:
        'Write the iterative 3-pointer linked list reversal: save nextTemp = curr.next, flip curr.next = prev, then advance prev = curr and curr = nextTemp.',
      starterHint: `prev = null, curr = head\nwhile curr != null:\n    nextTemp = curr.next\n    # flip pointer and advance...`,
      requiredGroups: [
        {
          concept: 'Preserve curr.next before overwriting',
          keywords: ['next', 'temp', 'nxt'],
          missingHint: 'Save nextTemp = curr.next before modifying curr.next, or you lose the rest of the list.',
        },
        {
          concept: 'Reverse pointer curr.next = prev',
          keywords: ['curr.next', 'prev'],
          missingHint: 'Set curr.next = prev to flip the arrow backward.',
        },
        {
          concept: 'Advance prev and curr',
          keywords: ['prev =', 'curr ='],
          missingHint: 'Advance prev = curr and curr = nextTemp on each iteration.',
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
            codeLine: 0,
            narration: 'Initial state: 10 -> 20 -> 30 -> 40. prev = NULL, curr points at node 10.',
            vars: [
              ['prev', 'NULL'],
              ['curr', '10'],
              ['nxt', '20'],
            ],
            arrValues: [10, 20, 30, 40],
            highlights: [0],
            pointers: [{ name: 'curr', index: 0, color: 'accent', lane: 0 }],
            listLinks: [
              { from: 0, to: 1, status: 'idle' },
              { from: 1, to: 2, status: 'idle' },
              { from: 2, to: 3, status: 'idle' },
            ],
          },
          {
            codeLine: 3,
            narration: 'Save nxt = 20, then flip 10.next = NULL and advance prev = 10, curr = 20.',
            vars: [
              ['prev', '10'],
              ['curr', '20'],
              ['nxt', '30'],
            ],
            arrValues: [10, 20, 30, 40],
            doneIndices: [0],
            highlights: [1],
            pointers: [
              { name: 'prev', index: 0, color: 'green', lane: 0 },
              { name: 'curr', index: 1, color: 'accent', lane: 0 },
              { name: 'nxt', index: 2, color: 'blue', lane: 1 },
            ],
            listLinks: [
              { from: 0, to: null, status: 'done', label: 'NULL' },
              { from: 1, to: 0, status: 'active', label: 'flip' },
              { from: 2, to: 3, status: 'idle' },
            ],
          },
          {
            codeLine: 5,
            narration: 'All links reversed! 40 -> 30 -> 20 -> 10 -> NULL. Return prev (node 40) as new head.',
            vars: [
              ['prev (newHead)', '40'],
              ['curr', 'NULL'],
            ],
            arrValues: [10, 20, 30, 40],
            doneIndices: [0, 1, 2, 3],
            bestIndices: [3],
            bestLabel: 'New Head = 40',
            pointers: [{ name: 'prev (head)', index: 3, color: 'green', lane: 0 }],
            listLinks: [
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
    id: 'invert-binary-tree',
    patternId: 'trees-graphs',
    title: 'Invert Binary Tree & Shortest Path',
    subtitle: 'Recursively swap left and right children at every node in post-order / pre-order.',
    kind: 'problem',
    difficulty: 'Easy',
    leetcodeId: 226,
    companies: ['Google', 'Homebrew', 'Amazon', 'Meta'],
    statement:
      'Given the root of a binary tree, invert the tree (mirror its left and right subtrees at every level) and return its root.',
    inputDisplay: 'root = [4, 2, 7, 1, 3, 6, 9]',
    render: 'tree',
    rubric: {
      prompt:
        'Write recursive pseudocode for Invert Binary Tree: handle the null base case, swap root.left and root.right, and recursively invert both subtrees.',
      starterHint: `function invertTree(node):\n    if node == null: return null\n    # swap children and recurse...`,
      requiredGroups: [
        {
          concept: 'Base case for null node',
          keywords: ['null', 'none', 'if'],
          missingHint: 'Check if node is null/None and return null.',
        },
        {
          concept: 'Swap left and right pointers',
          keywords: ['left', 'right'],
          missingHint: 'Swap node.left and node.right.',
        },
        {
          concept: 'Recursive calls on children',
          keywords: ['invert', 'recurse', 'dfs'],
          missingHint: 'Recursively call invertTree on left and right children.',
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
          '  invertTree(node.left)',
          '  invertTree(node.right)',
          '  return node',
        ],
        steps: [
          {
            codeLine: 2,
            narration: 'At root 4: swap left child (2) and right child (7). Notice the entire subtrees move with their roots!',
            vars: [
              ['node', 4],
              ['left', '7 (was 2)'],
              ['right', '2 (was 7)'],
            ],
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
            codeLine: 3,
            narration: 'Recurse into node 7 and node 2: swap (6 ↔ 9) and swap (1 ↔ 3). Full mirror tree complete!',
            vars: [
              ['node', '7 & 2'],
              ['bfsOrder', '[4, 7, 2, 9, 6, 3, 1]'],
            ],
            callStack: ['invertTree(4)', 'invertTree(7) -> done', 'invertTree(2) -> done'],
            treeNodes: [
              { id: 'n4', val: 4, x: 50, y: 18, leftId: 'n7', rightId: 'n2', state: 'done', badge: 'Root' },
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
];
