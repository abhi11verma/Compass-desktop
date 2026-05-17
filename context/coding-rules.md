# Coding Rules

These rules are enforced by ESLint and TypeScript. Violations will fail `just lint` and `just build`.
Run `just lint` before considering any task complete.

---

## TypeScript

**Strict mode is on.** The following flags are active in `tsconfig.app.json`:
- `strict: true` — enables all strict checks (noImplicitAny, strictNullChecks, etc.)
- `noUnusedLocals`, `noUnusedParameters` — no dead code
- `noUncheckedIndexedAccess` — `arr[i]` is typed as `T | undefined`, not `T`
- `noFallthroughCasesInSwitch` — exhaustive switch cases

**No `any`.** Use `unknown` + type narrowing or define a proper interface.

**`import type` for type-only imports.** `verbatimModuleSyntax` is enabled — TypeScript will error if you use a regular import for a type-only value.
```ts
// CORRECT
import type { FC } from "react";
import { type ReactNode, useState } from "react";

// WRONG (TypeScript will reject this with verbatimModuleSyntax)
import { FC } from "react";
```

**Explicit return types** on exported functions are encouraged. On internal helpers, inference is fine.

---

## Components

**Named exports only.** No `export default`.

**Props interface co-located.** Define props in the same file unless they're shared across multiple files (then move to `src/types/`).
```ts
interface CounterProps {
  initialCount?: number;
}

export function Counter({ initialCount = 0 }: CounterProps) { ... }
```

**No inline styles.** Use Tailwind classes. For complex conditional classes, use `cn()`:
```ts
import { cn } from "@/lib/utils";

<div className={cn("base-classes", isActive && "active-classes", variant === "ghost" && "ghost-classes")} />
```

**File size.** If a component file exceeds ~150 lines, consider splitting into sub-components or extracting logic to a custom hook.

---

## Imports

**`@/` alias always.** Never use `../` to cross folder boundaries.

**No circular dependencies.** `import/no-cycle` is set to `error`. Fix cycles by extracting shared code.

**Import order** (enforced by ESLint — violations auto-fixable with `eslint --fix`):
1. Node built-ins (`path`, `fs`)
2. External packages (`react`, `zustand`, `clsx`)
3. Internal alias imports (`@/store/...`, `@/components/...`)
4. Parent-relative (`../`)
5. Sibling-relative (`./`)
6. Type imports (last)

Blank lines between groups are required:
```ts
import { useState } from "react";            // external

import { useCounterStore } from "@/store/counter.store"; // internal alias

import { cn } from "./utils";                // sibling
```

---

## State Management

| State type | Where it lives | How |
|---|---|---|
| Global app state | `src/store/` | Zustand |
| Local UI state | Inside component | `useState` |
| Server/async data | TBD (add TanStack Query when needed) | Never in Zustand |
| Form state | Inside form component | `useState` or form library |

Never store derived values in Zustand — compute them from state instead.
Never put async data fetching results directly in Zustand without a caching layer.

---

## Adding shadcn Components

See `context/shadcn-guide.md` for the complete reference.

Short version:
```bash
just list-ui              # check what's already installed
just add-ui button        # add a component
```

Import from `@/components/ui/<name>`. Never modify files inside `src/components/ui/` directly.

---

## Simplicity Over Cleverness

- Three similar lines is better than a premature abstraction
- One obvious implementation is better than two clever ones
- No partial implementations — either the feature is complete or it isn't
- No feature flags, backwards-compat shims, or unused code

---

## No Comments for the Obvious

Only add a comment when the WHY is non-obvious: a hidden constraint, a workaround for a specific bug, a subtle invariant.
```ts
// USEFUL: explains a non-obvious constraint
// Zustand v5 requires the outer () for correct middleware type inference
const useStore = create<State>()((set) => ({ ... }));

// USELESS: just describes what the code does
// Increment the count by 1
increment: () => set((state) => ({ count: state.count + 1 })),
```
