# polish — the micro-detail pass

**Route here when:** the interface works and the direction is right, but it feels
cheap, unfinished or slightly off. "Tighten this up", "it's 90% there".

**Not here when:** the direction itself is the problem → `overhaul` or `slop`.

**Writes:** many small, low-risk edits.

---

## Procedure

Work through these passes in order. Each is independent; each is small.

### 1. Alignment
Most "looks off with nothing obviously wrong" is one misaligned edge.
- Identify the alignment lines on the page. There should be few.
- Snap everything to them. Icon boxes, avatars, text starts, card edges.
- Optical over mathematical: circles read smaller than squares at the same box size — scale circles ~4–8% up. Quotation marks and bullets should hang into the margin so the *text* aligns.
- Icons align to cap height, not box centre.

### 2. Spacing
- One scale, no orphan values. Grep for odd numbers.
- Space by relationship — intra-component < intra-group < inter-section (`reference/layout.md` §1).
- Optical padding: buttons often need slightly less bottom padding than top; cards with headings need more top than bottom.

### 3. Type detail
- `tabular-nums` on every number that changes in place
- `text-wrap: balance` on headings, `pretty` on body
- Negative tracking at display sizes, positive on all-caps micro-labels
- Curly quotes, en dashes, real ellipses
- Measure capped at 65–75ch
- Heading leading dropped to 1.05–1.2

### 4. Radius and border coherence
- Inner radius = outer radius − padding
- One separation mechanism per level: border **or** shadow **or** background shift
- Border colours from the ramp, not ad-hoc rgba
- Focus ring `border-radius: inherit` so it follows the shape

### 5. States
- `:active` scale on every pressable thing
- `:focus-visible` ring present, correct offset, correct contrast
- Hover gated behind `@media (hover: hover) and (pointer: fine)`
- No layout shift from any state change
- Disabled states legible and explained

### 6. Motion detail
```bash
node scripts/motion-lint.mjs .
```
- Named properties, `ease-out` enters, exits at ~70%
- Transform origin correct on anchored elements
- Stagger 30–80ms where multiple items enter
- Nothing over 300ms except drawers and marketing
- Tooltip: delay first, instant for subsequent

### 7. Content edges
- Long strings: truncation with a reachable full value
- Zero, one, and very many items
- Missing avatar, `null` date, empty description
- Longest translation

### 8. Micro-details that always pay
- `scrollbar-gutter: stable` on `html`
- `scroll-margin-block-start` on anchor targets
- `env(safe-area-inset-bottom)` on fixed bottom bars
- `autocomplete` and `inputmode` on every field
- `aspect-ratio` on every image slot
- `overscroll-behavior: contain` on modals and drawers
- `user-select: none` on UI chrome labels; `select-all` on copyable tokens
- `cursor` correctness — `pointer` on actions, `text` on text, `not-allowed` on disabled
- Loading state on the button that triggers work, width preserved
- Copy-to-clipboard confirmation on the button itself
- `title`/tooltip on truncated text
- Skeletons matching the shape they replace

### 9. Verify
Build. Render. Compare before/after screenshots if you can. Keyboard pass.

---

## Output

A table, not prose. One row per change.

| Area | Before | After | Why |
|---|---|---|---|
| Button | no `:active` | `scale(0.97)` 150ms | confirms the press |
| Table | proportional figures | `tabular-nums` | digits stop jittering |
| Card | radius 12 inner and outer | inner 6 | nested radii were reading wrong |
| Dropdown | `transform-origin: center` | `var(--transform-origin)` | scales from its trigger |
| `html` | — | `scrollbar-gutter: stable` | no shift when a modal opens |

Then one line: total changes, files touched, build status.

---

## Gate

- [ ] No visual regressions — polish must not change the design, only sharpen it
- [ ] `motion-lint` clean
- [ ] Keyboard pass unchanged or improved
- [ ] Build passes

## See also
`reference/components.md`, `reference/motion.md`, `commands/distill.md`,
`commands/review.md`
