# motion-audit — review existing motion

**Route here when:** "the animations feel off", "it's janky", "it feels slow",
"review my transitions".

**Read-only by default.** Produce findings; apply them on request or via
`commands/animate.md`.

If `review-animations` or `improve-animations` (Emil Kowalski) are installed, defer to
them — they are the specialists this command converges with.

---

## Procedure

### 1. Inventory
```bash
node scripts/motion-lint.mjs . --json
```
Then find by hand what the linter cannot see: JS-driven animation, library configs
(spring params, variants), keyframes, scroll handlers, `requestAnimationFrame` loops.

### 2. Check each animation against the bar

| Check | Fail condition |
|---|---|
| **Should it exist?** | Animates something the user sees dozens of times a day |
| **Purpose** | No answer beyond "looks nice" |
| **Easing** | `ease-in` on enter; bounce/elastic on standard UI; built-in weak curves |
| **Duration** | > 300ms for UI; identical enter and exit; duration unrelated to distance |
| **Origin** | `transform-origin: center` on an anchored popover |
| **Start value** | `scale(0)`; opacity-only where movement is needed, or vice versa |
| **Properties** | `transition: all`; animating `height`/`width`/`top`/`left`/`margin` |
| **Interruptibility** | Keyframes on a rapidly-retriggered element |
| **Hardware path** | Motion `x`/`y`/`scale` shorthands under load; CSS vars written on a parent during a gesture |
| **Reduced motion** | No `prefers-reduced-motion` handling, or a blanket kill |
| **Hover gating** | Hover effect with no `(hover: hover)` guard |
| **Frame budget** | Drops frames at 4× CPU throttle |
| **Live regions** | Async result conveyed only by a fade, never announced |

### 3. Watch it, slowly
Slow every animation 5× (DevTools Animations panel, or multiply durations). Look for:
two overlapping states during a crossfade, wrong origin, properties out of sync,
abrupt starts or stops. Most defects are invisible at full speed.

### 4. Test interruption
Trigger, then immediately reverse. Open a menu and press `Esc` mid-animation. Drag and
release mid-flight. Keyframes will snap; springs and transitions should flow.

### 5. Profile
Chrome Performance panel, 4× CPU throttle. Look for layout thrash during animation and
long tasks that coincide with motion.

---

## Output

A table. One row per finding. This format is required — not a bulleted list.

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` (Button.tsx:14) | `transition: transform 150ms var(--ease-out)` | `all` animates layout properties too |
| `ease-in` on Dropdown enter (Menu.tsx:31) | `var(--ease-out)` | `ease-in` delays the moment the user watches |
| `scale(0)` on Popover (Popover.tsx:22) | `scale(0.96)` + `opacity: 0` | Nothing appears from nothing |
| 450ms Select (Select.css:8) | 180ms | Under 300ms for UI |
| Cmd+K palette animates (Palette.tsx:40) | remove entirely | Seen 50+ times/day |
| `animate={{ x: 120 }}` (Sheet.tsx:18) | `animate={{ transform: "translateX(120px)" }}` | Shorthand props run on the main thread |
| Keyframes on toast stack | CSS transitions | Keyframes restart from zero on rapid inserts |
| No reduced-motion block | opacity-only substitutions | Accessibility requirement |

Then:

```
Verdict: <one or two sentences>
Findings: 12 (4 blocking feel, 6 craft, 2 perf)
Should not animate at all: <list>
Frame budget: drops to 42fps during <interaction> at 4× throttle
```

---

## Gate

- [ ] Every finding cites `file:line`
- [ ] Output is a Before/After/Why table
- [ ] Includes a "should not animate at all" section — the most valuable finding type
- [ ] Interrupt and throttled-CPU behaviour reported
- [ ] No source modified unless the user asked for fixes

## See also
`reference/motion.md`, `commands/animate.md`, `commands/optimize.md`
