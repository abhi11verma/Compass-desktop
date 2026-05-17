# Agent Instructions

This file is read by AI coding agents (Claude Code, Cursor, Copilot, etc.) when working in this repository.
Read this file before writing any code.

---

## Project Identity

AI-First Minimal React Boilerplate. The goal is a clean, well-typed, minimal foundation — not a feature-complete app.
Resist adding dependencies unless they solve a concrete problem the existing stack cannot handle.

---

## Non-Negotiable Rules

### 1. Path Alias
Always use `@/` for imports from `src/`. Never use relative paths like `../../` to cross folder boundaries.
```ts
// CORRECT
import { useCounterStore } from "@/store/counter.store";

// WRONG
import { useCounterStore } from "../../store/counter.store";
```

### 2. Named Exports Only
Never use `export default` for components, stores, or utilities.
```ts
// CORRECT
export function Counter() { ... }

// WRONG
export default function Counter() { ... }
```

### 3. No `any`
TypeScript strict mode is enforced. ESLint will reject `any`. Use `unknown` + type narrowing.
```ts
// CORRECT
function parse(value: unknown): string {
  if (typeof value === "string") return value;
  throw new Error("Expected string");
}

// WRONG
function parse(value: any): string { return value; }
```

### 4. Place Code in the Right Folder
See `context/folder-structure.md` for exact rules. Short version:
- UI components → `src/components/`
- Feature logic → `src/modules/<feature>/`
- Global state → `src/store/`
- Pure utilities → `src/lib/`
- Shared hooks → `src/hooks/`

### 5. shadcn Components
Before building any UI component, check if shadcn provides it:
```bash
just list-ui           # see what's already installed
just add-ui button     # install a component
```
Import from `@/components/ui/<name>`. Never hand-write shadcn components.
For full usage guide: `context/shadcn-guide.md`

### 6. Zustand for Global State
All global state lives in `src/store/`. One file per domain. Pattern: `useXxxStore`.
Local UI state (open/closed, hovered) → `useState` inside the component.
Never put Zustand stores inside `modules/` or `components/`.

### 7. No Circular Imports
`eslint-plugin-import` enforces `import/no-cycle`. If your import creates a cycle, restructure — don't suppress the rule.

### 8. CSS Variable Tokens Only
Use Tailwind CSS variable tokens for all color styling. Never hardcode colors.
```tsx
// CORRECT
<div className="bg-background text-foreground border-border">

// WRONG
<div className="bg-white text-gray-900 border-gray-200">
<div style={{ backgroundColor: "#fff" }}>
```

### 9. No New Dependencies Without Explicit Permission
If a feature needs a library not already in `package.json`, ask the user before installing.
Exception: shadcn components added via `just add-ui` are always allowed.

---

## Before Starting Any Task

1. Read the relevant section of `context/folder-structure.md`
2. Check if a shadcn component covers the UI need (`just list-ui`)
3. Check if a utility in `src/lib/` already does what you need
4. Check for existing patterns in nearby files

## Commit Message Format

Use Conventional Commits:
- `feat:` — new capability
- `fix:` — bug fix
- `chore:` — tooling, config, deps
- `refactor:` — internal restructure, no behavior change
- `docs:` — documentation only
