# responsive — adapt across sizes, inputs and preferences

**Route here when:** "it breaks on mobile", "make it responsive", "fix the tablet
layout", "support dark mode and reduced motion properly".

**Writes:** layout and media-query code.

---

## Procedure

### 1. Find the actual breaking points
Resize continuously from 320px to 1920px and note where the layout genuinely fails.
Those are your breakpoints. Do not target devices; do not assume 768/1024 are the right
places for *this* layout.

### 2. Replace media queries with better tools where possible
`reference/responsive.md` §1, in order of preference:
1. Intrinsic layout — `flex-wrap`, `auto-fit` grids, `clamp()`. No breakpoint needed.
2. Container queries — for anything reusable. A card in a sidebar cannot be sized by viewport width.
3. Media queries — page-level structural changes only.
4. JS — only for behaviour CSS cannot express.

Most "responsive" code is media queries doing a container query's job.

### 3. Mobile-first
Base styles are the smallest layout; `min-width` queries add complexity upward.
Breakpoints in `rem` so they respect user font size.

### 4. Fluid values
`clamp()` for display type, section padding and gutters. Body text stays fixed. Always
keep a `rem` term in the clamp middle — `clamp(2rem, 5vw, 4rem)` ignores user zoom and
fails SC 1.4.4.

### 5. Viewport units
`100svh` for anything that must fit. `100dvh` only when reflow-while-scrolling is
acceptable. `100vh` on mobile pushes content under the browser chrome.

### 6. Input modality, not screen size
```css
@media (hover: hover) and (pointer: fine)  { /* hover effects */ }
@media (any-pointer: coarse)               { .btn { min-height: 44px; } }
```
Nothing may be hover-only. Targets >= 44px on touch, >= 8px apart. Primary mobile
actions in the thumb zone.

### 7. Other user preferences
`prefers-reduced-motion` · `prefers-color-scheme` · `prefers-contrast` ·
`prefers-reduced-transparency` · `forced-colors` · `scripting: none` · `print`.

Print styles take two minutes and are always forgotten. Any page a user might save
(invoice, report, recipe, docs) deserves them.

### 8. Logical properties and RTL
`padding-inline`, `margin-inline-start`, `inset-inline-end`, `text-align: start`.
Then mirror directional icons, keep numbers and code LTR, and test with real RTL text.

### 9. Mobile web plumbing
`viewport-fit=cover` + `env(safe-area-inset-*)` on fixed bars · `font-size: max(16px, 1rem)`
on inputs so iOS stops zooming · `overscroll-behavior: contain` on panels ·
`touch-action: manipulation` · never `user-scalable=no`.

### 10. Verify the matrix
320 · 375 · 430 · 768 · 1024 · 1440 · 1920. Plus landscape phone (short viewports break
modals and heroes), 200% zoom, 400% zoom at 1280px, and the longest translation.

---

## Output

```
Breakpoints: 3 (was 6) — 40rem / 64rem / 80rem, at real breaking points
Container queries: 5 components converted from viewport queries
Fluid: display type + section padding + gutters (rem term preserved)
Viewport: 100vh → 100svh on 3 full-height surfaces
Touch: 11 targets raised to 44px; 4 hover-only affordances made focus-reachable
Preferences: reduced-motion, contrast, reduced-transparency, forced-colors, print
Logical properties: converted; RTL verified with Arabic content
Mobile: safe areas on 2 fixed bars; 16px input floor; overscroll containment
Fixed: horizontal scroll at 320px (a fixed-width table); hero cut off on iOS
Verified: 320/375/430/768/1024/1440/1920, landscape, 200% + 400% zoom
```

---

## Gate

- [ ] No horizontal scroll at 320px
- [ ] Container queries used for reusable components
- [ ] Breakpoints in `rem`, at real breaking points, <= 4 of them
- [ ] All `clamp()` values include a `rem` term
- [ ] Nothing hover-only; touch targets >= 44px
- [ ] `svh` where height must fit; safe areas on fixed bars
- [ ] Reduced-motion, contrast and forced-colors handled
- [ ] Print stylesheet present for printable pages
- [ ] Verified across the full width matrix plus landscape and zoom

## See also
`reference/responsive.md`, `reference/layout.md`, `commands/layout.md`
