import { SystemDesignLesson, SystemDesignModule } from '../types/curriculum';

export const SYSTEM_DESIGN_MODULES: SystemDesignModule[] = [
  {
    id: 'lld-uml-oop',
    number: '01',
    title: 'UML & OOP Foundations',
    tagline: 'Master the 6 UML connectors, Encapsulation, and Composition over Inheritance.',
    trackType: 'LLD',
  },
  {
    id: 'lld-solid',
    number: '02',
    title: 'SOLID & Clean Design Principles',
    tagline: 'SRP, OCP, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
    trackType: 'LLD',
  },
  {
    id: 'lld-creational',
    number: '03',
    title: 'Creational Patterns (GoF)',
    tagline: 'Factory Method, Abstract Factory, Immutable Builder, and Thread-Safe Singleton.',
    trackType: 'LLD',
  },
  {
    id: 'lld-structural',
    number: '04',
    title: 'Structural Patterns (GoF)',
    tagline: 'Decorator runtime wrapping, Adapter protocol translation, and Protection/Cache Proxy.',
    trackType: 'LLD',
  },
  {
    id: 'lld-behavioral',
    number: '05',
    title: 'Behavioral Patterns (GoF)',
    tagline: 'Strategy, Observer Pub-Sub, Finite State Machine, and Chain of Responsibility.',
    trackType: 'LLD',
  },
  {
    id: 'lld-case-studies',
    number: '06',
    title: 'Machine-Coding Case Studies (LLD)',
    tagline: 'BookMyShow Seat Lock, Multi-Floor Parking Lot, Elevator LOOK, and Splitwise.',
    trackType: 'LLD',
  },
  {
    id: 'hld-foundations',
    number: '07',
    title: 'Distributed Systems Building Blocks (HLD)',
    tagline: 'Consistent Hashing Virtual Nodes, Cache Stampede Singleflight, and Quorum Replication.',
    trackType: 'HLD',
  },
  {
    id: 'hld-case-studies',
    number: '08',
    title: 'Production HLD Case Studies (FAANG)',
    tagline: 'Rate Limiter, TinyURL, WhatsApp WebSocket Chat, Hybrid News Feed, and Kafka Log.',
    trackType: 'HLD',
  },
];

export const SYSTEM_DESIGN_LESSONS: SystemDesignLesson[] = [
  /* ==========================================================================
   * MODULE 01: UML & OOP FOUNDATIONS
   * ========================================================================== */
  {
    id: 'uml-and-strategy',
    moduleId: 'lld-uml-oop',
    title: 'The 6 UML Connectors & Composition over Inheritance',
    subtitle: 'See all 6 UML class arrows in action and replace subclass explosion with pluggable composition.',
    kind: 'concept',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'Swiggy', 'Uber'],
    statement:
      'Every LLD interview uses three visual languages: Class Diagrams (static structure & 6 arrow types), Sequence Diagrams (time-ordered calls across lifelines), and State/Topology Diagrams.',
    theoryMarkdown: `# Visual Language of System Design

## The 6 UML Class Relationships (Weakest to Strongest)

| Relationship | Arrow Notation | Meaning | Lifetime Coupling |
| :--- | :--- | :--- | :--- |
| **Dependency** | \`A - - -> B\` | \`A\` receives \`B\` as a method parameter | Transient (call scope) |
| **Association** | \`A ---> B\` | \`A\` holds a field reference to \`B\` | Independent |
| **Aggregation** | \`A ◇---> B\` | \`A\` groups \`B\` in a collection | Independent (survives \`A\`) |
| **Composition** | \`A ◆---> B\` | \`A\` owns \`B\` exclusively | Bound (\`B\` dies with \`A\`) |
| **Realization** | \`A - - ▷ B\` | Class \`A\` implements interface \`B\` | Type contract |
| **Inheritance** | \`A ───▷ B\` | Subclass \`A\` extends superclass \`B\` | Tightest coupling |

> **Core Principle**: Favor **Composition + Realization** (\`◆--->\` an \`«interface»\`) over deep **Inheritance** (\`───▷\`) hierarchies so algorithms can be swapped at runtime without modifying callers.`,
    rubric: {
      prompt:
        'Write the Strategy Pattern contract for CheckoutService: define a PaymentStrategy interface with pay(amount) and inject it into CheckoutService via constructor composition.',
      starterHint: `interface PaymentStrategy {\n    pay(amount: Money): Receipt\n}\n\nclass CheckoutService {\n    // inject strategy and delegate...`,
      requiredGroups: [
        {
          concept: 'Strategy interface with pay/execute method',
          keywords: ['interface', 'strategy', 'pay'],
          missingHint: 'Declare an interface (e.g. PaymentStrategy) with a pay(amount) method.',
        },
        {
          concept: 'Concrete implementations (e.g. UpiPayment / StripeCardPayment)',
          keywords: ['implements', 'class', 'upi', 'stripe', 'card'],
          missingHint: 'Show at least one concrete class implementing PaymentStrategy.',
        },
        {
          concept: 'Composition in CheckoutService delegating to strategy.pay()',
          keywords: ['checkout', 'strategy', 'pay('],
          missingHint: 'Store the strategy reference on CheckoutService and delegate strategy.pay(amount).',
        },
      ],
    },
    approaches: [
      {
        label: '1 · Rigid Inheritance (Anti-Pattern)',
        badge: 'M × N Explosion',
        code: [
          'class OrderCheckout { processOrder(amount) {} }',
          'class UpiOrderCheckout extends OrderCheckout {}',
          'class CardOrderCheckout extends OrderCheckout {}',
          'class WalletWithRetryCheckout extends OrderCheckout {}',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 2,
            narration: 'When payment rails are hardcoded into subclasses via Inheritance (───▷), combining M payment rails × N discount rules triggers combinatorial class explosion.',
            vars: [['coupling', 'Inheritance (───▷)'], ['subclasses', 'M × N'], ['runtimeSwap', 'Impossible']],
            classes: [
              { id: 'base', name: 'OrderCheckout', stereotype: 'abstract', x: 340, y: 25, w: 240, fields: ['# cartTotal: Money'], methods: ['+ processOrder(): Receipt'], tint: 'active' },
              { id: 'upi', name: 'UpiOrderCheckout', x: 70, y: 220, w: 220, methods: ['+ processOrder(): Receipt'], tint: 'dead' },
              { id: 'card', name: 'CardOrderCheckout', x: 350, y: 220, w: 220, methods: ['+ processOrder(): Receipt'], tint: 'dead' },
              { id: 'wallet', name: 'WalletWithRetryCheckout', x: 630, y: 220, w: 250, methods: ['+ processOrder(): Receipt'], tint: 'dead' },
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
        label: '2 · Composition + Interface Realization',
        badge: 'SOLID Optimal',
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
            narration: 'CheckoutService holds PaymentStrategy via Association (--->), while UpiPayment and StripeCardPayment implement the interface (- - ▷).',
            vars: [['pattern', 'Strategy Composition'], ['OCP', 'Satisfied'], ['DIP', 'Depends on «interface»']],
            classes: [
              { id: 'checkout', name: 'CheckoutService', stereotype: 'service', x: 60, y: 60, w: 250, fields: ['- strategy: PaymentStrategy'], methods: ['+ checkout(cart: Cart): Receipt'], tint: 'active' },
              { id: 'strategy', name: 'PaymentStrategy', stereotype: 'interface', x: 520, y: 60, w: 250, methods: ['+ pay(amount: Money): Receipt'], tint: 'gold' },
              { id: 'upi', name: 'UpiPayment', x: 380, y: 250, w: 220, fields: ['- vpaHandle: string'], methods: ['+ pay(amount: Money): Receipt'], tint: 'done' },
              { id: 'stripe', name: 'StripeCardPayment', x: 650, y: 250, w: 230, fields: ['- token: string'], methods: ['+ pay(amount: Money): Receipt'], tint: 'done' },
            ],
            relations: [
              { id: 'e1', from: 'checkout', to: 'strategy', kind: 'assoc', label: 'delegates to', toMult: '1', active: true },
              { id: 'e2', from: 'upi', to: 'strategy', kind: 'implement', label: 'implements', active: true },
              { id: 'e3', from: 'stripe', to: 'strategy', kind: 'implement', label: 'implements', active: true },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 02: SOLID & CLEAN DESIGN PRINCIPLES
   * ========================================================================== */
  {
    id: 'solid-dip-liskov',
    moduleId: 'lld-solid',
    title: 'SOLID — Liskov Substitution & Dependency Inversion',
    subtitle: 'Why Square extending Rectangle breaks callers (LSP), and how high-level policy inverts database ownership (DIP).',
    kind: 'lld',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'ThoughtWorks', 'Atlassian'],
    statement:
      'Satisfy all 5 SOLID principles: keep classes focused on one actor (SRP), extend via abstractions (OCP), preserve subtype behavioral contracts (LSP), split fat interfaces (ISP), and depend on abstractions (DIP).',
    theoryMarkdown: `# SOLID Principles in Interviews

## 1. Liskov Substitution Principle (LSP)
If \`S\` is a subtype of \`T\`, objects of type \`T\` may be replaced with objects of type \`S\` **without breaking any caller invariant**.
- **Classic Trap**: \`Square extends Rectangle\`. A caller doing \`rect.setWidth(5); rect.setHeight(10); assert(rect.area() == 50)\` fails when \`Square.setHeight(10)\` secretly overwrites \`width = 10\` (producing \`area = 100\`).
- **Fix**: Both \`Rectangle\` and \`Square\` implement an immutable \`Shape { area(): number }\` interface.

## 2. Dependency Inversion Principle (DIP)
High-level domain services (\`OrderService\`) must **not** import low-level infrastructure (\`MySqlOrderRepository\`). Both depend on a domain-owned \`OrderRepository\` interface.`,
    rubric: {
      prompt:
        'Write a SOLID-compliant OrderService + NotificationSender design: define domain interfaces for OrderRepository and NotificationChannel, and inject them into OrderService without instantiating concrete SQL/SMTP classes inside OrderService.',
      starterHint: `interface OrderRepository { save(order: Order): void }\ninterface NotificationChannel { send(msg: string): void }\n\nclass OrderService {\n    // constructor injection...`,
      requiredGroups: [
        {
          concept: 'Domain-owned abstraction interfaces (OrderRepository / NotificationChannel)',
          keywords: ['interface', 'repository', 'notification', 'channel'],
          missingHint: 'Define interfaces for persistence and notification so high-level policy owns the contract.',
        },
        {
          concept: 'Constructor dependency injection into OrderService',
          keywords: ['constructor', 'this.', 'repo', 'channel'],
          missingHint: 'Inject the interfaces into OrderService via constructor.',
        },
        {
          concept: 'Concrete infrastructure classes implementing the interfaces',
          keywords: ['implements', 'class'],
          missingHint: 'Provide concrete classes implementing the interfaces.',
        },
      ],
    },
    approaches: [
      {
        label: 'DIP + ISP Clean Domain Boundary',
        badge: 'Clean Architecture',
        code: [
          'interface OrderRepository { + save(o: Order): void }',
          'interface NotificationChannel { + send(to: User, msg: string): void }',
          'class OrderService {',
          '  - repo: OrderRepository; - notifier: NotificationChannel',
          '  + placeOrder(o: Order): void { repo.save(o); notifier.send(o.user, "Confirmed") }',
          '}',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 4,
            narration: 'Arrows point UPWARD toward the domain abstractions: PostgresOrderRepo and SesEmailChannel depend on OrderService’s interfaces, inverting source-code coupling!',
            vars: [['SRP', 'Separated Save vs Notify'], ['DIP', 'Arrows point to «interface»']],
            classes: [
              { id: 'svc', name: 'OrderService', stereotype: 'service', x: 350, y: 20, w: 250, fields: ['- repo: OrderRepository', '- notifier: NotificationChannel'], methods: ['+ placeOrder(o: Order): void'], tint: 'active' },
              { id: 'irepo', name: 'OrderRepository', stereotype: 'interface', x: 90, y: 150, w: 230, methods: ['+ save(o: Order): void'], tint: 'gold' },
              { id: 'inotif', name: 'NotificationChannel', stereotype: 'interface', x: 630, y: 150, w: 240, methods: ['+ send(u: User, msg: string)'], tint: 'gold' },
              { id: 'pg', name: 'PostgresOrderRepo', x: 90, y: 280, w: 230, methods: ['+ save(o: Order): void'], tint: 'done' },
              { id: 'ses', name: 'SesEmailChannel', x: 630, y: 280, w: 240, methods: ['+ send(u: User, msg: string)'], tint: 'done' },
            ],
            relations: [
              { id: 'd1', from: 'svc', to: 'irepo', kind: 'assoc', label: 'uses', active: true },
              { id: 'd2', from: 'svc', to: 'inotif', kind: 'assoc', label: 'uses', active: true },
              { id: 'd3', from: 'pg', to: 'irepo', kind: 'implement', label: 'implements', active: true },
              { id: 'd4', from: 'ses', to: 'inotif', kind: 'implement', label: 'implements', active: true },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 03: CREATIONAL DESIGN PATTERNS (GOF)
   * ========================================================================== */
  {
    id: 'creational-factory-builder',
    moduleId: 'lld-creational',
    title: 'Factory Method & Immutable Builder Pattern',
    subtitle: 'Decouple object creation via Factory Method and eliminate telescoping constructors with a fluent Builder.',
    kind: 'lld',
    difficulty: 'Medium',
    companies: ['Google', 'Amazon', 'Uber', 'Oracle'],
    statement:
      'Construct complex immutable HttpRequest objects (url, method, headers, timeout, retryPolicy) cleanly without 9-argument telescoping constructors.',
    theoryMarkdown: `# Creational Patterns: When to Use Which

| Pattern | Problem Solved | Key Signature |
| :--- | :--- | :--- |
| **Factory Method** | Caller shouldn't know which concrete class (\`SmsSender\` vs \`PushSender\`) to instantiate | \`NotificationFactory.create(type): Notification\` |
| **Abstract Factory** | Create families of related objects (\`DarkThemeButton + DarkThemeModal\`) | \`UiFactory { createButton(), createModal() }\` |
| **Builder** | Telescoping constructors with 6+ optional parameters & immutable validation | \`new HttpRequest.Builder(url).timeout(5000).build()\` |
| **Singleton** | Strictly one shared instance (e.g., ConnectionPool / ConfigRegistry) | \`volatile instance\` + Double-Checked Locking |`,
    rubric: {
      prompt:
        'Write the Immutable HttpRequest + fluent Builder class: keep HttpRequest fields private final, provide fluent setter methods on Builder returning this, and validate invariants inside build().',
      starterHint: `class HttpRequest {\n  private constructor(builder: Builder) { ... }\n  static class Builder {\n    // fluent setters + build()...\n  }\n}`,
      requiredGroups: [
        {
          concept: 'Private constructor on target immutable class taking Builder',
          keywords: ['private', 'builder', 'httprequest'],
          missingHint: 'Make the HttpRequest constructor private/internal and initialize fields from the Builder.',
        },
        {
          concept: 'Fluent setter methods returning this',
          keywords: ['return this', 'timeout', 'header', 'method'],
          missingHint: 'Chain builder methods by returning this.',
        },
        {
          concept: 'Terminal build() method validating and returning new HttpRequest(this)',
          keywords: ['build()', 'new httprequest'],
          missingHint: 'Provide a build() method that validates required fields and returns new HttpRequest(this).',
        },
      ],
    },
    approaches: [
      {
        label: 'Fluent Builder + Immutable Product',
        badge: 'GoF Creational',
        code: [
          'class HttpRequest {',
          '  - readonly url: string; - readonly timeoutMs: number',
          '  private constructor(b: RequestBuilder) { this.url = b.url; this.timeoutMs = b.timeoutMs }',
          '}',
          'class RequestBuilder {',
          '  + withTimeout(ms: number): this { this.timeoutMs = ms; return this }',
          '  + build(): HttpRequest { validate(this.url); return new HttpRequest(this) }',
          '}',
        ],
        steps: [
          {
            view: 'sequence',
            codeLine: 6,
            narration: 'Client chains .withMethod("POST").withTimeout(3000).build(). Builder validates invariants once and returns a thread-safe immutable HttpRequest.',
            vars: [['url', '"https://api.pay/v1"'], ['timeoutMs', 3000], ['immutable', 'true']],
            participants: [
              { id: 'cli', label: 'Client', kind: 'actor', active: true },
              { id: 'bld', label: 'RequestBuilder', kind: 'object', active: true },
              { id: 'req', label: 'HttpRequest', kind: 'object', active: true },
            ],
            activeMessageId: 'b3',
            messages: [
              { id: 'b1', from: 'cli', to: 'bld', label: 'new RequestBuilder("https://api.pay/v1")', kind: 'create', status: 'done' },
              { id: 'b2', from: 'cli', to: 'bld', label: 'withTimeout(3000) -> returns this', kind: 'call', status: 'done' },
              { id: 'b3', from: 'cli', to: 'bld', label: 'build() [validates url != null]', kind: 'call', status: 'active' },
              { id: 'b4', from: 'bld', to: 'req', label: 'new HttpRequest(this) [frozen]', kind: 'create', status: 'done' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 04: STRUCTURAL DESIGN PATTERNS (GOF)
   * ========================================================================== */
  {
    id: 'structural-decorator-proxy',
    moduleId: 'lld-structural',
    title: 'Decorator Pattern — Composable Runtime Wrappers',
    subtitle: 'Both implement AND wrap the same Component interface to stack Encryption, Compression, and Logging.',
    kind: 'lld',
    difficulty: 'Medium',
    companies: ['Amazon', 'Netflix', 'Adobe', 'Microsoft'],
    statement:
      'Add optional Compression and AES Encryption to a DataSource writer so callers can compose any combination at runtime without creating 2ⁿ subclasses.',
    theoryMarkdown: `# Structural Patterns: Decorator vs Adapter vs Proxy

- **Decorator**: Implements the **same interface** it wraps (\`DataSource\`) to stack responsibilities recursively (\`new EncryptionDecorator(new CompressionDecorator(new FileDataSource()))\`).
- **Adapter**: Translates an **incompatible third-party interface** (\`LegacyXmlBankApi\`) into the target domain interface (\`PaymentGateway\`).
- **Proxy**: Implements the **same interface** to control access, lazy-load, or cache results (\`CachingUserRepositoryProxy\`).`,
    rubric: {
      prompt:
        'Write the Decorator Pattern for DataSource: BaseDecorator implements DataSource AND holds a protected wrappee: DataSource field; CompressionDecorator transforms data and delegates to super.write(compressed).',
      starterHint: `interface DataSource { write(data: string): void }\n\nabstract class DataSourceDecorator implements DataSource {\n    protected wrappee: DataSource\n    // delegate write(data)...`,
      requiredGroups: [
        {
          concept: 'Decorator both implements AND holds a reference to Component interface',
          keywords: ['implements', 'datasource', 'wrappee', 'wrapped'],
          missingHint: 'DataSourceDecorator must both implement DataSource and hold a DataSource field.',
        },
        {
          concept: 'Concrete decorator transforms input and delegates to wrappee.write()',
          keywords: ['write(', 'compress', 'encrypt', 'wrappee'],
          missingHint: 'Transform the payload in the concrete decorator and call wrappee.write(...).',
        },
      ],
    },
    approaches: [
      {
        label: 'Recursive Interface Wrapping (Decorator)',
        badge: 'Both IS-A & HAS-A',
        code: [
          'interface DataSource { + write(data: bytes): void }',
          'abstract class DataSourceDecorator implements DataSource {',
          '  # wrappee: DataSource',
          '  + write(data: bytes) { wrappee.write(data) }',
          '}',
          'class EncryptionDecorator extends DataSourceDecorator {',
          '  + write(data: bytes) { super.write(aesEncrypt(data)) }',
          '}',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 2,
            narration: 'Notice the dual connector on DataSourceDecorator: it realizes DataSource (- - ▷) AND aggregates a wrappee DataSource (◇--->), allowing arbitrary Russian-doll nesting!',
            vars: [['stack', 'Encrypt -> Compress -> File'], ['subclasses', 'Linear O(k), not 2^k']],
            classes: [
              { id: 'ds', name: 'DataSource', stereotype: 'interface', x: 350, y: 20, w: 230, methods: ['+ write(data: bytes): void'], tint: 'gold' },
              { id: 'file', name: 'FileDataSource', x: 90, y: 175, w: 210, methods: ['+ write(data: bytes): void'], tint: 'done' },
              { id: 'dec', name: 'DataSourceDecorator', stereotype: 'abstract', x: 560, y: 165, w: 250, fields: ['# wrappee: DataSource'], methods: ['+ write(data: bytes): void'], tint: 'active' },
              { id: 'enc', name: 'EncryptionDecorator', x: 560, y: 300, w: 250, methods: ['+ write(data: bytes): void'], tint: 'done' },
            ],
            relations: [
              { id: 'dec1', from: 'file', to: 'ds', kind: 'implement', label: 'implements' },
              { id: 'dec2', from: 'dec', to: 'ds', kind: 'implement', label: 'IS-A', active: true },
              { id: 'dec3', from: 'dec', to: 'ds', kind: 'aggregate', label: 'HAS-A wrappee', toMult: '1', active: true },
              { id: 'dec4', from: 'enc', to: 'dec', kind: 'inherit', label: 'extends', active: true },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 05: BEHAVIORAL DESIGN PATTERNS (GOF)
   * ========================================================================== */
  {
    id: 'behavioral-observer-pubsub',
    moduleId: 'lld-behavioral',
    title: 'Observer Pattern — Event-Driven Pub/Sub',
    subtitle: 'Decouple Order publisher from Email, Inventory, and Analytics subscribers via an Observer interface.',
    kind: 'lld',
    difficulty: 'Easy',
    companies: ['Amazon', 'Netflix', 'Meta', 'Flipkart'],
    statement:
      'When an Order transitions to PAID, notify InventoryService, InvoiceGenerator, and LoyaltyPointsService without coupling OrderService to concrete downstream classes.',
    theoryMarkdown: `# Behavioral Pattern: Observer (Pub/Sub)

Instead of hardcoding \`inventory.deduct(); email.send(); loyalty.credit()\` inside \`OrderService\`, the Subject maintains a list of \`OrderObserver\` subscribers and broadcasts \`onOrderPaid(event)\`. New listeners subscribe at runtime with zero changes to \`OrderService\`.`,
    rubric: {
      prompt:
        'Write the Observer Pattern for OrderEventPublisher: maintain a list of OrderObserver subscribers with subscribe(obs), unsubscribe(obs), and notifyAll(event).',
      starterHint: `interface OrderObserver { onOrderPaid(event: OrderEvent): void }\n\nclass OrderEventPublisher {\n    private observers: OrderObserver[] = []\n    // subscribe and notify...`,
      requiredGroups: [
        {
          concept: 'Observer interface with callback method',
          keywords: ['interface', 'observer', 'onorder', 'update'],
          missingHint: 'Define an Observer interface with a notification callback.',
        },
        {
          concept: 'Subscription management (subscribe / unsubscribe list)',
          keywords: ['observers', 'subscribe', 'add', 'push'],
          missingHint: 'Store observers in a collection and provide subscribe/unsubscribe methods.',
        },
        {
          concept: 'Broadcast loop notifying all registered observers',
          keywords: ['for', 'notify', 'onorder', 'update'],
          missingHint: 'Iterate over all registered observers and invoke their callback.',
        },
      ],
    },
    approaches: [
      {
        label: 'Subject + Observer Broadcast',
        badge: '1-to-N Fanout',
        code: [
          'interface OrderObserver { + onOrderPaid(e: OrderEvent): void }',
          'class OrderPublisher {',
          '  - observers: List<OrderObserver> = []',
          '  + subscribe(o: OrderObserver) { observers.add(o) }',
          '  + notify(e: OrderEvent) { for o in observers: o.onOrderPaid(e) }',
          '}',
        ],
        steps: [
          {
            view: 'sequence',
            codeLine: 4,
            narration: 'OrderPublisher loops through its registered OrderObservers and broadcasts onOrderPaid(event) to Inventory, Email, and Analytics in turn.',
            vars: [['event', 'ORDER_PAID (#902)'], ['subscribers', 3]],
            participants: [
              { id: 'pub', label: 'OrderPublisher', kind: 'service', active: true },
              { id: 'inv', label: 'InventoryObserver', kind: 'object', active: true },
              { id: 'eml', label: 'EmailObserver', kind: 'object', active: true },
              { id: 'pts', label: 'LoyaltyObserver', kind: 'object', active: true },
            ],
            activeMessageId: 'o3',
            messages: [
              { id: 'o1', from: 'pub', to: 'inv', label: 'onOrderPaid(#902) [reserve stock]', kind: 'call', status: 'done' },
              { id: 'o2', from: 'pub', to: 'eml', label: 'onOrderPaid(#902) [send receipt]', kind: 'call', status: 'done' },
              { id: 'o3', from: 'pub', to: 'pts', label: 'onOrderPaid(#902) [+150 points]', kind: 'call', status: 'active' },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 06: MACHINE-CODING CASE STUDIES (LLD)
   * ========================================================================== */
  {
    id: 'bookmyshow-seat-lock',
    moduleId: 'lld-case-studies',
    title: 'Design BookMyShow — Concurrent Seat Locking',
    subtitle: 'Prevent double-booking under high concurrency with atomic SeatLock TTL and idempotent confirmation.',
    kind: 'case-study',
    difficulty: 'Hard',
    companies: ['BookMyShow', 'Uber', 'Amazon', 'Ticketmaster'],
    statement:
      'Thousands of fans tap Seat A12 for a concert at the exact same millisecond. Design the domain model and locking sequence so two users never pay for the same seat, while abandoned checkouts auto-release after TTL.',
    theoryMarkdown: `# BookMyShow — Concurrency & Seat Locking

## Two-Phase Seat Reservation
1. **Acquire Temporary Lock (TTL = 5 min)**: \`SeatLockProvider.lockSeats(showId, seatIds, userId)\` atomically acquires a per-show mutex or Redis \`SET NX EX 300\` / DB \`SELECT ... FOR UPDATE NOWAIT\`.
2. **Process Payment Out-of-Band**: Never hold a DB connection open while waiting on external payment gateways.
3. **Confirm Booking**: Verify the caller still owns the unexpired lock, then transition \`ShowSeat\` to \`BOOKED\`.`,
    rubric: {
      prompt:
        'Write pseudocode for atomic seat reservation in BookingService: acquire an atomic lock via SeatLockProvider with a TTL before initiating payment, reject concurrent callers if already locked, and mark seats BOOKED upon payment confirmation.',
      starterHint: `class BookingService {\n  reserveSeats(showId, seatIds, userId) {\n    // 1. atomically lock seats with TTL\n    // 2. create PENDING booking...\n  }\n}`,
      requiredGroups: [
        {
          concept: 'Atomic lock check & acquisition (SeatLockProvider / synchronized / Redis NX)',
          keywords: ['lock', 'atomic', 'synchronized', 'mutex', 'nx'],
          missingHint: 'Acquire an atomic lock on (showId, seatId) before allowing checkout.',
        },
        {
          concept: 'Lock expiration / TTL handling',
          keywords: ['ttl', 'expire', 'timeout', 'pending'],
          missingHint: 'Include a TTL/timeout on the seat lock so abandoned carts auto-release.',
        },
        {
          concept: 'Verify lock ownership before confirming BOOKED state',
          keywords: ['confirm', 'booked', 'validate', 'verify', 'owner', 'user'],
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
          '  paymentGateway.charge(userId) // 8s payment window!',
          '  seat.status = BOOKED; db.save(seat)',
        ],
        steps: [
          {
            view: 'sequence',
            codeLine: 3,
            narration: 'User A and User B both read Seat A12 = AVAILABLE at t=0ms. Both enter the 8-second payment flow simultaneously — resulting in a double-booked seat!',
            vars: [['Seat A12', 'AVAILABLE'], ['User A', 'Charged ₹2,500'], ['User B', 'Charged ₹2,500 (RACE!)']],
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
              { id: 'm4', from: 'svc', to: 'db', label: 'SELECT status -> STILL AVAILABLE! (Double Booked)', kind: 'call', status: 'dead' },
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
            vars: [['Entity', 'ShowSeat (per Show)'], ['Guard', 'SeatLockProvider'], ['Lock TTL', '300s']],
            classes: [
              { id: 'bms', name: 'BookingService', stereotype: 'service', x: 50, y: 50, w: 250, fields: ['- lockProvider: SeatLockProvider'], methods: ['+ reserveSeats(show, seats, user)', '+ confirmBooking(bookingId, user)'], tint: 'active' },
              { id: 'lockp', name: 'SeatLockProvider', stereotype: 'interface', x: 400, y: 50, w: 260, methods: ['+ lockSeats(show, seats, user, ttl)', '+ validateLock(show, seat, user): bool'], tint: 'gold' },
              { id: 'lock', name: 'SeatLock', stereotype: 'entity', x: 730, y: 50, w: 210, fields: ['- seatId: string', '- lockedBy: string', '- expiresAt: Instant'], methods: ['+ isExpired(): bool'], tint: 'done' },
              { id: 'showseat', name: 'ShowSeat', stereotype: 'entity', x: 400, y: 250, w: 250, fields: ['- status: AVAILABLE | BOOKED'], methods: ['+ markBooked(): void'], tint: 'done' },
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
            vars: [['User A', 'LOCKED A12 (TTL 300s)'], ['User B', '409 Conflict (Fast Fail)'], ['ShowSeat A12', 'BOOKED']],
            participants: [
              { id: 'ua', label: 'User A', kind: 'actor', active: true },
              { id: 'ub', label: 'User B', kind: 'actor' },
              { id: 'svc', label: 'BookingService', kind: 'service', active: true },
              { id: 'lck', label: 'SeatLockProvider', kind: 'store', active: true },
            ],
            activeMessageId: 's5',
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
    id: 'parking-lot-lld',
    moduleId: 'lld-case-studies',
    title: 'Design a Multi-Floor Parking Lot',
    subtitle: 'Combine SpotAllocationStrategy (Nearest-to-Gate) with PricingStrategy (Hourly vs Flat) and thread-safe gate entry.',
    kind: 'case-study',
    difficulty: 'Medium',
    companies: ['Amazon', 'Uber', 'Gojek', 'Walmart'],
    statement:
      'Design a multi-floor parking lot supporting Bike, Compact, Large, and EV spots, multiple entry/exit gates, pluggable spot allocation, and ticket fee calculation.',
    theoryMarkdown: `# Multi-Floor Parking Lot (LLD)

## Core Entities & Patterns
1. **Entities**: \`ParkingLot\` ◆---> \`ParkingFloor\` ◆---> \`ParkingSpot\` (\`SpotType: BIKE | COMPACT | LARGE | EV\`), and \`ParkingTicket\`.
2. **SpotAllocationStrategy**: \`NearestToEntranceStrategy\` uses a per-SpotType Min-Heap indexed by distance from gate.
3. **PricingStrategy**: \`HourlyPricingStrategy\` vs \`WeekendSurgePricingStrategy\` injected into \`ExitGate\`.`,
    rubric: {
      prompt:
        'Write the ParkingLot entry/exit design: EntryGate delegates spot selection to SpotAllocationStrategy, marks the spot occupied, and issues a ParkingTicket; ExitGate computes fee via PricingStrategy and frees the spot.',
      starterHint: `interface SpotAllocationStrategy { findSpot(type: VehicleType, gate: Gate): ParkingSpot }\ninterface PricingStrategy { calculateFee(ticket: Ticket): Money }\n\nclass ParkingLotService {\n  // parkVehicle and exitVehicle...`,
      requiredGroups: [
        {
          concept: 'Pluggable SpotAllocationStrategy',
          keywords: ['spot', 'strategy', 'find', 'allocate'],
          missingHint: 'Use a SpotAllocationStrategy to select an available compatible spot.',
        },
        {
          concept: 'Issue ParkingTicket with entry timestamp and assigned spot',
          keywords: ['ticket', 'entry', 'time', 'occupy'],
          missingHint: 'Mark the spot occupied and return a ParkingTicket recording spot and entryTime.',
        },
        {
          concept: 'PricingStrategy fee computation and freeing the spot on exit',
          keywords: ['pricing', 'fee', 'free', 'vacate', 'release'],
          missingHint: 'Calculate the fee via PricingStrategy and release the ParkingSpot on exit.',
        },
      ],
    },
    approaches: [
      {
        label: 'Strategy-Driven Entry & Exit Gates',
        badge: 'Factory + Strategy',
        code: [
          'class EntryGate {',
          '  + issueTicket(v: Vehicle): Ticket {',
          '    spot = allocationStrategy.findSpot(v.type, this.gateId)',
          '    spot.assignVehicle(v); return new Ticket(v, spot, now())',
          '  }',
          '}',
          'class ExitGate {',
          '  + processExit(t: Ticket): Receipt { fee = pricing.calc(t); t.spot.vacate(); return pay(fee) }',
          '}',
        ],
        steps: [
          {
            view: 'class',
            codeLine: 2,
            narration: 'ParkingLot owns ParkingFloors (◆--->), while EntryGate and ExitGate delegate spot selection and fee calculation to pluggable Strategy interfaces.',
            vars: [['Vehicle', 'SUV (LARGE)'], ['Assigned Spot', 'Floor 1 · L-04'], ['Strategy', 'NearestToGate']],
            classes: [
              { id: 'lot', name: 'ParkingLot', stereotype: 'entity', x: 60, y: 40, w: 220, fields: ['- floors: List<ParkingFloor>'], methods: ['+ getAvailableCount(type)'], tint: 'active' },
              { id: 'spot', name: 'ParkingSpot', stereotype: 'entity', x: 60, y: 230, w: 220, fields: ['- id: string', '- type: SpotType', '- isFree: bool'], methods: ['+ assignVehicle(v)', '+ vacate()'], tint: 'done' },
              { id: 'entry', name: 'EntryGate', stereotype: 'controller', x: 370, y: 40, w: 230, fields: ['- allocator: SpotAllocationStrategy'], methods: ['+ issueTicket(v): Ticket'], tint: 'active' },
              { id: 'alloc', name: 'SpotAllocationStrategy', stereotype: 'interface', x: 680, y: 40, w: 240, methods: ['+ findSpot(type, gate): Spot'], tint: 'gold' },
              { id: 'price', name: 'PricingStrategy', stereotype: 'interface', x: 680, y: 230, w: 240, methods: ['+ calcFee(ticket): Money'], tint: 'gold' },
            ],
            relations: [
              { id: 'p1', from: 'lot', to: 'spot', kind: 'compose', label: 'owns floors/spots', toMult: '*', active: true },
              { id: 'p2', from: 'entry', to: 'alloc', kind: 'assoc', label: 'selects spot', active: true },
              { id: 'p3', from: 'entry', to: 'spot', kind: 'depend', label: 'occupies', active: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'elevator-state-machine',
    moduleId: 'lld-case-studies',
    title: 'Design an Elevator System — State Machine & LOOK Dispatch',
    subtitle: 'Model deterministic elevator transitions and pluggable HallCall dispatch scoring.',
    kind: 'case-study',
    difficulty: 'Medium',
    companies: ['Uber', 'Amazon', 'Microsoft', 'Salesforce'],
    statement:
      'Design a multi-car elevator controller for a 50-floor building. Separate hall-call dispatching (choosing which car serves floor 14 UP) from each car’s internal state machine (IDLE, MOVING, DOOR_OPEN, MAINTENANCE).',
    theoryMarkdown: `# Elevator System — State Machine + LOOK Sweep

1. **Dispatcher Strategy (\`DispatchStrategy\`)**: Given a \`HallRequest(floor=14, dir=UP)\`, score all cars and pick the one already heading \`UP\` below floor 14 (**LOOK algorithm**).
2. **Per-Car State Machine (\`ElevatorCar\`)**: Every car enforces valid physical transitions: a \`MOVING\` car cannot open its doors until \`arriveAtStop()\` transitions it to \`DOOR_OPEN\`.`,
    rubric: {
      prompt:
        'Write the ElevatorController and ElevatorCar design: use a DispatchStrategy to assign hall requests to the best car, and maintain upStops/downStops sorted sets inside ElevatorCar.',
      starterHint: `interface DispatchStrategy {\n  selectCar(cars: ElevatorCar[], req: HallRequest): ElevatorCar\n}\nclass ElevatorCar {\n  // state, upStops, downStops, step()...\n}`,
      requiredGroups: [
        {
          concept: 'Pluggable DispatchStrategy interface',
          keywords: ['strategy', 'dispatch', 'selectcar'],
          missingHint: 'Define a DispatchStrategy interface that selects the optimal ElevatorCar.',
        },
        {
          concept: 'Directional stop queues (upStops / downStops)',
          keywords: ['upstops', 'downstops', 'treeset', 'heap', 'stops'],
          missingHint: 'Maintain directional stop sets (upStops ascending, downStops descending).',
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
            vars: [['Car #1 Floor', 7], ['Direction', 'UP'], ['upStops', '[9, 14]'], ['State', 'MOVING -> DOOR_OPEN']],
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

  /* ==========================================================================
   * MODULE 07: DISTRIBUTED SYSTEMS BUILDING BLOCKS (HLD)
   * ========================================================================== */
  {
    id: 'consistent-hashing-ring',
    moduleId: 'hld-foundations',
    title: 'Consistent Hashing Ring & Virtual Nodes',
    subtitle: 'Remap only O(K/N) keys when a cache/storage node joins or crashes by hashing both keys and virtual nodes onto [0, 2³²-1].',
    kind: 'hld',
    difficulty: 'Medium',
    companies: ['Amazon (Dynamo)', 'Discord', 'Netflix', 'Akamai'],
    statement:
      'Why does modulo hashing hash(key) % N trigger a 90% cache stampede when N changes from 10 to 9? Design a Consistent Hashing router with Virtual Nodes in O(log V) lookup time.',
    theoryMarkdown: `# Consistent Hashing & Virtual Nodes (HLD + LLD)

## Why \`hash(key) % N\` Fails in Elastic Clusters
When node count changes from $N$ to $N-1$, almost every key's \`hash(key) % N\` changes, invalidating $\\approx (N-1)/N$ of the entire cache cluster at once!

## The Consistent Hash Ring (\`TreeMap<u32, Node>\`)
1. Place each physical node on a $0 \\dots 2^{32}-1$ ring at $V$ virtual positions (\`hash("NodeA#1")\`, \`hash("NodeA#2")\`, ...).
2. To route \`key\`, compute \`h = murmur3(key)\` and find the first virtual node clockwise via \`ring.ceilingEntry(h)\` (wrapping around to \`ring.firstEntry()\` if \`null\`).
3. When a node leaves, **only $1/N$ of keys** shift to their immediate clockwise neighbor!`,
    rubric: {
      prompt:
        'Write the ConsistentHashRouter using a sorted TreeMap/BST: addNode(node) inserts V virtual replicas onto the ring, and getNode(key) finds the clockwise ceilingEntry(hash(key)) with wrap-around to firstEntry().',
      starterHint: `class ConsistentHashRouter {\n  ring = new TreeMap<int, Node>()\n  addNode(node, vnodes): // insert virtual replicas...\n  getNode(key): // ceilingEntry with wrap-around...\n}`,
      requiredGroups: [
        {
          concept: 'Sorted ring structure (TreeMap / sorted array + binary search) with virtual nodes',
          keywords: ['treemap', 'ring', 'vnode', 'virtual', 'replica'],
          missingHint: 'Store virtual node hashes in a sorted TreeMap or sorted ring array.',
        },
        {
          concept: 'Clockwise lookup (ceilingEntry / tailMap / binary search)',
          keywords: ['ceiling', 'tailmap', 'clockwise', 'binary'],
          missingHint: 'Find the first virtual node with hash >= hash(key) using ceilingEntry or binary search.',
        },
        {
          concept: 'Ring wrap-around to firstEntry() when hash exceeds max entry',
          keywords: ['first', 'wrap', '0'],
          missingHint: 'Wrap around to the first node on the ring when hash(key) is past the highest virtual node.',
        },
      ],
    },
    approaches: [
      {
        label: 'TreeMap Ring + Virtual Nodes',
        badge: 'O(log V) Lookup',
        code: [
          'class ConsistentHashRouter {',
          '  ring: TreeMap<uint32, ServerNode>',
          '  addNode(node, vnodes=100):',
          '    for i in 0..vnodes-1: ring.put(murmur3(node.id + "#" + i), node)',
          '  getNode(key):',
          '    entry = ring.ceilingEntry(murmur3(key))',
          '    return (entry ?? ring.firstEntry()).value',
          '}',
        ],
        steps: [
          {
            view: 'architecture',
            codeLine: 5,
            narration: 'Router hashes key "session_88" to angle 142° on the ring and walks clockwise via ceilingEntry(142°) to Shard-B#2. If Shard-B dies, only its keys fail over clockwise to Shard-C!',
            vars: [['hash("session_88")', '142°'], ['ceilingEntry', 'Shard-B#2 (165°)'], ['Remapped on Crash', 'Only 1/N (33%)']],
            firedEdgeId: 'ch2',
            nodes: [
              { id: 'gw', label: 'Consistent Router', sublabel: 'TreeMap (300 vnodes)', kind: 'gateway', x: 60, y: 140, tint: 'active', metrics: 'O(log V)' },
              { id: 'sa', label: 'Shard-A', sublabel: 'Ring: 20°, 110°, 240°', kind: 'cache', x: 400, y: 30, tint: 'done', metrics: '33% keys' },
              { id: 'sb', label: 'Shard-B (Target)', sublabel: 'Ring: 75°, 165°, 300°', kind: 'cache', x: 400, y: 140, tint: 'gold', metrics: 'Hit @ 165°' },
              { id: 'sc', label: 'Shard-C (Replica)', sublabel: 'Ring: 45°, 195°, 350°', kind: 'cache', x: 400, y: 250, tint: 'done', metrics: 'Clockwise Next' },
            ],
            edges: [
              { id: 'ch1', from: 'gw', to: 'sa', label: '0°..110°', dashed: true },
              { id: 'ch2', from: 'gw', to: 'sb', label: 'hash=142° → ceiling(165°)', active: true },
              { id: 'ch3', from: 'sb', to: 'sc', label: 'Failover arc (165°→195°)', dashed: true },
            ],
          },
        ],
      },
    ],
  },

  /* ==========================================================================
   * MODULE 08: PRODUCTION HLD CASE STUDIES (FAANG)
   * ========================================================================== */
  {
    id: 'distributed-rate-limiter',
    moduleId: 'hld-case-studies',
    title: 'Design a Distributed API Rate Limiter (HLD)',
    subtitle: 'Enforce 100 req/min per tenant across API Gateway nodes using atomic Redis Lua Token Bucket.',
    kind: 'hld',
    difficulty: 'Hard',
    companies: ['Stripe', 'Cloudflare', 'Uber', 'GitHub'],
    statement:
      'Design a high-throughput distributed rate limiter sitting at the API Gateway layer handling 100K RPS. Prevent burst race conditions across stateless gateway instances while keeping latency under 2ms.',
    theoryMarkdown: `# Distributed Rate Limiter (HLD + LLD)

## Atomic Redis Lua Token Bucket
To avoid a network round-trip race between \`GET tokens\` and \`DECR tokens\` across 20 API Gateway pods, execute both the lazy token refill calculation and token deduction inside a single **Redis Lua script** (\`EVALSHA\`), which Redis executes atomically on its single-threaded event loop.`,
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
          missingHint: 'Check if tokens >= 1; if so, decrement tokens by 1 and allow.',
        },
        {
          concept: 'HTTP 429 rejection when bucket is empty',
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
            vars: [['Tenant', 'usr_492'], ['Bucket Capacity', '100'], ['Remaining', '41'], ['Decision', '200 OK']],
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
            narration: 'When usr_492 spikes to 500 RPS and exhausts all tokens (tokens = 0), API Gateway short-circuits at the edge with HTTP 429 Too Many Requests — shielding Order Service!',
            vars: [['Tenant', 'usr_492 (Spike)'], ['Tokens', '0 / 100'], ['Decision', '429 Too Many Requests']],
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
    moduleId: 'hld-case-studies',
    title: 'Design a Distributed URL Shortener (TinyURL)',
    subtitle: 'Generate collision-free 7-char Base62 keys via Snowflake IDs and serve 100:1 read-heavy 302 redirects from Redis.',
    kind: 'hld',
    difficulty: 'Medium',
    companies: ['Google', 'Atlassian', 'Amazon', 'Bitly'],
    statement:
      'Design a URL shortener handling 1,000 writes/sec and 100,000 redirects/sec. Avoid random hash collisions with Base62-encoded Snowflake IDs and optimize the read path with Cache-Aside.',
    theoryMarkdown: `# Distributed URL Shortener (HLD)

- **Snowflake ID + Base62**: Generate a 64-bit unique Snowflake ID (41-bit timestamp + 10-bit worker + 12-bit seq) and convert to Base62 (\`[0-9a-zA-Z]\`). $62^7 \\approx 3.52 \\text{ trillion}$ unique codes with **zero collisions**.
- **Read Path (100:1 ratio)**: Check Redis first (\`< 1ms\` hit for viral links), fall back to sharded KV DB on miss, and return \`302 Found\`.`,
    rubric: {
      prompt:
        'Write pseudocode for shortenUrl(longUrl) using a distributed ID generator + Base62 encoding, and resolveUrl(shortCode) using Cache-Aside (Redis first, DB fallback on miss).',
      starterHint: `function shortenUrl(longUrl):\n    id = snowflake.nextId()\n    shortCode = toBase62(id)\n    # persist and return...\n\nfunction resolveUrl(shortCode):\n    # check Redis cache first, fallback to DB...`,
      requiredGroups: [
        {
          concept: 'Base62 encoding of unique ID',
          keywords: ['base62', '62', 'snowflake', 'id', 'encode'],
          missingHint: 'Generate a unique 64-bit ID and encode it into Base62.',
        },
        {
          concept: 'Cache-Aside lookup in Redis before querying DB',
          keywords: ['cache', 'redis', 'get'],
          missingHint: 'Check Redis cache first before querying the primary database.',
        },
        {
          concept: 'Populate cache on DB miss and return redirect URL',
          keywords: ['set', 'db', 'put', 'return'],
          missingHint: 'On a cache miss, fetch longUrl from DB, populate Redis, and return.',
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
            narration: 'Write Path: URL Service generates a 64-bit Snowflake ID, encodes it into Base62 ("2Bi9kLm"), persists to Sharded DB, and warms Redis.',
            vars: [['Snowflake ID', '71829304912'], ['Base62 Code', '"2Bi9kLm"'], ['Hit Ratio', '97%']],
            firedEdgeId: 'u2',
            nodes: [
              { id: 'user', label: 'Client', sublabel: 'POST /shorten', kind: 'client', x: 40, y: 150, tint: 'active' },
              { id: 'api', label: 'URL Service', sublabel: 'Base62 Encoder', kind: 'service', x: 290, y: 150, tint: 'active', metrics: 'Snowflake #4' },
              { id: 'cache', label: 'Redis Cache', sublabel: 'Hot ShortCodes (LRU)', kind: 'cache', x: 590, y: 55, tint: 'gold', metrics: 'Hit: 97%' },
              { id: 'db', label: 'Sharded KV DB', sublabel: 'Shard by hash(shortCode)', kind: 'db', x: 590, y: 245, tint: 'done', metrics: '3.5T keys' },
            ],
            edges: [
              { id: 'u1', from: 'user', to: 'api', label: 'POST /shorten', active: true },
              { id: 'u2', from: 'api', to: 'db', label: 'INSERT ("2Bi9kLm" -> longUrl)', active: true },
              { id: 'u3', from: 'api', to: 'cache', label: 'SETEX "2Bi9kLm" 86400', active: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'whatsapp-realtime-chat-hld',
    moduleId: 'hld-case-studies',
    title: 'Design WhatsApp / Realtime Chat Architecture (HLD)',
    subtitle: 'Route stateful WebSocket messages across Chat Gateways via Redis Session Registry and Cassandra Inbox storage.',
    kind: 'hld',
    difficulty: 'Hard',
    companies: ['Meta (WhatsApp)', 'Discord', 'Slack', 'Telegram'],
    statement:
      'Design a 1-on-1 and group messaging system for 50M concurrent connections with real-time WebSocket delivery, Delivered/Read receipts, and offline push fallback.',
    theoryMarkdown: `# Realtime Chat (WhatsApp / Discord HLD)

## Why Stateful WebSockets Need a Session Registry
Unlike stateless HTTP, User A is pinned to **Chat Gateway #1** over a persistent TCP WebSocket, while User B is pinned to **Chat Gateway #7**.
1. **Session Lookup**: Gateway #1 queries **Redis Session Registry** (\`user_B -> gateway_7\`).
2. **Persist First (Write-Ahead)**: Persist \`Message(chatId, msgId, payload)\` to **Cassandra** (partitioned by \`chat_id\`, clustered by \`message_id\` Snowflake).
3. **Real-Time Relay or Push Fallback**: Forward via internal gRPC to Gateway #7 -> push down User B's WebSocket. If User B is offline, enqueue to **APNs/FCM Push Queue**.`,
    rubric: {
      prompt:
        'Write pseudocode for ChatGateway.sendMessage(sender, recipient, text): persist message to InboxStore first, look up recipient’s active Gateway node in SessionRegistry, and either relay over WebSocket or enqueue a PushNotification if offline.',
      starterHint: `function onMessage(sender, recipient, text):\n    msg = inboxDb.save(sender, recipient, text)\n    targetGateway = sessionRedis.get(recipient)\n    # relay to targetGateway or push notification...`,
      requiredGroups: [
        {
          concept: 'Persist message to durable store (Cassandra / Inbox DB) before delivery',
          keywords: ['save', 'insert', 'persist', 'db', 'inbox'],
          missingHint: 'Persist the message to the Inbox database first so no message is lost.',
        },
        {
          concept: 'Lookup recipient active WebSocket gateway in Session Registry (Redis)',
          keywords: ['session', 'redis', 'gateway', 'get', 'lookup'],
          missingHint: 'Query the Session Registry (Redis) to find which Gateway holds recipient’s WebSocket.',
        },
        {
          concept: 'Offline fallback to Push Notification service (FCM / APNs)',
          keywords: ['else', 'offline', 'push', 'notify', 'queue'],
          missingHint: 'If the recipient has no active WebSocket session, send an offline Push Notification.',
        },
      ],
    },
    approaches: [
      {
        label: 'WebSocket Gateways + Session Registry + Cassandra Inbox',
        badge: '50M Concurrent WS',
        code: [
          'onWebSocketMessage(sender, recipient, body):',
          '  msg = cassandraInbox.insert(chatId, snowflakeId(), body)',
          '  targetGw = redisSessionRegistry.get("ws:" + recipient)',
          '  if targetGw != null: targetGw.pushViaGrpc(recipient, msg)',
          '  else: pushQueue.publish(FCM_PUSH, recipient, msg)',
        ],
        steps: [
          {
            view: 'architecture',
            codeLine: 3,
            narration: 'Alice (on WS Gateway #1) sends a message to Bob. Gateway #1 writes to Cassandra Inbox, looks up Bob’s WebSocket host in Redis Session Registry (Gateway #7), and relays via gRPC in 15ms!',
            vars: [['Sender', 'Alice (GW #1)'], ['Recipient', 'Bob (GW #7)'], ['Storage', 'Cassandra (chat_id)'], ['E2E Latency', '15ms']],
            firedEdgeId: 'w3',
            nodes: [
              { id: 'gw1', label: 'WS Gateway #1', sublabel: 'Alice Connected', kind: 'gateway', x: 50, y: 145, tint: 'active', metrics: '250K conns' },
              { id: 'reg', label: 'Session Registry', sublabel: 'Redis: Bob → GW #7', kind: 'cache', x: 330, y: 35, tint: 'gold', metrics: '0.5ms lookup' },
              { id: 'cass', label: 'Cassandra Inbox', sublabel: 'PK: (chat_id, msg_id)', kind: 'db', x: 330, y: 250, tint: 'done', metrics: 'Write-Ahead' },
              { id: 'gw7', label: 'WS Gateway #7', sublabel: 'Pushes to Bob WS', kind: 'gateway', x: 615, y: 145, tint: 'done', metrics: 'Delivered ✓✓' },
            ],
            edges: [
              { id: 'w1', from: 'gw1', to: 'cass', label: '1. Persist msg_991', active: true },
              { id: 'w2', from: 'gw1', to: 'reg', label: '2. GET ws:Bob → GW#7', active: true },
              { id: 'w3', from: 'gw1', to: 'gw7', label: '3. gRPC Relay → Bob WebSocket', active: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'twitter-hybrid-newsfeed-hld',
    moduleId: 'hld-case-studies',
    title: 'Design Twitter / News Feed — Hybrid Celebrity Fanout',
    subtitle: 'Combine Fanout-on-Write (Push) for normal users with Fanout-on-Read (Pull) for 50M-follower celebrities.',
    kind: 'hld',
    difficulty: 'Hard',
    companies: ['Meta', 'X (Twitter)', 'LinkedIn', 'Bytedance'],
    statement:
      'Why does pure Fanout-on-Write melt Redis when a celebrity with 50 million followers tweets? Design the Hybrid Push/Pull timeline architecture.',
    theoryMarkdown: `# Hybrid News Feed Architecture (Push + Pull)

## The Celebrity Backpressure Problem
- **Normal User (< 10K followers)**: Use **Fanout-on-Write (Push)**. Async workers append \`tweetId\` to each follower's Redis Timeline List (\`LPUSH feed:{followerId} tweetId\`) so reads are $O(1)$.
- **Celebrity / Hot Account (> 10K followers)**: **Do NOT fan out on write!** Write only to the celebrity's own \`AuthorPosts\` list. When a follower opens their app (**Fanout-on-Read**), merge their precomputed Redis Timeline with the latest posts from the few celebrities they follow in $O(C \\log K)$ via a K-way merge.`,
    rubric: {
      prompt:
        'Write pseudocode for Hybrid News Feed publishPost(userId, post) and getHomeTimeline(userId): branch on followerCount > CELEBRITY_THRESHOLD during write, and merge precomputed Redis feed with followed celebrities’ posts during read.',
      starterHint: `function publishPost(author, post):\n    postDb.save(post)\n    if author.followersCount < THRESHOLD:\n        # fanout-on-write to followers Redis feeds...\n\nfunction getTimeline(user):\n    # merge user Redis feed + followed celebrity posts...`,
      requiredGroups: [
        {
          concept: 'Celebrity threshold check on write (Push vs Pull split)',
          keywords: ['threshold', 'celebrity', 'followers', '<', '>'],
          missingHint: 'Check if author.followersCount exceeds the celebrity threshold before fanning out on write.',
        },
        {
          concept: 'Fanout-on-Write to follower Redis caches for normal users',
          keywords: ['fanout', 'redis', 'feed', 'followers', 'push'],
          missingHint: 'Push postId into each follower’s Redis timeline cache for standard accounts.',
        },
        {
          concept: 'Merge precomputed feed with celebrity posts on read',
          keywords: ['merge', 'celebrities', 'read', 'timeline'],
          missingHint: 'On getTimeline(user), fetch the precomputed Redis feed and merge with followed celebrities’ recent posts.',
        },
      ],
    },
    approaches: [
      {
        label: 'Hybrid Fanout (Push Normal + Pull Celebrities)',
        badge: 'FAANG Standard',
        code: [
          'publishPost(author, post):',
          '  db.save(post)',
          '  if author.followers < 10_000: fanoutWorkers.pushToFollowers(author, post.id)',
          '  else: celebrityCache.append(author.id, post.id) // O(1) write!',
          '',
          'getTimeline(user):',
          '  pushed = redisFeed.getTop(user.id, 100)',
          '  pulled = celebrityCache.getRecent(user.followedCelebrities)',
          '  return kWayMergeByTimestamp(pushed, pulled)',
        ],
        steps: [
          {
            view: 'architecture',
            codeLine: 7,
            narration: 'Normal posts fan out asynchronously into followers’ Redis Timelines, while 50M-follower Celebrity posts write in O(1) to Celebrity Cache and merge on read!',
            vars: [['Normal Write', 'Async Push (<10K)'], ['Celebrity Write', 'O(1) No Fanout'], ['Read Latency', 'p99 < 25ms']],
            firedEdgeId: 'f3',
            nodes: [
              { id: 'post', label: 'Post Service', sublabel: 'Checks followerCount', kind: 'service', x: 45, y: 145, tint: 'active', metrics: 'Threshold: 10K' },
              { id: 'wrk', label: 'Fanout Workers', sublabel: 'Normal Users (<10K)', kind: 'queue', x: 325, y: 40, tint: 'done', metrics: 'LPUSH followers' },
              { id: 'cel', label: 'Celebrity Cache', sublabel: 'Hot Authors (>10K)', kind: 'cache', x: 325, y: 250, tint: 'gold', metrics: 'O(1) Write' },
              { id: 'tl', label: 'Timeline Mixer', sublabel: 'K-Way Merge on Read', kind: 'gateway', x: 615, y: 145, tint: 'active', metrics: 'Push + Pull' },
            ],
            edges: [
              { id: 'f1', from: 'post', to: 'wrk', label: 'followers < 10K (Push)', active: true },
              { id: 'f2', from: 'post', to: 'cel', label: 'followers >= 10K (No Fanout)', active: true },
              { id: 'f3', from: 'cel', to: 'tl', label: 'Merge on Read (K-Way Heap)', active: true },
              { id: 'f4', from: 'wrk', to: 'tl', label: 'Precomputed Redis Feed', active: true },
            ],
          },
        ],
      },
    ],
  },
];
