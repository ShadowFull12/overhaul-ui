# animate — add motion

**Route here when:** "add animations", "make it feel alive", "this feels static".

**Writes:** motion code, and often a `motion.css` token file.

The default answer to "what should animate?" is **less than you think**. This command
is as much a filter as a builder.

---

## Procedure

### 1. Install the tokens
If the project has no motion tokens, copy `templates/motion.css` first. Every duration
and easing below references them. Ad-hoc `300ms ease-in-out` scattered through
components is how motion drifts.

### 2. List the candidates
Every moment where something appears, disappears, moves, changes state, or responds to
input. Include what already animates.

### 3. Filter hard
For each candidate, answer the frequency question (`reference/motion.md` §1):

| Frequency | Verdict |
|---|---|
| 100+/day (shortcuts, palette, tab switch) | **Reject.** Remove existing animation too |
| Tens/day (hover, list nav, toggles) | Reject, or <= 120ms opacity only |
| Occasional (modal, drawer, toast, route change) | Accept |
| Rare (onboarding, success, marketing) | Accept, delight allowed |

Then the purpose question. Valid: spatial continuity, feedback, state change,
preventing a jarring cut, explanation, covering unavoidable latency. "Looks cool" is
not valid for anything frequent.

**Expect to reject most candidates.** A short list of high-conviction animations beats
a long wishlist. Report what you rejected and why — that is the valuable half.

### 4. Specify each survivor
Before writing code, write the spec:

```
What:      dropdown menu opens
Trigger:   click / Enter on the trigger button
Properties:opacity 0→1, scale 0.96→1
Duration:  180ms enter / 120ms exit
Easing:    var(--ease-out)
Origin:    var(--transform-origin) — the trigger
Reduced:   opacity only, 120ms
Frequency: several times per session → justified
```

### 5. Implement
- CSS transitions for anything interruptible or state-driven
- `@starting-style` + `allow-discrete` for enter/exit without JS
- CSS scroll-driven animations (`animation-timeline`) instead of scroll listeners
- View Transitions for list→detail navigation
- A JS library only for springs, gestures, layout animations and shared-element moves
- `transform` and `opacity` only. `clip-path` and `filter` where they earn it

### 6. Reduced motion
Not optional. Reduce and substitute — keep opacity and colour transitions that explain
state, remove movement, scale and parallax.

### 7. Verify
```bash
node scripts/motion-lint.mjs .
```
Then: slow every animation 5× and watch it. Check on a throttled CPU. Test the
interrupt case — trigger, then immediately reverse.

---

## Default recipes

| Element | Enter | Exit | Notes |
|---|---|---|---|
| Button press | — | — | `scale(0.97)`, 150ms `--ease-out` on `:active` |
| Tooltip | opacity + `scale(0.97)`, 150ms | 100ms | Origin at trigger. Instant for subsequent |
| Dropdown / menu | opacity + `scale(0.96)`, 180ms | 120ms | Origin at trigger |
| Modal | opacity + `scale(0.96)`, 240ms | 160ms | Origin stays **centre** |
| Drawer / sheet | `translateY(100%)→0`, 320ms `--ease-drawer` | 240ms | Spring if draggable |
| Toast | `translateY(100%)` + opacity, 350ms `ease` | 200ms | Transitions, not keyframes |
| Accordion | `grid-template-rows: 0fr→1fr`, 240ms | 200ms | Or `interpolate-size` |
| Tab indicator | `transform` on a shared bar, 200ms `--ease-in-out` | — | Or `clip-path` for perfect colour |
| List insert | opacity + `translateY(8px)`, 250ms | 180ms | 50ms stagger max |
| Page / route | View Transitions, 260ms | — | Off for daily-driver tools |
| Skeleton → content | 150ms crossfade | — | Only if shapes match exactly |
| Number change | `NumberFlow`-style digit roll | — | `tabular-nums` mandatory |

---

## Output

```
Animated (4)
  Modal open/close      240/160ms  ease-out       prevents a jarring cut
  Drawer                320ms      ease-drawer    spatial continuity, draggable
  Toast stack           350/200ms  ease           enters/exits from the same edge
  Button press          150ms      ease-out       feedback

Rejected (7)
  Command palette open   — seen 50+ times/day
  Sidebar nav hover      — seen constantly; 100ms opacity only
  Every-section scroll reveal — hides content the user asked for
  […]

Removed (2)
  Tab switch 400ms bounce → none
  Hero blob float loop    → static

Reduced motion: opacity-only substitutions, no movement
motion-lint: clean
```

---

## Gate

- [ ] Every animation has a stated purpose and passes the frequency test
- [ ] Named properties only; no `transition: all`
- [ ] No `ease-in` enters, no bounce on standard UI
- [ ] Exits faster than enters
- [ ] Nothing over 300ms except drawers and marketing
- [ ] Correct transform origin on anchored elements
- [ ] `prefers-reduced-motion` handled with substitutions
- [ ] Interrupt-tested; 60fps on a throttled CPU

## See also
`reference/motion.md`, `templates/motion.css`, `commands/motion-audit.md`
