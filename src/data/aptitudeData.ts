export interface AptitudeCategory {
  id: string;
  slug: string;
  number: string;
  name: string;
  blurb: string;
  sortOrder: number;
  liveQuestions: number;
  barWidthPercent: number;
}

export interface AptitudeQuestion {
  id: string;
  categorySlug: string;
  categoryName: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  workedAnswer: string;
}

export interface AptitudeDurationOption {
  minutes: 15 | 30;
  questions: 20 | 40;
}

export const APTITUDE_DURATIONS: AptitudeDurationOption[] = [
  { minutes: 15, questions: 20 },
  { minutes: 30, questions: 40 },
];

export const APTITUDE_STATS = [
  { value: 8, label: 'placement categories' },
  { value: 921, label: 'questions in the bank' },
  { value: 20, label: 'questions in 15 minutes' },
  { value: 40, label: 'questions in 30 minutes' },
];

export const APTITUDE_CATEGORIES: AptitudeCategory[] = [
  {
    id: 'quantitative',
    slug: 'quantitative',
    number: '01',
    name: 'Quantitative Aptitude',
    blurb: 'Percentages, profit and loss, ratios, averages, time and work, speed and distance.',
    sortOrder: 1,
    liveQuestions: 120,
    barWidthPercent: 98.36,
  },
  {
    id: 'number-systems',
    slug: 'number-systems',
    number: '02',
    name: 'Number Systems',
    blurb: 'Divisibility, HCF and LCM, remainders, factors, surds and indices.',
    sortOrder: 2,
    liveQuestions: 121,
    barWidthPercent: 99.18,
  },
  {
    id: 'logical',
    slug: 'logical',
    number: '03',
    name: 'Logical Reasoning',
    blurb: 'Series, analogies, coding-decoding, blood relations, direction sense, syllogisms.',
    sortOrder: 3,
    liveQuestions: 120,
    barWidthPercent: 98.36,
  },
  {
    id: 'verbal',
    slug: 'verbal',
    number: '04',
    name: 'Verbal Ability',
    blurb: 'Reading comprehension, sentence correction, synonyms, antonyms, para-jumbles.',
    sortOrder: 4,
    liveQuestions: 120,
    barWidthPercent: 98.36,
  },
  {
    id: 'data-interp',
    slug: 'data-interp',
    number: '05',
    name: 'Data Interpretation',
    blurb: 'Tables, bar and line charts, pie charts, caselets and multi-step extraction.',
    sortOrder: 5,
    liveQuestions: 120,
    barWidthPercent: 98.36,
  },
  {
    id: 'puzzles',
    slug: 'puzzles',
    number: '06',
    name: 'Puzzles & Seating',
    blurb: 'Seating arrangements, floor puzzles, scheduling grids and constraint problems.',
    sortOrder: 6,
    liveQuestions: 77,
    barWidthPercent: 63.11,
  },
  {
    id: 'probability',
    slug: 'probability',
    number: '07',
    name: 'Probability & Permutations',
    blurb: 'Counting, arrangements, selections, probability and expected value.',
    sortOrder: 7,
    liveQuestions: 121,
    barWidthPercent: 99.18,
  },
  {
    id: 'non-verbal',
    slug: 'non-verbal',
    number: '08',
    name: 'Non-Verbal Reasoning',
    blurb: 'Figure series, mirror and water images, paper folding, embedded figures.',
    sortOrder: 8,
    liveQuestions: 122,
    barWidthPercent: 100,
  },
];

export const APTITUDE_HOW_IT_WORKS = [
  {
    title: 'On the clock',
    description: '20 questions in 15 minutes or 40 in 30. The timer keeps running, just like the real thing.',
    icon: 'clock' as const,
  },
  {
    title: 'One topic or a mix',
    description: 'Drill a weak category on its own, or take a random mix across all of them.',
    icon: 'target' as const,
  },
  {
    title: 'Worked answers after',
    description: 'Every question comes back with the correct answer and the reasoning behind it.',
    icon: 'doc' as const,
  },
  {
    title: 'Every attempt kept',
    description: 'Your past papers stay in your history, so you can see your scores move.',
    icon: 'chart' as const,
  },
];

export const APTITUDE_FAQS = [
  {
    question: 'Is it free?',
    answer:
      'Yes — on Don’t Paper Code, both the category drills and full timed mocks (15-minute and 30-minute papers) are completely free and unlocked with full worked solutions.',
  },
  {
    question: 'Is there negative marking?',
    answer:
      'No. A wrong answer scores the same as a skipped one, so it is worth attempting every question.',
  },
  {
    question: 'When do I see the answers?',
    answer:
      'As soon as you submit, or when the clock runs out. Each question shows your choice, the correct answer and the working.',
  },
  {
    question: 'Can I leave a mock and come back?',
    answer:
      'Yes, while its time lasts. The clock keeps running when you step away, and starting a new mock offers to take you back to the one in progress.',
  },
];

export const APTITUDE_DEMO_QUESTION: AptitudeQuestion = {
  id: 'quant-demo-1',
  categorySlug: 'quantitative',
  categoryName: 'Quantitative',
  topic: 'Time and work',
  question:
    'One pipe fills a tank in 6 hours. Another empties it in 9 hours. With both open, how long does the tank take to fill?',
  options: ['12 hours', '15 hours', '18 hours', '24 hours'],
  correctIndex: 2,
  workedAnswer:
    'Each hour the tank gains 1/6 and loses 1/9, a net 1/18. So it fills in 18 hours.',
};

export const APTITUDE_QUESTION_BANK: AptitudeQuestion[] = [
  // 01 · Quantitative Aptitude
  APTITUDE_DEMO_QUESTION,
  {
    id: 'quant-2',
    categorySlug: 'quantitative',
    categoryName: 'Quantitative Aptitude',
    topic: 'Speed and distance',
    question:
      'A 180-metre train passes a pole in 9 seconds. How long will it take to cross a 220-metre platform at the same speed?',
    options: ['16 seconds', '18 seconds', '20 seconds', '22 seconds'],
    correctIndex: 2,
    workedAnswer:
      'Speed of the train = 180 / 9 = 20 m/s. Total distance to cross the platform = 180 + 220 = 400 m. Time = 400 / 20 = 20 seconds.',
  },
  {
    id: 'quant-3',
    categorySlug: 'quantitative',
    categoryName: 'Quantitative Aptitude',
    topic: 'Profit and loss',
    question:
      'A shopkeeper marks an item 40% above cost price and allows a 15% discount. What is the net profit percentage?',
    options: ['17%', '19%', '21%', '25%'],
    correctIndex: 1,
    workedAnswer:
      'Let CP = 100. Marked Price = 140. Selling Price after 15% discount = 140 × 0.85 = 119. Net profit = 19%.',
  },
  {
    id: 'quant-4',
    categorySlug: 'quantitative',
    categoryName: 'Quantitative Aptitude',
    topic: 'Ratios and mixtures',
    question:
      'In a 60-litre mixture of milk and water, the ratio of milk to water is 3 : 1. How much water must be added to make the ratio 3 : 2?',
    options: ['10 litres', '12 litres', '15 litres', '20 litres'],
    correctIndex: 2,
    workedAnswer:
      'Initially, milk = 45 L and water = 15 L. For a 3 : 2 ratio with 45 L of milk, water must be 30 L. Water to add = 30 − 15 = 15 litres.',
  },
  {
    id: 'quant-5',
    categorySlug: 'quantitative',
    categoryName: 'Quantitative Aptitude',
    topic: 'Averages',
    question:
      'The average weight of 8 engineers increases by 1.5 kg when a new engineer replaces one weighing 65 kg. What is the weight of the new engineer?',
    options: ['74 kg', '75.5 kg', '77 kg', '79 kg'],
    correctIndex: 2,
    workedAnswer:
      'Total weight increase across 8 people = 8 × 1.5 = 12 kg. Therefore the new engineer weighs 65 + 12 = 77 kg.',
  },
  {
    id: 'quant-6',
    categorySlug: 'quantitative',
    categoryName: 'Quantitative Aptitude',
    topic: 'Percentages',
    question:
      'If the price of cloud compute drops by 20% and usage increases by 30%, how does total monthly spend change?',
    options: ['Increases by 4%', 'Decreases by 4%', 'Increases by 10%', 'No change'],
    correctIndex: 0,
    workedAnswer:
      'Net multiplier = 0.80 × 1.30 = 1.04, which is a +4% increase in total spend.',
  },

  // 02 · Number Systems
  {
    id: 'num-1',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'Remainders',
    question: 'What is the remainder when 7^84 is divided by 342?',
    options: ['0', '1', '7', '49'],
    correctIndex: 1,
    workedAnswer:
      'Note that 7^3 = 343 ≡ 1 (mod 342). Since 84 = 3 × 28, 7^84 = (7^3)^28 ≡ 1^28 ≡ 1 (mod 342).',
  },
  {
    id: 'num-2',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'HCF and LCM',
    question:
      'The HCF of two numbers is 12 and their LCM is 180. If one of the numbers is 36, what is the other number?',
    options: ['48', '60', '72', '90'],
    correctIndex: 1,
    workedAnswer:
      'Product of two numbers = HCF × LCM. So 36 × N = 12 × 180 ⇒ N = (12 × 180) / 36 = 60.',
  },
  {
    id: 'num-3',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'Trailing zeros',
    question: 'How many trailing zeros are there in 100! (100 factorial)?',
    options: ['20', '22', '24', '25'],
    correctIndex: 2,
    workedAnswer:
      'Count factors of 5 in 100!: ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24 trailing zeros.',
  },
  {
    id: 'num-4',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'Factors',
    question: 'How many positive divisors does the number 360 have?',
    options: ['18', '20', '24', '30'],
    correctIndex: 2,
    workedAnswer:
      'Prime factorization: 360 = 2^3 × 3^2 × 5^1. Number of divisors = (3 + 1)(2 + 1)(1 + 1) = 4 × 3 × 2 = 24.',
  },
  {
    id: 'num-5',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'Unit digit',
    question: 'What is the units digit of 23^47 × 17^18?',
    options: ['1', '3', '7', '9'],
    correctIndex: 1,
    workedAnswer:
      '3^47 has cycle 4: 47 mod 4 = 3 ⇒ 3^3 ends in 7. 7^18 has cycle 4: 18 mod 4 = 2 ⇒ 7^2 ends in 9. Product units digit: 7 × 9 = 63 ⇒ 3.',
  },
  {
    id: 'num-6',
    categorySlug: 'number-systems',
    categoryName: 'Number Systems',
    topic: 'Divisibility',
    question: 'If the 7-digit number 5432k18 is divisible by 9, what is the digit k?',
    options: ['2', '4', '6', '7'],
    correctIndex: 1,
    workedAnswer:
      'Sum of digits = 5 + 4 + 3 + 2 + k + 1 + 8 = 23 + k. Next multiple of 9 is 27, so k = 27 − 23 = 4.',
  },

  // 03 · Logical Reasoning
  {
    id: 'log-1',
    categorySlug: 'logical',
    categoryName: 'Logical Reasoning',
    topic: 'Number series',
    question: 'Find the next number in the series: 3, 8, 18, 35, 61, ?',
    options: ['94', '98', '102', '106'],
    correctIndex: 1,
    workedAnswer:
      'First differences: +5, +10, +17, +26 (which are 2^2+1, 3^2+1, 4^2+1, 5^2+1). Next difference is 6^2+1 = 37. So 61 + 37 = 98.',
  },
  {
    id: 'log-2',
    categorySlug: 'logical',
    categoryName: 'Logical Reasoning',
    topic: 'Coding-decoding',
    question:
      'In a certain code, SYSTEM is written as SYSMET and NEARER is written as AENRER. How is FRACTION written in that code?',
    options: ['CARFNOIT', 'CARFTION', 'ARFCNOIT', 'FRACNOIT'],
    correctIndex: 0,
    workedAnswer:
      'Each word is split into two equal halves and each half is reversed. FRAC → CARF and TION → NOIT, giving CARFNOIT.',
  },
  {
    id: 'log-3',
    categorySlug: 'logical',
    categoryName: 'Logical Reasoning',
    topic: 'Blood relations',
    question:
      'Pointing to a photograph, Aarav says, "She is the daughter of the only son of my grandfather." How is the woman in the photograph related to Aarav?',
    options: ['Cousin', 'Sister', 'Aunt', 'Mother'],
    correctIndex: 1,
    workedAnswer:
      'The only son of Aarav’s grandfather is Aarav’s father. His father’s daughter is Aarav’s sister.',
  },
  {
    id: 'log-4',
    categorySlug: 'logical',
    categoryName: 'Logical Reasoning',
    topic: 'Direction sense',
    question:
      'Riya walks 8 km North, turns right and walks 6 km, then turns right again and walks 16 km. How far is she from her starting point?',
    options: ['8 km', '10 km', '12 km', '14 km'],
    correctIndex: 1,
    workedAnswer:
      'Net vertical displacement = 8 km North − 16 km South = 8 km South. Horizontal displacement = 6 km East. Straight-line distance = √(8^2 + 6^2) = 10 km.',
  },
  {
    id: 'log-5',
    categorySlug: 'logical',
    categoryName: 'Logical Reasoning',
    topic: 'Syllogisms',
    question:
      'Statements: All compilers are parsers. Some parsers are linkers. Conclusions: (I) Some compilers are linkers. (II) All linkers are parsers.',
    options: [
      'Only I follows',
      'Only II follows',
      'Both I and II follow',
      'Neither I nor II follows',
    ],
    correctIndex: 3,
    workedAnswer:
      'Since the overlap between parsers and linkers need not intersect the subset of compilers, neither conclusion is guaranteed to hold.',
  },

  // 04 · Verbal Ability
  {
    id: 'verb-1',
    categorySlug: 'verbal',
    categoryName: 'Verbal Ability',
    topic: 'Sentence correction',
    question:
      'Choose the grammatically correct version: "Neither the architect nor the engineers was informed about the latency spike."',
    options: [
      'was informed about the latency spike.',
      'were informed about the latency spike.',
      'has been informed about the latency spike.',
      'is informed about the latency spike.',
    ],
    correctIndex: 1,
    workedAnswer:
      'With "Neither … nor …", the verb agrees with the closer subject ("engineers", plural), so "were informed" is correct.',
  },
  {
    id: 'verb-2',
    categorySlug: 'verbal',
    categoryName: 'Verbal Ability',
    topic: 'Synonyms',
    question: 'Select the word closest in meaning to EPHEMERAL:',
    options: ['Transient', 'Perpetual', 'Resilient', 'Stubborn'],
    correctIndex: 0,
    workedAnswer:
      'Ephemeral means lasting for a very short time; "Transient" is the direct synonym.',
  },
  {
    id: 'verb-3',
    categorySlug: 'verbal',
    categoryName: 'Verbal Ability',
    topic: 'Antonyms',
    question: 'Select the word most nearly opposite in meaning to MITIGATE:',
    options: ['Alleviate', 'Aggravate', 'Moderate', 'Attenuate'],
    correctIndex: 1,
    workedAnswer:
      'Mitigate means to make less severe. Aggravate means to make worse or more severe.',
  },
  {
    id: 'verb-4',
    categorySlug: 'verbal',
    categoryName: 'Verbal Ability',
    topic: 'Para-jumbles',
    question:
      'Arrange P, Q, R, S into a coherent paragraph:\n(P) Consequently, tail latency spikes even when average CPU stays low.\n(Q) Modern microservices fan out a single user request across dozens of nodes.\n(R) The overall response waits for the slowest downstream dependency.\n(S) This phenomenon is known as the tail-at-scale problem.',
    options: ['Q-R-P-S', 'R-Q-S-P', 'S-P-Q-R', 'Q-P-S-R'],
    correctIndex: 0,
    workedAnswer:
      'Q introduces the fan-out setup, R explains waiting for the slowest node, P states the consequence on tail latency, and S names the phenomenon.',
  },
  {
    id: 'verb-5',
    categorySlug: 'verbal',
    categoryName: 'Verbal Ability',
    topic: 'Contextual vocabulary',
    question:
      'The post-mortem report was praised for its _______ analysis: it identified the root cause in three paragraphs without blame or filler.',
    options: ['verbose', 'incisive', 'equivocal', 'redundant'],
    correctIndex: 1,
    workedAnswer:
      '"Incisive" means clear, sharp, and direct in analysis, matching "without blame or filler".',
  },

  // 05 · Data Interpretation
  {
    id: 'di-1',
    categorySlug: 'data-interp',
    categoryName: 'Data Interpretation',
    topic: 'Multi-step extraction',
    question:
      'A SaaS company earned ₹480L in Q1 (40% Enterprise, 60% SMB). In Q2, Enterprise revenue grew by 25% while SMB revenue grew by 10%. What was total Q2 revenue?',
    options: ['₹540.4L', '₹556.8L', '₹564.0L', '₹572.2L'],
    correctIndex: 1,
    workedAnswer:
      'Q1 Enterprise = 0.40 × 480 = 192L; Q1 SMB = 288L. Q2 Enterprise = 192 × 1.25 = 240L; Q2 SMB = 288 × 1.10 = 316.8L. Total = 240 + 316.8 = ₹556.8L.',
  },
  {
    id: 'di-2',
    categorySlug: 'data-interp',
    categoryName: 'Data Interpretation',
    topic: 'Pie chart proportions',
    question:
      'In a pie chart of server costs totaling $72,000, Storage accounts for a central angle of 75°. How much is spent on Storage?',
    options: ['$12,500', '$14,000', '$15,000', '$16,500'],
    correctIndex: 2,
    workedAnswer:
      'Fraction of circle = 75° / 360° = 5 / 24. Storage spend = (5 / 24) × $72,000 = $15,000.',
  },
  {
    id: 'di-3',
    categorySlug: 'data-interp',
    categoryName: 'Data Interpretation',
    topic: 'Conversion funnel',
    question:
      'Out of 25,000 applicants, 16% clear the online test. Of those, 25% clear technical rounds, and 60% of finalists receive offers. How many offers are made?',
    options: ['480', '540', '600', '720'],
    correctIndex: 2,
    workedAnswer:
      'Online test cleared = 25,000 × 0.16 = 4,000. Technical cleared = 4,000 × 0.25 = 1,000. Offers = 1,000 × 0.60 = 600.',
  },
  {
    id: 'di-4',
    categorySlug: 'data-interp',
    categoryName: 'Data Interpretation',
    topic: 'Table averages',
    question:
      'Cluster A processes 400 req/s at 20 ms latency; Cluster B processes 600 req/s at 35 ms latency. What is the weighted average latency across all requests?',
    options: ['27.5 ms', '28.0 ms', '29.0 ms', '30.5 ms'],
    correctIndex: 2,
    workedAnswer:
      'Weighted latency = (400 × 20 + 600 × 35) / (400 + 600) = (8,000 + 21,000) / 1,000 = 29.0 ms.',
  },
  {
    id: 'di-5',
    categorySlug: 'data-interp',
    categoryName: 'Data Interpretation',
    topic: 'Growth rate',
    question:
      'Daily active users rose from 1.25 million to 1.80 million over two years. What is the approximate compound annual growth rate (CAGR)?',
    options: ['18%', '20%', '22%', '24%'],
    correctIndex: 1,
    workedAnswer:
      'Ratio = 1.80 / 1.25 = 1.44. Since √1.44 = 1.20, the exact annual growth rate is 20%.',
  },

  // 06 · Puzzles & Seating
  {
    id: 'puz-1',
    categorySlug: 'puzzles',
    categoryName: 'Puzzles & Seating',
    topic: 'Circular seating',
    question:
      'Six engineers (A, B, C, D, E, F) sit around a circular table facing the center. A is opposite D. B sits to the immediate right of A, and E sits to the immediate right of D. Who sits opposite B?',
    options: ['C', 'E', 'F', 'D'],
    correctIndex: 1,
    workedAnswer:
      'Number the seats 1 to 6 counter-clockwise facing the center: A is at 1 and D is opposite at 4. B (immediate right of A) is at 2, and E (immediate right of D) is at 5. Seat 5 is directly opposite seat 2, so E sits opposite B.',
  },
  {
    id: 'puz-2',
    categorySlug: 'puzzles',
    categoryName: 'Puzzles & Seating',
    topic: 'Linear arrangement',
    question:
      'Five boxes (P, Q, R, S, T) are stacked vertically. R is immediately above P. T is at the bottom. S is above Q, and Q is above R. Which box is in the middle (3rd from bottom)?',
    options: ['P', 'Q', 'R', 'S'],
    correctIndex: 2,
    workedAnswer:
      'From bottom (1) to top (5): 1 = T. Since R is immediately above P and S > Q > R, the order from bottom to top is T (1), P (2), R (3), Q (4), S (5). Middle box is R.',
  },
  {
    id: 'puz-3',
    categorySlug: 'puzzles',
    categoryName: 'Puzzles & Seating',
    topic: 'Scheduling grid',
    question:
      'Five tasks (J, K, L, M, N) run Monday to Friday, one per day. L runs on Wednesday. J runs before K, and M runs immediately after N. If K runs on Tuesday, which day does M run?',
    options: ['Monday', 'Thursday', 'Friday', 'Tuesday'],
    correctIndex: 2,
    workedAnswer:
      'K is Tuesday and J is before K ⇒ J is Monday. L is Wednesday. That leaves Thursday and Friday for N followed immediately by M ⇒ N is Thursday and M is Friday.',
  },
  {
    id: 'puz-4',
    categorySlug: 'puzzles',
    categoryName: 'Puzzles & Seating',
    topic: 'Order and ranking',
    question:
      'In a row of 42 candidates, Rohan is 15th from the left and Meera is 12th from the right. When they swap places, what is Rohan’s new position from the left?',
    options: ['29th', '30th', '31st', '32nd'],
    correctIndex: 2,
    workedAnswer:
      'Meera’s original seat is 12th from the right, which from the left is 42 − 12 + 1 = 31st. After swapping, Rohan occupies the 31st seat from the left.',
  },
  {
    id: 'puz-5',
    categorySlug: 'puzzles',
    categoryName: 'Puzzles & Seating',
    topic: 'Floor puzzle',
    question:
      'Four teams (Auth, Billing, Core, Data) occupy floors 1 to 4. Billing is on Floor 1. Auth is directly above Data. Core is on an even-numbered floor. Which floor is Core on?',
    options: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'],
    correctIndex: 3,
    workedAnswer:
      'Billing occupies Floor 1. Since Auth is directly above Data, they must occupy two consecutive remaining floors (either 2 & 3 or 3 & 4). Because Core must be on an even floor, Core takes Floor 4, leaving Floors 3 & 2 for Auth & Data.',
  },

  // 07 · Probability & Permutations
  {
    id: 'prob-1',
    categorySlug: 'probability',
    categoryName: 'Probability & Permutations',
    topic: 'Permutations',
    question:
      'In how many distinct ways can the letters of the word "ALGORITHMS" be arranged so that the vowels (A, O, I) always stay together?',
    options: ['8! × 3!', '7! × 3!', '10! / 3!', '8! × 3'],
    correctIndex: 0,
    workedAnswer:
      'ALGORITHMS has 10 distinct letters: 7 consonants + 3 vowels (A, O, I). Bundle the 3 vowels as 1 unit → 7 + 1 = 8 units arranged in 8! ways, and the 3 vowels arrange internally in 3! ways. Total = 8! × 3!.',
  },
  {
    id: 'prob-2',
    categorySlug: 'probability',
    categoryName: 'Probability & Permutations',
    topic: 'Probability',
    question:
      'Two fair six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers is at least 10?',
    options: ['1/9', '1/6', '5/36', '7/36'],
    correctIndex: 1,
    workedAnswer:
      'Favorable pairs for sum ≥ 10: Sum 10 has (4,6),(5,5),(6,4); Sum 11 has (5,6),(6,5); Sum 12 has (6,6). Total = 6 outcomes out of 36 = 6/36 = 1/6.',
  },
  {
    id: 'prob-3',
    categorySlug: 'probability',
    categoryName: 'Probability & Permutations',
    topic: 'Selections',
    question:
      'A hiring panel of 4 members must be chosen from 6 backend engineers and 4 frontend engineers such that at least 2 backend engineers are included. How many panels are possible?',
    options: ['115', '185', '195', '210'],
    correctIndex: 1,
    workedAnswer:
      'Cases: (2B, 2F) = C(6,2)×C(4,2) = 15×6 = 90; (3B, 1F) = C(6,3)×C(4,1) = 20×4 = 80; (4B, 0F) = C(6,4)×C(4,0) = 15×1 = 15. Total = 90 + 80 + 15 = 185.',
  },
  {
    id: 'prob-4',
    categorySlug: 'probability',
    categoryName: 'Probability & Permutations',
    topic: 'Independent events',
    question:
      'Service A succeeds with probability 0.8 and Service B succeeds independently with probability 0.75. What is the probability that at least one service succeeds?',
    options: ['0.90', '0.92', '0.95', '0.98'],
    correctIndex: 2,
    workedAnswer:
      'P(at least one succeeds) = 1 − P(both fail) = 1 − (1 − 0.8)(1 − 0.75) = 1 − (0.20 × 0.25) = 1 − 0.05 = 0.95.',
  },
  {
    id: 'prob-5',
    categorySlug: 'probability',
    categoryName: 'Probability & Permutations',
    topic: 'Expected value',
    question:
      'A cache lookup hits L1 (1 ms) 70% of the time, L2 (5 ms) 20% of the time, and falls back to DB (40 ms) 10% of the time. What is the expected lookup time?',
    options: ['4.2 ms', '5.7 ms', '6.4 ms', '7.5 ms'],
    correctIndex: 1,
    workedAnswer:
      'E[T] = 0.70(1) + 0.20(5) + 0.10(40) = 0.7 + 1.0 + 4.0 = 5.7 ms.',
  },

  // 08 · Non-Verbal Reasoning
  {
    id: 'nv-1',
    categorySlug: 'non-verbal',
    categoryName: 'Non-Verbal Reasoning',
    topic: 'Mirror and clock images',
    question:
      'A wall clock with only hour/minute markings shows 3:40. What time will its reflection in a vertical plane mirror appear to show?',
    options: ['8:20', '8:40', '9:20', '7:20'],
    correctIndex: 0,
    workedAnswer:
      'Subtract the given time from 11:60: 11:60 − 3:40 = 8:20.',
  },
  {
    id: 'nv-2',
    categorySlug: 'non-verbal',
    categoryName: 'Non-Verbal Reasoning',
    topic: 'Figure rotation series',
    question:
      'An arrow points North (0°) in Figure 1. It rotates 45° clockwise to NE in Figure 2, then 90° clockwise to SE in Figure 3, then 135° clockwise to West in Figure 4. Following the pattern (+180° clockwise next), which direction does it point in Figure 5?',
    options: ['North', 'East', 'South', 'West'],
    correctIndex: 1,
    workedAnswer:
      'The step-to-step clockwise rotations are +45°, +90°, +135°, and +180°. Starting from West (270°) in Figure 4 and rotating 180° clockwise lands on East (90°).',
  },
  {
    id: 'nv-3',
    categorySlug: 'non-verbal',
    categoryName: 'Non-Verbal Reasoning',
    topic: 'Paper folding & punching',
    question:
      'A square sheet of paper is folded in half vertically, then folded in half horizontally, and a circular hole is punched through the center of the folded quarter. How many holes appear when the sheet is fully unfolded?',
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    workedAnswer:
      'Two perpendicular folds create 2 × 2 = 4 overlapping layers. One punch through the center of the quarter creates 4 symmetric holes.',
  },
  {
    id: 'nv-4',
    categorySlug: 'non-verbal',
    categoryName: 'Non-Verbal Reasoning',
    topic: 'Cube painting & cutting',
    question:
      'A solid cube is painted orange on all 6 faces and cut into 64 equal smaller cubes (4 × 4 × 4). How many small cubes have exactly two painted faces?',
    options: ['16', '24', '32', '8'],
    correctIndex: 1,
    workedAnswer:
      'Cubes with 2 painted faces lie along the 12 edges (excluding corners): 12 × (n − 2) = 12 × (4 − 2) = 24.',
  },
  {
    id: 'nv-5',
    categorySlug: 'non-verbal',
    categoryName: 'Non-Verbal Reasoning',
    topic: 'Water image symmetry',
    question:
      'Which of the following capital English words remains completely unchanged in its horizontal water image (top-to-bottom reflection)?',
    options: ['CODE', 'MOM', 'WOW', 'NOON'],
    correctIndex: 0,
    workedAnswer:
      'Every letter in C, O, D, E has horizontal axis symmetry, so CODE looks identical when reflected top-to-bottom.',
  },
];

export function drawMockQuestions(
  categorySlug: string | null,
  count: number
): AptitudeQuestion[] {
  const pool = categorySlug
    ? APTITUDE_QUESTION_BANK.filter((q) => q.categorySlug === categorySlug)
    : [...APTITUDE_QUESTION_BANK];

  const source = pool.length > 0 ? pool : [...APTITUDE_QUESTION_BANK];
  const result: AptitudeQuestion[] = [];

  // Shuffle & repeat with variation if count > source.length so 20 or 40 question mocks always draw a full paper
  let round = 0;
  while (result.length < count) {
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    for (const q of shuffled) {
      if (result.length >= count) break;
      result.push(
        round === 0
          ? q
          : {
              ...q,
              id: `${q.id}-r${round}-${result.length}`,
            }
      );
    }
    round++;
  }
  return result;
}
