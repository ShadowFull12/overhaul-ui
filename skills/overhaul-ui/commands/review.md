# review — the pre-delivery gate

**Route here when:** before presenting any UI work as done. Every other command's gate
funnels into this one.

**Read-only, then fix what fails.** Do not present work that has not passed this.

---

## 1. Build

- [ ] The project's build command ran clean
- [ ] Typecheck passes
- [ ] Existing tests pass (say how many)
- [ ] No new console errors or warnings on the primary route
- [ ] No `TODO`, placeholder, or commented-out block left in delivered code

If you could not run the build (missing deps, no environment), say so explicitly. Do not
imply verification you did not perform.

## 2. Instruments

```bash
node scripts/slop-scan.mjs .
node scripts/motion-lint.mjs .
node scripts/a11y-lint.mjs .
node scripts/contrast.mjs --matrix design-system/tokens.json
```

- [ ] `slop-scan`: zero error-level findings
- [ ] `motion-lint`: clean
- [ ] `a11y-lint`: clean
- [ ] Contrast matrix: all pairs pass AA, both themes

## 3. Craft

- [ ] The direction is nameable in one sentence, and every choice serves it
- [ ] One focal point per view; squint test passes
- [ ] One spacing scale; no orphan values
- [ ] Type scale has real contrast; no headline wraps past 3 lines
- [ ] Neutrals tinted; no `#000`/`#fff`/`#888`
- [ ] One accent, appearing at most twice per view
- [ ] Max one card nesting level; nested radii correct
- [ ] Icons: one family, one stroke weight, tokenised sizes, no emoji
- [ ] Section composition varies (4+ archetypes on multi-section pages)

## 4. Behaviour

- [ ] Every control: rest, hover, focus-visible, active, disabled
- [ ] Every async surface: loading, empty, error, success
- [ ] No layout shift on load, hover, focus, or state change
- [ ] Forms: labels, correct types, `autocomplete`, inline validation, useful errors, input preserved on failure
- [ ] Motion: named properties, ease-out enters, exits faster, <= 300ms for UI, correct origin
- [ ] `prefers-reduced-motion` handled with substitutions
- [ ] Hover effects gated behind `(hover: hover) and (pointer: fine)`
- [ ] Nothing frequent animates

## 5. Access

- [ ] Keyboard-only pass through the primary flow, completed
- [ ] Visible focus on every interactive element, >= 3:1
- [ ] Semantic HTML; ARIA only where semantics fall short
- [ ] Accessible names on all icon-only controls
- [ ] Touch targets >= 44px, >= 8px apart
- [ ] Usable at 320px and at 400% zoom
- [ ] No colour-only encoding
- [ ] `forced-colors: active` does not break the UI

## 6. Widths and themes

- [ ] 320px — no horizontal scroll, nothing clipped
- [ ] 768px — the awkward middle actually works
- [ ] 1440px — content not stretched into unreadable measures
- [ ] Landscape phone (short viewport)
- [ ] Both themes, verified independently
- [ ] Longest translation / 1.4× string length

## 7. Content

- [ ] Real copy; no lorem ipsum, no "John Doe", no `[Placeholder]`
- [ ] Zero banned phrases (`reference/copywriting.md` §1)
- [ ] Every headline could be false
- [ ] Every CTA is verb + object and unique on the page
- [ ] Every error says what to do next
- [ ] Every empty state offers an action

## 8. Performance

- [ ] No layout properties animated
- [ ] Images have dimensions and appropriate formats
- [ ] Heavy components lazy-loaded
- [ ] No obvious bundle regression
- [ ] 60fps at 4× CPU throttle on any animation added

---

## Output

Report the result compactly. Not 60 checkmarks.

```
Review: pass with 2 notes

Build      pass · typecheck pass · 84/84 tests
Instruments slop 0 error / 3 warn · motion clean · a11y clean · contrast AA both themes
Craft      direction held; squint test passes
Behaviour  all control + async states present; no shift; reduced-motion handled
Access     keyboard pass complete; axe 0 violations; 44px targets; 320px + 400% clean
Widths     320 / 768 / 1440 / landscape verified; both themes
Content    real copy; 0 banned phrases

Notes
  1. slop-scan warns on 3 arbitrary spacing values in LegacyTable.tsx — pre-existing,
     out of scope for this change
  2. Screen reader tested with VoiceOver only; NVDA and TalkBack not verified

Not verified: real-device gestures, Safari 16, low-end Android field performance
```

**Honesty is the point of this command.** A review that reports everything green when
the screen reader was never opened is worse than no review — it transfers risk to the
user without their knowledge. Always include a "not verified" line.

---

## If something fails

Fix it, then re-run the affected sections. Do not present the work with a known failure
and a note saying it could be fixed later, unless the user has explicitly scoped it out.

## See also
`SKILL.md` §6, and the gate section of whichever command produced the work.
