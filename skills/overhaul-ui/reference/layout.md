# Layout, spacing, composition

---

## 1. One spacing scale

Every gap, pad and margin comes from one scale. An orphan `13px` is a defect.

```
4px base:  0  2  4  6  8  10  12  16  20  24  32  40  48  64  80  96  128  160
```

**Assign by relationship, not by habit.** The most common layout failure is a uniform
gap everywhere, which erases grouping information.

| Relationship | Gap |
|---|---|
| Icon ↔ its label | 6–8px |
| Label ↔ its input | 6–8px |
| Input ↔ its help/error text | 4–6px |
| Field ↔ next field | 16–20px |
| Field group ↔ next group | 32–40px |
| Card padding | 16–24px (dense) / 24–32px (spacious) |
| Card ↔ card | 12–24px |
| Content block ↔ next block | 32–48px |
| Section ↔ section | 64–96px mobile / 96–160px desktop |

**Proximity law:** the space *inside* a group must be smaller than the space *around*
it. If a label sits 16px from its input and 16px from the previous field, the form has
no structure. This one rule fixes more layouts than any other.

---

## 2. Grid

- **12 columns** for marketing and mixed content. Divides by 2, 3, 4, 6.
- **CSS Grid** for two-dimensional layout; **Flexbox** for one-dimensional rows/columns. Do not use grid for a button row.
- **Subgrid** to align nested content to the parent grid — the real fix for cards whose titles and CTAs don't line up:

```css
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { display: grid; grid-template-rows: subgrid; grid-row: span 3; }
/* every card's title / body / footer now share baselines */
```

- **Intrinsic sizing** beats breakpoint arithmetic:

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: var(--space-6);
}
```
The `min(18rem, 100%)` guard prevents overflow on narrow screens — `minmax(18rem, 1fr)` alone overflows below 288px.

- **Container widths:** prose 640–720px; app content 1120–1280px; wide dashboards 1440–1600px; full-bleed for media. Use `margin-inline: auto` + `max-inline-size`, and logical properties throughout for RTL.

```css
.container {
  inline-size: 100%;
  max-inline-size: var(--container, 75rem);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);   /* gutters grow with viewport */
}
```

- **Full-bleed inside a constrained flow**, without breaking out of the container:

```css
.flow { display: grid; grid-template-columns: 1fr min(72ch, 100%) 1fr; }
.flow > * { grid-column: 2; }
.flow > .bleed { grid-column: 1 / -1; }
```

---

## 3. Composition — breaking the template

The AI default is: centred title, centred subtitle, three cards. Repeated six times.
The fix is deliberate variation. Give a page at least four different section shapes.

| Archetype | Shape | Use for |
|---|---|---|
| Centred stack | Everything on the axis | Hero, closing CTA. **Once or twice per page, max** |
| Asymmetric split | 5/7 or 4/8 columns, text left | Feature explanations |
| Offset / staggered | Alternating vertical offsets between columns | Galleries, logo walls |
| Editorial left-rail | Sticky heading left, scrolling content right | Docs, long features, changelogs |
| Full-bleed media | Edge-to-edge image or video with overlaid text | Product shots, atmosphere |
| Overlap | Card or image crossing a section boundary | Depth, visual interest at a seam |
| Bento | Mixed-span grid cells | Feature overview — only if the span math is exact |
| Diagonal / rotated | Slight rotation or skewed divider | Energy. Use once, or not at all |
| Horizontal scroll | Sideways-scrolling row | Galleries, timelines. Needs keyboard + scrollbar |
| Two-column comparison | Before/after, us/them | Positioning |
| Marquee | Continuous ticker | Logos, social proof. Pause on hover, respect reduced-motion |
| Single statement | One sentence, huge, alone | Rhythm break between dense sections |

**Vertical rhythm should be uneven.** Identical padding on every section reads as a
template. Give the hero more room, tighten the middle, open up before the final CTA.

**Alignment beats decoration.** Most "it looks off" is one misaligned edge. Establish
a small number of alignment lines and put everything on them.

---

## 4. Density

Pick a density tier and hold it across the product.

| Tier | Row height | Text | Padding | Fits |
|---|---|---|---|---|
| Compact | 28–32px | 12–13px | 6–8px | Trading, ops, tables |
| Default | 36–40px | 14px | 8–12px | Product UI |
| Comfortable | 44–48px | 15–16px | 12–16px | Consumer apps, touch |
| Spacious | 56px+ | 16–18px | 16–24px | Marketing, onboarding |

Compact tiers must still reach the 44px touch target on touch devices — expand the
hit area with padding or `hitSlop` rather than shrinking the target.

---

## 5. Nesting and containers

- **Max one card level.** A card inside a card inside a card is the clearest structural slop tell. Flatten: use a background shift, a hairline divider, or just space.
- **Radius nesting:** inner radius = outer radius − padding. An 16px-radius card with 12px padding wants ~4–6px inner radius. Equal radii look wrong.
- **Border vs background vs shadow:** pick one separation mechanism per level. Border *and* shadow *and* background shift on the same element is triple-encoding.
- **Do not put a shadow on something already inside a shadowed container.** Elevation is relative; two levels of lift inside one card is noise.

---

## 6. Whitespace

Whitespace is structure, not leftover.

- **Macro whitespace** (between sections) signals confidence. Under-spaced pages read as cheap. When unsure, add 50%.
- **Micro whitespace** (inside components) controls legibility and grouping.
- **Asymmetric padding is fine and often better.** Optical centring: a button with text usually needs slightly less bottom padding than top; a card with a heading needs more top padding than bottom.
- **Optical alignment over mathematical.** A circular avatar and a square icon at the same box size do not look the same size — scale the circle ~4–8% larger.
- **Do not fill space.** Empty area is allowed to be empty. Adding a decorative blob to "balance" a layout is how slop accumulates.

---

## 7. Scroll and sticky behaviour

```css
html { scroll-behavior: smooth; }               /* reduce-motion gated below */
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

:target, [id] { scroll-margin-block-start: 6rem; }   /* clear the sticky header */
.sticky-header { position: sticky; top: 0; z-index: 40; }
html { scrollbar-gutter: stable; }              /* no shift when a scrollbar appears */
```

- Reserve space for sticky bars with `padding-block-end` on scroll containers, or content hides behind them.
- Scroll snapping: `scroll-snap-type: x mandatory` + `scroll-snap-align: start`. Use `proximity` rather than `mandatory` for content of varying length, and never trap the user.
- `overscroll-behavior: contain` on modals and drawers to stop scroll chaining to the page behind.
- Safe areas on mobile web and RN: `padding-bottom: env(safe-area-inset-bottom)` for fixed bottom bars.

---

## 8. Z-index

Tokenise it. Ad-hoc `z-index: 9999` is how stacking bugs are born.

```css
--z-base: 0;       --z-raised: 10;    --z-sticky: 20;
--z-drawer: 30;    --z-header: 40;    --z-overlay: 50;
--z-modal: 60;     --z-popover: 70;   --z-toast: 80;    --z-tooltip: 90;
```

Remember that `transform`, `filter`, `backdrop-filter`, `will-change`, `contain` and
`opacity < 1` each create a containing block or stacking context — an element with
`z-index: 90` inside a `transform`ed parent cannot escape it. This is the usual cause
of "my dropdown renders behind the header". Fix with a portal, or `position: fixed`
plus CSS anchor positioning / a popover API element, not with a bigger number.

---

## 9. Failure table

| Symptom | Cause | Fix |
|---|---|---|
| "Looks off" but nothing is obviously wrong | One misaligned edge | Find the alignment lines; snap everything |
| No visual grouping | Uniform gap | Vary spacing by relationship |
| Cramped, cheap feel | Under-spaced sections | Increase section rhythm 50%+ |
| Cards look boxy and nested | Multiple container levels | Flatten to one |
| Radii look wrong on nesting | Equal inner and outer radius | inner = outer − padding |
| Grid overflows on mobile | `minmax(18rem, 1fr)` | `minmax(min(18rem, 100%), 1fr)` |
| Card titles don't line up | Independent card grids | `grid-template-rows: subgrid` |
| Anchor links land under the header | No scroll margin | `scroll-margin-block-start` |
| Page shifts when a modal opens | Scrollbar removal | `scrollbar-gutter: stable` |
| Dropdown behind the header | Ancestor stacking context | Portal or popover API |
| Every section looks the same | One archetype repeated | Use 4+ archetypes per page |
