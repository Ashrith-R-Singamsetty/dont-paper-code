import { DsaApproach, DsaStep, PointerBadge } from '../types/curriculum';

export interface CustomGeneratorConfig {
  id: string;
  name: string;
  defaultInput: string;
  defaultTarget?: number | string;
  inputType: 'number-array' | 'string' | 'parentheses';
  placeholder: string;
  targetLabel?: string;
  presets: Array<{
    label: string;
    input: string;
    target?: number | string;
  }>;
}

export const SUPPORTED_ALGORITHMS: Record<string, CustomGeneratorConfig> = {
  'two-sum-ii': {
    id: 'two-sum-ii',
    name: 'Two Pointers (Sorted Two Sum)',
    defaultInput: '1, 2, 4, 6, 8, 9',
    defaultTarget: 10,
    inputType: 'number-array',
    placeholder: 'e.g. 1, 2, 4, 7, 11, 15',
    targetLabel: 'Target Sum',
    presets: [
      { label: 'Standard (Target 10)', input: '1, 2, 4, 6, 8, 9', target: 10 },
      { label: 'First & Last Pair', input: '2, 5, 8, 12, 19', target: 21 },
      { label: 'With Duplicates', input: '1, 2, 2, 3, 5, 7', target: 4 },
      { label: 'No Match Possible', input: '2, 4, 6, 8, 10', target: 11 },
    ],
  },
  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search (Logarithmic Window)',
    defaultInput: '-1, 0, 3, 5, 9, 12',
    defaultTarget: 9,
    inputType: 'number-array',
    placeholder: 'e.g. -1, 0, 3, 5, 9, 12',
    targetLabel: 'Target Value',
    presets: [
      { label: 'Target at Mid', input: '1, 3, 5, 7, 9, 11, 13', target: 7 },
      { label: 'Target on Right', input: '-1, 0, 3, 5, 9, 12', target: 9 },
      { label: 'Target on Left', input: '2, 4, 6, 8, 10, 12', target: 4 },
      { label: 'Target Missing (Low)', input: '5, 10, 15, 20', target: 2 },
    ],
  },
  'container-with-most-water': {
    id: 'container-with-most-water',
    name: 'Container With Most Water',
    defaultInput: '1, 8, 6, 2, 5, 4, 8, 3, 7',
    inputType: 'number-array',
    placeholder: 'e.g. 1, 8, 6, 2, 5, 4, 8, 3, 7',
    presets: [
      { label: 'Classic LeetCode', input: '1, 8, 6, 2, 5, 4, 8, 3, 7' },
      { label: 'Descending Valley', input: '9, 7, 5, 3, 2, 4, 6, 8' },
      { label: 'Equal Heights', input: '5, 5, 5, 5, 5' },
      { label: 'Two Outer Peaks', input: '10, 1, 1, 1, 1, 10' },
    ],
  },
  'best-time-to-buy-and-sell-stock': {
    id: 'best-time-to-buy-and-sell-stock',
    name: 'Best Time to Buy & Sell Stock',
    defaultInput: '7, 1, 5, 3, 6, 4',
    inputType: 'number-array',
    placeholder: 'e.g. 7, 1, 5, 3, 6, 4',
    presets: [
      { label: 'Max Profit 5', input: '7, 1, 5, 3, 6, 4' },
      { label: 'Strictly Decreasing (Profit 0)', input: '7, 6, 4, 3, 1' },
      { label: 'Late Spurt (Profit 9)', input: '3, 2, 6, 5, 0, 9' },
    ],
  },
  'valid-palindrome': {
    id: 'valid-palindrome',
    name: 'Valid Palindrome (Two Pointers)',
    defaultInput: 'racecar',
    inputType: 'string',
    placeholder: 'e.g. racecar or deified',
    presets: [
      { label: 'Odd Palindrome', input: 'racecar' },
      { label: 'Even Palindrome', input: 'noon' },
      { label: 'Almost Palindrome', input: 'race a car' },
      { label: 'Single Letter', input: 'a' },
    ],
  },
  'sort-colors': {
    id: 'sort-colors',
    name: 'Sort Colors (Dutch National Flag)',
    defaultInput: '2, 0, 2, 1, 1, 0',
    inputType: 'number-array',
    placeholder: 'e.g. 2, 0, 2, 1, 1, 0 (0s, 1s, 2s)',
    presets: [
      { label: 'Scattered 0, 1, 2', input: '2, 0, 2, 1, 1, 0' },
      { label: 'Reverse Order', input: '2, 2, 1, 1, 0, 0' },
      { label: 'All Twos & Zeros', input: '2, 0, 2, 0, 2, 0' },
    ],
  },
  'valid-parentheses': {
    id: 'valid-parentheses',
    name: 'Valid Parentheses (LIFO Stack)',
    defaultInput: '()[]{}',
    inputType: 'parentheses',
    placeholder: 'e.g. ()[]{} or {[()]}',
    presets: [
      { label: 'Nested Valid', input: '{[()]}' },
      { label: 'Sequential Valid', input: '()[]{}' },
      { label: 'Mismatched Bracket', input: '(]' },
      { label: 'Unclosed Leftover', input: '((())' },
    ],
  },
};

export function parseNumberArray(input: string): number[] {
  const cleaned = input.replace(/[\[\]]/g, '');
  const parts = cleaned.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  const nums = parts.map((p) => Number(p)).filter((n) => !isNaN(n));
  return nums.length > 0 ? nums : [1, 2, 3, 4, 5];
}

export function parseStringOrArray(input: string): string[] {
  const trimmed = input.trim();
  if (trimmed.includes(',') || trimmed.startsWith('[')) {
    const cleaned = trimmed.replace(/[\[\]"]/g, '');
    const parts = cleaned.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  // Treat as string of characters, stripping spaces and punctuation
  const chars = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '').split('');
  return chars.length > 0 ? chars : ['r', 'a', 'c', 'e', 'c', 'a', 'r'];
}

export function detectAlgorithmForProblem(problemId: string, patternId?: string): string {
  if (SUPPORTED_ALGORITHMS[problemId]) {
    return problemId;
  }
  const pid = (patternId ?? '').toLowerCase();
  const id = problemId.toLowerCase();

  if (id.includes('sum') || id.includes('two-pointer') || pid.includes('two-pointers')) {
    if (id.includes('water') || id.includes('container')) return 'container-with-most-water';
    if (id.includes('palindrome')) return 'valid-palindrome';
    if (id.includes('sort-colors') || id.includes('dutch')) return 'sort-colors';
    return 'two-sum-ii';
  }
  if (id.includes('binary-search') || pid.includes('binary-search')) {
    return 'binary-search';
  }
  if (id.includes('stock') || id.includes('sliding-window') || pid.includes('sliding-window')) {
    return 'best-time-to-buy-and-sell-stock';
  }
  if (id.includes('parenthes') || id.includes('stack') || pid.includes('stack')) {
    return 'valid-parentheses';
  }
  // Default fallback
  return 'two-sum-ii';
}

export function generateCustomSteps(
  algoId: string,
  rawInput: string,
  rawTarget?: string | number
): DsaApproach {
  switch (algoId) {
    case 'binary-search': {
      const nums = parseNumberArray(rawInput).sort((a, b) => a - b);
      const target = typeof rawTarget === 'number' ? rawTarget : Number(rawTarget ?? nums[Math.floor(nums.length / 2)]);
      return generateBinarySearch(nums, target);
    }
    case 'container-with-most-water': {
      const heights = parseNumberArray(rawInput).map((n) => Math.max(1, Math.abs(n)));
      return generateContainerWithMostWater(heights);
    }
    case 'best-time-to-buy-and-sell-stock': {
      const prices = parseNumberArray(rawInput).map((n) => Math.max(0, n));
      return generateStock(prices);
    }
    case 'valid-palindrome': {
      const chars = parseStringOrArray(rawInput);
      return generateValidPalindrome(chars);
    }
    case 'sort-colors': {
      const nums = parseNumberArray(rawInput).map((n) => (n <= 0 ? 0 : n >= 2 ? 2 : 1));
      return generateSortColors(nums);
    }
    case 'valid-parentheses': {
      const chars = rawInput.replace(/[^(){}\[\]]/g, '').split('');
      return generateValidParentheses(chars.length > 0 ? chars : ['(', '[', ']', ')']);
    }
    case 'two-sum-ii':
    default: {
      const nums = parseNumberArray(rawInput).sort((a, b) => a - b);
      const target = typeof rawTarget === 'number' ? rawTarget : Number(rawTarget ?? (nums[0] + nums[nums.length - 1]));
      return generateTwoSumII(nums, target);
    }
  }
}

// -------------------------------------------------------------
// Two Sum II Generator
// -------------------------------------------------------------
function generateTwoSumII(nums: number[], target: number): DsaApproach {
  const steps: DsaStep[] = [];
  let L = 0;
  let R = nums.length - 1;

  steps.push({
    codeLine: 1,
    narration: `Initialize L = 0 (val = ${nums[L]}) and R = ${R} (val = ${nums[R]}). Array is sorted. Target = ${target}.`,
    arrValues: [...nums],
    pointers: [
      { name: 'L', index: L, color: 'accent' },
      { name: 'R', index: R, color: 'blue' },
    ],
    reads: [L, R],
    regions: [{ start: L, end: R }],
    vars: [
      ['L', L],
      ['R', R],
      ['nums[L]', nums[L]],
      ['nums[R]', nums[R]],
      ['sum', nums[L] + nums[R]],
      ['target', target],
    ],
  });

  let found = false;
  while (L < R) {
    const sum = nums[L] + nums[R];

    if (sum === target) {
      steps.push({
        codeLine: 4,
        narration: `Match found! nums[${L}] (${nums[L]}) + nums[${R}] (${nums[R]}) == target ${target}. Return 1-based indices [${L + 1}, ${R + 1}].`,
        arrValues: [...nums],
        pointers: [
          { name: 'L', index: L, color: 'accent' },
          { name: 'R', index: R, color: 'blue' },
        ],
        highlights: [L, R],
        best: { indices: [L, R], label: `Sum = ${target} ✓` },
        vars: [
          ['L', L],
          ['R', R],
          ['sum', sum],
          ['target', target],
          ['match', 'TRUE'],
        ],
      });
      found = true;
      break;
    }

    if (sum < target) {
      steps.push({
        codeLine: 6,
        narration: `Sum ${nums[L]} + ${nums[R]} = ${sum} is LESS than target ${target}. Since array is sorted, we must increase the sum: move L pointer right (L++ from ${L} to ${L + 1}).`,
        arrValues: [...nums],
        pointers: [
          { name: 'L', index: L, color: 'accent' },
          { name: 'R', index: R, color: 'blue' },
        ],
        reads: [L, R],
        regions: [{ start: L, end: R }],
        vars: [
          ['L', L],
          ['R', R],
          ['sum', sum],
          ['target', target],
          ['action', 'L++'],
        ],
      });
      L++;
    } else {
      steps.push({
        codeLine: 8,
        narration: `Sum ${nums[L]} + ${nums[R]} = ${sum} is GREATER than target ${target}. Since array is sorted, we must decrease the sum: move R pointer left (R-- from ${R} to ${R - 1}).`,
        arrValues: [...nums],
        pointers: [
          { name: 'L', index: L, color: 'accent' },
          { name: 'R', index: R, color: 'blue' },
        ],
        reads: [L, R],
        regions: [{ start: L, end: R }],
        vars: [
          ['L', L],
          ['R', R],
          ['sum', sum],
          ['target', target],
          ['action', 'R--'],
        ],
      });
      R--;
    }
  }

  if (!found) {
    steps.push({
      codeLine: 9,
      narration: `Pointers crossed (L >= R). No pair in [${nums.join(', ')}] sums to target ${target}. Return [-1, -1].`,
      arrValues: [...nums],
      pointers: [
        { name: 'L', index: Math.min(L, nums.length - 1), color: 'accent' },
        { name: 'R', index: Math.max(0, R), color: 'blue' },
      ],
      vars: [
        ['L', L],
        ['R', R],
        ['found', 'FALSE'],
        ['result', '[-1, -1]'],
      ],
    });
  }

  return {
    label: `Custom: [${nums.join(', ')}] · Target ${target}`,
    complexity: { time: 'O(N)', space: 'O(1)' },
    pseudocode: [
      'function twoSum(numbers, target):',
      '    L = 0, R = numbers.length - 1',
      '    while L < R:',
      '        sum = numbers[L] + numbers[R]',
      '        if sum == target: return [L + 1, R + 1]',
      '        else if sum < target: L++',
      '        else: R--',
      '    return [-1, -1]',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Binary Search Generator
// -------------------------------------------------------------
function generateBinarySearch(nums: number[], target: number): DsaApproach {
  const steps: DsaStep[] = [];
  let L = 0;
  let R = nums.length - 1;
  let found = false;

  steps.push({
    codeLine: 2,
    narration: `Initialize search bounds: L = 0, R = ${R}. Target = ${target}.`,
    arrValues: [...nums],
    pointers: [
      { name: 'L', index: L, color: 'accent' },
      { name: 'R', index: R, color: 'blue' },
    ],
    regions: [{ start: L, end: R }],
    vars: [
      ['L', L],
      ['R', R],
      ['target', target],
    ],
  });

  while (L <= R) {
    const mid = Math.floor((L + R) / 2);
    const midVal = nums[mid];

    const pointers: PointerBadge[] = [
      { name: 'L', index: L, color: 'accent' },
      { name: 'mid', index: mid, color: 'gold' },
      { name: 'R', index: R, color: 'blue' },
    ];

    if (midVal === target) {
      steps.push({
        codeLine: 5,
        narration: `Target ${target} found at index mid = ${mid}! nums[${mid}] == ${target}.`,
        arrValues: [...nums],
        pointers,
        highlights: [mid],
        best: { indices: [mid], label: `Found target ${target}!` },
        vars: [
          ['L', L],
          ['mid', mid],
          ['R', R],
          ['nums[mid]', midVal],
          ['target', target],
          ['match', 'TRUE'],
        ],
      });
      found = true;
      break;
    }

    if (midVal < target) {
      steps.push({
        codeLine: 7,
        narration: `nums[mid] (${midVal}) < target (${target}). Target must lie in right half. Shift L = mid + 1 (${mid + 1}).`,
        arrValues: [...nums],
        pointers,
        reads: [mid],
        dimmed: Array.from({ length: mid + 1 }, (_, i) => i),
        regions: [{ start: mid + 1, end: R }],
        vars: [
          ['L', L],
          ['mid', mid],
          ['R', R],
          ['nums[mid]', midVal],
          ['target', target],
          ['action', 'L = mid + 1'],
        ],
      });
      L = mid + 1;
    } else {
      steps.push({
        codeLine: 9,
        narration: `nums[mid] (${midVal}) > target (${target}). Target must lie in left half. Shift R = mid - 1 (${mid - 1}).`,
        arrValues: [...nums],
        pointers,
        reads: [mid],
        dimmed: Array.from({ length: nums.length - mid }, (_, i) => mid + i),
        regions: [{ start: L, end: mid - 1 }],
        vars: [
          ['L', L],
          ['mid', mid],
          ['R', R],
          ['nums[mid]', midVal],
          ['target', target],
          ['action', 'R = mid - 1'],
        ],
      });
      R = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      codeLine: 10,
      narration: `Search space exhausted (L > R). Target ${target} does not exist in array. Return -1.`,
      arrValues: [...nums],
      dimmed: nums.map((_, i) => i),
      vars: [
        ['L', L],
        ['R', R],
        ['target', target],
        ['result', -1],
      ],
    });
  }

  return {
    label: `Custom: Binary Search [${nums.join(', ')}] · Target ${target}`,
    complexity: { time: 'O(log N)', space: 'O(1)' },
    pseudocode: [
      'function binarySearch(nums, target):',
      '    L = 0, R = nums.length - 1',
      '    while L <= R:',
      '        mid = floor((L + R) / 2)',
      '        if nums[mid] == target: return mid',
      '        else if nums[mid] < target: L = mid + 1',
      '        else: R = mid - 1',
      '    return -1',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Container With Most Water Generator
// -------------------------------------------------------------
function generateContainerWithMostWater(heights: number[]): DsaApproach {
  const steps: DsaStep[] = [];
  let L = 0;
  let R = heights.length - 1;
  let maxArea = 0;
  let bestL = 0;
  let bestR = R;

  steps.push({
    codeLine: 1,
    narration: `Initialize L = 0 and R = ${R}. Width is maximized at ${R}.`,
    arrValues: [...heights],
    pointers: [
      { name: 'L', index: L, color: 'accent' },
      { name: 'R', index: R, color: 'blue' },
    ],
    vars: [
      ['L', L],
      ['R', R],
      ['maxArea', 0],
    ],
  });

  while (L < R) {
    const w = R - L;
    const h = Math.min(heights[L], heights[R]);
    const area = w * h;
    const isNewMax = area > maxArea;

    if (isNewMax) {
      maxArea = area;
      bestL = L;
      bestR = R;
    }

    steps.push({
      codeLine: 4,
      narration: `L=${L} (h=${heights[L]}), R=${R} (h=${heights[R]}). Area = width (${w}) × minHeight (${h}) = ${area}.${isNewMax ? ` New max area = ${maxArea}!` : ` Current max remains ${maxArea}.`}`,
      arrValues: [...heights],
      pointers: [
        { name: 'L', index: L, color: 'accent' },
        { name: 'R', index: R, color: 'blue' },
      ],
      area: { left: L, right: R, height: h, label: `Area = ${area}` },
      best: { indices: [bestL, bestR], label: `Best: ${maxArea}` },
      reads: [L, R],
      vars: [
        ['L', L],
        ['R', R],
        ['width', w],
        ['minHeight', h],
        ['area', area],
        ['maxArea', maxArea],
      ],
    });

    if (heights[L] < heights[R]) {
      L++;
    } else {
      R--;
    }
  }

  steps.push({
    codeLine: 7,
    narration: `All configurations checked. Maximum water container holds ${maxArea} units between indices ${bestL} and ${bestR}.`,
    arrValues: [...heights],
    highlights: [bestL, bestR],
    best: { indices: [bestL, bestR], label: `Final Max Area = ${maxArea}` },
    area: { left: bestL, right: bestR, height: Math.min(heights[bestL], heights[bestR]), label: `Max = ${maxArea}` },
    vars: [
      ['maxArea', maxArea],
      ['bestL', bestL],
      ['bestR', bestR],
    ],
  });

  return {
    label: `Custom: Container [${heights.join(', ')}]`,
    complexity: { time: 'O(N)', space: 'O(1)' },
    pseudocode: [
      'function maxArea(height):',
      '    L = 0, R = height.length - 1, max_area = 0',
      '    while L < R:',
      '        area = (R - L) * min(height[L], height[R])',
      '        max_area = max(max_area, area)',
      '        if height[L] < height[R]: L++',
      '        else: R--',
      '    return max_area',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Stock (Sliding Window / Min Price) Generator
// -------------------------------------------------------------
function generateStock(prices: number[]): DsaApproach {
  const steps: DsaStep[] = [];
  let minPrice = prices[0];
  let minIdx = 0;
  let maxProfit = 0;
  let bestBuy = 0;
  let bestSell = 0;

  steps.push({
    codeLine: 1,
    narration: `Start at Day 0 with price ${prices[0]}. Initialize minPrice = ${minPrice}, maxProfit = 0.`,
    arrValues: [...prices],
    pointers: [{ name: 'min', index: 0, color: 'accent' }],
    vars: [
      ['minPrice', minPrice],
      ['maxProfit', 0],
    ],
  });

  for (let i = 1; i < prices.length; i++) {
    const current = prices[i];
    const profit = current - minPrice;

    let isNewMin = false;
    let isNewProfit = false;

    if (current < minPrice) {
      minPrice = current;
      minIdx = i;
      isNewMin = true;
    } else if (profit > maxProfit) {
      maxProfit = profit;
      bestBuy = minIdx;
      bestSell = i;
      isNewProfit = true;
    }

    steps.push({
      codeLine: 4,
      narration: `Day ${i}: price = ${current}.${isNewMin ? ` New lowest buy price found (${current})!` : ` Potential profit = ${current} - ${minPrice} = ${profit}.${isNewProfit ? ` New max profit = ${maxProfit}!` : ''}`}`,
      arrValues: [...prices],
      pointers: [
        { name: 'buy', index: minIdx, color: 'accent' },
        { name: 'day', index: i, color: 'blue' },
      ],
      reads: [minIdx, i],
      best: maxProfit > 0 ? { indices: [bestBuy, bestSell], label: `Profit +${maxProfit}` } : undefined,
      vars: [
        ['day', i],
        ['price', current],
        ['minPrice', minPrice],
        ['profit', profit],
        ['maxProfit', maxProfit],
      ],
    });
  }

  steps.push({
    codeLine: 6,
    narration: `Evaluation complete. Maximum attainable profit is ${maxProfit}${maxProfit > 0 ? ` (buy at ${prices[bestBuy]} on day ${bestBuy}, sell at ${prices[bestSell]} on day ${bestSell})` : ' (no profit possible)'}.`,
    arrValues: [...prices],
    highlights: maxProfit > 0 ? [bestBuy, bestSell] : [],
    best: maxProfit > 0 ? { indices: [bestBuy, bestSell], label: `Best Profit: +${maxProfit}` } : undefined,
    vars: [
      ['maxProfit', maxProfit],
      ['bestBuy', bestBuy],
      ['bestSell', bestSell],
    ],
  });

  return {
    label: `Custom: Stock [${prices.join(', ')}]`,
    complexity: { time: 'O(N)', space: 'O(1)' },
    pseudocode: [
      'function maxProfit(prices):',
      '    min_price = prices[0], max_profit = 0',
      '    for price in prices[1:]:',
      '        if price < min_price: min_price = price',
      '        else: max_profit = max(max_profit, price - min_price)',
      '    return max_profit',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Valid Palindrome Generator
// -------------------------------------------------------------
function generateValidPalindrome(chars: string[]): DsaApproach {
  const steps: DsaStep[] = [];
  let L = 0;
  let R = chars.length - 1;
  let isPal = true;

  steps.push({
    codeLine: 1,
    narration: `Check palindrome: L = 0 ('${chars[L]}'), R = ${R} ('${chars[R]}'). Pointers move inward.`,
    arrValues: [...chars],
    pointers: [
      { name: 'L', index: L, color: 'accent' },
      { name: 'R', index: R, color: 'blue' },
    ],
    reads: [L, R],
    vars: [
      ['L', L],
      ['R', R],
      ['char[L]', chars[L]],
      ['char[R]', chars[R]],
    ],
  });

  while (L < R) {
    if (chars[L] !== chars[R]) {
      steps.push({
        codeLine: 4,
        narration: `Mismatch! Character at L (${chars[L]}) does not equal character at R (${chars[R]}). Not a palindrome!`,
        arrValues: [...chars],
        pointers: [
          { name: 'L', index: L, color: 'red' },
          { name: 'R', index: R, color: 'red' },
        ],
        highlights: [L, R],
        vars: [
          ['L', L],
          ['R', R],
          ['char[L]', chars[L]],
          ['char[R]', chars[R]],
          ['palindrome', 'FALSE'],
        ],
      });
      isPal = false;
      break;
    }

    steps.push({
      codeLine: 5,
      narration: `'${chars[L]}' matches '${chars[R]}'. Increment L (to ${L + 1}) and decrement R (to ${R - 1}).`,
      arrValues: [...chars],
      pointers: [
        { name: 'L', index: L, color: 'green' },
        { name: 'R', index: R, color: 'green' },
      ],
      reads: [L, R],
      vars: [
        ['L', L],
        ['R', R],
        ['match', 'TRUE'],
      ],
    });
    L++;
    R--;
  }

  if (isPal) {
    steps.push({
      codeLine: 6,
      narration: `All matching character pairs verified! "${chars.join('')}" is a valid palindrome.`,
      arrValues: [...chars],
      highlights: chars.map((_, i) => i),
      best: { indices: [0, chars.length - 1], label: 'Valid Palindrome ✓' },
      vars: [
        ['result', 'TRUE'],
        ['palindrome', 'TRUE'],
      ],
    });
  }

  return {
    label: `Custom: "${chars.join('')}"`,
    complexity: { time: 'O(N)', space: 'O(1)' },
    pseudocode: [
      'function isPalindrome(s):',
      '    L = 0, R = s.length - 1',
      '    while L < R:',
      '        if s[L] != s[R]: return false',
      '        L++, R--',
      '    return true',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Sort Colors (Dutch National Flag) Generator
// -------------------------------------------------------------
function generateSortColors(arr: number[]): DsaApproach {
  const steps: DsaStep[] = [];
  const nums = [...arr];
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  steps.push({
    codeLine: 1,
    narration: `Initialize 3-way partition: low = 0, mid = 0, high = ${high}. 0s left, 1s middle, 2s right.`,
    arrValues: [...nums],
    pointers: [
      { name: 'low', index: low, color: 'red' },
      { name: 'mid', index: mid, color: 'accent' },
      { name: 'high', index: high, color: 'blue' },
    ],
    vars: [
      ['low', low],
      ['mid', mid],
      ['high', high],
    ],
  });

  while (mid <= high) {
    const val = nums[mid];
    const pointers: PointerBadge[] = [
      { name: 'low', index: low, color: 'red' },
      { name: 'mid', index: mid, color: 'accent' },
      { name: 'high', index: high, color: 'blue' },
    ];

    if (val === 0) {
      const temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      steps.push({
        codeLine: 4,
        narration: `nums[mid] is 0: Swap nums[low] (${nums[low]}) and nums[mid] (${nums[mid]}). Increment low and mid.`,
        arrValues: [...nums],
        swapPair: [low, mid],
        pointers,
        vars: [
          ['midVal', 0],
          ['action', 'swap(low, mid) -> low++, mid++'],
        ],
      });
      low++;
      mid++;
    } else if (val === 1) {
      steps.push({
        codeLine: 6,
        narration: `nums[mid] is 1: Correctly positioned in middle section. Increment mid.`,
        arrValues: [...nums],
        pointers,
        reads: [mid],
        vars: [
          ['midVal', 1],
          ['action', 'mid++'],
        ],
      });
      mid++;
    } else {
      const temp = nums[mid];
      nums[mid] = nums[high];
      nums[high] = temp;
      steps.push({
        codeLine: 8,
        narration: `nums[mid] is 2: Swap nums[mid] with nums[high]. Decrement high (high = ${high - 1}).`,
        arrValues: [...nums],
        swapPair: [mid, high],
        pointers,
        vars: [
          ['midVal', 2],
          ['action', 'swap(mid, high) -> high--'],
        ],
      });
      high--;
    }
  }

  steps.push({
    codeLine: 9,
    narration: `Partition complete! All 0s, 1s, and 2s sorted in-place in a single pass O(N).`,
    arrValues: [...nums],
    highlights: nums.map((_, i) => i),
    best: { indices: [0, nums.length - 1], label: 'Sorted in O(N)!' },
    vars: [['complete', 'TRUE']],
  });

  return {
    label: `Custom: Sort Colors [${nums.join(', ')}]`,
    complexity: { time: 'O(N)', space: 'O(1)' },
    pseudocode: [
      'function sortColors(nums):',
      '    low = 0, mid = 0, high = nums.length - 1',
      '    while mid <= high:',
      '        if nums[mid] == 0: swap(low, mid); low++; mid++',
      '        else if nums[mid] == 1: mid++',
      '        else: swap(mid, high); high--',
    ],
    steps,
  };
}

// -------------------------------------------------------------
// Valid Parentheses Generator
// -------------------------------------------------------------
function generateValidParentheses(chars: string[]): DsaApproach {
  const steps: DsaStep[] = [];
  const stack: string[] = [];
  const matching: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  let valid = true;

  steps.push({
    codeLine: 1,
    narration: `Initialize empty LIFO stack. Process symbols sequentially: [${chars.join(', ')}].`,
    arrValues: [...chars],
    pointers: [{ name: 'i', index: 0, color: 'accent' }],
    auxLabel: 'STACK',
    auxItems: [],
    vars: [
      ['stackSize', 0],
      ['status', 'START'],
    ],
  });

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
      steps.push({
        codeLine: 3,
        narration: `Char '${ch}' is an open bracket: push onto stack. Stack now contains: [${stack.join(', ')}].`,
        arrValues: [...chars],
        pointers: [{ name: 'i', index: i, color: 'accent' }],
        reads: [i],
        auxLabel: 'STACK',
        auxItems: [...stack],
        vars: [
          ['char', ch],
          ['action', `PUSH '${ch}'`],
          ['stackTop', ch],
          ['stackDepth', stack.length],
        ],
      });
    } else {
      const top = stack.pop();
      if (!top || top !== matching[ch]) {
        valid = false;
        steps.push({
          codeLine: 5,
          narration: `Invalid! Closing bracket '${ch}' does not match expected open bracket '${matching[ch]}' (got '${top ?? 'EMPTY'}').`,
          arrValues: [...chars],
          pointers: [{ name: 'i', index: i, color: 'red' }],
          highlights: [i],
          auxLabel: 'STACK',
          auxItems: [...stack],
          vars: [
            ['char', ch],
            ['expected', matching[ch]],
            ['actual', top ?? 'EMPTY'],
            ['valid', 'FALSE'],
          ],
        });
        break;
      } else {
        steps.push({
          codeLine: 6,
          narration: `Matched! '${ch}' matches popped bracket '${top}'.`,
          arrValues: [...chars],
          pointers: [{ name: 'i', index: i, color: 'green' }],
          reads: [i],
          auxLabel: 'STACK',
          auxItems: [...stack],
          vars: [
            ['char', ch],
            ['popped', top],
            ['match', 'TRUE'],
            ['stackDepth', stack.length],
          ],
        });
      }
    }
  }

  if (valid) {
    if (stack.length === 0) {
      steps.push({
        codeLine: 7,
        narration: `Stack is empty and all symbols matched cleanly. "${chars.join('')}" is valid!`,
        arrValues: [...chars],
        highlights: chars.map((_, i) => i),
        best: { indices: [0, chars.length - 1], label: 'Valid Expression ✓' },
        auxLabel: 'STACK',
        auxItems: [],
        vars: [
          ['valid', 'TRUE'],
          ['stackSize', 0],
        ],
      });
    } else {
      steps.push({
        codeLine: 8,
        narration: `Unclosed bracket(s) remaining on stack: [${stack.join(', ')}]. Expression is invalid.`,
        arrValues: [...chars],
        auxLabel: 'STACK',
        auxItems: [...stack],
        vars: [
          ['valid', 'FALSE'],
          ['unmatchedLeftovers', stack.length],
        ],
      });
    }
  }

  return {
    label: `Custom: "${chars.join('')}"`,
    complexity: { time: 'O(N)', space: 'O(N)' },
    pseudocode: [
      'function isValid(s):',
      '    stack = []',
      '    for char in s:',
      '        if char in "({[": stack.push(char)',
      '        else if stack.empty() or stack.pop() != match[char]: return false',
      '    return stack.empty()',
    ],
    steps,
  };
}
