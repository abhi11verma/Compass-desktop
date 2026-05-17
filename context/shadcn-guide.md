# shadcn/ui — Agent Guide

This project is pre-configured for shadcn/ui. Components are added on demand via the CLI.
Read this file before building any UI.

---

## Adding a Component

```bash
just list-ui              # check what's already installed (avoid duplicates)
just add-ui button        # install the button component
just add-ui card          # install the card component
```

The CLI reads `components.json` and places the component in `src/components/ui/<name>.tsx`.
Do **not** copy-paste shadcn source code manually — always use the CLI.

---

## Importing Components

All shadcn components live in `src/components/ui/`. Always use the `@/` alias:

```ts
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

---

## Commonly Used Components

Run `just add-ui <name>` for any of these:

| Component       | Import path                     | Key props / exports                          |
|-----------------|---------------------------------|----------------------------------------------|
| `button`        | `@/components/ui/button`        | `variant`, `size`, `asChild`                 |
| `card`          | `@/components/ui/card`          | `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`, `CardFooter` |
| `input`         | `@/components/ui/input`         | standard input props                         |
| `label`         | `@/components/ui/label`         | `htmlFor`                                    |
| `textarea`      | `@/components/ui/textarea`      | standard textarea props                      |
| `dialog`        | `@/components/ui/dialog`        | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle` |
| `sheet`         | `@/components/ui/sheet`         | `side`, `Sheet`, `SheetTrigger`, `SheetContent` |
| `dropdown-menu` | `@/components/ui/dropdown-menu` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` |
| `select`        | `@/components/ui/select`        | `value`, `onValueChange`, `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` |
| `badge`         | `@/components/ui/badge`         | `variant`                                    |
| `separator`     | `@/components/ui/separator`     | `orientation`                                |
| `avatar`        | `@/components/ui/avatar`        | `Avatar`, `AvatarImage`, `AvatarFallback`    |
| `skeleton`      | `@/components/ui/skeleton`      | layout placeholder                           |
| `toast`         | `@/components/ui/toast`         | use with `useToast` hook from `@/hooks/use-toast` |
| `tabs`          | `@/components/ui/tabs`          | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `table`         | `@/components/ui/table`         | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` |
| `form`          | `@/components/ui/form`          | integrates with `react-hook-form`            |

Full list: https://ui.shadcn.com/docs/components

---

## Button Variants (CVA pattern — applies to most components)

```tsx
<Button variant="default">Primary action</Button>
<Button variant="secondary">Secondary action</Button>
<Button variant="destructive">Delete / danger</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost / subtle</Button>
<Button variant="link">Looks like a link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon className="h-4 w-4" /></Button>
```

---

## Customizing with cn()

Use `cn()` from `@/lib/utils` to add conditional classes on top of shadcn defaults:

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

<Button className={cn("w-full mt-4", isLoading && "opacity-50 pointer-events-none")}>
  Submit
</Button>
```

Do **not** edit files in `src/components/ui/` — they are owned by shadcn and will be overwritten on updates.
Customize entirely via `className` prop + `cn()`.

---

## Applying / Changing a Theme

The entire color theme lives in CSS variables in `src/index.css`. No component code needs to change.

### Switch to a different base palette

```bash
just apply-theme zinc      # switch to zinc palette
just apply-theme blue      # switch to blue palette
just apply-theme rose      # switch to rose palette
```

Available base colors:
`slate` | `gray` | `zinc` | `neutral` | `stone` | `red` | `rose` | `orange` | `green` | `blue` | `yellow` | `violet`

This regenerates the `:root` and `.dark` CSS variable blocks in `src/index.css` while preserving everything else.

### Manual theme customization

Edit CSS variable values directly in `src/index.css`:

```css
:root {
  --primary: 262.1 83.3% 57.8%;       /* hsl values only — no hsl() wrapper */
  --primary-foreground: 210 20% 98%;
  --radius: 0.75rem;                   /* controls lg/md/sm border-radius tokens */
}
```

### Theme variable reference

| Variable | Controls |
|---|---|
| `--background` / `--foreground` | Page background + body text |
| `--primary` / `--primary-foreground` | Primary buttons, active states |
| `--secondary` / `--secondary-foreground` | Secondary buttons, badges |
| `--muted` / `--muted-foreground` | Disabled states, placeholder text, hints |
| `--accent` / `--accent-foreground` | Hover highlights |
| `--destructive` / `--destructive-foreground` | Error states, delete actions |
| `--card` / `--card-foreground` | Card backgrounds |
| `--popover` / `--popover-foreground` | Dropdown, tooltip backgrounds |
| `--border` | All borders and dividers |
| `--input` | Input field borders |
| `--ring` | Focus ring color |
| `--radius` | Base border-radius (lg/md/sm scale off this) |

---

## Dark Mode

Dark mode is class-based (`darkMode: ["class"]` in `tailwind.config.js`).

Toggle by adding/removing `class="dark"` on the `<html>` element:

```tsx
// Simple toggle using Zustand
import { useThemeStore } from "@/store/theme.store";

document.documentElement.classList.toggle("dark", isDark);
```

All shadcn components respond to dark mode automatically via the CSS variable system.
