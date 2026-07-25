# audit — find everything wrong, change nothing

**Route here when:** the user asks what is wrong, wants a review, or makes a broad
request like "make this better" with no specified direction.

**Read-only.** Do not edit source in this command. Produce findings and a plan.

---

## Procedure

### 1. Establish scope
Which routes, components or screens? If unspecified, audit the primary user flow plus
the highest-traffic page. Say what you covered and what you skipped.

### 2. Run the instruments
```bash
node scripts/report.mjs . --out=overhaul-ui-report.md
```
Or individually: `slop-scan.mjs`, `motion-lint.mjs`, `a11y-lint.mjs`.
Script output is a set of leads. Confirm each in the code before recording it.

### 3. Read the code
The design system (or its absence), the layout primitives, 3–5 representative
components, the global stylesheet, and the async surfaces.

### 4. Score seven dimensions
For each, one line of assessment plus concrete findings. Score 1–5.

| Dimension | Look for | Reference |
|---|---|---|
| **Direction** | Is there a POV? Nameable in one sentence? Or is it default-shaped? | `reference/anti-slop.md` |
| **Hierarchy** | Does the squint test pass? One focal point per view? | `reference/philosophy.md` |
| **Type** | Scale contrast, measure, wraps, tracking, weight count | `reference/typography.md` |
| **Colour** | Untinted greys, gradient defaults, contrast, dark mode parity | `reference/color.md` |
| **Layout** | Spacing rhythm, alignment, nesting depth, section variety | `reference/layout.md` |
| **States** | Focus, hover, active, disabled, loading, empty, error coverage | `reference/interaction-states.md` |
| **Motion** | `all`, `ease-in`, durations, origin, reduced-motion | `reference/motion.md` |

Then two more, always: **accessibility** (`reference/accessibility.md`) and
**performance** (`reference/performance.md`).

### 5. Prioritise by leverage
Rank findings by `(user impact × frequency) / effort`. The top of the list is usually
one of: missing states, weak hierarchy contrast, untinted neutrals, or motion defects
on frequent interactions. The bottom is usually pixel-level polish.

Severity:
- **Blocker** — broken, inaccessible, or unusable for some users
- **High** — visibly damages quality or trust
- **Medium** — noticeable to a careful eye
- **Low** — polish

---

## Output

Use `templates/AUDIT.md`. Structure:

```
## Verdict
Two or three sentences. The single most important thing, stated plainly.

## Scores
Direction 2/5 · Hierarchy 3/5 · Type 2/5 · Colour 2/5 · Layout 3/5
States 1/5 · Motion 2/5 · A11y 2/5 · Perf 4/5

## Findings

### BLOCKER — Focus rings removed globally
`src/styles/global.css:42` — `*:focus { outline: none }` with no replacement.
Keyboard users cannot see where they are. WCAG 2.4.7 failure.
Fix: delete the rule, add a `:focus-visible` token ring. ~10 min.

[…one block per finding: severity, title, location, what, why it matters, fix, effort]

## Plan
1. harden    — focus rings, labels, contrast          (~1h, unblocks everyone)
2. states    — loading/empty/error on 4 surfaces      (~3h, biggest quality jump)
3. colorize  — tint the ramp, cut to one accent       (~2h)
4. typeset   — pairing + scale contrast               (~2h)
5. motion    — de-slop transitions                    (~1h)

## Not covered
Admin routes, email templates, the mobile app.
```

Findings must cite `file:line`. A finding without a location cannot be acted on.

---

## Gate

- [ ] Every finding has a location, a reason, and a fix
- [ ] Severity assigned to all
- [ ] Plan is ordered by leverage, with effort estimates
- [ ] No source files were modified
- [ ] Scope and non-scope both stated

## See also
`commands/critique.md` for a subjective design critique instead of a defect list;
`commands/overhaul.md` to execute the plan; `commands/review.md` for the pre-ship gate.
