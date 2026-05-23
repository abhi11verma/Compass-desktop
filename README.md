# Compass

![version](https://img.shields.io/badge/version-0.2.0-blue) ![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Web-lightgrey)

A personal life-navigation app. Three views — **Now**, **What**, **Who** — keep your daily actions, active focuses, and core identity in one place.

**[compassapp.verma.dev](https://abhi11verma.github.io/Compass-desktop/) · [Open app →](https://abhi11verma.github.io/Compass-desktop/app/)**

Works entirely in the browser. No account, no server — your data lives in `localStorage`.

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| **v0.2.0** | May 2026 | Mobile experience, landing page overhaul, light/dark theme |
| **v0.1.0** | May 2026 | Initial release |

---

## What it does

| View | Purpose |
|---|---|
| **Now** | Today's habits, reminders, and quick capture |
| **What** | Active focuses, their tasks, streak history, and captured ideas |
| **Who** | Your values and the behavioral principles you're practicing |

**Capture** (`Space` / `C`) is a global inbox — jot anything down and route it to a focus later.

---

## Stack

| Layer | Tool |
|---|---|
| Bundler | Vite 8 + React 19 + TypeScript 6 (strict) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| State | Zustand v5 (persisted to `localStorage`) |
| Linting | ESLint 10 flat config (`typescript-eslint strictTypeChecked`) |
| Task runner | `just` |

---

## Getting started

### Prerequisites

- Node 20+
- [`just`](https://github.com/casey/just) — `brew install just` on macOS

### Run locally

```bash
npm install
just dev
```

Open `http://localhost:5173`.

### Key commands

```
just dev              start dev server
just build            type-check + production build
just lint             run ESLint
just add-ui <name>    add a shadcn component
just list-ui          list installed shadcn components
just apply-theme <c>  swap the color palette
```

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `1` | Switch to Now view |
| `2` | Switch to What view |
| `3` | Switch to Who view |
| `Space` / `C` | Open capture overlay |
| `Esc` | Close capture overlay |

---

## Folder structure

```
src/
  app/              global providers
  components/
    layout/         Topbar, LeftColumn, MiddleColumn, RightTray
    views/          NowView, WhatView, WhoView
    overlays/       CaptureOverlay
    ui/             shadcn-generated (do not edit manually)
  store/            useCompassStore — single Zustand store, persisted
  hooks/            useKeyboard, useDailyReset
  lib/              pure utilities (dates, cn)
  types/            global ambient declarations
```

---

## Data model

All state lives in a single Zustand store (`src/store/useCompassStore.ts`) persisted under the key `compass-store`.

| Entity | Key fields |
|---|---|
| `Value` | name, description |
| `Principle` | cue, daysActive, status (`active` / `queue` / `retired`) |
| `Focus` | name, color, status (`active` / `trying` / `parked`), tasks, captures, streakDays |
| `Habit` | name, streakCount, completedToday |
| `Reminder` | text, time, dismissed |
| `Capture` | text, routedTo (focus id or null), processed |

Habits reset daily via `useDailyReset` (compares stored date against today on mount).
