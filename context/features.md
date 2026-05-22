# Compass — Feature Reference

Tracks every feature built into the app. Update this file whenever a new capability is added.
Read this alongside `agent-instructions.md` before extending any existing feature.

---

## App Architecture

Three-panel layout rendered by `src/App.tsx`:

```
Topbar
  └─ view switcher: Now / What / Who

NowView        → LeftColumn + MiddleColumn + RightTray
WhatView       → full-width focus + habit list
WhoView        → values + principles list

CaptureOverlay   (z-index 30, always mounted)
FocusDetailOverlay (z-index 31, always mounted)
```

Global state lives in one Zustand store: `src/store/useCompassStore.ts`, persisted to localStorage under the key **`compass-store-v2`** (bump the version suffix any time the schema changes shape).

---

## Data Model

```ts
// src/store/useCompassStore.ts

type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'done' | 'parked'

type Task = {
  id: string        // `t-${Date.now()}`
  text: string
  status: TaskStatus
}

type Focus = {
  id: string        // `f-${Date.now()}`
  name: string
  process: string   // "how will you work on it"
  tags: string[]    // stored without #; user types "#tag1 #tag2"
  color: 'green' | 'indigo' | 'amber'
  status: 'active' | 'parked'
  daysActive: number
  streakDays: number[]   // unused in UI — reserved for future streak feature
  tasks: Task[]
  captures: Capture[]    // captures routed to this focus
}

type HabitStatus = 'active' | 'parked' | 'complete'

type Habit = {
  id: string
  name: string
  details: string          // long-form description, shown only in detail view
  tags: string[]           // stored without #; user types "#tag1 #tag2"
  status: HabitStatus      // active | parked | complete
  streakCount: number
  completedToday: boolean
  history: string[]
}

type Capture = {
  id: string        // `cap-${Date.now()}`
  text: string
  routedTo: string | null   // focus id, 'inbox', or null
  createdAt: string         // ISO string
  processed: boolean
}

type Value     = { id: string; name: string; description: string; note: string; hidden: boolean }
type Principle = { id: string; cue: string; daysActive: number; tags: string[]; status: 'active' | 'queue' | 'retired' }
type Reminder  = { id: string; text: string; time: string; dismissed: boolean }
```

---

## Store Actions

| Action | Signature | Notes |
|---|---|---|
| `setView` | `(view: 'now' \| 'what' \| 'who') => void` | |
| `setCaptureOpen` | `(open: boolean) => void` | |
| `openFocusDetail` | `(id: string \| null) => void` | sets `focusDetailId` |
| `toggleHabit` | `(id: string) => void` | flips completedToday + adjusts streakCount |
| `dismissReminder` | `(id: string) => void` | |
| `addCapture` | `(text, routedTo, processed?) => void` | if routedTo is a focus id, also creates a Backlog task on that focus |
| `resetDailyHabits` | `() => void` | called by `useDailyReset` hook on new day |
| `addFocus` | `(name, process) => void` | defaults: color green, status active |
| `updateFocus` | `(id, { name?, process?, tags?, status? }) => void` | partial update |
| `deleteFocus` | `(id) => void` | also clears `focusDetailId` |
| `addTask` | `(focusId, text) => void` | status defaults to backlog |
| `updateTask` | `(focusId, taskId, text) => void` | edit task text |
| `updateTaskStatus` | `(focusId, taskId, status) => void` | |
| `deleteTask` | `(focusId, taskId) => void` | |
| `addHabit` | `(name) => void` | |
| `updateHabit` | `(id, { name?, details?, tags?, status? }) => void` | partial update |
| `deleteHabit` | `(id) => void` | also clears `habitDetailId` |
| `addPrinciple` | `(cue) => void` | status defaults to queue |
| `updatePrinciple` | `(id, { cue?, tags?, status? }) => void` | partial update |
| `deletePrinciple` | `(id) => void` | also clears `principleDetailId` |
| `addValue` | `(name) => void` | |
| `updateValue` | `(id, { name?, description?, note?, hidden? }) => void` | partial update |
| `deleteValue` | `(id) => void` | also clears `valueDetailId` |

---

## Features

### NOW View — Focus Cards (`src/components/layout/MiddleColumn.tsx`)
- Lists only **active** focuses (`status === 'active'`). Parked focuses are hidden.
- Each card shows: color bar · name · process line · top 3 non-done/non-parked tasks · footer chips.
- Task preview: status glyph (`·` backlog, `○` todo, `◑` in-progress) + truncated text.
- Footer chips: task count · capture count (if > 0) · `#tags` (purple chips).
- Clicking a card calls `openFocusDetail(f.id)`.
- Streak dots removed (data exists on model but is not displayed — unlinked).

### WHAT View — Focus + Habit Lists (`src/components/views/WhatView.tsx`)
- Two sections: active focuses (top), parked focuses (below), then habits.
- Each focus row: color dot · name · process · right side chips.
  - Active row right side: **Active** chip (green) + any `#tag` chips + age in days.
  - Parked row right side: **Parked** chip + any `#tag` chips.
- Clicking any focus row opens the Focus Detail overlay.
- **Habit rows**: All habits listed (active, parked, complete). Clicking a row opens the Habit Detail overlay.
  - Active habits: streak dots + Active chip + tag chips.
  - Parked habits: no streak dots + Parked chip (muted name).
  - Complete habits: no streak dots + Complete chip (muted name, no streak count).
- **Add focus**: inline form at the bottom of the focus list (name + process fields; Enter or Add button).
- **Add habit**: inline form at the bottom of the habit list (name field).

### Habit Detail Overlay (`src/components/overlays/HabitDetailOverlay.tsx`)
Open-surface design — matching Focus Detail visual language.

- **Open**: clicking any habit row in the What view; clicking habit name in the Right Tray.
- **Close**: Escape key · clicking backdrop.
- **Header row**: ◎ icon · editable habit name (blur to save) · trash icon.
- **Confirm delete**: inline red banner with Delete / Cancel.
- **Details**: auto-resizing textarea (like process in Focus Detail); blur to save.
- **Status**: select (Active / Parked / Complete).
- **Tags**: single text field; user types `#tag1 #tag2`; blur parses and saves as `string[]`.
- **Streak section**: numeric streak count + 14-dot history bar.
- **Mark as done button**: full-width button; toggles `completedToday` and adjusts `streakCount`. Shows "Done today — tap to undo" when complete.

### Focus Detail Overlay (`src/components/overlays/FocusDetailOverlay.tsx`)
Open-surface design — no visible input chrome; the whole card feels like one editable document.

- **Open**: clicking any focus card/row in Now or What view.
- **Close**: Escape key · clicking backdrop.
- **Header row**: color dot · editable focus name (blur to save) · trash icon.
- **Confirm delete**: clicking trash shows an inline red banner with Delete / Cancel; Escape dismisses the banner first.
- **Process**: auto-resizing textarea; blur to save.
- **Tags**: single text field; user types `#tag1 #tag2`; blur parses and saves as `string[]` (strips `#`).
- **Status**: select (Active / Parked) below tags. Changing it saves immediately via `updateFocus`.
- **Tasks section** (after separator):
  - Each row: task text · status dropdown · delete (×) button.
  - Click task text → inline input (edit mode); Enter/blur saves, Escape cancels.
  - Status dropdown: Backlog · Todo · In Progress · Done · Parked. Styled as colored mini-chip.
  - Done tasks: strikethrough text.
  - Delete button visible on row hover only.
- **Add task**: plain text input at bottom of task list; Enter to save, Escape to clear.

### Capture Inbox (`src/components/overlays/InboxOverlay.tsx`)
Two-pane overlay for reviewing and routing unprocessed captures.

- **Open**: clicking the "to route" pill in the Topbar (visible when `captures.filter(!processed).length > 0`).
- **Close**: Escape key · clicking backdrop.
- **Left pane**: scrollable list of all unprocessed (`processed === false`) captures. Each row shows age + text. Clicking selects it.
- **Right pane**: shown when a capture is selected.
  - Displays the capture text.
  - Search input filters active focuses and active habits by name.
  - Results grouped: Focuses (colored dot, routes capture + creates Backlog task on that focus) / Habits (purple dot, tags capture without creating a task).
  - "Dismiss without routing" marks the capture as processed with `routedTo: 'dismissed'` — no task created.
  - After routing/dismissing, auto-advances to the next unprocessed capture.
- **CSS namespace**: `.ibx-`
- **Store actions**: `routeCapture(captureId, routedTo)` — marks `processed: true`, sets `routedTo`; if `routedTo` is a focus id it also appends a Backlog task to that focus.

### Capture Overlay (`src/components/overlays/CaptureOverlay.tsx`)
- Trigger: `C` key (via `useKeyboard` hook) or any other configured shortcut.
- **Route to focus**: pill selector — routes the capture to a specific focus and auto-creates a Backlog task on it.
- **Create as**: pill selector (Habit / Focus / Principle / Value) — mutually exclusive with route-to-focus. On save, immediately creates the entity.
- Saving with a focus route marks the capture as `processed: true`.

### WHO View (`src/components/views/WhoView.tsx`)
- Displays Values and Principles lists.
- **Values**: clicking any row opens the Value Detail overlay. Hidden values shown at bottom with muted style + "hidden" badge.
- **Add value**: inline input triggered by `+` button in the Values header or the `+ add value` hint at the bottom.
- **Value Detail Overlay** (`src/components/overlays/ValueDetailOverlay.tsx`): editable name · description textarea · note textarea · eye toggle for show/hide · delete with confirm. CSS namespace: `.vd-`
- **Principles**: clicking any row opens the Principle Detail overlay. Active and queued principles shown with tag chips.
- **Add principle**: inline input at bottom via `+ add principle` hint; created with `queue` status.
- **Principle Detail Overlay** (`src/components/overlays/PrincipleDetailOverlay.tsx`): editable cue textarea · status select (Active / Queue) · tags field (`#tag1 #tag2`) · days-active display · delete with confirm. CSS namespace: `.pd-`

### Keyboard Shortcuts (`src/hooks/useKeyboard.ts`)
| Key | Action |
|---|---|
| `C` | Open Capture overlay |
| `1` | Switch to Now view |
| `2` | Switch to What view |
| `3` | Switch to Who view |

### Daily Habit Reset (`src/hooks/useDailyReset.ts`)
- On app load, checks localStorage for the last-reset date.
- If it's a new calendar day, calls `resetDailyHabits()` to set all `completedToday` to false.

---

## CSS Conventions

All styles in `src/index.css`. No Tailwind utilities used in component JSX (Tailwind base/reset only).

**Design tokens (CSS variables):**
```
--bg          page background
--bg-card     card / overlay background
--bg-hover    hover state
--bg-active   active / selected
--border      subtle border
--border-mid  slightly stronger border
--ink-1..4    text hierarchy (1 = brightest, 4 = most muted)
--accent      blue accent
--accent-dim  blue accent background
--warn        amber warning
--warn-dim    amber warning background
--sans        body font
--mono        monospace font
```

**Component class namespaces:**
| Prefix | Component |
|---|---|
| `.fd-` | Focus Detail overlay |
| `.td-` | Task rows inside Focus Detail |
| `.tds-` | Task status dropdown variants |
| `.ft-` | Task preview rows inside focus cards (Now view) |
| `.cap-` | Capture overlay |
| `.f-` | Focus card body (Now view) |
| `.fb-` | Focus card color bar |
| `.hl-` | Habit list row (What view) |
| `.hbd-` | Habit Detail overlay |
| `.l-` | List row (What view) |
| `.pd-` | Principle Detail overlay |

**Chip variants:**
- `.chip` — default (muted)
- `.chip-info` — blue (capture count)
- `.chip-warn` — amber (legacy, available)
- `.chip-tag` — purple (`#tags`)
- `.chip-status-active` — green (Active status)
- `.chip-status-parked` — amber (Parked status)
- `.chip-status-complete` — indigo (Complete status)

---

## Known Gaps / Not Yet Built

- `streakDays` field on Focus exists in the store but nothing reads or writes it after initial seed.
- WHO view (Values / Principles) is read-only — no add/edit UI yet. ~~done~~
- Habit history (`history: string[]`) is stored but not visualized beyond streakCount.
- Reminders in the Right Tray are seed-only — no add UI.
