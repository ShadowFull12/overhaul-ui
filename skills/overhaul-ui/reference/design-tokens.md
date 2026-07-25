# Design tokens

Tokens exist so a decision is made once. If a component hardcodes a hex value, the
decision has been made twice and one of them will drift.

---

## 1. Three tiers

| Tier | Name | Example | Referenced by |
|---|---|---|---|
| 1 | **Primitive** — raw values, no meaning | `--n-700: oklch(0.385 0.013 260)` | Only tier 2 |
| 2 | **Semantic** — role in the system | `--fg-muted: var(--n-600)` | Components |
| 3 | **Component** — one component's need | `--button-primary-bg: var(--accent)` | That component |

**Components reference tier 2 or 3. Never tier 1.** This is the rule that makes
theming possible: swap tier 2, and every component follows. If a component references
`--n-700` directly, dark mode requires editing the component.

Tier 3 is optional. Add it only when a component needs a value the semantic layer
does not express.

---

## 2. Naming

`--<category>-<role>-<variant>-<state>`

```
--bg                --bg-subtle          --bg-elevated       --bg-inset
--fg                --fg-muted           --fg-subtle         --fg-on-accent
--border            --border-strong      --border-focus
--accent            --accent-hover       --accent-active     --accent-subtle
--danger            --danger-bg          --danger-border     --danger-fg
--space-1 … --space-16
--text-xs … --text-6xl
--radius-sm --radius-md --radius-lg --radius-full
--shadow-xs --shadow-sm --shadow-md --shadow-lg
--dur-1 … --dur-6
--ease-out --ease-in-out --ease-drawer --ease-linear
--z-base … --z-tooltip
```

**Rules**
- Name by **role**, never by appearance. `--fg-muted`, not `--gray-600`. `--danger`, not `--red`. A token called `--blue-button` that turns green is a bug you cannot fix.
- Never encode the theme in the name. `--bg` works in both themes; `--bg-dark` does not.
- Be consistent about scale direction: numbers ascend with intensity (light → dark for neutrals) or use t-shirt sizes. Do not mix both in one category.
- Singular category names. `--space-4`, not `--spacings-4`.
- `-subtle` = lower emphasis; `-strong` = higher emphasis; `-on-x` = foreground designed to sit on `x`.

---

## 3. Theming

Themes override the **semantic** layer only.

```css
:root {
  color-scheme: light;
  /* primitives */
  --n-0: oklch(0.99 0.002 260); /* … */ --n-1000: oklch(0.115 0.009 260);
  --a-50: oklch(0.97 0.02 258); /* … */ --a-900: oklch(0.30 0.10 258);

  /* semantics — light */
  --bg: var(--n-0);   --bg-subtle: var(--n-50);  --bg-elevated: var(--n-0);
  --fg: var(--n-950); --fg-muted: var(--n-600);
  --border: var(--n-200);
  --accent: var(--a-600); --accent-hover: var(--a-700);
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: var(--n-1000);  --bg-subtle: var(--n-900); --bg-elevated: var(--n-800);
  --fg: var(--n-50);    --fg-muted: var(--n-400);
  --border: var(--n-800);
  --accent: var(--a-500); --accent-hover: var(--a-400);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* repeat the dark block, or use :where() */ }
}
```

**Three-state theme switching** (system / light / dark):
```js
const stored = localStorage.getItem("theme");            // "light" | "dark" | null
const dark = stored ? stored === "dark"
  : matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.theme = dark ? "dark" : "light";
```
Run this **inline in `<head>` before first paint**, or you ship a flash of the wrong
theme. Server-render it from a cookie if you can.

**Multi-brand:** add a `[data-brand]` layer above semantics that swaps the primitive
accent ramp. Components stay untouched.

**Do not transition theme changes.** A 300ms crossfade of every colour on the page is
expensive and looks like a bug. If you must, transition only `background-color` and
`color` on a short duration, and add `.no-transitions` during the swap.

---

## 4. Beyond colour

Tokenise everything that repeats.

```css
:root {
  /* spacing — 4px base */
  --space-0:0; --space-1:.25rem; --space-2:.5rem;  --space-3:.75rem;
  --space-4:1rem; --space-5:1.25rem; --space-6:1.5rem; --space-8:2rem;
  --space-10:2.5rem; --space-12:3rem; --space-16:4rem; --space-20:5rem; --space-24:6rem;

  /* type */
  --text-xs:.75rem;   --text-sm:.8125rem; --text-base:1rem;  --text-lg:1.25rem;
  --text-xl:1.5625rem;--text-2xl:1.9375rem;--text-3xl:2.4375rem;--text-4xl:3.0625rem;
  --leading-tight:1.1; --leading-snug:1.35; --leading-normal:1.55;
  --tracking-tight:-0.02em; --tracking-wide:0.08em;

  /* geometry */
  --radius-xs:.25rem; --radius-sm:.375rem; --radius-md:.5rem;
  --radius-lg:.75rem; --radius-xl:1rem;    --radius-full:9999px;
  --border-width:1px;

  /* motion */
  --dur-1:100ms; --dur-2:150ms; --dur-3:200ms; --dur-4:300ms; --dur-5:400ms;
  --ease-out:cubic-bezier(.23,1,.32,1);
  --ease-in-out:cubic-bezier(.77,0,.175,1);

  /* layout */
  --container-prose:45rem; --container-app:75rem; --container-wide:90rem;
  --nav-h:3.5rem; --sidebar-w:16rem;

  /* elevation */
  --z-sticky:20; --z-header:40; --z-modal:60; --z-toast:80; --z-tooltip:90;
}
```

Generate the numeric scales rather than hand-writing them:
`node scripts/tokens.mjs --brand="#2C6E49" --format=css`.

---

## 5. Stack integration

### Tailwind v4 (CSS-first)
```css
@import "tailwindcss";

@theme {
  --color-bg: oklch(0.99 0.002 260);
  --color-fg: oklch(0.16 0.011 260);
  --color-accent: oklch(0.55 0.17 258);
  --font-display: "Instrument Serif", ui-serif, serif;
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --text-4xl: 3.0625rem;
  --radius-lg: 0.75rem;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```
`@theme` entries become both CSS variables and utilities (`bg-bg`, `text-fg`,
`font-display`, `ease-out`). Use `@theme inline` when a token must reference another
runtime variable. There is no `tailwind.config.js` in v4 unless you opt in.

### Tailwind v3
```js
// tailwind.config.js — reference CSS vars so themes still work at runtime
theme: { extend: {
  colors: { bg: "var(--bg)", fg: "var(--fg)", accent: "var(--accent)" },
  borderRadius: { lg: "var(--radius-lg)" },
  transitionTimingFunction: { out: "var(--ease-out)" },
}}
```
Do not hardcode hex values in the config if you support theming — you lose runtime
switching.

### CSS Modules / vanilla
Import one `tokens.css` at the root. Components reference `var(--…)` only.

### React Native / Expo
No CSS variables. Export a TS object and a `useTheme()` hook:
```ts
export const tokens = {
  color: { bg: "#FCFCFD", fg: "#111318", accent: "#2F5FD0" },
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
  radius: { sm: 6, md: 10, lg: 16, full: 9999 },
  text: { sm: 13, base: 16, lg: 20 },
} as const;
```
Use `useColorScheme()` for the theme, and never hardcode a colour in a `StyleSheet`.

### Cross-platform source of truth
For multi-platform products, author tokens in JSON following the
[DTCG format](https://tr.designtokens.org/) and build per-platform output with Style
Dictionary or Terrazzo. Overkill for a single web app.

---

## 6. Hygiene

- **One source of truth.** If tokens live in both a CSS file and a JS object, they will diverge. Generate one from the other.
- **No magic numbers in components.** If you need `13px`, either add it to the scale or use the nearest existing step.
- **Grep before adding.** A new token that duplicates an existing one is worse than reusing an imperfect match.
- **Delete unused tokens.** A 400-token file where 90 are used is not a system.
- **Document the intent**, not the value: "`--bg-subtle`: page-level alternating sections and table stripes."
- **Version deliberately.** Renaming a semantic token is a breaking change for every consumer.
- **Keep the count small.** 12 neutrals + 9 accent + 12 semantic roles + 4 scales covers most products. A system nobody can hold in their head gets bypassed.
