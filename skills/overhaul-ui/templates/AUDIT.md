# UI audit — <project / surface>

**Date:** <date> · **Scope:** <routes, components or screens covered>
**Stack:** <framework / styling / component library>
**Instruments:** `slop-scan` · `motion-lint` · `a11y-lint` · `contrast` · axe · Lighthouse

---

## Verdict

<Two or three sentences. The single most important thing, stated plainly. If the
interface has no design direction, that goes here — it is upstream of everything else.>

---

## Scores

| Dimension | Score | One line |
|---|---|---|
| Direction | /5 | |
| Hierarchy | /5 | |
| Typography | /5 | |
| Colour | /5 | |
| Layout & spacing | /5 | |
| States | /5 | |
| Motion | /5 | |
| Accessibility | /5 | |
| Performance | /5 | |

---

## Findings

Severity: **BLOCKER** (broken or inaccessible) · **HIGH** (visibly damages quality) ·
**MEDIUM** (a careful eye notices) · **LOW** (polish).

### BLOCKER — <title>
**Where:** `path/to/file.tsx:42`
**What:** <the observable fact>
**Why it matters:** <user impact, and the WCAG criterion if applicable>
**Fix:** <the specific change>
**Effort:** <~10 min>

### HIGH — <title>
**Where:**
**What:**
**Why it matters:**
**Fix:**
**Effort:**

<!-- repeat. Every finding needs a location. A finding without one cannot be acted on. -->

---

## Instrument output

```
slop-scan    <n> findings (<n> error, <n> warn)
motion-lint  <n> findings
a11y-lint    <n> findings
contrast     <n> failing pairs (worst: <pair>, <ratio>)
axe          <n> violations
lighthouse   LCP <n>s · INP <n>ms · CLS <n> · JS <n>KB
```

---

## Plan

Ordered by leverage — `(impact × frequency) / effort`.

| # | Command | Work | Effort | Why here |
|---|---|---|---|---|
| 1 | `harden` | focus rings, labels, contrast | ~1h | unblocks users who currently cannot use it |
| 2 | `states` | loading/empty/error on <n> surfaces | ~3h | largest perceived-quality jump |
| 3 | `colorize` | tint the ramp, cut to one accent | ~2h | fixes the "generic" read |
| 4 | `typeset` | pairing + scale contrast | ~2h | |
| 5 | `motion-audit` | de-slop transitions | ~1h | |

---

## What is working

<Specific. If the form validation is genuinely good, say so and say why. This is not
padding — it tells the team what not to break.>

---

## Not covered

<Routes, states, browsers, devices and assistive technologies outside this audit.>
