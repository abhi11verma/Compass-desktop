# Claude Code — Compass App Build Prompt

---

## Setup

Clone this boilerplate to get started:

```bash
git clone https://github.com/abhi11verma/react-ai-boilerplate compass
cd compass
npm install
npm run dev
```

Use this as the base. Do not scaffold a new project from scratch.

---

## What We're Building

**Compass** — a personal life OS for managing signal vs. noise.

The core problem it solves: people accumulate ideas, goals, habits, and reminders across their life, get overwhelmed, lose focus, and make no progress on what actually matters. Compass gives them one surface to see where they are, what they're working on, and what to do next — without noise.

The app is built around a framework from Chris Bailey's intentionality research:

```
WHO (values + principles)     →  identity layer, slowest clock
WHAT (focuses + tasks)        →  direction layer, weekly clock  
NOW (habits + reminders)      →  execution layer, daily clock
```

Each layer operates at a different speed. The desktop layout makes all three visible simultaneously so drift is visible without needing a notification.

---

## Design Reference

The `compass.html` file in this repo is the **complete visual and interaction reference**. It is a fully working HTML prototype with:
- Final dark theme and color palette
- Typography (DM Sans + DM Mono + Instrument Serif)
- All three views: Now, What, Who
- Left column with Values + Principles cards
- Middle column with Focus cards
- Right tray with Habits + Reminders cards
- Capture overlay (keyboard shortcut: C)
- Settings button pinned to bottom-left
- Segmented nav control: Now / What / Who

**Match this design exactly.** Do not deviate from the visual language, spacing, colors, or component structure unless explicitly asked.

---

## Core Concepts to Understand

### 1. WHO — Identity Layer
- **Values**: 2–3 core values from the Schwartz framework (self-direction, pleasure, benevolence etc.). Static. Changed maybe once a year. These are the filter everything else runs through.
- **Principles**: Behavioral commitments. Max 3 active at any time. They rotate — when one is retired, the next in queue activates. Each has an age (days active). No daily interaction needed — they're ambient identity, not tasks.

### 2. WHAT — Direction Layer
- **Focuses**: Max 3 active goals. Each has:
  - A name
  - A process line (how you're working on it this week)
  - Task count
  - Capture count (unprocessed ideas routed here)
  - A 7-day streak indicator (dot cells)
  - A status: Active / Trying / Parked
- **Parked focuses**: Goals you've put on hold. Visible in the What view list, not in the Now view.

### 3. NOW — Execution Layer (Right Tray)
- **Habits**: Daily recurring actions. Each has a streak count. Appear every day, mark complete, reset at midnight.
- **Reminders**: Time-specific nudges. Appear when due, dismissed with ×, gone when actioned. Not persistent.
- The tray resets daily. Empty tray at end of day = the reward signal.

### 4. Capture
- A keyboard-triggered overlay (press C anywhere).
- One field: what's on your mind.
- Optional routing: route to a specific focus or general inbox.
- Captured items go into a queue. A counter in the topbar shows "N to route".
- Items are processed during weekly review — either promoted to a focus task, parked, or dropped.

---

## Data Models

```typescript
// Values — static identity
type Value = {
  id: string
  name: string
  description: string
}

// Principles — rotating behavioral commitments
type Principle = {
  id: string
  cue: string           // the behavioral statement
  daysActive: number
  status: 'active' | 'queue' | 'retired'
}

// Focuses — active goal inventory
type Focus = {
  id: string
  name: string
  process: string       // how you're working on it this week
  color: 'green' | 'indigo' | 'amber'
  status: 'active' | 'trying' | 'parked'
  daysActive: number
  streakDays: number[]  // last 7 days: 0 (missed) | 1 | 2 | 3 (strength)
  tasks: Task[]
  captures: Capture[]
}

type Task = {
  id: string
  text: string
  done: boolean
}

// Habits — daily recurring
type Habit = {
  id: string
  name: string
  streakCount: number
  completedToday: boolean
  history: string[]     // ISO date strings of completions
}

// Reminders — time-based, ephemeral
type Reminder = {
  id: string
  text: string
  time: string          // "10:00 AM"
  dismissed: boolean
}

// Captures — inbox items
type Capture = {
  id: string
  text: string
  routedTo: string | null   // focusId or null (general inbox)
  createdAt: string
  processed: boolean
}
```

---

## App Architecture

```
src/
  components/
    layout/
      Topbar.tsx          — app name, date, segmented nav, inbox badge, capture button
      LeftColumn.tsx      — values card + principles card + settings button
      MiddleColumn.tsx    — focuses list
      RightTray.tsx       — habits card + reminders card
    views/
      NowView.tsx         — three-column layout (left + middle + right)
      WhatView.tsx        — full list: all focuses + habits with history dots
      WhoView.tsx         — full list: values with descriptions + all principles with queue
    cards/
      FocusCard.tsx       — individual focus card with accent bar, process, chips, streak
      HabitRow.tsx        — habit row with checkbox, name, streak
      ReminderRow.tsx     — reminder row with time, text, dismiss
      WhoCard.tsx         — values card and principles card (shared shell)
    overlays/
      CaptureOverlay.tsx  — capture input + focus routing pills
  store/
    useCompassStore.ts    — Zustand store for all state
  hooks/
    useKeyboard.ts        — keyboard shortcut handler (C for capture, Esc to close)
    useDailyReset.ts      — resets habit completion at midnight
  lib/
    storage.ts            — localStorage persistence layer
    dates.ts              — date utilities
  App.tsx
```

---

## State Management

Use **Zustand** for global state. Persist everything to **localStorage** via Zustand's persist middleware.

Key store slices:
- `view`: 'now' | 'what' | 'who'
- `captureOpen`: boolean
- `values`: Value[]
- `principles`: Principle[]
- `focuses`: Focus[]
- `habits`: Habit[]
- `reminders`: Reminder[]
- `captures`: Capture[]

---

## Behavior Rules

**Focuses:**
- Max 3 active at any time (enforced in UI — add button disabled at 3)
- Trying = active but uncertain. Shown with amber "Trying" chip.
- Parked = not shown in Now view, shown in What view
- Streak dots represent last 7 days. 0 = empty, 1 = light, 2 = medium, 3 = full

**Principles:**
- Max 3 active. Queue holds the rest.
- When a principle is retired, the first in queue automatically becomes active
- Age shown in days (daysActive)

**Habits:**
- Mark complete toggles for today only
- Streak increments when completed on consecutive days
- Daily reset at midnight — completedToday → false for all habits

**Reminders:**
- Shown only on the day they're due
- Dismissed with × — removed from tray immediately
- Not recurring (separate from habits)

**Capture:**
- Press C anywhere to open (except when typing in an input)
- Press Esc to close
- Captured items add to captures array with processed: false
- Inbox badge count = captures where processed === false
- During weekly review (What view) user can route or drop each capture

**Segmented nav:**
- Now / What / Who — single outer border, internal dividers, active segment fills
- Match the reference HTML exactly for the segmented control appearance

---

## Visual Design Tokens

Extract these exactly from `compass.html`:

```css
--bg:         #0E0E11    /* app background */
--bg-card:    #161619    /* card surface */
--bg-hover:   #1C1C21    /* hover state */
--border:     rgba(255,255,255,0.07)
--border-mid: rgba(255,255,255,0.12)
--ink-1:      rgba(255,255,255,0.86)   /* primary text */
--ink-2:      rgba(255,255,255,0.44)   /* secondary text */
--ink-3:      rgba(255,255,255,0.22)   /* tertiary / labels */
--ink-4:      rgba(255,255,255,0.10)   /* ghost */
--accent-dim: rgba(76,110,245,0.12)
--warn-dim:   rgba(156,106,40,0.14)
--g: #3A8F68   /* green focus accent */
--i: #5C6DC4   /* indigo focus accent */
--a: #B8772A   /* amber focus accent */
```

Fonts:
- `DM Sans` — UI font (weights 300, 400, 500)
- `DM Mono` — labels, metadata, chips, counts
- `Instrument Serif italic` — principle cues in left column only

---

## What NOT to Build (yet)

- No backend / API calls
- No authentication
- No mobile layout (desktop only for now — min-width 1024px)
- No notifications system
- No onboarding flow
- No analytics
- No drag-and-drop reordering (yet)

All data lives in localStorage. This is a local-first app for now.

---

## First Steps for Claude Code

1. Clone the boilerplate: `git clone https://github.com/abhi11verma/react-ai-boilerplate compass`
2. Install dependencies: `npm install`
3. Add required packages: `npm install zustand`
4. Add Google Fonts to `index.html`: DM Sans, DM Mono, Instrument Serif
5. Add Tabler Icons: `npm install @tabler/icons-react`
6. Set up the Zustand store with seed data matching the prototype
7. Build the layout shell: Topbar → LeftColumn → NowView (middle + tray)
8. Build the WhatView and WhoView
9. Wire the CaptureOverlay with keyboard shortcut
10. Add localStorage persistence via Zustand persist middleware
11. Implement daily habit reset logic

Use `compass.html` as pixel-level reference for every component. When in doubt about spacing, color, or layout — check the HTML file first.
