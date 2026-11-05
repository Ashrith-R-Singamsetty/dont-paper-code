import { SystemDesignLesson, SystemDesignModule } from '../types/curriculum';

export const SYSTEM_DESIGN_MODULES: SystemDesignModule[] = [
  {
    id: 'sd-foundations',
    number: '01',
    title: 'UML & Design Patterns (LLD)',
    tagline: 'Master the 6 UML connectors, SOLID boundaries, and Strategy composition.',
  },
  {
    id: 'sd-case-studies',
    number: '02',
    title: 'Machine-Coding Case Studies (LLD)',
    tagline: 'Concurrent Seat Locking (BookMyShow) and State-Driven Elevator Dispatch.',
  },
  {
    id: 'sd-distributed-hld',
    number: '03',
    title: 'Distributed Systems (HLD)',
    tagline: 'Token-Bucket Redis Rate Limiter and Consistent-Hashing URL Shortener.',
  },
];

export const SYSTEM_DESIGN_LESSONS: SystemDesignLesson[] = [
  {
    id: 'uml-and-strategy',
    moduleId: 'sd-foundations',
    title: 'UML Relationships & Strategy Pattern',
    subtitle: 'See all 6 UML class connectors in action and replace rigid inheritance with pluggable composition.',
    kind: 'concept',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'Swiggy', 'Uber'],
    statement:
      'Every LLD interview uses three visual languages: Class Diagrams (static structure & 6 arrow types), Sequence Diagrams (time-ordered calls across lifelines), and State/Topology Diagrams. Step through how Strategy Pattern eliminates subclass explosion.',
    theoryMarkdown: `# Visual Language of System Design

## 1. The 6 UML Class Relationships (Weakest to Strongest)

| Relationship | Arrow Notation | Meaning | Lifetime Coupling |
| :--- | :--- | :--- | :--- |
| **Dependency** | \`A - - -> B\` | \`A\` receives \`B\` as a method parameter | Transient (call scope) |
| **Association** | \`A ---> B\` | \`A\` holds a field reference to \`B\` | Independent |
| **Aggregation** | \`A ◇---> B\` | \`A\` groups \`B\` in a collection | Independent (survives \`A\`) |
| **Composition** | \`A ◆---> B\` | \`A\` owns \`B\` exclusively | Bound (\`B\` dies with \`A\`) |
| **Realization** | \`A - - ▷ B\` | Class \`A\` implements interface \`B\` | Type contract |
| **Inheritance** | \`A ───▷ B\` | Subclass \`A\` extends superclass \`B\` | Tightest coupling |

> **Design Rule**: Favor **Composition + Realization** (\`◆--->\` an \`«interface»\`) over deep **Inheritance** (\`───▷\`) trees so behavior can be swapped at runtime without modifying callers.`,
    rubric: {
      prompt:
        'Write the clean Strategy Pattern contract for CheckoutService: define a PaymentStrategy interface with pay(amount) and inject it into CheckoutService via constructor composition.',
      starterHint: `interface PaymentStrategy {\n    pay(amount: Money): Receipt\n}\n\nclass CheckoutService {\n    // inject strategy and delegate...`,
      requiredGroups: [
        {
          concept: 'Strategy interface with pay/execute method',
          keywords: ['interface', 'paymentstrategy', 'strategy', 'pay'],
          missingHint: 'Declare an interface (e.g. PaymentStrategy) with a pay(amount) method.',
        },
        {
          concept: 'Concrete implementations (e.g. Stripe / UPI / Card)',
          keywords: ['implements', 'class', 'upi', 'stripe', 'card'],
          missingHint: 'Show at least one concrete class implementing PaymentStrategy.',
        },
        {
          concept: 'Composition in CheckoutService delegating to strategy.pay()',
          keywords: ['checkout', 'this.', 'strategy.pay', 'pay('],
          missingHint: 'Store the strategy reference on CheckoutService and delegate this.strategy.pay(amount).',
        },
      ],
    },
    approaches: [
      {
        label: '1 · Rigid Inheritance (Anti-Pattern)',
        badge: 'Anti-Pattern',
        code: [
          'class OrderCheckout {',
          '  processOrder(amount) { /* base logic */ }',
          '}',
          'class UpiOrderCheckout extends OrderCheckout {}',
          'class CardOrderCheckout extends OrderCheckout {}',
          '// Adding Retry + Currency creates M × N subclasses!',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 3,
            narration: 'When payment behavior is baked into subclasses via Inheritance (───▷), every new payment rail + discount rule multiplies the class hierarchy.',
            vars: [
              ['coupling', 'Inheritance (───▷)'],
              ['subclasses', 'M × N explosion'],
              ['runtimeSwap', 'Impossible'],
            ],
            classes: [
              {
                id: 'base',
                name: 'OrderCheckout',
                stereotype: 'abstract',
                x: 340,
                y: 30,
                w: 240,
                fields: ['# cartTotal: Money'],
                methods: ['+ processOrder(): Receipt'],
                tint: 'active',
              },
              {
                id: 'upi',
                name: 'UpiOrderCheckout',
                x: 80,
                y: 230,
                w: 220,
                methods: ['+ processOrder(): Receipt'],
                tint: 'dead',
              },
              {
                id: 'card',
                name: 'CardOrderCheckout',
                x: 350,
                y: 230,
                w: 220,
                methods: ['+ processOrder(): Receipt'],
                tint: 'dead',
              },
              {
                id: 'wallet',
                name: 'WalletWithRetryCheckout',
                x: 620,
                y: 230,
                w: 250,
                methods: ['+ processOrder(): Receipt'],
                tint: 'dead',
                badge: 'Combinatorial bloat',
              },
            ],
            relations: [
              { id: 'r1', from: 'upi', to: 'base', kind: 'inherit', label: 'extends', broken: true },
              { id: 'r2', from: 'card', to: 'base', kind: 'inherit', label: 'extends', broken: true },
              { id: 'r3', from: 'wallet', to: 'base', kind: 'inherit', label: 'extends', broken: true },
            ],
          },
        ],
      },
      {
        label: '2 · Strategy Composition (SOLID)',
        badge: 'Optimal LLD',
        code: [
          'interface PaymentStrategy { + pay(amount: Money): Receipt }',
          'class UpiPayment implements PaymentStrategy { ... }',
          'class StripeCardPayment implements PaymentStrategy { ... }',
          'class CheckoutService {',
          '  - strategy: PaymentStrategy',
          '  + checkout(cart: Cart): Receipt { return strategy.pay(cart.total) }',
          '}',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 4,
            narration: 'CheckoutService holds a PaymentStrategy interface via Association/Composition (--->), while UpiPayment and StripeCardPayment implement the interface (- - ▷).',
            vars: [
              ['pattern', 'Strategy'],
              ['OCP', 'Satisfied'],
              ['DIP', 'Depends on «interface»'],
            ],
            classes: [
              {
                id: 'checkout',
                name: 'CheckoutService',
                stereotype: 'service',
                x: 60,
                y: 60,
                w: 250,
                fields: ['- strategy: PaymentStrategy'],
                methods: ['+ setStrategy(s: PaymentStrategy)', '+ checkout(cart: Cart): Receipt'],
                tint: 'active',
              },
              {
                id: 'strategy',
                name: 'PaymentStrategy',
                stereotype: 'interface',
                x: 520,
                y: 60,
                w: 250,
                methods: ['+ pay(amount: Money): Receipt'],
                tint: 'gold',
                badge: 'Pluggable Seam',
              },
              {
                id: 'upi',
                name: 'UpiPayment',
                x: 380,
                y: 260,
                w: 220,
                fields: ['- vpaHandle: string'],
                methods: ['+ pay(amount: Money): Receipt'],
                tint: 'done',
              },
              {
                id: 'stripe',
                name: 'StripeCardPayment',
                x: 650,
                y: 260,
                w: 230,
                fields: ['- token: string'],
                methods: ['+ pay(amount: Money): Receipt'],
                tint: 'done',
              },
            ],
            relations: [
              { id: 'e1', from: 'checkout', to: 'strategy', kind: 'assoc', label: 'delegates to', toMult: '1', active: true },
              { id: 'e2', from: 'upi', to: 'strategy', kind: 'implement', label: 'implements', active: true },
              { id: 'e3', from: 'stripe', to: 'strategy', kind: 'implement', label: 'implements', active: true },
            ],
          },
          {
            view: 'sequence',
            codeLine: 5,
            narration: 'At runtime, CheckoutService calls strategy.pay(cart.total) polymorphically without knowing whether UPI or Stripe is wired in.',
            vars: [
              ['caller', 'Client'],
              ['injected', 'UpiPayment'],
              ['amount', '₹1,499'],
            ],
            participants: [
              { id: 'client', label: 'Client', kind: 'actor', active: true },
              { id: 'service', label: 'CheckoutService', kind: 'service', active: true },
              { id: 'upi', label: 'UpiPayment', kind: 'object', active: true },
            ],
            activeMessageId: 'm3',
            messages: [
              { id: 'm1', from: 'client', to: 'service', label: 'new CheckoutService(new UpiPayment())', kind: 'create', status: 'done' },
              { id: 'm2', from: 'client', to: 'service', label: 'checkout(cart)', kind: 'call', status: 'done' },
              { id: 'm3', from: 'service', to: 'upi', label: 'pay(₹1,499)', kind: 'call', status: 'active' },
              { id: 'm4', from: 'upi', to: 'service', label: 'Receipt(txId="upi_98a")', kind: 'return', status: 'done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bookmyshow-seat-lock',
    moduleId: 'sd-case-studies',
    title: 'Design BookMyShow — Concurrent Seat Locking',
    subtitle: 'Prevent double-booking under high concurrency with atomic SeatLock TTL and idempotent payment confirmation.',
    kind: 'case-study',
    difficulty: 'Hard',
    companies: ['BookMyShow', 'Uber', 'Amazon', 'Ticketmaster'],
    statement:
      'Thousands of fans tap Seat A12 for a coldplay concert at the exact same millisecond. Design the domain model and locking sequence so two users never pay for the same seat, while abandoned checkouts auto-release after TTL.',
    theoryMarkdown: `# BookMyShow — Concurrency & Seat Locking

## Why Naive Read-Then-Write Fails
If \`BookingService\` checks \`if (seat.status == AVAILABLE)\` and only updates the DB *after* the user finishes a 2-minute payment flow, two concurrent requests both see \`AVAILABLE\` and charge both credit cards.

## Two-Phase Seat Reservation
1. **Acquire Temporary Lock (TTL = 5 min)**: \`SeatLockProvider.lockSeats(showId, seatIds, userId)\` atomically acquires a per-show mutex or Redis \`SET NX EX 300\` / DB \`SELECT ... FOR UPDATE NOWAIT\`.
2. **Process Payment Out-of-Band**: Never hold a DB transaction open while waiting on Stripe/Razorpay.
3. **Confirm Booking**: Verify the caller still owns the unexpired lock, then transition \`ShowSeat\` to \`BOOKED\`.`,
    rubric: {
      prompt:
        'Write pseudocode for atomic seat reservation in BookingService: acquire an atomic lock via SeatLockProvider with a TTL before initiating payment, reject concurrent callers if already locked, and mark seats BOOKED upon payment confirmation.',
      starterHint: `class BookingService {\n  reserveSeats(showId, seatIds, userId) {\n    // 1. atomically lock seats with TTL\n    // 2. create PENDING booking...\n  }\n}`,
      requiredGroups: [
        {
          concept: 'Atomic lock check & acquisition (SeatLockProvider / synchronized / Redis NX)',
          keywords: ['lock', 'atomic', 'synchronized', 'mutex', 'nx', 'for update'],
          missingHint: 'Acquire an atomic lock on (showId, seatId) before allowing checkout to proceed.',
        },
        {
          concept: 'Lock expiration / TTL handling',
          keywords: ['ttl', 'expire', 'timeout', 'Pending'],
          missingHint: 'Include a TTL/timeout on the seat lock so abandoned carts release automatically.',
        },
        {
          concept: 'Verify lock ownership before confirming BOOKED state',
          keywords: ['confirm', 'booked', 'verify', 'owner', 'user'],
          missingHint: 'Verify that the lock is still valid and owned by userId before marking seats BOOKED.',
        },
      ],
    },
    approaches: [
      {
        label: '1 · Naive Check-Then-Book (Race Condition)',
        badge: 'Broken Concurrency',
        code: [
          'reserve(showId, seatId, userId):',
          '  seat = db.getShowSeat(showId, seatId)',
          '  if seat.status != AVAILABLE: throw Conflict()',
          '  paymentGateway.charge(userId) // takes 8 seconds!',
          '  seat.status = BOOKED; db.save(seat)',
        ],
        steps: [
          {
            view: 'sequence',
            codeLine: 3,
            narration: 'User A and User B both read Seat A12 = AVAILABLE at t=0ms. Both enter the 8-second payment flow simultaneously — resulting in a double-booked seat!',
            vars: [
              ['Seat A12', 'AVAILABLE'],
              ['User A read', 'AVAILABLE (t=10ms)'],
              ['User B read', 'AVAILABLE (t=12ms)'],
              ['Outcome', 'DOUBLE BOOKED!'],
            ],
            participants: [
              { id: 'ua', label: 'User A', kind: 'actor', active: true },
              { id: 'ub', label: 'User B', kind: 'actor', active: true },
              { id: 'svc', label: 'BookingService', kind: 'service', active: true },
              { id: 'db', label: 'ShowSeat DB', kind: 'store', active: true },
            ],
            activeMessageId: 'm4',
            messages: [
              { id: 'm1', from: 'ua', to: 'svc', label: 'reserve(A12, userA)', kind: 'call', status: 'done' },
              { id: 'm2', from: 'svc', to: 'db', label: 'SELECT status -> AVAILABLE', kind: 'return', status: 'done' },
              { id: 'm3', from: 'ub', to: 'svc', label: 'reserve(A12, userB) [2ms later]', kind: 'call', status: 'active' },
              { id: 'm4', from: 'svc', to: 'db', label: 'SELECT status -> STILL AVAILABLE! (Race)', kind: 'call', status: 'dead' },
            ],
          },
        ],
      },
      {
        label: '2 · Atomic SeatLockProvider + TTL (Production LLD)',
        badge: 'Thread-Safe',
        code: [
          'reserveSeats(show, seats, user):',
          '  lockProvider.lockSeats(show, seats, user, ttl=300s) // Atomic!',
          '  return BookingRepo.create(PENDING, show, seats, user)',
          '',
          'confirmBooking(bookingId, user):',
          '  if !lockProvider.validateLock(show, seats, user): throw Expired()',
          '  ShowSeatRepo.markBooked(seats); lockProvider.unlock(show, seats)',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 1,
            narration: 'Separate physical Seat from per-screening ShowSeat, and isolate concurrency inside SeatLockProvider holding SeatLock value objects with a 300-second TTL.',
            vars: [
              ['Entity', 'ShowSeat (per Show)'],
              ['Concurrency', 'SeatLockProvider'],
              ['Lock TTL', '300 seconds'],
            ],
            classes: [
              {
                id: 'bms',
                name: 'BookingService',
                stereotype: 'service',
                x: 50,
                y: 50,
                w: 250,
                fields: ['- lockProvider: SeatLockProvider', '- bookingRepo: BookingRepository'],
                methods: ['+ reserveSeats(show, seats, user)', '+ confirmBooking(bookingId, user)'],
                tint: 'active',
              },
              {
                id: 'lockp',
                name: 'SeatLockProvider',
                stereotype: 'interface',
                x: 400,
                y: 50,
                w: 260,
                methods: ['+ lockSeats(show, seats, user, ttl)', '+ validateLock(show, seat, user): bool'],
                tint: 'gold',
                badge: 'Atomic Guard',
              },
              {
                id: 'lock',
                name: 'SeatLock',
                stereotype: 'entity',
                x: 730,
                y: 50,
                w: 220,
                fields: ['- showId: string', '- seatId: string', '- lockedBy: string', '- expiresAt: Instant'],
                methods: ['+ isLockExpired(): bool'],
                tint: 'done',
              },
              {
                id: 'showseat',
                name: 'ShowSeat',
                stereotype: 'entity',
                x: 400,
                y: 260,
                w: 250,
                fields: ['- id: string', '- status: AVAILABLE | BOOKED', '- price: Money'],
                methods: ['+ markBooked(): void'],
                tint: 'done',
              },
            ],
            relations: [
              { id: 'c1', from: 'bms', to: 'lockp', kind: 'assoc', label: 'acquires lock', toMult: '1', active: true },
              { id: 'c2', from: 'lockp', to: 'lock', kind: 'compose', label: 'manages', toMult: '*', active: true },
              { id: 'c3', from: 'bms', to: 'showseat', kind: 'depend', label: 'transitions', active: true },
            ],
          },
          {
            view: 'sequence',
            codeLine: 5,
            narration: 'User A acquires the atomic lock on A12 first; User B is immediately rejected with 409 SeatLockedException while User A completes payment safely.',
            vars: [
              ['User A', 'LOCKED A12 (TTL 300s)'],
              ['User B', '409 Conflict (Fast Fail)'],
              ['ShowSeat A12', 'BOOKED'],
            ],
            participants: [
              { id: 'ua', label: 'User A', kind: 'actor', active: true },
              { id: 'ub', label: 'User B', kind: 'actor' },
              { id: 'svc', label: 'BookingService', kind: 'service', active: true },
              { id: 'lck', label: 'SeatLockProvider', kind: 'store', active: true },
            ],
            activeMessageId: 's3',
            messages: [
              { id: 's1', from: 'ua', to: 'svc', label: 'reserveSeats(show, [A12], userA)', kind: 'call', status: 'done' },
              { id: 's2', from: 'svc', to: 'lck', label: 'lockSeats(A12, userA, TTL=300s) -> OK', kind: 'call', status: 'done' },
              { id: 's3', from: 'ub', to: 'svc', label: 'reserveSeats(show, [A12], userB)', kind: 'call', status: 'dead' },
              { id: 's4', from: 'lck', to: 'svc', label: 'throw SeatTemporaryUnavailableException!', kind: 'return', status: 'dead' },
              { id: 's5', from: 'ua', to: 'svc', label: 'confirmBooking(bookingId, userA) -> BOOKED', kind: 'call', status: 'active' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'elevator-state-machine',
    moduleId: 'sd-case-studies',
    title: 'Design an Elevator System — State Machine & LOOK Dispatch',
    subtitle: 'Model deterministic elevator transitions and pluggable HallCall dispatch scoring.',
    kind: 'case-study',
    difficulty: 'Medium',
    companies: ['Uber', 'Amazon', 'Microsoft', 'Salesforce'],
    statement:
      'Design a multi-car elevator controller for a 50-floor building. Separate hall-call dispatching (choosing which car serves floor 14 UP) from each car’s internal state machine (IDLE, MOVING, DOOR_OPEN, MAINTENANCE).',
    theoryMarkdown: `# Elevator System — State Machine + Strategy

## Two Orthogonal Concerns
1. **Dispatcher Strategy (\`DispatchStrategy\`)**: Given a \`HallRequest(floor=14, dir=UP)\`, score all cars and pick the one already heading \`UP\` below floor 14 (**LOOK / SCAN algorithm**).
2. **Per-Car State Machine (\`ElevatorCar\`)**: Every car enforces valid physical transitions: a \`MOVING\` car cannot open its doors until \`arriveAtNextStop()\` transitions it to \`DOOR_OPEN\`.`,
    rubric: {
      prompt:
        'Write the ElevatorController and ElevatorCar design: use a DispatchStrategy to assign hall requests to the best car, and maintain upStops/downStops sorted sets inside ElevatorCar.',
      starterHint: `interface DispatchStrategy {\n  selectCar(cars: ElevatorCar[], req: HallRequest): ElevatorCar\n}\nclass ElevatorCar {\n  // state, upStops, downStops, step()...\n}`,
      requiredGroups: [
        {
          concept: 'Pluggable DispatchStrategy interface',
          keywords: ['strategy', 'dispatch', 'selectcar'],
          missingHint: 'Define a DispatchStrategy interface that selects the optimal ElevatorCar for a HallRequest.',
        },
        {
          concept: 'Directional stop queues (upStops / downStops)',
          keywords: ['upstops', 'downstops', 'treeset', 'heap', 'stops'],
          missingHint: 'Maintain separate directional stop queues (upStops ascending, downStops descending) for the LOOK sweep.',
        },
        {
          concept: 'Explicit car state transitions (IDLE, MOVING, DOOR_OPEN)',
          keywords: ['idle', 'moving', 'door', 'state'],
          missingHint: 'Track car state (IDLE, MOVING, DOOR_OPEN) to guard door and motor operations.',
        },
      ],
    },
    approaches: [
      {
        label: 'LOOK Dispatcher + Car State Machine',
        badge: 'State + Strategy',
        code: [
          'enum CarState { IDLE, MOVING, DOOR_OPEN, MAINTENANCE }',
          'class ElevatorCar {',
          '  state: CarState; upStops: TreeSet<int>; downStops: TreeSet<int>',
          '  step():',
          '    if currentFloor in activeStops: state = DOOR_OPEN',
          '    else if activeStops.nonEmpty(): state = MOVING; moveOneFloor()',
          '    else: state = IDLE',
          '}',
        ],
        steps: [
          {
            view: 'state',
            codeLine: 4,
            narration: 'Each ElevatorCar follows a strict finite state machine: IDLE transitions to MOVING when a stop is added, and only opens doors after arriving at a target floor.',
            vars: [
              ['Car #1 Floor', 7],
              ['Direction', 'UP'],
              ['upStops', '[9, 14]'],
              ['State', 'MOVING -> DOOR_OPEN'],
            ],
            firedEdgeId: 'st2',
            nodes: [
              { id: 'start', label: '', kind: 'start', x: 70, y: 180 },
              { id: 'idle', label: 'IDLE', sublabel: 'Motor off · Doors closed', kind: 'state', x: 170, y: 150, tint: 'done' },
              { id: 'moving', label: 'MOVING', sublabel: 'Sweep upStops / downStops', kind: 'state', x: 430, y: 70, tint: 'active' },
              { id: 'door', label: 'DOOR_OPEN', sublabel: 'Board passengers (5s timer)', kind: 'state', x: 430, y: 250, tint: 'gold' },
              { id: 'maint', label: 'MAINTENANCE', sublabel: 'Excluded from Dispatch', kind: 'state', x: 720, y: 150, tint: 'dead' },
            ],
            edges: [
              { id: 'st0', from: 'start', to: 'idle' },
              { id: 'st1', from: 'idle', to: 'moving', label: 'addStop(f)' },
              { id: 'st2', from: 'moving', to: 'door', label: 'arriveAtStop()', active: true },
              { id: 'st3', from: 'door', to: 'moving', label: 'closeDoor() [more stops]' },
              { id: 'st4', from: 'door', to: 'idle', label: 'closeDoor() [queues empty]' },
              { id: 'st5', from: 'idle', to: 'maint', label: 'tripBreaker()', dashed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'distributed-rate-limiter',
    moduleId: 'sd-distributed-hld',
    title: 'Design a Distributed API Rate Limiter (HLD)',
    subtitle: 'Enforce 100 req/min per tenant across API Gateway nodes using atomic Redis Lua Token Bucket.',
    kind: 'hld',
    difficulty: 'Hard',
    companies: ['Stripe', 'Cloudflare', 'Uber', 'GitHub'],
    statement:
      'Design a high-throughput distributed rate limiter sitting at the API Gateway layer handling 100K RPS. Prevent burst race conditions across stateless gateway instances while keeping latency under 2ms.',
    theoryMarkdown: `# Distributed Rate Limiter (HLD + LLD)

## Why Local In-Memory Counters Fail in HLD
When 10 stateless API Gateway pods sit behind an L7 Load Balancer, a user with a limit of \`100 req/min\` could send 100 requests to *each* pod (1,000 total) if state isn't centralized.

## Atomic Redis Lua Token Bucket
To avoid a network round-trip race between \`GET tokens\` and \`DECR tokens\`, execute both the lazy token refill calculation and token deduction inside a single **Redis Lua script** (\`EVALSHA\`), which Redis executes atomically on its single-threaded event loop.`,
    rubric: {
      prompt:
        'Write pseudocode for the Token Bucket rate limiter: compute refilled tokens based on elapsed time (now - lastRefill) * refillRate, cap at capacity, and if tokens >= 1 deduct 1 and allow (200 OK), else reject with 429.',
      starterHint: `function allowRequest(key, now, capacity, refillRate):\n    tokens, lastRefill = redis.hmget(key)\n    # refill based on elapsed time and check tokens >= 1...`,
      requiredGroups: [
        {
          concept: 'Lazy token refill calculation using elapsed time',
          keywords: ['elapsed', 'now', 'refill', 'min', 'capacity'],
          missingHint: 'Refill tokens lazily: min(capacity, tokens + (now - lastRefill) * refillRate).',
        },
        {
          concept: 'Atomic check and decrement (tokens >= 1)',
          keywords: ['>=', '- 1', '-= 1', 'tokens'],
          missingHint: 'Check if tokens >= 1; if so, decrement tokens by 1 and allow the request.',
        },
        {
          concept: 'HTTP 429 rejection with Retry-After metadata',
          keywords: ['429', 'false', 'reject', 'retry'],
          missingHint: 'Return false / HTTP 429 Too Many Requests when tokens < 1.',
        },
      ],
    },
    approaches: [
      {
        label: 'API Gateway + Redis Lua Token Bucket',
        badge: 'Distributed HLD',
        code: [
          '-- Runs atomically inside Redis EVALSHA:',
          'local elapsed = now - bucket.lastRefill',
          'local tokens = math.min(capacity, bucket.tokens + elapsed * refillRate)',
          'if tokens < 1 then return { allowed = false, status = 429 } end',
          'redis.hset(key, "tokens", tokens - 1, "lastRefill", now)',
          'return { allowed = true, remaining = tokens - 1 }',
        ],
        steps: [
          {
            view: 'architecture',
            codeLine: 2,
            narration: 'Client request hits API Gateway Pod #2, which executes an atomic Lua Token Bucket check on Redis Cluster in 0.6ms before forwarding to Order Microservice.',
            vars: [
              ['Tenant', 'usr_492'],
              ['Bucket Capacity', '100 tokens'],
              ['Tokens Remaining', '42 -> 41'],
              ['Decision', '200 OK (Allowed)'],
            ],
            firedEdgeId: 'h2',
            nodes: [
              { id: 'cli', label: 'Client App', sublabel: 'usr_492 (85 RPS)', kind: 'client', x: 50, y: 150, tint: 'active' },
              { id: 'gw', label: 'API Gateway', sublabel: 'RateLimit Middleware', kind: 'gateway', x: 300, y: 150, tint: 'active', metrics: 'p99: 0.8ms' },
              { id: 'redis', label: 'Redis Cluster', sublabel: 'Atomic Lua Token Bucket', kind: 'cache', x: 580, y: 55, tint: 'gold', metrics: 'tokens: 41/100' },
              { id: 'svc', label: 'Order Service', sublabel: 'Protected Upstream', kind: 'service', x: 580, y: 245, tint: 'done', metrics: 'Healthy' },
            ],
            edges: [
              { id: 'h1', from: 'cli', to: 'gw', label: 'POST /v1/orders', active: true },
              { id: 'h2', from: 'gw', to: 'redis', label: 'EVALSHA token_bucket (1 RTT)', active: true },
              { id: 'h3', from: 'gw', to: 'svc', label: 'Forward [X-RateLimit-Remaining: 41]', active: true },
            ],
          },
          {
            view: 'architecture',
            codeLine: 3,
            narration: 'When usr_492 spikes to 500 RPS and exhausts all tokens (tokens = 0), API Gateway short-circuits at the edge with HTTP 429 Too Many Requests — shielding Order Service completely!',
            vars: [
              ['Tenant', 'usr_492 (Burst Spike)'],
              ['Tokens Remaining', '0 / 100'],
              ['Decision', '429 Too Many Requests'],
              ['Retry-After', '12s'],
            ],
            firedEdgeId: 'h2',
            nodes: [
              { id: 'cli', label: 'Client App', sublabel: '500 RPS Spike!', kind: 'client', x: 50, y: 150, tint: 'dead' },
              { id: 'gw', label: 'API Gateway', sublabel: 'Edge Short-Circuit', kind: 'gateway', x: 300, y: 150, tint: 'active', metrics: '429 Rejected' },
              { id: 'redis', label: 'Redis Cluster', sublabel: 'tokens = 0 (< 1)', kind: 'cache', x: 580, y: 55, tint: 'dead', metrics: 'tokens: 0/100' },
              { id: 'svc', label: 'Order Service', sublabel: 'Zero Spike Load', kind: 'service', x: 580, y: 245, tint: 'done', metrics: 'Shielded' },
            ],
            edges: [
              { id: 'h1', from: 'cli', to: 'gw', label: 'POST /v1/orders -> 429', rejected: true },
              { id: 'h2', from: 'gw', to: 'redis', label: 'EVALSHA -> allowed: false', active: true },
              { id: 'h3', from: 'gw', to: 'svc', label: 'Blocked at Edge', dashed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'url-shortener-hld',
    moduleId: 'sd-distributed-hld',
    title: 'Design a Distributed URL Shortener (TinyURL)',
    subtitle: 'Generate collision-free 7-char Base62 keys via Snowflake IDs and serve 100:1 read-heavy 302 redirects from Redis.',
    kind: 'hld',
    difficulty: 'Medium',
    companies: ['Google', 'Atlassian', 'Amazon', 'Bitly'],
    statement:
      'Design a URL shortener handling 1,000 writes/sec and 100,000 redirects/sec. Avoid random hash collisions with Base62-encoded Snowflake IDs and optimize the read path with Cache-Aside.',
    theoryMarkdown: `# Distributed URL Shortener (HLD)

## Collision-Free Base62 Encoding
Instead of hashing with MD5 and dealing with DB uniqueness collisions, generate a 64-bit distributed **Snowflake ID** (timestamp + workerId + sequence) and convert it to **Base62** (\`[0-9a-zA-Z]\`).
- $62^7 \\approx 3.52 \\text{ trillion}$ unique 7-character short codes.
- Read path uses **Cache-Aside**: check Redis first (\`< 1ms\` hit for viral links), fall back to partitioned DB on miss, and return \`302 Found\` (to track analytics) or \`301 Moved Permanently\`.`,
    rubric: {
      prompt:
        'Write pseudocode for both shortenUrl(longUrl) using a distributed ID generator + Base62 encoding, and resolveUrl(shortCode) using the Cache-Aside pattern (Redis check first, DB fallback on miss).',
      starterHint: `function shortenUrl(longUrl):\n    id = snowflake.nextId()\n    shortCode = toBase62(id)\n    # persist and return...\n\nfunction resolveUrl(shortCode):\n    # check Redis cache first, fallback to DB...`,
      requiredGroups: [
        {
          concept: 'Base62 encoding of unique ID',
          keywords: ['base62', '62', 'snowflake', 'id', 'encode'],
          missingHint: 'Generate a unique 64-bit ID (Snowflake/Range server) and encode it into Base62.',
        },
        {
          concept: 'Cache-Aside lookup in Redis before querying DB',
          keywords: ['cache', 'redis', 'get'],
          missingHint: 'In resolveUrl, check Redis cache first before querying the primary database.',
        },
        {
          concept: 'Populate cache on DB miss and return redirect URL',
          keywords: ['set', 'db', 'put', 'return'],
          missingHint: 'On a cache miss, fetch longUrl from the DB, populate Redis with a TTL, and return the redirect target.',
        },
      ],
    },
    approaches: [
      {
        label: 'Snowflake Base62 Write + Cache-Aside Read',
        badge: '100K RPS HLD',
        code: [
          'shorten(longUrl):',
          '  id = snowflakeGenerator.nextId() // 64-bit unique',
          '  code = encodeBase62(id)          // e.g. "2Bi9kLm"',
          '  db.insert(code, longUrl); cache.set(code, longUrl)',
          '',
          'redirect(code):',
          '  if url = cache.get(code): return HTTP_302(url)',
          '  url = db.findByCode(code); cache.set(code, url); return HTTP_302(url)',
        ],
        steps: [
          {
            view: 'architecture',
            codeLine: 2,
            narration: 'Write Path: Write Service requests a 64-bit Snowflake ID, encodes it into Base62 ("2Bi9kLm"), persists to Sharded Cassandra/Postgres, and pre-warms Redis.',
            vars: [
              ['Snowflake ID', '71829304912'],
              ['Base62 Code', '"2Bi9kLm"'],
              ['Collision Risk', '0% (Monotonic ID)'],
            ],
            firedEdgeId: 'u2',
            nodes: [
              { id: 'user', label: 'Client', sublabel: 'POST /shorten', kind: 'client', x: 40, y: 150, tint: 'active' },
              { id: 'api', label: 'URL Service', sublabel: 'Base62 Encoder', kind: 'service', x: 290, y: 150, tint: 'active', metrics: 'Snowflake #4' },
              { id: 'cache', label: 'Redis Cache', sublabel: 'Hot ShortCodes (LRU)', kind: 'cache', x: 590, y: 55, tint: 'gold', metrics: 'Hit Ratio: 97%' },
              { id: 'db', label: 'Sharded KV DB', sublabel: 'Shard by hash(shortCode)', kind: 'db', x: 590, y: 245, tint: 'done', metrics: '3.5T capacity' },
            ],
            edges: [
              { id: 'u1', from: 'user', to: 'api', label: 'POST /shorten', active: true },
              { id: 'u2', from: 'api', to: 'db', label: 'INSERT ("2Bi9kLm" -> longUrl)', active: true },
              { id: 'u3', from: 'api', to: 'cache', label: 'SETEX "2Bi9kLm" 86400', active: true },
            ],
          },
          {
            view: 'sequence',
            codeLine: 6,
            narration: 'Read Path (100:1 ratio): GET /2Bi9kLm hits Redis in 0.4ms and returns HTTP 302 Redirect without touching the database.',
            vars: [
              ['Request', 'GET /2Bi9kLm'],
              ['Cache Status', 'HIT (0.4ms)'],
              ['Response', '302 Found -> Location: https://...'],
            ],
            participants: [
              { id: 'browser', label: 'Browser', kind: 'actor', active: true },
              { id: 'edge', label: 'URL Read Service', kind: 'service', active: true },
              { id: 'redis', label: 'Redis Cache', kind: 'store', active: true },
              { id: 'db', label: 'Primary DB', kind: 'store' },
            ],
            activeMessageId: 'r3',
            messages: [
              { id: 'r1', from: 'browser', to: 'edge', label: 'GET /2Bi9kLm', kind: 'call', status: 'done' },
              { id: 'r2', from: 'edge', to: 'redis', label: 'GET url:2Bi9kLm', kind: 'call', status: 'done' },
              { id: 'r3', from: 'redis', to: 'edge', label: '"https://chaicode.com/system-design"', kind: 'return', status: 'active' },
              { id: 'r4', from: 'edge', to: 'browser', label: 'HTTP 302 Found (Location Header)', kind: 'return', status: 'done' },
            ],
          },
        ],
      },
    ],
  },
];
