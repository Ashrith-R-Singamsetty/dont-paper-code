# Don't Paper Code (!P)

**Don't Paper Code** is an interactive visual learning studio for **Data Structures & Algorithms (DSA)** and **System Design (LLD + HLD)**. Step through every pointer movement, recursive call frame, UML class connector, lifelines sequence, and distributed Redis Lua lock before writing code.

## Features

- **Warm Ink-on-Paper & Dark-Sketch Theme**: Instant toggle between warm paper mode and dark sketch mode (`--paper`, `--ink`, `--accent`, `--accent2`, `.sketch-border`).
- **DSA Visual Stage**:
  - **Array Cells**: Multi-lane pointers (`L`, `R`), dynamic sliding-window brackets (`[L..R]`), `★` best-answer badges, and auxiliary HashSet viewers.
  - **Histogram Bars & Water**: Dynamic container water-level visualization (*Container With Most Water*).
  - **Linked Lists**: Curved SVG pointer arcs that animate in-place reversal (`curr.next = prev`).
  - **Binary Trees**: SVG subtree swap visualizer with live recursion call-stack inspector.
- **System Design (LLD + HLD) Visual Stage**:
  - **Watch vs. Read Mode**: Switch seamlessly between step-by-step animated diagrams and Markdown architecture notes.
  - **UML Class Diagrams**: Bounding-box intersection router with all 6 UML relationship connectors (`inherit`, `implement`, `compose`, `aggregate`, `assoc`, `depend`) and multiplicity labels.
  - **Sequence Diagrams**: Actor/Service lifelines with synchronous calls, creations, returns, and race-condition highlights (*BookMyShow Concurrent Seat Lock*).
  - **State Machine & Distributed HLD Topologies**: Finite state machine transitions (*Elevator LOOK Dispatcher*) and distributed service graphs (*API Gateway + Redis Lua Token Bucket Rate Limiter*, *Snowflake Base62 URL Shortener*).
- **"Don't Paper Code" Practice Engine**:
  - Global **Hide Solutions** mode masks reference code until you practice or reveal it.
  - Smart pseudocode editor with `Tab`/`Shift+Tab` indent/outdent, `Enter` auto-indent, bracket auto-close, instant rubric evaluation, and side-by-side **Compare ⤢** diff modal.
- **Universal `⌘K` / `Ctrl+K` Command Palette** & Keyboard Playback (`Space`, `←`, `→`, `Home`).

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
