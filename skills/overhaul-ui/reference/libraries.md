# Library picks

Opinionated defaults so you stop re-litigating solved problems. If
[`pick-ui-library`](https://github.com/emilkowalski/skills) (Emil Kowalski) is
installed, defer to it — it is the source this table converges with.

**Check `package.json` first.** If the project already uses a competitor, flag the
recommendation but do not churn the dependency without being asked.

---

## Behaviour and primitives

| Task | Pick | Why | Alternatives |
|---|---|---|---|
| Accessible primitives | **Base UI** or **Radix Primitives** | Full keyboard/ARIA contract, unstyled, `--transform-origin` for correct popover motion | React Aria (most rigorous), Ark UI (multi-framework), Headless UI |
| Anchored positioning | **Floating UI** | Collision detection, flip, shift, arrow. Or native CSS anchor positioning where support allows | Popper (legacy) |
| Toasts | **Sonner** | Great defaults, swipe-to-dismiss, stacking, timer pause on blur | react-hot-toast |
| Drawer / bottom sheet | **Vaul** | Velocity-based dismissal, damping at boundaries, correct nested scroll | Radix Dialog + custom gestures |
| Command menu | **cmdk** | Fuzzy filtering, groups, correct keyboard model | kbar |
| Dropdown/select/dialog/tabs | **Base UI / Radix** | Don't hand-roll a listbox | — |
| Copy-in component set | **shadcn/ui** | You own the code. **Restyle the tokens before shipping** | — |

## Motion

| Task | Pick | Why |
|---|---|---|
| General animation (React) | **Motion** (formerly Framer Motion) | Springs, layout animations, gestures, `useReducedMotion` |
| Predetermined animation | **CSS** | Off the main thread; survives a busy page. Don't reach for a library |
| Scroll-linked | **CSS scroll-driven animations** | `animation-timeline: view()` / `scroll()`. No listener, no jank |
| Complex timelines / scrub | **GSAP** (+ ScrollTrigger) | Now free including plugins. Best for marketing choreography |
| React Native | **Reanimated 3** + **Gesture Handler** | Worklets on the UI thread |
| Vue | **@vueuse/motion** or native `<Transition>` | — |
| Lottie | **lottie-web / dotlottie** | Only for illustrated motion a designer authored. Heavy — audit the JSON size |
| Numbers / counters | **NumberFlow** | Correct digit transitions, tabular alignment, locale-aware |
| List reordering | **Motion `layout`** or Svelte `animate:flip` | FLIP done properly |

## Data and rendering

| Task | Pick | Why |
|---|---|---|
| Charts | **Recharts** (simple), **visx** (custom), **ECharts** (dense/large), **Observable Plot** (exploratory) | See `reference/data-viz.md` |
| Tables | **TanStack Table** | Headless: sorting, grouping, pagination, column sizing. You own the markup |
| Virtualisation | **TanStack Virtual** or **Virtuoso** | Variable heights handled correctly |
| Drag and drop | **dnd-kit** | Accessible by default, keyboard support included (SC 2.5.7) |
| Rich text | **Tiptap** (ProseMirror) or **Lexical** | — |
| Code editor / viewer | **CodeMirror 6** (editable), **Shiki** (static highlight) | Shiki is build-time, zero runtime cost |
| Date picking | **react-day-picker** + `Intl`/`Temporal` | Skip a whole date library |
| Maps | **MapLibre GL** | Open, no vendor lock |

## Forms and data

| Task | Pick | Why |
|---|---|---|
| Forms | **React Hook Form** + **Zod** | Uncontrolled, minimal re-renders, one schema for client+server |
| Server state | **TanStack Query** | Caching, revalidation, optimistic updates, correct loading semantics |
| Client state | **Zustand** (simple) or **Jotai** (atomic) | Reach for context first; most apps need neither |
| Validation shared | **Zod** or **Valibot** | Valibot when bundle size dominates |
| Tables of forms | RHF `useFieldArray` | — |

## Styling and assets

| Task | Pick | Why |
|---|---|---|
| Styling | **Tailwind v4** | Or CSS Modules for framework-agnostic work |
| Class merging | **clsx** + **tailwind-merge** (`cn()`) | Consumer overrides actually win |
| Variants | **cva** or **tailwind-variants** | Typed variant APIs |
| Icons | **Lucide** (default), **Phosphor** (more weights), **Radix Icons** (15px UI), **Iconoir** | One family, one stroke weight. Never an icon font |
| Fonts | **Fontsource** (self-host) or `next/font` | Metric-matched fallbacks, no third-party request |
| Illustration | Commission it, or use geometric primitives | Stock 3D blobs are a slop tell |

## Tooling

| Task | Pick |
|---|---|
| Accessibility testing | axe DevTools, `@axe-core/playwright`, `eslint-plugin-jsx-a11y` |
| Visual regression | Playwright screenshots, or Chromatic with Storybook |
| Perf audit | Lighthouse CI, `unlighthouse`, `web-vitals` in production |
| Bundle analysis | `source-map-explorer`, `vite-bundle-visualizer` |
| Component docs | Storybook, or a route in the app itself |
| Contrast | `node scripts/contrast.mjs` in this skill |

---

## Deliberate non-picks

| Avoid | Why | Instead |
|---|---|---|
| Icon fonts (Font Awesome as a font) | FOIT, misalignment, breaks in forced-colors | SVG sprite or per-component SVG |
| moment.js | Huge, mutable, deprecated by its own authors | `Intl`, `Temporal`, `date-fns` scoped imports |
| Full lodash import | Ships everything | `lodash-es` named imports, or plain JS |
| jQuery in a framework app | Fights the framework's DOM ownership | Framework APIs |
| A CSS framework's default theme, untouched | The most recognisable slop tell there is | Restyle the tokens |
| Bootstrap for new work | Dated defaults, hard to de-brand | Tailwind, or plain CSS |
| A carousel library for 3 items | Overkill and usually inaccessible | CSS scroll-snap + scroll buttons |
| An animation library for a hover state | Bundle cost for something CSS does better | CSS transition |
| A 200KB modal library | `<dialog>` exists | Native dialog, or Radix |
| Auto-generated a11y "overlay" widgets | Do not fix underlying issues; often make things worse | Fix the markup |

---

## Adding a dependency: the four questions

1. **Can the platform do it?** `<dialog>`, `popover`, `<details>`, `Intl`, `scroll-snap`, `anchor-name`, container queries and view transitions have absorbed a lot of former library territory.
2. **What does it cost?** Check bundlephobia. A 90KB gzip dependency for one feature is rarely worth it.
3. **Is it maintained?** Last release, open issue trend, whether it supports the current framework version.
4. **Does it own the DOM I need?** Headless libraries (TanStack, Radix, dnd-kit) let you keep design control. Styled libraries take it away.

Pin exact versions for anything design-critical — a minor bump that changes a default
duration or a border radius is a visual regression you did not review.
