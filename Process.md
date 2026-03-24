# Process

## Stack

- React 19 + TypeScript + Vite
- CSS Modules (`.module.css` per component)
- No CSS framework — plain CSS custom properties for design tokens
- `npm run dev` serves to localhost via Vite

---

## Design Tokens

Defined globally in `src/index.css` on `:root`. Everything in the component tree inherits them via `var(--token)`.

**3 colors**
- `--color-bg` — base dark background
- `--color-surface` — elevated panels (sidepane, input area)
- `--color-accent` — indigo, used for active states and badges

**3 font sizes** — `--text-sm` (12px), `--text-base` (14px), `--text-lg` (18px)

**3 font weights** — `--weight-normal` (400), `--weight-medium` (500), `--weight-bold` (700)

Component-specific tokens (e.g. bubble colors, border colors) are scoped to the root class of the component that owns them, not `:root`. This prevents global namespace pollution while still cascading to children naturally through the DOM.

---

## Component Architecture

```
App
├── SidePane
│   ├── SectionList (Channels)
│   │   └── SectionItem × n
│   └── SectionList (Direct Messages)
│       └── SectionItem × n
└── MessageContainer
    └── MessageBubble × n
```

Each component has its own `.tsx` and `.module.css` file. No shared stylesheet between components.

---

## Components

### MessageBubble
- Renders a single message bubble
- Direction (`incoming` | `outgoing`) drives alignment and color via a typed `Record<MessageDirection, string>` — no dynamic string indexing
- Exports `Message` and `MessageDirection` types — `MessageContainer` imports them from here

### MessageContainer
- Owns message state and input state
- 80% / 20% flex split: message list above, input area below
- `useEffect` + scroll anchor ref auto-scrolls to the latest message on send
- Send is guarded: empty input is a no-op

### SectionItem
- Fully controlled — owns no state
- Receives `isActive` and `onSelect` as props
- Exports `LineItem` type

### SectionList
- Renders a labeled, scrollable list of `SectionItem`s
- Owns the scroll bounce effect via `useScrollBounce` hook (wheel event listener + CSS keyframe animation)
- Scrollbar styled to 4px, transparent track, accent color on hover, arrow ends removed
- Exports `SectionId` and `ActiveKey` types

### SidePane
- Single source of truth for active selection: `activeKey: ActiveKey`
- `ActiveKey` is a typed discriminated union `{ section: SectionId; id: number }` — not a magic string
- Icon render functions stored as `() => React.ReactElement`, not eagerly-created `ReactNode`
- Fixed width (`150px`), `flex-shrink: 0` — does not resize with the window

---

## Key Technical Decisions

**Active state lifted to `SidePane`**
`SectionItem` is stateless. Keeping active selection in the parent is the only way to enforce the one-active-at-a-time rule across two separate sections. Local state in `SectionItem` cannot coordinate across siblings.

**Typed discriminated union for active key**
`{ section: 'channels' | 'dms'; id: number }` instead of a concatenated string like `'channels-1'`. Enables structural comparison, catches invalid states at compile time, and requires no string parsing.

**Scroll bounce via wheel event + CSS animation**
`overscroll-behavior: contain` only triggers the OS rubber-band gesture — no effect on Windows Chrome. The implemented approach attaches a `wheel` event listener, detects boundary hits, and applies a `@keyframes` animation class directly on the element. A forced reflow (`void el.offsetWidth`) restarts the animation if triggered in quick succession.

**File splits after stability**
Components were built and iterated in a single file first, then split into their own files once the design was settled. Splitting too early locks in a file structure before the component shape is known.

---

## Prompting Learnings

### What worked

**State constraints upfront**
The most productive prompts front-loaded the non-negotiables before describing the feature:
> "Prefer flexbox. Rule of 3 for styling. 80/20 split. No interactivity yet."
This eliminated back-and-forth on decisions that were already made.

**Explicit stopping points**
Saying "don't scaffold anything else yet" or "static only" kept scope contained. Without it, gaps in the spec get filled with assumptions that need correcting.

**Isolating components before composing**
Building `SidePane` alone — then `MessageContainer` alone — before wiring them together in `App` made each component easier to reason about and faster to iterate on. Problems were caught in isolation rather than in a composed view.

**Separating structure from behavior**
Prompting for layout and static data first, then wiring up interactivity in a follow-up, produced cleaner results. The structure didn't shift when behavior was added.

---

### What caused iteration

**Open-ended prompts**
"Can we improve on this?" is valid but invites a conversation. It asks the model to both diagnose and fix. Faster version: do the diagnosis yourself and hand over the specific problem:
> "The active state is local to SectionItem but needs to coordinate across sections. Lift it to SidePane as a typed discriminated union."

**Bundling structure and behavior together**
Asking for layout and interactivity in the same prompt meant the structure wasn't stable when behavior was added, leading to interleaved concerns.

**Missing conventions in the first prompt**
`.module.css` was added as a mid-session correction. Conventions like file naming, CSS approach, and folder structure belong in the very first prompt so every subsequent file follows them automatically.

**Not specifying the starting file**
Several early prompts didn't specify what file to start from or what the component renders into. This led to assumptions about the parent layout that needed fixing.

---

### Efficient prompt sequence for a component

```
1. Constraints  — layout rules, styling rules, file conventions, what not to build
2. Structure    — static layout, mock data, no handlers
3. Behavior     — wire up interactivity
4. Refactor     — split files, extract sub-components (separate prompt, after stable)
```

Each step is a separate prompt. Never bundle step 2 and step 3. Never do step 4 before step 3 is settled.

---

### Prompt template

```
Component: <name>
File: <path>, CSS: <path>.module.css

Layout: <describe structure and flex rules>
Data: <describe shape or reference an existing type>
Behavior: none yet / <describe specific interactions>
Constraints: <list non-negotiables>
Stop after: <explicit boundary>
```