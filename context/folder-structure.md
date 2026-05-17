# Folder Structure

## Full Tree

```
react-ai-boilerplate/
├── context/                  # AI agent documentation (this folder)
│   ├── agent-instructions.md # START HERE — rules all agents must follow
│   ├── folder-structure.md   # This file
│   ├── coding-rules.md       # TypeScript + code quality rules
│   └── shadcn-guide.md       # How to use shadcn components and themes
│
├── public/                   # Static assets served as-is (favicon, etc.)
│
├── src/
│   ├── app/
│   │   └── providers.tsx     # Root provider wrapper (React Query, Router, Theme, etc.)
│   │                         # Add new global providers here, not in main.tsx
│   │
│   ├── components/
│   │   ├── ui/               # shadcn-generated components (DO NOT edit manually)
│   │   │                     # Add via: just add-ui <component-name>
│   │   └── Counter.tsx       # Example: shared, domain-agnostic UI component
│   │
│   ├── modules/              # Feature-based groupings
│   │   └── <feature>/
│   │       ├── components/   # Components used ONLY by this feature
│   │       ├── hooks/        # Hooks used ONLY by this feature
│   │       └── index.ts      # Public API — only export what external code needs
│   │
│   ├── store/
│   │   └── counter.store.ts  # Example: one Zustand store per domain
│   │                         # Naming: use<Name>Store
│   │
│   ├── lib/
│   │   └── utils.ts          # cn() — the shadcn className utility
│   │                         # Add: pure helper functions with no React/side-effects
│   │
│   ├── hooks/                # Shared React hooks used by 2+ modules
│   │
│   ├── types/
│   │   └── global.d.ts       # Global ambient type declarations
│   │
│   ├── index.css             # Tailwind directives + CSS variable theme
│   └── main.tsx              # React tree root — minimal, just wires providers
│
├── components.json           # shadcn configuration (do not edit manually)
├── tailwind.config.js        # Tailwind v3 config with CSS variable color tokens
├── vite.config.ts            # Vite bundler — defines `@` → `src/` alias
├── tsconfig.json             # TypeScript root (references app + node)
├── tsconfig.app.json         # TypeScript config for src/ (strict mode + path alias)
├── tsconfig.node.json        # TypeScript config for vite.config.ts
├── eslint.config.js          # ESLint flat config (strict TypeScript + import order)
├── justfile                  # Task runner — use `just` to see all commands
└── package.json
```

---

## What Goes Where

### `src/app/`
App-level wiring only. Providers, router setup, global error boundaries.
Nothing domain-specific goes here.

### `src/components/`
Reusable, **domain-agnostic** UI components. A component belongs here if it could be used by any feature.
- `ui/` — shadcn generated (hands off)
- Direct children — custom shared components (e.g., `PageHeader`, `DataTable`)

### `src/modules/<feature>/`
Feature-specific code. Each module is self-contained and exposes a public API via `index.ts`.
```
modules/
  auth/
    components/LoginForm.tsx
    hooks/useAuth.ts
    index.ts              ← export { LoginForm, useAuth }
  dashboard/
    ...
```
Cross-module imports are discouraged. If two modules need the same logic, lift it to `src/lib/`, `src/hooks/`, or `src/store/`.

### `src/store/`
Global Zustand stores. One file per domain.
```ts
// Naming convention:
export const useAuthStore = create<AuthState>()(...)
export const useCartStore = create<CartState>()(...)
```

### `src/lib/`
Pure utilities — no React, no side effects, no imports from `src/components/` or `src/store/`.
Think: functions you could test with `node` directly.

### `src/hooks/`
Shared React hooks used by multiple modules. If a hook is only used by one module, keep it inside `modules/<feature>/hooks/`.

### `src/types/`
Ambient global type declarations (`*.d.ts`). For feature-specific types, keep them co-located in the module.

---

## Import Direction Rules

```
modules/  →  store/, lib/, hooks/, components/
components/  →  lib/, hooks/
store/  →  lib/
hooks/  →  store/, lib/
lib/  →  (nothing internal)
```

**Forbidden patterns:**
- `store/` importing from `components/` or `modules/`
- `lib/` importing from anything in `src/`
- `modules/auth` importing from `modules/dashboard` (use a shared abstraction instead)
