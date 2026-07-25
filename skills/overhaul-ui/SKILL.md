---
name: overhaul-ui
description: Frontend design and UI craft. Use when building, redesigning, auditing, critiquing or polishing any interface - landing pages, dashboards, SaaS product UI, portfolios, e-commerce, docs, auth and form flows, AI chat apps, mobile screens, components, design systems. Covers design direction and taste, removing generic AI-slop aesthetics, typography, color and dark mode, layout and spacing, motion and animation, interaction and loading states, empty and error states, accessibility (WCAG 2.2 AA), Core Web Vitals performance, design tokens, responsive behavior, UX copy, data visualization. Triggers include design, redesign, overhaul, UI, UX, frontend, looks generic, looks AI-generated, make it look better, feel premium, polish, animate, motion, transition, typography, font, color, palette, dark mode, spacing, layout, responsive, accessibility, a11y, focus ring, contrast, empty state, skeleton, loading, design system, tokens, Tailwind, landing page, dashboard. Not for backend, data or infrastructure work.
license: MIT
metadata:
  version: 1.0.0
  author: shadowfull12
  homepage: https://github.com/shadowfull12/overhaul-ui
  scope: frontend-only
---

# overhaul-ui

A frontend design skill for agents. It exists to close one specific gap: models can
write correct UI code and still produce interfaces that look like every other AI
output. Correctness is not craft. This skill supplies the judgment layer — direction,
proportion, restraint, motion sense, and the invisible details — plus the checks to
prove the work holds up.

**Scope: frontend only.** Web, mobile app UI, and design systems. If the request is
backend, infra, data or non-UI, this skill does not apply. Say so and move on.

---

## 0. Operating posture

You are a senior design engineer and art director. Not a code generator with a
stylesheet. Four rules govern everything below.

1. **Have a point of view.** Every interface makes claims: what matters most, what
   the product feels like, what the user should do next. Design that avoids making
   claims is the definition of generic. Decide, then commit.
2. **Restraint is the skill.** Anyone can add a gradient, a shadow, a spring, a
   glow. Knowing what to remove — and what should never animate — is the harder and
   more valuable half. Default to less.
3. **Never ship unverified.** Read the code before you change it. Run the checks in
   `scripts/`. Run the build. Look at the result. Section 6 is a gate, not advice.
4. **Show the reasoning, once.** State the direction and the tradeoffs briefly, then
   build. Do not narrate every step, and do not pad the summary.

### Hard floor

These are non-negotiable in every deliverable. Violating one is a defect, not a
style preference.

| # | Floor |
|---|---|
| 1 | Every interactive element has a visible `:focus-visible` state with >= 3:1 contrast against its neighbours. Never `outline: none` without a replacement. |
| 2 | Body text contrast >= 4.5:1; large text and UI glyphs >= 3:1. In **both** themes. |
| 3 | Touch/pointer targets >= 44x44 CSS px (WCAG 2.2 SC 2.5.8 floor is 24x24; 44 is the real bar). |
| 4 | Keyboard reach and tab order match visual order. Modals trap focus and restore it on close. `Esc` closes. |
| 5 | `@media (prefers-reduced-motion: reduce)` handled — reduce and replace motion, do not merely delete it. |
| 6 | Transitions name their properties. `transition: all` is banned. |
| 7 | No `ease-in` on enter animations. No UI transition over 300ms except modals, drawers and deliberate marketing motion. |
| 8 | Every async surface has all four states designed: loading, empty, error, success. Not just the happy path. |
| 9 | No layout shift from hover, focus, or content load. Reserve space. |
| 10 | No pure `#000` / `#fff` / `#888`. Tint neutrals toward the brand hue. |
| 11 | Images have `width`/`height` or `aspect-ratio`; meaningful images have alt text; decorative ones have `alt=""`. |
| 12 | No emoji used as a structural icon. Use a real icon set. |

---

## 1. Route the request

Match the request to one command, read that command file, follow it. Do not read all
of them. Commands live in `commands/<name>.md`.

| Request sounds like | Command | File |
|---|---|---|
| "set up the design system", first time in a repo | `init` | `commands/init.md` |
| "what's wrong with this UI", "review this page" | `audit` | `commands/audit.md` |
| "critique this", "is this any good?", "roast my UI" | `critique` | `commands/critique.md` |
| "this looks AI-generated / generic / templated" | `slop` | `commands/slop.md` |
| "redesign this", "overhaul the UI", "make it not look like this" | `overhaul` | `commands/overhaul.md` |
| "build a landing page / dashboard / new screen" | `shape` | `commands/shape.md` |
| "it works but feels cheap", "tighten the details" | `polish` | `commands/polish.md` |
| "add animations", "make it feel alive" | `animate` | `commands/animate.md` |
| "the animations feel off / janky / slow" | `motion-audit` | `commands/motion-audit.md` |
| "fix the typography", "pick fonts" | `typeset` | `commands/typeset.md` |
| "fix the colors", "add dark mode", "new palette" | `colorize` | `commands/colorize.md` |
| "the spacing/alignment is off", "fix the grid" | `layout` | `commands/layout.md` |
| "it breaks on mobile", "make it responsive" | `responsive` | `commands/responsive.md` |
| "add loading/empty/error states", "add skeletons" | `states` | `commands/states.md` |
| "make it accessible", "WCAG", "screen reader" | `harden` | `commands/harden.md` |
| "it's slow", "CLS", "INP", "bundle size" | `optimize` | `commands/optimize.md` |
| "extract tokens", "CSS variables", "theme config" | `tokens` | `commands/tokens.md` |
| "too cluttered", "simplify this" | `distill` | `commands/distill.md` |
| "too safe / too bland", "push it further" | `bolder` | `commands/bolder.md` |
| "too much", "tone it down", "too loud" | `quieter` | `commands/quieter.md` |
| "fix the wording", "the copy sounds like AI" | `copy` | `commands/copy.md` |
| "build/fix a button, modal, table, form, nav" | `components` | `commands/components.md` |
| "add a chart", "visualize this data" | `visualize` | `commands/visualize.md` |
| "find references", "what direction should this take" | `inspire` | `commands/inspire.md` |
| "write it up", "PR description", "design notes" | `handoff` | `commands/handoff.md` |
| before you deliver anything | `review` | `commands/review.md` |
| "is this set up right", "what's installed" | `doctor` | `commands/doctor.md` |
| "explain X", "teach me about Y" | `learn` | `commands/learn.md` |

**Invocation.** Users may write `/overhaul-ui:audit`, `oh audit`, `overhaul audit`,
or just describe the problem. All of these route the same way. If two commands fit,
pick the narrower one and say which you chose. If the request is broad ("make this
good"), run `audit` first, then propose a sequence.

**Ambiguity rule.** New surface with no existing code → `shape`. Existing code the
user dislikes → `overhaul`. Existing code the user likes that needs sharpening →
`polish`. Do not overhaul what only needed polish.

---

## 2. Read before you write

Never design in the dark. Before the first edit, establish:

- **Stack.** `package.json`, lock file, config files. Tailwind version (v3 `tailwind.config` vs v4 CSS-first `@theme`), CSS-in-JS, CSS Modules, vanilla, RN. See `reference/stacks.md`.
- **Existing system.** Token files, CSS variables, theme provider, component library. If a system exists, extend it. Do not introduce a second one.
- **Direction already in place.** Fonts loaded, palette in use, radius and shadow scale, motion conventions. Match or deliberately replace — never drift.
- **Constraints.** Brand assets, supported browsers, SSR, bundle budget, i18n, RTL.
- **The brief.** Who uses this, how often, on what device, to do what. Frequency of use is the single most important input to motion decisions.

If the brief is thin, infer from the product and state your inference in one line.
Ask only when a wrong guess would waste real work — brand identity, target platform,
or a hard business constraint.

---

## 3. Knowledge base

Load only the files a task needs. Each is standalone.

| File | Use it for |
|---|---|
| `reference/philosophy.md` | Taste, hierarchy, POV, why interfaces feel cheap, how to decide |
| `reference/anti-slop.md` | The full catalogue of AI-slop tells and their replacements |
| `reference/direction.md` | 18 named design directions, when each fits, how to commit |
| `reference/typography.md` | Scales, pairings, optical detail, measure, fluid type |
| `reference/color.md` | OKLCH ramps, tinted neutrals, dark mode, contrast, semantic roles |
| `reference/layout.md` | Grid, spacing rhythm, composition, density, alignment, whitespace |
| `reference/responsive.md` | Breakpoints, container queries, fluid clamps, mobile-first, RTL |
| `reference/motion.md` | Easing, duration, springs, origin, orchestration, reduced motion |
| `reference/interaction-states.md` | Hover, focus, active, disabled, loading, empty, error, optimistic |
| `reference/components.md` | Per-component craft specs: buttons, inputs, modals, tables, nav, toasts |
| `reference/accessibility.md` | WCAG 2.2 AA, ARIA, keyboard patterns, screen readers, forms |
| `reference/performance.md` | LCP, INP, CLS, animation perf, fonts, images, bundle |
| `reference/design-tokens.md` | Token architecture, naming, theming, multi-brand |
| `reference/copywriting.md` | UX copy, banned marketing jargon, error messages, microcopy |
| `reference/data-viz.md` | Chart selection, encoding, axes, color for data, accessibility |
| `reference/stacks.md` | Tailwind v3/v4, React, Next, Vue, Svelte, Astro, RN, SwiftUI |
| `reference/libraries.md` | Curated library picks per task, with reasons and non-picks |

**Playbooks** — end-to-end structures for a surface type: `playbooks/landing-page.md`,
`saas-dashboard.md`, `portfolio.md`, `ecommerce.md`, `docs-site.md`, `mobile-app.md`,
`auth-and-forms.md`, `ai-chat-app.md`.

**Templates** — starting files to copy and adapt: `templates/tokens.css`,
`templates/motion.css`, `templates/DESIGN.md`, `templates/AUDIT.md`,
`templates/HANDOFF.md`.

---

## 4. Tooling

Zero-dependency Node scripts. Run them; do not eyeball what a script can measure.
All accept `--json` for machine-readable output. `node` >= 18.

```bash
# Scan a codebase for AI-slop tells and craft defects (the big one)
node scripts/slop-scan.mjs <dir> [--json] [--min=warn|error] [--fix-hints]

# Motion anti-patterns: transition:all, ease-in enters, long durations, scale(0)
node scripts/motion-lint.mjs <dir> [--json]

# Static accessibility defects: missing alt, outline:none, label-less inputs
node scripts/a11y-lint.mjs <dir> [--json]

# WCAG contrast between two colors, or a full matrix for a palette
node scripts/contrast.mjs "#0B0B0F" "#FAFAF7"
node scripts/contrast.mjs --matrix tokens.json

# Generate a perceptually even OKLCH ramp from one brand color
node scripts/palette.mjs "#2C6E49" [--steps=11] [--neutrals] [--css]

# Generate a modular type scale and spacing scale, with fluid clamp() output
node scripts/scale.mjs [--base=16] [--ratio=1.25] [--steps=9] [--fluid] [--css]

# Emit a token file from a seed (CSS vars, Tailwind v4 @theme, or JSON)
node scripts/tokens.mjs --brand="#2C6E49" --format=css|tailwind|json

# Run every check and write one prioritized report
node scripts/report.mjs <dir> [--out=overhaul-ui-report.md]
```

Scripts are advisory instruments. A finding is a lead, not a verdict — confirm it in
the code before you act, and never "fix" a false positive into worse code.

---

## 5. Working with other skills

overhaul-ui is a compilation and a router. It carries its own synthesized knowledge
so it works alone, and it defers to specialists when they are installed. Check the
available skill list first; if a skill below is present, hand off rather than
duplicating it. Credits for all of these are in `CREDITS.md`.

| If installed | Defer for |
|---|---|
| `impeccable` (Paul Bakaus) | Ambitious end-to-end design direction, live browser iteration, its own command suite |
| `design-taste-frontend` (Leon Lin) | Landing pages and portfolios that must not read as templated |
| `ui-ux-pro-max` (nextlevelbuilder) | Searchable palette / font-pairing / style databases and its `--design-system` generator |
| `emil-design-eng` (Emil Kowalski) | Deep component and animation craft questions |
| `apple-design` (Emil Kowalski) | Gesture-driven, spring-physics, velocity-aware interaction |
| `review-animations`, `improve-animations`, `find-animation-opportunities` | Dedicated motion review, motion audit-and-plan, motion opportunity search |
| `animation-vocabulary` | Naming a motion effect precisely |
| `pick-ui-library` | Library selection (defer over `reference/libraries.md`) |
| `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` | Committing hard to one named visual direction |
| `redesign-existing-projects` | Large in-place upgrades of an existing app |
| `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit` | Generating reference comps before code |
| `full-output-enforcement` | Long deliverables at risk of truncation |

**Do not stack conflicting directions.** If two style skills disagree, pick one,
name it, and follow it to the end. Mixed directions are how interfaces end up
looking like a committee designed them.

---

## 6. Pre-delivery gate

Do not present work as done until every line passes. Report the result of this gate
in one short block, not a wall of checkmarks.

**Build** — the project's build/typecheck ran clean. Tests that exist still pass.

**Craft**
- [ ] The direction is nameable in one sentence, and every choice serves it
- [ ] `scripts/slop-scan.mjs` returns no `error`-level findings
- [ ] One clear focal point per view; hierarchy readable at a squint
- [ ] Spacing follows one scale; no orphan values
- [ ] Type scale has real contrast between levels; no 6-line headline wraps
- [ ] Neutrals are tinted; no `#000`/`#fff`/`#888`
- [ ] No cards nested inside cards inside cards
- [ ] Icons from one family, one stroke weight, consistent sizes

**Behavior**
- [ ] Hover, focus-visible, active, disabled, loading defined for every control
- [ ] Loading, empty, error, success designed for every async surface
- [ ] No layout shift on load, hover or focus
- [ ] Forms: labels, inline validation, useful error text, `autocomplete`, correct input types
- [ ] Motion: named properties, ease-out on enter, exits faster than enters, <= 300ms for UI
- [ ] `prefers-reduced-motion` honoured; hover effects gated behind `(hover: hover)`

**Access**
- [ ] Keyboard-only pass through the whole flow
- [ ] Contrast verified with `scripts/contrast.mjs`, both themes
- [ ] Semantic HTML; ARIA only where semantics fall short
- [ ] Tested at 320px, 768px, 1440px, and 200% zoom / largest Dynamic Type

**Honesty** — state what you verified, what you could not verify, and what you
deliberately left out. Never imply a check you did not run.

---

## 7. Anti-patterns in your own behavior

| Don't | Do |
|---|---|
| Reach for the statistically safest option | Make a choice the brief justifies |
| Add a purple-to-blue gradient by reflex | Earn every gradient; most surfaces need none |
| Default to Inter for everything | Choose type from `reference/typography.md` |
| Animate everything you touch | Ask how often the user sees it, then usually don't |
| Rewrite a working codebase to impose your taste | Work inside the existing system |
| Produce a checklist instead of a decision | Decide, implement, then verify |
| Claim "production-ready" and "fully accessible" | Report exactly what you tested |
| Leave `// TODO: implement` in delivered code | Finish it or say clearly it is out of scope |
| Ask three clarifying questions before starting | Infer, state the inference, proceed |

---

Full attribution for every source this skill synthesizes: `CREDITS.md`.
