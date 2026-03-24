# Process

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


### Chats

The main efficiency gains come from three things:

1. Lead with constraints, not features
The prompts that moved fastest were the ones that front-loaded the non-negotiables:

"Prefer flexbox. Rule of 3 for styling. 80/20 split. No interactivity yet."

The ones that required iteration were open-ended:

"Can we improve on this?"

That's a valid prompt but it invites a conversation rather than a decision. Faster version:

"The active state is local to SectionItem but needs to be shared across sections. Lift it to SidePane as a typed discriminated union. Also DRY the section rendering into a reusable sub-component."

You've already done the diagnosis — just hand it over.

2. Separate structure from behavior
You instinctively did this ("don't focus on interactivity yet") and it was the right call. A more explicit version of this as a standing rule:

Pass 1 — structure + layout only, static data, no handlers

Pass 2 — interactivity wired up

Pass 3 — refactor / split files

You went through all three passes, just not always in clean separation. The bounce effect and active state got intermixed with structural work, which caused some back-and-forth.

3. File splits should be their own prompt
Yes — the "refactor into separate files" request should always be a standalone prompt, after the component is stable. Asking for a component and its file structure in the same prompt leads to over-scaffolding before the design is settled.

What an efficient prompt sequence looks like

1. "Scaffold the project shell. #root is full-viewport flex. Design tokens: 3 colors, 3 sizes, 3 weights."

2. "Build MessageContainer. 80% scroll area, 20% input. Static mock data. No handlers. CSS Module."

3. "Wire up the input: textarea accepts text, Send appends an outgoing message."

4. "Build SidePane in isolation. Fixed 260px. 3 sections [describe each]. Static only."

5. "Add active state to SidePane. Single active item across both sections."

6. "Split SectionItem and SectionList into their own files and CSS modules."
That's 6 prompts with no iteration needed on any of them. You got here in roughly double that because some prompts bundled multiple concerns or left decisions open.

Short version: Be the architect in the prompt. Diagnose the problem, state the constraint, name the pattern. The more decisions you make before sending, the less back-and-forth there is.