# <Title> — design handoff

**Date:** <date> · **Author:** <agent / person> · **Branch / PR:** <ref>

---

## What

<One paragraph. What changed, for whom, and why. A reviewer who reads only this should
understand the change.>

---

## Direction

<The design direction in one sentence, and why it fits this product.>

Recorded in `design-system/DESIGN.md`.

---

## Changes

- **Tokens** — <what changed>
- **Type** — <faces, scale>
- **Colour** — <ramp, accent, themes>
- **Layout** — <structure, spacing, composition>
- **Components** — <which; note whether APIs changed>
- **States** — <what was added>
- **Motion** — <count before/after, what was removed>
- **Accessibility** — <what was fixed>
- **Copy** — <what was rewritten>

---

## Before / after

| | Before | After |
|---|---|---|
| Slop findings | | |
| Distinct greys | | |
| Accent colours | | |
| Missing states | | |
| axe violations | | |
| Contrast failures | | |
| LCP / INP / CLS | | |
| JS (gzip) | | |

<Screenshots or a preview link, if available. Images beat this table for most readers.>

---

## Rejected

<The most valuable section — it stops the next person re-litigating a settled decision.>

- **<option>** — <why not>
- **<option>** — <why not>
- **<option>** — <why not>

---

## Breaking changes

<Component API changes, renamed tokens, removed props. "None" is a valid and welcome
answer — say it explicitly.>

---

## Verified

<Exactly what was run and passed. Build, typecheck, test counts, keyboard pass, axe,
contrast matrix, widths, themes, reduced motion.>

## Not verified

<Screen readers not tested, browsers not checked, devices not used, field performance
unknown. Never omit this section.>

## Out of scope

<Deliberately untouched.>

---

## Next

<The one or two highest-leverage things to do after this.>
