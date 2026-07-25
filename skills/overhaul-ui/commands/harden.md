# harden — the accessibility pass

**Route here when:** "make it accessible", "WCAG", "a11y", "screen reader", "keyboard
navigation", or an audit found access failures.

**Target:** WCAG 2.2 Level AA. **Writes:** markup, ARIA, focus management, styles.

Never claim compliance. Report the criteria you tested.

---

## Procedure

### 1. Static scan
```bash
node scripts/a11y-lint.mjs .
npx @axe-core/cli http://localhost:3000     # or axe DevTools in the browser
```
Automated tools catch ~30–40%. Fix all of it — those are the cheap wins — then do the
manual work, which is where the rest lives.

### 2. Semantics
Replace `<div onClick>` with `<button>`, div-navigation with `<a href>`, custom modals
with `<dialog>`, custom disclosures with `<details>`. Native elements bring keyboard
behaviour, focus and semantics free.

Landmarks: one `<h1>`, `<header>/<nav>/<main>/<footer>`, a skip link as the first
focusable element. Heading levels step by one — never jump for visual size.

### 3. Names
Every icon-only control gets an accessible name. Priority: visible text >
`aria-labelledby` > `aria-label`. The visible label must be part of the accessible name
(SC 2.5.3) or voice control breaks. Use a real `.sr-only` class — never `display: none`.

### 4. Focus
- Visible `:focus-visible` on everything interactive: 2px, 2px offset, >= 3:1 against both the control and the page
- Handle `forced-colors: active` with system keywords
- Tab order matches visual order; no positive `tabindex`
- Modals: focus in, trapped, `Esc` closes, focus returns to the trigger
- After deleting a row, move focus to the next row, not `<body>`
- SPA route change: move focus to the new `<h1>` and announce the title
- **SC 2.4.11**: the focused element must not be hidden behind a sticky header — `scroll-margin` / `scroll-padding`

### 5. Keyboard operation
Walk every widget against the table in `reference/accessibility.md` §3. Radio groups,
tabs, menus, comboboxes and sliders all have defined key contracts — follow the
[ARIA APG](https://www.w3.org/WAI/ARIA/apg/), or better, use Radix / Base UI / React
Aria and stop hand-rolling.

**SC 2.5.7:** every drag interaction needs a single-pointer alternative. Reorder by
drag *and* a move-up/move-down control. Slider by drag *and* arrow keys.

### 6. Forms
Visible `<label>` for every field · correct `type` and `inputmode` · `autocomplete`
tokens (SC 1.3.5) · `<fieldset>`/`<legend>` for groups · required marked in text ·
errors associated with `aria-describedby` + `aria-invalid` · paste allowed everywhere ·
password managers not blocked · `autocomplete="one-time-code"` on OTP (SC 3.3.8) ·
review step before an irreversible submit (SC 3.3.4) · don't ask for the same data
twice (SC 3.3.7).

### 7. Targets and spacing
>= 24×24 CSS px is the SC 2.5.8 floor; **44×44 is the bar**. Expand with padding, a
pseudo-element, or `hitSlop` in RN rather than growing the visual. >= 8px between
adjacent targets.

### 8. Colour and contrast
```bash
node scripts/contrast.mjs --matrix design-system/tokens.json
```
Body 4.5:1 · large text and UI glyphs 3:1 · focus ring 3:1. Both themes. Never colour
alone as a signal (SC 1.4.1).

### 9. Content and media
`alt` on every image (empty for decorative, never missing) · complex images get a longer
description or a data table · captions on video · no autoplay with sound · no flashing
above 3Hz · pause control for anything moving over 5s.

### 10. Reflow, zoom, spacing
Usable at 320px with no 2D scrolling (SC 1.4.10) · text to 200% (SC 1.4.4) · no
`user-scalable=no` · survives forced text spacing (SC 1.4.12) — use `min-height`, never
fixed heights around text.

### 11. Motion
`prefers-reduced-motion` handled with substitutions, not a blanket kill. See
`reference/motion.md` §8.

### 12. Live regions
Container present in the DOM before writing to it. `polite` for status, `role="alert"`
for blocking errors only. Never stack assertive regions.

### 13. Manual testing — the part that matters
1. Unplug the mouse. Complete the primary flow. This finds more than every tool combined.
2. Tab through: invisible focus? illogical order? focus lost? traps?
3. Screen reader for 60 seconds: VoiceOver (`Cmd+F5`), NVDA, or TalkBack.
4. Zoom 200% and 400%. Resize to 320px.
5. Force reduced motion, dark mode, and Windows High Contrast.

---

## Output

```
Target: WCAG 2.2 AA

Fixed
  1.1.1  alt on 12 images (4 decorative → alt="")
  1.3.1  6 div-buttons → <button>; heading levels corrected on 3 pages
  1.3.5  autocomplete on 14 fields
  1.4.3  contrast: 7 pairs remapped (worst was 2.9:1)
  1.4.11 focus ring 3:1; 4 icon contrasts raised
  2.1.1  keyboard support added to the custom select and the date picker
  2.4.7  global outline:none removed; :focus-visible ring added
  2.4.11 scroll-margin so the sticky header stops covering focus
  2.5.7  keyboard reorder alternative for the drag list
  2.5.8  9 targets 32px → 44px hit area
  3.3.1/3.3.3 error text associated and rewritten with next steps
  3.3.8  paste enabled on OTP; autocomplete="one-time-code"

Tested
  keyboard-only primary flow · axe (0 violations) · VoiceOver on 3 screens
  contrast matrix both themes · 320px and 400% zoom · forced-colors · reduced-motion

Not tested
  NVDA, JAWS, TalkBack, voice control, cognitive-load review
```

Report criteria, not a compliance claim.

---

## Gate

- [ ] Keyboard-only pass through the primary flow, completed
- [ ] axe reports zero violations
- [ ] Every interactive element has a visible focus indicator at >= 3:1
- [ ] Every form field has a label, correct type, and `autocomplete`
- [ ] Every drag has a pointer alternative
- [ ] Contrast verified in both themes with the script
- [ ] Usable at 320px and at 400% zoom
- [ ] Reduced motion and forced-colors do not break the UI
- [ ] Output states what was tested and what was not

## See also
`reference/accessibility.md`, `commands/states.md`, `scripts/a11y-lint.mjs`
