# Design system — <Project Name>

> The source of truth for this project's interface. Written by `overhaul-ui init`.
> Read this before building any UI. Page-specific deviations live in
> `design-system/pages/<page>.md` and override this file.

**Last updated:** <date> · **Direction:** <name>

---

## 1. Direction

**One sentence:** <e.g. "A quiet, dense instrument — the interface disappears and the
data is the interface.">

**Why this fits:** <the specific brief attributes it serves>

**Reference points:** <2–3 named products or sites>

### Explicitly rejected
<The most important section. Three to five things this direction does not do, and why.>

1. **No gradients on surfaces** — depth comes from one lightness step, not colour
2. **No route transition animation** — this is a daily driver; motion is a tax
3. **No second accent** — status colour is the only other colour in the system
4. …

---

## 2. Stack

| | |
|---|---|
| Framework | <Next.js 15 App Router> |
| Styling | <Tailwind v4, CSS-first `@theme`> |
| Components | <Base UI> |
| Icons | <Lucide, 1.5px stroke, 16/20/24> |
| Tokens | <`src/styles/tokens.css`> |
| Build | <`pnpm build`> |
| Test | <`pnpm test`> |

---

## 3. Typography

| Role | Face | Size | Weight | Leading | Tracking |
|---|---|---|---|---|---|
| display | | | | | |
| h1 | | | | | |
| h2 | | | | | |
| h3 | | | | | |
| body | | | | | |
| body-sm | | | | | |
| label | | | | | |
| caption | | | | | |
| overline | | | | | |
| code | | | | | |

**Scale:** <base 16px, ratio 1.25, 9 steps> · **Fluid above:** <lg>
**Loaded weights:** <400, 600> · **Measure:** prose <65ch>, display <32ch>
**Always:** `tabular-nums` on <tables, metrics, timers> · `text-wrap: balance` on headings

---

## 4. Colour

**Neutral ramp:** OKLCH hue <262>, 13 steps, `--n-0` … `--n-1000`
**Accent:** <oklch(0.55 0.17 258)> — 11 steps, `--a-50` … `--a-950`
**Status:** success <> · warning <> · danger <> · info <>

### Semantic roles

| Token | Light | Dark |
|---|---|---|
| `--bg` | | |
| `--bg-subtle` | | |
| `--bg-elevated` | | |
| `--fg` | | |
| `--fg-muted` | | |
| `--border` | | |
| `--accent` | | |
| `--ring` | | |

**Contrast verified:** <date> — worst pair <`--fg-muted` on `--bg-subtle`, 4.71:1>
**Accent appears:** <primary actions and active nav only — max twice per view>

---

## 5. Space and geometry

**Base:** <4px> · **Scale:** <0 2 4 6 8 12 16 20 24 32 40 48 64 80 96 128>
**Density tier:** <default — 40px rows, 14px UI text>
**Containers:** prose <45rem> · app <75rem> · wide <90rem>
**Gutters:** `clamp(1rem, 4vw, 2.5rem)`
**Radius:** xs <4> sm <6> md <8> lg <12> xl <16> full <9999>
**Border:** <1px> at `--border`
**Shadows:** <3 levels, tinted, paired>
**Section rhythm:** <mobile 64/96 · desktop 96/160 — deliberately uneven>

---

## 6. Motion

**Durations:** `--dur-1` <100> · `--dur-2` <150> · `--dur-3` <200> · `--dur-4` <300>
**Easings:**
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — enters, feedback
- `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` — on-screen movement
- `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` — sheets

**Never animates:** <command palette · route change · tab switch · sidebar nav hover>
**Reduced motion:** <opacity-only substitutions; no movement, scale or parallax>
**Total animation count:** <n>

---

## 7. Component conventions

| | |
|---|---|
| Button heights | <sm 32 · md 40 · lg 48> |
| Input height | <40, matching button md> |
| Focus ring | <2px `--ring`, 2px offset, `border-radius: inherit`> |
| Press state | <`scale(0.97)`, 150ms `--ease-out`> |
| Card | <one level only; 1px border; radius lg; padding 24> |
| Table row | <40px; hairlines, no zebra; `tabular-nums`> |
| Modal | <520px; centre origin; 240/160ms> |
| Toast | <bottom-right; max 3; 4s; pause on hover and tab blur> |
| Empty states | <always name the action> |

---

## 8. Content and voice

**Register:** <neutral, matter-of-fact> · **Case:** <sentence case everywhere>
**Terminology:** <"project" not "workspace" · "member" not "user">
**CTA form:** <verb + object>
**Banned:** <the list in `reference/copywriting.md` §1, plus: <project-specific terms>>

---

## 9. Accessibility baseline

**Target:** WCAG 2.2 AA
**Touch targets:** >= 44px · **Contrast:** verified both themes
**Tested with:** <keyboard, axe, VoiceOver>
**Known gaps:** <NVDA, TalkBack not tested>

---

## 10. Performance budget

| Metric | Budget |
|---|---|
| LCP | <= 2.5s |
| INP | <= 200ms |
| CLS | <= 0.1 |
| JS (gzip, initial route) | <= <250KB> |
| Fonts | <2 files, 34KB> |
