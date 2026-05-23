# CSS Guide

## Structure

All custom CSS lives in `src/styles/`. `src/index.css` contains only the three `@tailwind` directives. All style files are imported in cascade order from `src/main.tsx`.

**Never add CSS directly to `src/index.css`.**

---

## File Map

| File | Owns these classes |
|---|---|
| `src/styles/tokens.css` | `:root` design tokens, `html.light` token overrides |
| `src/styles/base.css` | `*, html, body, #root`, `.app` shell |
| `src/styles/topbar.css` | `.topbar*`, `.seg*`, `.cap-btn`, `.cap-kbd`, `.inbox-dot`, `.inbox-pill` |
| `src/styles/layout.css` | `.layout`, `.col-who*`, `.settings-btn`, `.who-card*`, `.val-row`, `.prin-row*`, `.col-main`, `.col-mid`, `.sec-hd*`, `.col-tray`, `.tcard*`, `.h-row*`, `.hck*`, `.h-info`, `.h-name`, `.h-streak` |
| `src/styles/focus-card.css` | `.focus-card`, `.f-*`, `.chip*`, `.streak`, `.sd*`, `.fd-meta*`, `.fd-tags-input` |
| `src/styles/what-view.css` | `.what-view`, `.what-col*`, `.list-*`, `.l-*`, `.hl-*`, `.hd*` (streak dots), `.add-*` |
| `src/styles/who-view.css` | `.who-view`, `.vf-*`, `.vd-*`, `.pf-*` |
| `src/styles/overlays/capture.css` | `.cap-overlay`, `.cap-card`, `.cap-*`, `.rpill*` |
| `src/styles/overlays/focus-detail.css` | `.fd-overlay`, `.fd-card`, `.fd-*`, `.td-*` |
| `src/styles/overlays/habit-detail.css` | `.hbd-*` |
| `src/styles/overlays/inbox.css` | `.ibx-*` |
| `src/styles/overlays/principle-detail.css` | `.pd-*` |
| `src/styles/overlays/settings.css` | `.settings-*`, `.theme-*` |
| `src/styles/responsive.css` | All `@media` breakpoints |
| `src/styles/platform.css` | `.is-tauri` Tauri desktop overrides |

---

## Adding styles for a new feature

1. Identify which file owns the component's namespace (see table above).
2. Add to that file. If no existing file fits, create `src/styles/<feature>.css`.
3. Add the new `@import` to `src/main.tsx` in a logical position (before `responsive.css`).
4. Co-locate light-theme overrides in the same file, directly after the dark-mode rules.

---

## Adding a new overlay

New overlays follow the pattern in `src/styles/overlays/`. Create `src/styles/overlays/<name>.css` and:
- Add a `@import` to `src/main.tsx` after the other overlay imports
- Use a unique class prefix (e.g. `.xo-` for a new "x overlay") to avoid collisions

---

## Light-theme overrides

Light-theme rules live **in the same file as their dark-mode counterparts**, not in a separate block. Place them at the bottom of the file:

```css
/* dark-mode rule */
.cap-overlay { background: rgba(0,0,0,0.6); }

/* light override — same file, bottom of file */
html.light .cap-overlay { background: rgba(0,0,0,0.35); }
```

---

## Design tokens

All colors come from CSS variables defined in `src/styles/tokens.css`. Never hardcode hex or rgba values in component files — use the token variables:

| Token | Use |
|---|---|
| `var(--bg)` | Page / panel background |
| `var(--bg-card)` | Card surface |
| `var(--bg-hover)` | Hover state |
| `var(--bg-active)` | Active / selected state |
| `var(--border)` | Subtle dividers |
| `var(--border-mid)` | Stronger borders (focus rings, overlays) |
| `var(--ink-1)` | Primary text |
| `var(--ink-2)` | Secondary text |
| `var(--ink-3)` | Muted / placeholder |
| `var(--ink-4)` | Disabled / very subtle |
| `var(--accent)` | Indigo accent |
| `var(--accent-dim)` | Accent tint background |
| `var(--warn)` | Amber warning |
| `var(--warn-dim)` | Warning tint background |
| `var(--g)` | Green (growth/done) |
| `var(--i)` | Indigo (insight) |
| `var(--a)` | Amber (action) |
| `var(--sans)` | DM Sans — body font |
| `var(--mono)` | DM Mono — labels, metadata |
| `var(--serif)` | Instrument Serif — decorative |

---

## Class namespace conventions

Each overlay and view uses a short prefix. Check this list before naming new classes to avoid collisions:

| Prefix | Owner |
|---|---|
| `topbar-`, `seg-`, `cap-btn`, `cap-kbd` | Topbar |
| `col-`, `who-card`, `val-`, `prin-`, `tcard`, `h-row`, `hck`, `h-` | Layout |
| `focus-card`, `f-`, `ft-`, `chip`, `streak`, `sd` | Focus card |
| `what-`, `list-`, `l-`, `hl-`, `hd`, `add-` | What view |
| `who-`, `vf-`, `vd-`, `pf-` | Who view |
| `cap-` (overlay), `rpill` | Capture overlay |
| `fd-`, `td-` | Focus detail overlay |
| `hbd-` | Habit detail overlay |
| `ibx-` | Inbox overlay |
| `pd-` | Principle detail overlay |
| `settings-`, `theme-` | Settings overlay |
