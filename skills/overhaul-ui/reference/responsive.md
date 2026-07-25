# Responsive and adaptive

---

## 1. Order of tools

Reach for these in order. Most "responsive" code is media queries doing a job a
simpler tool does better.

1. **Intrinsic layout** — `flex-wrap`, `auto-fit` grids, `min()`/`max()`/`clamp()`. No breakpoints needed.
2. **Container queries** — the component adapts to its own space, wherever it is placed.
3. **Media queries** — for genuinely page-level changes (sidebar → drawer, columns → stack).
4. **JS** — only for behaviour that CSS cannot express (virtualisation thresholds, gesture handlers).

```css
/* 1. intrinsic — no breakpoint */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}

/* 2. container query — component-level */
.card-host { container-type: inline-size; container-name: card; }
@container card (min-width: 28rem) {
  .card { grid-template-columns: 8rem 1fr; align-items: start; }
}

/* container query units: cqw cqh cqi cqb cqmin cqmax */
@container card (min-width: 20rem) { .card-title { font-size: clamp(1rem, 4cqi, 1.5rem); } }
```

Container queries are the right default for anything reusable. A card that renders in a
sidebar, a modal and a full-width grid cannot be correctly sized by viewport width.

---

## 2. Breakpoints

Only when the *page* structure changes.

```css
--bp-sm:  40rem;   /* 640px  — large phone landscape */
--bp-md:  48rem;   /* 768px  — tablet portrait */
--bp-lg:  64rem;   /* 1024px — tablet landscape / small laptop */
--bp-xl:  80rem;   /* 1280px — desktop */
--bp-2xl: 96rem;   /* 1536px — large desktop */
```

- **Mobile-first**: base styles are the smallest layout; `min-width` queries add complexity.
- Use `rem` so breakpoints respond to the user's font size.
- Do not invent per-component breakpoints — that is what container queries are for.
- Never target devices ("iPad"). Target the layout's actual breaking point: resize until it breaks, put the breakpoint there.
- 3–4 breakpoints is plenty. Six means the layout is being micromanaged.

---

## 3. Fluid values

```css
/* clamp(min, preferred, max) — always keep a rem term in the middle */
--space-section: clamp(3rem, 8vw, 8rem);
--text-display: clamp(2.25rem, 1.2rem + 4.8vw, 4.75rem);
--gutter: clamp(1rem, 4vw, 2.5rem);
```

`clamp(2rem, 5vw, 4rem)` — no `rem` term — ignores user zoom and violates SC 1.4.4.
Always include one.

Use fluid values for **display type, section padding and gutters**. Keep **body text
fixed** — fluid body text produces bad measures and surprises users who have set a
preferred size.

---

## 4. Viewport units

```css
.hero { min-height: 100svh; }   /* small  — smallest viewport, no jump when chrome hides */
/* 100dvh — dynamic, resizes with browser chrome; causes reflow while scrolling on iOS */
/* 100lvh — large, the full viewport with chrome hidden */
```
`100vh` on mobile is taller than the visible area and pushes content under the browser
chrome. Prefer `100svh` for anything that must fit, `100dvh` only when the reflow is
acceptable.

For a real full-height app shell:
```css
html, body, #root { height: 100%; }
.app { display: grid; grid-template-rows: auto 1fr auto; min-height: 100svh; }
```

---

## 5. Input modality

Adapt to capability, not to screen size. A touchscreen laptop is both.

```css
@media (hover: hover) and (pointer: fine)   { /* mouse: hover effects allowed */ }
@media (hover: none)  and (pointer: coarse) { /* touch: bigger targets, no hover-only affordances */ }
@media (any-pointer: coarse) { .btn { min-height: 44px; } }
```

- Hover effects must be enhancements. Anything hover-only is invisible on touch and to keyboard users.
- Touch targets >= 44×44 CSS px (WCAG 2.2 floor is 24×24; 44 is the usable bar).
- Spacing between adjacent targets >= 8px so fat fingers do not misfire.
- Place primary mobile actions in the lower half of the screen — the thumb zone.
- No `:hover`-triggered menus on touch. Tap to open, tap outside to close.

---

## 6. Other user preferences

```css
@media (prefers-reduced-motion: reduce)      { /* see reference/motion.md */ }
@media (prefers-color-scheme: dark)          { /* see reference/color.md */ }
@media (prefers-contrast: more)              { :root { --border: var(--n-500); } }
@media (prefers-reduced-transparency: reduce){ .glass { backdrop-filter: none; background: var(--bg-elevated); } }
@media (prefers-reduced-data: reduce)        { /* skip decorative media */ }
@media (forced-colors: active)               { /* Windows High Contrast — use system keywords */ }
@media (scripting: none)                     { /* no-JS fallback */ }
@media print                                 { /* strip nav, expand content, black on white */ }
```

Print styles are two minutes of work and consistently forgotten. Any page a user might
save (invoice, recipe, report, docs) deserves them.

---

## 7. Logical properties and RTL

Use logical properties everywhere. They are the same length to type and they make RTL
free.

| Physical | Logical |
|---|---|
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `width` / `height` | `inline-size` / `block-size` |
| `text-align: left` | `text-align: start` |
| `border-top` | `border-block-start` |

RTL specifics that logical properties do **not** fix:
- Icons implying direction (arrows, chevrons, back buttons) must mirror: `[dir="rtl"] .chevron { scale: -1 1; }`
- Icons that must **not** mirror: clocks, media play buttons, checkmarks, logos, phone handsets.
- Numbers and code stay LTR — wrap in `<span dir="ltr">`.
- Shadows and gradients with a direction need mirroring.
- Test with `<html dir="rtl">` and real Arabic or Hebrew text, not reversed Latin.

---

## 8. Mobile web specifics

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
Never `user-scalable=no` or `maximum-scale=1` — both break SC 1.4.4.

```css
/* safe areas — required when viewport-fit=cover */
.bottom-bar { padding-block-end: max(1rem, env(safe-area-inset-bottom)); }
.header     { padding-block-start: max(0.75rem, env(safe-area-inset-top)); }

/* stop iOS zooming the page on input focus */
input, select, textarea { font-size: max(16px, 1rem); }

/* momentum + no scroll chaining out of a panel */
.panel { overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }

/* virtual keyboard */
/* CSS: interactive-widget=resizes-content in the viewport meta, or JS visualViewport */
```
Also: `touch-action: manipulation` to remove the 300ms tap delay; `-webkit-tap-highlight-color: transparent` paired with a real `:active` state (never remove the highlight without replacing the feedback).

---

## 9. Testing matrix

| Width | Represents | Check |
|---|---|---|
| 320px | Smallest supported (SC 1.4.10) | No horizontal scroll, nothing clipped |
| 375px | Common phone | Real content, real text lengths |
| 390–430px | Modern phone | Safe areas, thumb reach |
| 768px | Tablet portrait | The awkward middle — usually the worst layout |
| 1024px | Tablet landscape / small laptop | Hero visible without scrolling |
| 1440px | Desktop | Content not stretched into unreadable lines |
| 1920px+ | Large desktop | Max-width holds; no 200ch paragraphs |

Also test: landscape phone (short viewport — modals and heroes break here), 200% browser
zoom, 400% zoom at 1280px, and the longest translation you support.

---

## 10. Failure table

| Symptom | Cause | Fix |
|---|---|---|
| Horizontal scroll on mobile | A fixed-width child, or `100vw` with a scrollbar | `max-inline-size: 100%`, `min-width: 0` on flex/grid children |
| Grid overflows below 288px | `minmax(18rem, 1fr)` | `minmax(min(18rem, 100%), 1fr)` |
| Hero cut off on iOS | `100vh` | `100svh` |
| Page zooms when tapping an input | Font size under 16px | `font-size: max(16px, 1rem)` |
| Fixed CTA under the home indicator | No safe area | `env(safe-area-inset-bottom)` |
| Text unreadable at 1920px | No max-width on prose | 65–75ch measure |
| Component wrong inside a sidebar | Viewport media queries | Container queries |
| Layout breaks at 200% zoom | `px` breakpoints and fixed heights | `rem` breakpoints, `min-height` |
| Long German label overflows | Layout assumes English | Allow wrapping, test at 1.4× length |
| Flex child won't shrink | Default `min-width: auto` | `min-width: 0` |
