# layout — composition, spacing, alignment

**Route here when:** "the spacing is off", "fix the alignment", "the grid is broken",
"it looks cramped", "every section looks the same".

**Writes:** layout and spacing code.

---

## Procedure

### 1. Find the alignment lines
Most "it looks off with nothing obviously wrong" is a misaligned edge. List the
alignment lines the page should have — there should be few — then find everything that
misses them.

### 2. Normalise the spacing scale
Grep every gap, padding and margin. Any value not on the scale is an orphan; snap it to
the nearest step. If a value is genuinely needed, add it to the scale.

### 3. Re-space by relationship
The most common layout defect is a uniform gap, which destroys grouping information.
`reference/layout.md` §1:

```
icon↔label 6–8 · label↔input 6–8 · input↔error 4–6 · field↔field 16–20
group↔group 32–40 · card padding 16–32 · block↔block 32–48
section↔section 64–96 mobile / 96–160 desktop
```

**Proximity law:** space *inside* a group must be smaller than space *around* it.

### 4. Fix nesting
- Flatten cards-in-cards to one container level
- Inner radius = outer radius − padding
- One separation mechanism per level: border **or** shadow **or** background shift

### 5. Fix the grid
- Intrinsic first: `repeat(auto-fit, minmax(min(20rem, 100%), 1fr))`
- `subgrid` to align content across cards (`grid-template-rows: subgrid`)
- Container widths: prose 640–720 · app 1120–1280 · wide 1440–1600
- Logical properties throughout (`padding-inline`, `margin-inline`)
- Fluid gutters: `padding-inline: clamp(1rem, 4vw, 2.5rem)`
- If it is a bento grid, do the span arithmetic — no empty leftover cells

### 6. Vary the composition
Count how many sections use the same archetype. If it is more than two, fix it. Use at
least four distinct shapes from `reference/layout.md` §3: asymmetric split, editorial
left-rail, full-bleed media, overlap, offset grid, single statement.

### 7. Make the vertical rhythm uneven
Identical section padding reads as a template. Give the hero more room, tighten the
middle, open up before the closing CTA.

### 8. Increase macro whitespace
Under-spacing is the most reliable "cheap" signal. When unsure, add 50% to section
spacing and see whether it reads better. It usually does.

### 9. Fix the scroll and stacking plumbing
- `scrollbar-gutter: stable` on `html`
- `scroll-margin-block-start` on anchor targets, clearing the sticky header
- `overscroll-behavior: contain` on modals and panels
- Tokenised `z-index`; fix "renders behind the header" with a portal or the popover API, not a bigger number
- Content insets so nothing hides behind fixed bars
- `env(safe-area-inset-*)` on fixed mobile bars

### 10. Verify
320 / 768 / 1440 / 1920. Landscape phone. 200% zoom. Longest translation. RTL if
supported.

---

## Output

```
Alignment:  4 lines established; 11 elements snapped
Spacing:    1 scale (4px base); 23 orphan values removed
Grouping:   re-spaced by relationship in 6 components
Nesting:    3 card-in-card levels flattened; inner radii corrected
Grid:       auto-fit + subgrid; overflow at 320px fixed
Composition:5 identical sections → 5 distinct archetypes
Rhythm:     hero 128px, mid 96px, pre-CTA 160px (was 96 everywhere)
Plumbing:   scrollbar-gutter, scroll-margin, z-index tokens, safe areas
Verified:   320/768/1440/1920, landscape, 200% zoom
```

---

## Gate

- [ ] One spacing scale, no orphan values
- [ ] Spacing varies by relationship; proximity law holds
- [ ] Max one card nesting level; nested radii correct
- [ ] No horizontal scroll at 320px
- [ ] Four or more section archetypes on multi-section pages
- [ ] Uneven, intentional section rhythm
- [ ] `z-index` tokenised; no `9999`
- [ ] Verified at all four widths plus landscape

## See also
`reference/layout.md`, `reference/responsive.md`, `commands/responsive.md`,
`commands/distill.md`
