# Codex Agent — Project Guide

## Stack

| Layer | Tool |
|---|---|
| Bundler | Vite 8 + React 19 + TypeScript 6 (strict) |
| Styling | Tailwind CSS v3 + shadcn/ui (CSS variable theme) |
| State | Zustand v5 |
| Linting | ESLint 10 flat config (`eslint-plugin-import-x`, `typescript-eslint strictTypeChecked`) |
| Task runner | `just` — run `just` to list all commands |

## Read These First

Detailed rules live in `/context/`. Read the relevant file before starting any task:

| File | Read when... |
|---|---|
| [`context/agent-instructions.md`](context/agent-instructions.md) | Before writing any code — non-negotiable rules |
| [`context/folder-structure.md`](context/folder-structure.md) | Deciding where a new file goes |
| [`context/coding-rules.md`](context/coding-rules.md) | TypeScript, imports, component conventions |
| [`context/shadcn-guide.md`](context/shadcn-guide.md) | Adding UI components or changing the theme |

## Critical Rules (inline summary)

- **`@/` alias always** — never use `../` to cross folder boundaries
- **Named exports only** — no `export default`
- **No `any`** — use `unknown` + type narrowing
- **Global state** → `src/store/` (Zustand). Local UI state → `useState`
- **UI components** → run `just add-ui <name>` then import from `@/components/ui/<name>`
- **Colors** → CSS variable tokens only (`text-foreground`, `bg-primary`). Never hardcode hex/rgb
- **No new dependencies** without explicit user approval

## Starting a New Project

The repo includes a sample Task Manager app. Before building anything, check whether it has been cleaned:

```bash
ls src/components/TaskManager.tsx 2>/dev/null && echo "NEEDS CLEANING" || echo "already clean"
```

If the file exists, run:

```bash
just new
```

This removes all example files (`Counter.tsx`, `TaskManager.tsx`, `counter.store.ts`, `tasks.store.ts`, `src/components/ui/`) and resets `src/main.tsx` to a blank shell. Do this before writing any project code.

## Verification — Run Before Finishing Any Task

```bash
just build    # must exit 0 (tsc + vite)
just lint     # must exit 0
```

Do not mark a task done if either command fails.

## Key Commands

```bash
just dev                   # start dev server
just build                 # tsc + vite build
just lint                  # eslint
just add-ui button         # add a shadcn component
just list-ui               # see installed components
just apply-theme zinc      # swap the color palette
```

## Folder Quick-Reference

```
src/
  app/          # global providers — add providers here, not in main.tsx
  components/   # shared UI; ui/ is shadcn-generated (do not edit manually)
  modules/      # feature code — each module exposes a public index.ts
  store/        # Zustand stores, one file per domain
  lib/          # pure utilities (no React, no side effects)
  hooks/        # shared hooks used by 2+ modules
  types/        # global ambient type declarations
```

## Folder Placement Rules

| Code type | Destination |
|---|---|
| Reusable UI component | `src/components/` |
| shadcn-generated component | `src/components/ui/` (via CLI only) |
| Feature-specific component | `src/modules/<feature>/components/` |
| Global Zustand store | `src/store/<name>.store.ts` |
| Pure helper / utility | `src/lib/` |
| Shared hook (2+ modules) | `src/hooks/` |
| Feature-scoped hook | `src/modules/<feature>/hooks/` |
| Global type declaration | `src/types/global.d.ts` |

## Import Direction (enforced by ESLint `import-x/no-cycle`)

```
modules/ → store/, lib/, hooks/, components/
components/ → lib/, hooks/
store/ → lib/
hooks/ → store/, lib/
lib/ → (nothing internal)
```

Cross-module imports (`modules/auth` → `modules/chat`) are forbidden. Lift shared logic to `lib/`, `hooks/`, or `store/` instead.
