# Motion

The chapter with the most concrete numbers. Motion is the fastest way to make an
interface feel considered and the fastest way to make it feel slow.

Much of this knowledge tracks Emil Kowalski's design-engineering work
([emilkowal.ski](https://emilkowal.ski), [animations.dev](https://animations.dev),
author of [Sonner](https://github.com/emilkowalski/sonner) and
[Vaul](https://github.com/emilkowalski/vaul)) and Apple's WWDC 2018 session 803,
*Designing Fluid Interfaces*. See `CREDITS.md`.

---

## 1. Should this animate at all?

Ask one question first: **how often will the user see it?**

| Frequency | Decision |
|---|---|
| 100+ times/day — keyboard shortcuts, command palette, tab switch | **No animation. Ever.** |
| Tens of times/day — hovers, list navigation, inline toggles | Remove, or reduce to <= 120ms opacity only |
| Occasional — modals, drawers, toasts, page transitions | Standard animation |
| Rare / first-run — onboarding, success moments, marketing | Delight is allowed |

**Never animate a keyboard-initiated action.** A command palette that animates open
is slower every single time, forever. Raycast has no open/close animation, and that is
the correct choice for something used hundreds of times a day.

Then: **what is the purpose?** Valid answers only.

- **Spatial continuity** — the thing came from there, so it returns there. Makes swipe-to-dismiss and back-navigation feel obvious.
- **Feedback** — the interface confirms it heard the input.
- **State change** — this became that, and you can see it happen.
- **Preventing a jarring cut** — content appearing from nothing reads as a glitch.
- **Explanation** — marketing or onboarding motion that demonstrates a mechanism.
- **Perceived performance** — motion that covers latency you cannot remove.

"It looks cool" is not a purpose when the user sees it daily.

---

## 2. Easing

Built-in CSS easings are weak. Use custom curves.

```css
:root {
  /* Enter, and most UI feedback. Strong, immediate. */
  --ease-out:        cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-soft:   cubic-bezier(0.16, 1, 0.30, 1);
  /* On-screen movement and morphs */
  --ease-in-out:     cubic-bezier(0.77, 0, 0.175, 1);
  /* Exits only — acceptable because the user has stopped watching */
  --ease-in:         cubic-bezier(0.55, 0, 1, 0.45);
  /* iOS-style sheet/drawer (Ionic) */
  --ease-drawer:     cubic-bezier(0.32, 0.72, 0, 1);
  /* Emphasised, Material 3 flavour */
  --ease-emphasized: cubic-bezier(0.20, 0, 0, 1);
  /* Constant motion: marquees, progress, spinners */
  --ease-linear:     linear;
}
```

**Selection rule**

```
Entering or exiting the screen?     → ease-out
Moving or morphing while on screen? → ease-in-out
Hover / colour change?              → ease (or ease-out)
Constant motion?                    → linear
Unsure?                             → ease-out
```

**Never `ease-in` on an enter.** It starts slow at exactly the moment the user is
watching most closely, so it *feels* slower than the same duration with `ease-out`.
This is the single most common motion defect in AI-written CSS.

**Never bounce/elastic/back-out on standard UI.** It adds perceived latency and reads
as toy-like. Bounce belongs to drag-release and rare celebratory moments.

CSS `linear()` lets you approximate a spring in pure CSS, which is useful for
off-main-thread spring-feel without a JS library:
```css
--ease-spring: linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%,
  0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.007 50.1%, 1.011 57.7%, 1);
```

---

## 3. Duration

| Element | Duration |
|---|---|
| Colour / opacity hover | 80–150ms |
| Button press feedback | 100–160ms |
| Tooltip, small popover | 125–200ms |
| Dropdown, select, menu | 150–250ms |
| Accordion, inline expand | 200–280ms |
| Modal, dialog | 200–300ms |
| Drawer, bottom sheet | 250–400ms (larger travel earns more time) |
| Page / view transition | 250–400ms |
| Toast enter | 300–400ms |
| Marketing / explanatory | 400–1200ms, freely |

**Hard rule: UI animation stays under 300ms** apart from drawers, sheets and
deliberate marketing motion. A 180ms dropdown feels more responsive than a 400ms one,
and a faster spinner makes identical load times feel shorter.

**Exits are faster than enters** — 60–75% of the enter duration. The user has already
decided; get out of the way.

**Scale duration with distance, not with importance.** A 4px nudge at 300ms looks
broken. A 600px sheet at 150ms looks like a cut.

**Token the tiers** so durations cannot drift:
```css
--dur-1: 100ms;  --dur-2: 150ms;  --dur-3: 200ms;
--dur-4: 300ms;  --dur-5: 400ms;  --dur-6: 600ms;
```

---

## 4. Springs

Springs have no fixed duration; they settle. Their advantage is **interruptibility**:
a spring keeps its velocity when retargeted mid-flight, so a gesture the user reverses
halfway feels continuous. CSS transitions retarget reasonably; keyframes restart from
zero.

**Use springs for:** drag with momentum, gesture-driven sheets, anything the user can
grab and reverse, elements that should feel physical.

**Do not use springs for:** simple fades, colour changes, tooltips, or anything where
"settling" reads as indecision.

```js
// Apple-style parameterisation — easier to reason about (Motion / Framer Motion)
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Physics parameterisation — more control
{ type: "spring", mass: 1, stiffness: 220, damping: 26 }
```

Keep `bounce` at 0.1–0.25 and only where playfulness is on-brief. `bounce: 0` gives a
smooth, critically-damped feel that suits most product UI.

**Velocity is the whole point.** Motion should start from the element's *current*
value at the user's *current* velocity, project momentum forward, and remain grabbable
at any instant. That is what "fluid" means in Apple's framing, and it is why springs
rather than fixed-duration curves are the right primitive for gesture UI.

---

## 5. The craft rules

### Never animate from `scale(0)`
Nothing in the physical world appears from nothing. Start at `0.95`–`0.98` with
`opacity: 0`.

```css
/* wrong */ .enter { transform: scale(0); }
/* right */ .enter { transform: scale(0.96); opacity: 0; }
```

### Popovers scale from their trigger
`transform-origin: center` is wrong for anything anchored. Radix and Base UI expose
`var(--transform-origin)` / `--radix-popover-content-transform-origin` — use it.
**Modals are the exception**: they are not anchored, so they stay centre-origin.

### Buttons need a press state
```css
.button { transition: transform 150ms var(--ease-out), background-color 120ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```
Subtle — 0.95 to 0.98. This single detail is most of what "responsive-feeling" means.

### Transitions over keyframes for interruptible UI
Anything the user can trigger rapidly (toasts, toggles, list insertions) should use
transitions, which retarget from the current value. Keyframes restart, producing a
visible jump.

### Name your properties
```css
/* wrong */ transition: all 300ms;
/* right */ transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
```
`all` animates things you did not intend — including layout properties added later.

### `@starting-style` for entry without JS
```css
.toast {
  opacity: 1; translate: 0 0;
  transition: opacity 300ms var(--ease-out), translate 300ms var(--ease-out),
              display 300ms allow-discrete, overlay 300ms allow-discrete;
  @starting-style { opacity: 0; translate: 0 100%; }
}
```
`transition-behavior: allow-discrete` plus `overlay` is what makes exit animations work
on `display: none`, popovers and `<dialog>`.

### Percentage translates
`translateY(100%)` moves an element by its own height regardless of size. This is how
toast stacks and drawers position themselves without measuring. Prefer it to hardcoded
pixels.

### Blur to mask imperfect crossfades
When two states crossfade you briefly see both. A `filter: blur(2px)` during the
transition blends them into one perceived object. Keep blur under 20px — it is
expensive, especially in Safari, and never animate blur across a large area.

### Stagger, briefly
30–80ms between items, and never block interaction while a stagger runs. Longer delays
make the interface feel slow.

### Asymmetric timing
Slow where the user is deciding, fast where the system is responding. Hold-to-delete:
2s linear on press, 200ms ease-out on release.

### `clip-path` is an animation primitive
`clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` gives reveals, hold-to-confirm
progress, comparison sliders and perfect tab colour transitions (duplicate the tab
row, style the copy as active, clip it) — all GPU-friendly, no extra DOM.

---

## 6. Platform primitives

### View Transitions
```css
@view-transition { navigation: auto; }              /* same-document + cross-document */
.card-image { view-transition-name: hero-image; }   /* shared element */

::view-transition-old(hero-image),
::view-transition-new(hero-image) { animation-duration: 260ms; }

@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }
```
Use `view-transition-class` for groups. Keep names unique per snapshot — duplicates
throw. Great for list→detail; unnecessary for most in-page state changes.

### Scroll-driven animations
```css
.progress {
  animation: grow linear;
  animation-timeline: scroll(root block);
}
.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 15% cover 40%;
}
@keyframes grow { from { scale: 0 1; } to { scale: 1 1; } }
```
Runs off the main thread — genuinely cheaper than a scroll listener or
`IntersectionObserver`. Still gate behind reduced-motion, and never hide above-the-fold
content behind a scroll reveal.

### Popover & dialog
Native `popover` and `<dialog>` give you top-layer rendering (no z-index fights), light
dismiss, and focus management for free. Combine with `allow-discrete` for exit
animation and CSS anchor positioning (`anchor-name` / `position-anchor`) for placement.

### `interpolate-size` and `calc-size()`
```css
:root { interpolate-size: allow-keywords; }
details::details-content { transition: height 300ms var(--ease-out); height: 0; }
details[open]::details-content { height: auto; }
```
The long-awaited fix for animating to `height: auto`. Where unsupported, use
`grid-template-rows: 0fr → 1fr`.

---

## 7. Performance

- **Animate `transform`, `opacity`, `filter`, `clip-path` only.** These skip layout and mostly skip paint. Animating `width`, `height`, `top`, `left`, `margin` or `padding` triggers layout every frame.
- **CSS beats JS under load.** CSS animations run off the main thread; `requestAnimationFrame`-driven libraries drop frames exactly when the page is busy (route change, hydration, data fetch). Use CSS for predetermined motion, JS for dynamic and interruptible motion.
- **Motion/Framer Motion caveat:** the shorthand props `x`, `y`, `scale` are *not* hardware-accelerated — they run on the main thread. For the accelerated path use the full string: `animate={{ transform: "translateX(100px)" }}`. Or use `animate()` from `motion` with `{ type: "spring" }` on the WAAPI path.
- **Do not set CSS variables on a parent during a gesture.** Custom properties are inheritable, so changing one on a container invalidates style for every descendant. Write `element.style.transform` directly instead.
- **`will-change` is a scalpel.** Add before the animation, remove after. Permanent `will-change` on many elements wastes GPU memory and can *reduce* performance.
- **WAAPI** gives JS control at CSS performance:
```js
el.animate(
  [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
  { duration: 600, easing: "cubic-bezier(0.23,1,0.32,1)", fill: "forwards" }
);
```
- **`content-visibility: auto`** and `contain: layout paint` limit the blast radius of animated subtrees.
- Budget: 60fps means 16.7ms per frame; on a 120Hz display, 8.3ms. Profile on a mid-range Android, not your laptop.

---

## 8. Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* then restore what aids comprehension */
  .dialog, .toast, .tooltip {
    transition: opacity 150ms var(--ease-out) !important;
  }
}
```

Reduced motion means **fewer and gentler**, not none. Keep opacity and colour
transitions that explain state; remove movement, parallax, scale and rotation. In JS:

```jsx
const reduce = useReducedMotion();
const enter = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
```

Also:
- Gate hover *effects* behind `@media (hover: hover) and (pointer: fine)` — touch devices fire hover on tap, causing stuck states.
- Never convey information by motion alone.
- Anything that moves, blinks or auto-advances for more than 5s needs a pause control (WCAG 2.2.2).
- No flashing faster than 3Hz (WCAG 2.3.1).
- Announce async results to screen readers via a live region — a fade-in is not an announcement.

---

## 9. Debugging

1. **Slow it down 5×.** Most defects are invisible at full speed. Chrome DevTools → Animations panel, or temporarily multiply durations.
2. **Look for:** two overlapping states during a crossfade; wrong transform origin; properties out of sync; an abrupt start or stop.
3. **Frame-step** in the Animations panel to catch coordination bugs between properties.
4. **Test gestures on real hardware.** Simulators lie about velocity and momentum.
5. **Re-watch tomorrow.** Fresh eyes catch timing errors that fresh work hides.
6. **Record and scrub.** A screen recording stepped frame-by-frame is the cheapest review tool available.

---

## 10. Review table

Use this format when reviewing motion — a table, one row per finding.

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms var(--ease-out)` | Name properties; `all` animates layout too |
| `transform: scale(0)` | `transform: scale(0.96); opacity: 0` | Nothing appears from nothing |
| `ease-in` on a dropdown | `ease-out` with a custom curve | `ease-in` delays the moment the user is watching |
| No `:active` on a button | `transform: scale(0.97)` | Confirms the press |
| `transform-origin: center` on a popover | `var(--transform-origin)` | Should scale from its trigger; modals exempt |
| Animation on `Cmd+K` | none | Seen hundreds of times a day |
| 450ms menu | 180ms | Under 300ms for UI |
| Enter and exit both 300ms | exit 180ms | Exits get out of the way |
| Keyframes on a toast stack | transitions | Interruptible and retargetable |
| `animate={{ x: 100 }}` under load | `animate={{ transform: "translateX(100px)" }}` | Shorthand props are not GPU-accelerated |
| All items appear at once | 50ms stagger | Reads as intentional |
| No reduced-motion block | reduce + substitute | Accessibility requirement |
