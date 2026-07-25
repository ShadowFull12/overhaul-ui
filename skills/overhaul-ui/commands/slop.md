# slop — de-slop an interface

**Route here when:** the user says it looks AI-generated, generic, templated, like
every other site, or "like ChatGPT made it".

**Writes:** source edits.

---

## Procedure

Do these **in order**. Half-finished passes look worse than the original — a
half-replaced palette is a bug, not progress.

### 0. Measure
```bash
node scripts/slop-scan.mjs . --fix-hints
```
Record the error count. You will re-run at the end and report the delta.

### 1. Name a direction
`reference/direction.md`. One sentence. This is the step that actually fixes the
problem — everything below is execution. Skipping it means the output regresses to the
average again.

### 2. Replace the type
Biggest visual delta, lowest risk. New pairing from `reference/typography.md`, widen
the scale ratio, fix the measure, fix headline wraps, add tracking at display sizes.

### 3. Rebuild the neutral ramp
Tint it (`reference/color.md`). Remove every `#000`, `#fff`, `#888`, and untouched
`gray-*`. Re-derive every grey in the codebase from the new ramp. No stragglers.

### 4. Cut to one accent
Reassign the freed colours to neutrals. Keep semantic status colours. One accent,
appearing at most twice per view.

### 5. Strip decoration
- Delete every gradient that does not carry meaning — especially any purple→blue
- Delete accent-coloured glow except on the single primary action
- Flatten nested cards to one container level
- Remove every border that space or a background shift can replace
- Remove decorative floating blobs, orbs and grid overlays

### 6. Re-space
One scale. Vary gaps by relationship (`reference/layout.md` §1). Make section rhythm
uneven and deliberate. Increase macro whitespace — under-spacing is the most common
"cheap" signal.

### 7. Break the section template
Give at least three sections a composition other than centred-title-plus-three-cards.
Archetype table in `reference/layout.md` §3.

### 8. Fix the motion
Name transition properties, `ease-out` on enters, exits at ~70%, nothing over 300ms
for UI, remove animation from anything the user sees dozens of times a day, delete
scroll-reveal from above-the-fold content, add the reduced-motion block.
```bash
node scripts/motion-lint.mjs .
```

### 9. Add the missing states
Loading, empty, error on every async surface. Usually the largest perceived-quality
jump per line changed. See `commands/states.md`.

### 10. Rewrite the copy
Strip the banned list in `reference/copywriting.md` §1. Make every headline
falsifiable. Make every CTA specific and unique on the page.

### 11. Replace the icons
One vector family, one stroke weight, tokenised sizes. Delete emoji used as icons.

### 12. Re-measure
```bash
node scripts/slop-scan.mjs .
```

---

## Output

```
Direction:   <name> — <one sentence>
Slop score:  47 findings (12 error) → 3 findings (0 error)

Changed
  Type      Inter-everything → <display> + <text>, ratio 1.2 → 1.333
  Colour    9 unrelated greys → one tinted ramp; 4 accents → 1
  Removed   6 gradients, 11 glows, 2 nested-card levels, 14 borders
  Layout    5 identical sections → 5 distinct archetypes
  Motion    9 × transition:all fixed, 4 ease-in enters flipped, 3 animations deleted
  States    added loading/empty/error to 4 surfaces
  Copy      11 headlines and 6 CTAs rewritten

Files: 23 changed
Build: pass
```

Then two or three sentences on what was actually wrong and what the interface is now.

---

## Gate

- [ ] `slop-scan` reports zero error-level findings
- [ ] The direction is nameable, and every change serves it
- [ ] No half-migrations: zero references to the old palette or old fonts remain
- [ ] Build passes; visual check on the primary route
- [ ] `commands/review.md` gate run

## See also
`reference/anti-slop.md` (the catalogue), `commands/overhaul.md` (when structure needs
to change too, not just surface), `commands/copy.md`
