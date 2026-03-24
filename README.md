
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