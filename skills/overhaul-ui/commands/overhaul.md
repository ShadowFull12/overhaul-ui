# overhaul — redesign an existing interface in place

The flagship command. Use when the current design is wrong enough that surface fixes
will not save it, but the codebase should not be thrown away.

**Route here when:** "redesign this", "overhaul the UI", "this needs a rework".
**Not here when:** the design is fine and needs sharpening → `polish`. Only the
aesthetic is generic → `slop`. There is no existing code → `shape`.

**Writes:** source edits across many files.

---

## Procedure

### 1. Audit first, always
Run `commands/audit.md` and show the findings before changing anything. An overhaul
that starts with edits is a rewrite in disguise. The audit is also the before-state
you will measure against.

### 2. Agree the scope
State plainly:
- What changes: visual system, layout, component internals
- What does **not** change: routes, data contracts, component APIs, business logic, copy (unless asked)
- What might break: anything consuming the components you restyle

If the scope implies breaking changes to a shared component API, say so and get
confirmation before proceeding.

### 3. Work inside the existing stack
Do not migrate CSS approaches, swap component libraries, or introduce a build step as
part of a redesign. If the existing stack genuinely blocks the work, raise it as a
separate decision. Redesign and re-platform are two projects; combining them makes
both unreviewable.

### 4. Decide the direction
`reference/direction.md`. If the product has brand assets, derive from them. Write it
into `design-system/DESIGN.md` — `commands/init.md` step 6.

### 5. Rebuild bottom-up
Order matters. Each layer stabilises the next.

1. **Tokens** — colour ramp, type scale, spacing, radius, shadow, motion. Everything else references these.
2. **Primitives** — button, input, select, checkbox, card, badge, link. Get these right and 70% of the product follows.
3. **Patterns** — form, table, modal, nav, list row, toolbar, empty state.
4. **Layouts** — page shells, grids, section rhythm.
5. **Pages** — one representative page fully, then the rest.

Do not start at step 5. Restyling pages before primitives means restyling twice.

### 6. Convert page by page, verifying as you go
After each page: build, render, compare against the intent. Do not batch 15 pages and
verify once.

### 7. Sweep for leftovers
```bash
node scripts/slop-scan.mjs .
```
Grep for the old font names, old hex values, old class names, old spacing constants.
Leftovers are the most common overhaul defect — a half-migrated interface looks worse
than either the before or the after.

### 8. States and access
Every surface touched gets `commands/states.md` and `commands/harden.md` treatment.
An overhaul that only changes colours has not fixed the actual quality problem.

### 9. Full gate
`commands/review.md`.

---

## Constraints

| Do | Don't |
|---|---|
| Extend the existing token file | Create a second parallel system |
| Keep component APIs stable | Rename props as a side effect |
| Preserve behaviour and data flow | "Improve" logic while restyling |
| Keep copy unless asked | Rewrite content in a visual pass |
| Convert incrementally, verifying | Rewrite everything then debug |
| Delete dead CSS you replaced | Leave both old and new rules |
| Match existing conventions | Impose a personal file layout |

---

## Output

```
Direction:  <name> — <one sentence>
Scope:      <n> pages, <n> components, tokens rebuilt
Untouched:  routing, API layer, auth, business logic

Before → After
  Slop findings   47 (12 error)  →  2 (0 error)
  Distinct greys  9              →  1 ramp (13 steps)
  Accents         4              →  1
  A11y issues     18             →  0 static
  States missing  6 surfaces     →  0
  Bundle          412KB          →  388KB

Files changed: 61 (+2 new, -4 deleted)
Build: pass   Typecheck: pass   Tests: 84/84
Verified: keyboard pass on primary flow, contrast both themes, 320/768/1440
Not verified: screen reader, real-device gestures, IE-era browsers
```

Then a short paragraph: what was wrong, what the new direction is, and the one thing
you would do next.

---

## Gate

- [ ] Audit shown and scope agreed before edits
- [ ] Tokens → primitives → patterns → layouts → pages order followed
- [ ] Zero references to the replaced system remain
- [ ] Component APIs unchanged, or breaking changes explicitly listed
- [ ] `commands/review.md` fully passed
- [ ] Build, typecheck and existing tests pass

## See also
`commands/audit.md`, `commands/slop.md`, `commands/init.md`, `commands/handoff.md`
