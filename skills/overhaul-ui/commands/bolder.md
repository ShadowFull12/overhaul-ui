# bolder — increase confidence and contrast

**Route here when:** "too safe", "too bland", "too corporate", "push it further", "it's
boring", "make it memorable".

**Writes:** visual system changes.

Bolder is not louder. It is more *committed*. The output should be identifiable, not
noisy.

---

## Procedure

### 1. Diagnose the timidity
Bland almost always comes from one of these:
- **Insufficient scale contrast** — everything is medium-sized
- **No display moment** — no single element commands the page
- **Too many mid-tones** — no true darks or lights, everything hovers in the middle
- **Symmetry everywhere** — centred, evenly weighted, safe
- **Generic type** — one default sans doing every job
- **Decoration instead of structure** — small flourishes on a weak skeleton

### 2. Push the type scale
Raise the ratio (1.25 → 1.333 or 1.414). Then make the display level *much* bigger than
feels comfortable — 76px, 96px, or `clamp()` up to 12vw. Tighten its leading to 0.95–1.05
and its tracking to −0.03em. One statement per page.

Add a genuine display face if there is only a text face.

### 3. Push the value contrast
True darks and true lights. Take the neutral ramp's ends further apart. A near-black
surface next to an off-white one is confidence; two mid-greys are hesitation.

### 4. Commit to the accent
Use it in a large area, not just on a button. A full-bleed colour field, a coloured
section, a coloured footer. One place, large.

### 5. Break the symmetry
Asymmetric splits (4/8, 5/7), an offset grid, an element crossing a section boundary,
text hanging into the margin, one element deliberately larger than its neighbours.
`reference/layout.md` §3.

### 6. Increase the macro whitespace
Counter-intuitive but reliable: bold designs have *more* space, not less. Space around a
big element is what makes it read as deliberate rather than crowded.

### 7. Add exactly one distinctive move
Not five. One. Choose from:
- Type as image (a headline at 15vw, cropped)
- An unexpected full-bleed image treatment (hard crop, duotone, grain)
- One custom cursor or one custom scroll behaviour
- A visible grid or a structural rule line
- A single, well-made animated moment
- An oversized numeral, glyph or mark

### 8. Keep the floor
Bolder never means less accessible. Contrast still measured, focus rings still visible,
reduced motion still honoured, 320px still works. Large type must still wrap sanely.

### 9. Verify
Squint test: does one thing dominate? Screenshot next to two competitors — is it
distinguishable? Then the full `commands/review.md` gate.

---

## Output

```
Diagnosis: no display moment; type ratio 1.2; all mid-tone greys; every section centred

Changes
  Type      ratio 1.2 → 1.414; hero 39px → 96px (clamp to 12vw), leading 1.0, tracking -0.03em
  Added     <display face> for headings only
  Value     ramp ends pushed: bg oklch(.985) / footer oklch(.16)
  Accent    full-bleed accent section (was accent on buttons only)
  Symmetry  3 sections → asymmetric 5/7; one image crosses a section boundary
  Space     section rhythm 96px → 160px around the hero
  Signature one move: hero headline cropped at the viewport edge

Floor held: contrast AA both themes, focus rings intact, reduced-motion honoured,
320px clean, headline wraps to 2 lines max at every width
```

---

## Gate

- [ ] One dominant focal point per view (squint test)
- [ ] Exactly one signature move, not several
- [ ] Distinguishable from two competitor screenshots
- [ ] Contrast, focus, reduced motion, 320px all still pass
- [ ] No headline wrapping past 3 lines at any width
- [ ] Build passes

## See also
`reference/direction.md`, `commands/quieter.md`, `commands/typeset.md`
