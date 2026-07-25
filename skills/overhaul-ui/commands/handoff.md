# handoff — write the work up

**Route here when:** "write this up", "draft the PR description", "document the design
decisions", "explain what changed for the team".

**Writes:** a markdown document. No source changes.

---

## Procedure

### 1. Pick the format
| Audience | Format |
|---|---|
| Reviewers of a diff | PR description |
| Designers and PMs | Design notes |
| Future maintainers | `design-system/DESIGN.md` update |
| A different agent or a cheaper model executing the rest | Implementation plan |
| The user, right now | A short summary — do not write a document nobody asked for |

Do not produce a markdown file unless one was requested or the work genuinely needs
persisting. An unrequested `SUMMARY.md` is clutter.

### 2. Lead with the outcome
First paragraph: what changed and why, in plain language. A reviewer who reads only this
should understand the change.

### 3. Then the reasoning
The direction, the tradeoffs, and what you rejected. **The rejections are the most
valuable part** — they stop the next person re-litigating a decision you already made.

### 4. Then the specifics
Files, tokens, components, before/after numbers. Screenshots or a preview link if
available.

### 5. Then the honesty section
What you verified, what you could not verify, what is deliberately out of scope, and what
you would do next. Never omit this.

---

## PR description template

```md
## What

<One paragraph. What changed, for whom, and why.>

## Direction

<The design direction in one sentence, and the reason it fits this product.>

## Changes

- **Tokens** — 13-step tinted neutral ramp, one accent, 19 semantic roles
- **Type** — Instrument Serif + Geist, ratio 1.333 (was 1.15)
- **Components** — Button, Input, Select, Card, Table restyled; APIs unchanged
- **States** — loading/empty/error added to 4 surfaces
- **Motion** — 14 animations → 4; reduced-motion handled
- **A11y** — focus rings restored, 14 fields labelled, 9 targets to 44px

## Before / after

| | Before | After |
|---|---|---|
| Slop findings | 47 (12 error) | 2 (0 error) |
| Distinct greys | 9 | 1 ramp |
| A11y violations (axe) | 18 | 0 |
| CLS | 0.24 | 0.01 |
| JS (gzip) | 487KB | 198KB |

## Rejected

- **A second accent for the AI features** — one accent reads as more deliberate; AI
  surfaces are differentiated by an icon instead
- **Scroll-reveal animation on sections** — hides content the user asked for; the
  frequency test rejects it
- **Migrating to CSS Modules** — a re-platform, not a redesign. Separate decision

## Verified

Build, typecheck, 84/84 tests. Keyboard-only pass on the primary flow. axe: 0
violations. Contrast matrix AA in both themes. 320/768/1440 plus landscape.
Reduced motion and forced-colors.

## Not verified

NVDA and TalkBack. Real-device gesture feel on the drawer. Safari 16. Field
performance on low-end Android.

## Out of scope

Admin routes, email templates, the marketing site.

## Next

The invoice table is still the weakest surface — it needs virtualisation above ~500
rows and a proper column-visibility control.
```

---

## Design notes template

For a non-engineering audience: drop the file lists and the metrics table; keep
direction, reasoning, rejections, and screenshots. Lead with images if you have them.

---

## Implementation plan template

When handing execution to another agent, each task must be self-contained — assume the
executor has zero context and no design taste of its own.

```md
### Task 3 — Replace the neutral ramp

**Files:** `src/styles/tokens.css`, then every file matching `gray-[0-9]`
**Why:** nine unrelated greys; several fail contrast

**Do exactly this:**
1. Replace the `--n-*` block in `tokens.css` with:
   <the exact 13 lines>
2. Map old → new:
   `#111827` → `var(--n-950)` · `#6B7280` → `var(--n-600)` · `#9CA3AF` → `var(--n-500)`
   <full table>
3. Grep for `#[0-9a-fA-F]{6}` in `src/` — zero results expected when done
4. Run `node scripts/contrast.mjs --matrix design-system/tokens.json` — all AA

**Do not:** change any accent colour, touch dark-mode overrides, or reformat files
**Done when:** grep returns nothing, contrast passes, build passes
```

---

## Gate

- [ ] Outcome first, reasoning second, specifics third
- [ ] Rejections section present
- [ ] Verified / not-verified both stated
- [ ] Numbers, not adjectives
- [ ] No document created that nobody asked for

## See also
`commands/review.md`, `commands/audit.md`, `templates/HANDOFF.md`
