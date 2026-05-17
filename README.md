# react-ai-boilerplate

A minimal, production-ready React starter built for AI-assisted development.

Most boilerplates are written for humans — they assume the reader will explore the codebase, read docs, and develop intuition over time. This one is written for AI agents first. Every folder has a declared purpose. Every rule is written down. The context system tells agents exactly where code goes, what conventions to follow, and how to use the UI library — before they write a single line.

The result is a codebase that AI agents can navigate accurately from the first prompt, and that humans can hand off to an agent without spending half the conversation correcting folder placement or import style.

---

## What's included

| Layer | Tool | Version |
|---|---|---|
| Bundler | Vite + React + TypeScript | Vite 8, React 19, TS 6 |
| Styling | Tailwind CSS | v3 (pinned) |
| UI components | shadcn/ui | pre-configured, add on demand |
| State | Zustand | v5 |
| Linting | ESLint flat config | `typescript-eslint strictTypeChecked` + `import-x/no-cycle` |
| Task runner | just | `justfile` at root |
| AI context | `/context` folder | agent-instructions, folder-structure, coding-rules, shadcn-guide |
| Agent files | `CLAUDE.md`, `AGENTS.md` | auto-loaded by Claude Code and Codex |

---

## The problem it solves

When you drop an AI agent into a blank React project and ask it to build something, it guesses:

- Where to put the component (sometimes `src/`, sometimes `src/components/`, sometimes a new folder it invents)
- Whether to use Zustand or `useState` for a piece of state
- Whether to write a raw button or reach for a UI library
- What import style to use
- How to name things

Each guess requires either a correction from you (costing tokens and time) or produces a codebase that drifts further from consistency with every task.

This boilerplate fixes that by making all those decisions in advance and writing them down in a format agents can read.

---

## How it works

### `/context` — the agent's rulebook

Four files that agents are directed to read before acting:

| File | Purpose |
|---|---|
| `agent-instructions.md` | Hard rules: path alias, named exports, no `any`, where state lives, how to add UI |
| `folder-structure.md` | Annotated file tree + import direction rules |
| `coding-rules.md` | TypeScript conventions, component patterns, import order |
| `shadcn-guide.md` | How to add components, use variants, apply and customise themes |

### `CLAUDE.md` — Claude Code session start

Claude Code automatically loads `CLAUDE.md` into every session. It contains the stack summary, critical rules inline, and a table directing the agent to the right context file for each type of task. Agents start oriented with zero exploration overhead.

### `AGENTS.md` — Codex task preamble

OpenAI Codex reads `AGENTS.md` before executing any task. Same content as `CLAUDE.md` but formatted for Codex's reading pattern — includes an explicit verification step (`just build && just lint` must exit 0 before a task is considered done).

### Tooling that enforces the rules

Rules written down but not enforced drift. The ESLint config enforces the most critical ones automatically:

- `import-x/no-cycle` — catches circular dependencies at lint time
- `import-x/order` — enforces import group ordering
- `@typescript-eslint/no-explicit-any` — rejects `any`
- `consistent-type-imports` — enforces `import type` for type-only imports
- `typescript-eslint/strictTypeChecked` — full type-aware rule set

---

## Getting started

### Prerequisites

- Node 20+
- [`just`](https://github.com/casey/just) — `brew install just` on macOS

### Clone and run

```bash
git clone https://github.com/<your-username>/react-ai-boilerplate.git my-app
cd my-app
just install
just dev
```

Open `http://localhost:5173` — you'll see the Task Manager example app wired up with Zustand and shadcn components.

### Starting a new project

The repo ships with a working example app so you can verify everything is wired up correctly. Before building your own app, remove it:

```bash
just new
```

This removes:

- `src/components/Counter.tsx` and `src/components/TaskManager.tsx`
- `src/store/counter.store.ts` and `src/store/tasks.store.ts`
- `src/components/ui/` (all installed shadcn components)
- Resets `src/main.tsx` to a minimal blank shell

After running it, `src/main.tsx` looks like this:

```tsx
createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      {/* your app goes here */}
    </Providers>
  </StrictMode>
);
```

Then build your app from scratch using the conventions in `/context`.

> **Both `CLAUDE.md` and `AGENTS.md` instruct agents to run `just new` before writing any project code.** If you're using an AI agent, you can skip the manual step — just tell it to start and it will clean the example files itself.

### Add a shadcn component

```bash
just add-ui button      # installs to src/components/ui/button.tsx
just add-ui card
just list-ui            # see everything installed
```

### Change the color theme

```bash
just apply-theme zinc      # zinc palette
just apply-theme rose      # rose palette
just apply-theme blue      # blue palette
```

Available: `slate` `gray` `zinc` `neutral` `stone` `red` `rose` `orange` `green` `blue` `yellow` `violet`

### All commands

```
just install          install dependencies
just dev              start dev server
just build            type-check + production build
just lint             run ESLint
just add-ui <name>    add a shadcn component
just list-ui          list installed shadcn components
just apply-theme <c>  swap the color palette
```

---

## Using with AI agents

### Claude Code

Point Claude Code at the repo root. `CLAUDE.md` is loaded automatically — no setup needed. The agent will be directed to read the relevant `/context` file before acting on each task.

Suggested first prompt:

```
Read CLAUDE.md and context/agent-instructions.md, then build a login form
module in src/modules/auth using shadcn Input, Label, and Button components.
Store auth state in a Zustand store.
```

### OpenAI Codex

Codex reads `AGENTS.md` before each task. Same workflow — point it at the repo and give it a task. It will run `just build && just lint` before finishing.

### Any other agent

Direct the agent to read `context/agent-instructions.md` first. The four context files in `/context` are written to be self-contained — any LLM can follow them.

---

## Folder structure

```
src/
  app/            global providers (add React Query, Router, etc. here)
  components/
    ui/           shadcn-generated — do not edit manually
  modules/        feature code, each with its own components/, hooks/, index.ts
  store/          Zustand stores — one file per domain
  lib/            pure utilities, no React
  hooks/          shared hooks used by 2+ modules
  types/          global ambient type declarations
```

Full rules in [`context/folder-structure.md`](context/folder-structure.md).

---

## Adding a feature (the intended workflow)

1. Ask the agent to read `CLAUDE.md` and the relevant context file
2. Describe the feature — the agent knows where files go, what patterns to use, and which UI components are available
3. The agent runs `just build && just lint` to verify before finishing
4. Review the diff

No folder corrections. No import style debates. No state management arguments.

---

## Tech decisions worth knowing

**Tailwind v3 is pinned.** Tailwind v4 rewrites the PostCSS plugin format and breaks shadcn's CSS variable system. The pin prevents an accidental upgrade.

**`components.json` is pre-configured.** You don't need to run `npx shadcn init` — the config is already there. Just run `just add-ui <name>`.

**`eslint-plugin-import-x` instead of `eslint-plugin-import`.** The original plugin doesn't support ESLint v10. `import-x` is the maintained fork with identical rule names.

**`.npmrc` sets `legacy-peer-deps=true`.** Required so the shadcn CLI can install Radix UI packages without peer dependency resolution errors against ESLint v10.

**`src/components/ui/` is excluded from strict ESLint.** shadcn components are generated files — linting them against `strictTypeChecked` produces errors in code you're not supposed to edit.
