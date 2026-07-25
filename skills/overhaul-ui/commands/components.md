# components — build or fix a single component

**Route here when:** "build a button/modal/table/form/nav", "fix this component", "our
dropdown is broken", "make a reusable card".

**Writes:** one component and its states.

---

## Procedure

### 1. Do not build it if it exists
Check, in order:
1. Is it already in this codebase? Extend it rather than adding a second one.
2. Is it in the installed component library? Use it.
3. Can a native element do it? `<dialog>`, `popover`, `<details>`, `<select>`, `<progress>`.
4. Does a headless primitive exist? Radix, Base UI, React Aria — they solve the keyboard and ARIA contract you would otherwise re-implement badly.

Only then build from scratch. `reference/libraries.md`.

### 2. Read the spec
`reference/components.md` has per-component numbers: sizes, paddings, radii, motion,
keyboard behaviour and the specific failure modes. Read the relevant section before
writing.

### 3. Design the API
- Composition over configuration: `<Select><Select.Trigger/><Select.Content/></Select>` beats 30 props
- Controlled **and** uncontrolled (`value` + `defaultValue`)
- Forward the ref, spread `...props` onto the root
- `asChild`/polymorphism rather than a `component` prop
- Expose state as `data-*` attributes (`data-state="open"`) so consumers can style without prop drilling
- Accept `className` and merge it (`cn()`), so consumer overrides actually win
- Variants via `cva`/`tailwind-variants`, not string concatenation
- Good defaults over options — most consumers never customise

### 4. Build the states
All five control states, plus whichever of loading / selected / checked / indeterminate /
expanded / invalid / read-only / dragging apply. `commands/states.md`.

### 5. Keyboard and ARIA
Follow the [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) pattern for this component
type. Focus management, roving tabindex where needed, `Esc` behaviour, focus restore.
`reference/accessibility.md` §3.

### 6. Motion
Usually one transition, under 200ms, `ease-out`, correct origin. Frequently-used
components often want none. `reference/motion.md`.

### 7. Handle the edge cases invisibly
The details nobody notices and everybody feels: pause timers when the tab is hidden ·
capture the pointer during a drag · ignore extra touch points · preserve scroll
position · restore focus on close · fill the gaps between stacked items so hover does
not flicker · handle a 200-character label · handle zero items.

### 8. Tokens only
No hardcoded values. If you need one that does not exist, add it to the system.

### 9. Verify
Render every state and every variant on one page. Keyboard-only pass. Screen reader
pass. 320px. Both themes. Long content. Zero content.

---

## Output

```
Component: <Select>
Built on:  Base UI Select (keyboard + ARIA contract inherited)
API:       composition, controlled + uncontrolled, ref forwarded, data-state exposed
Variants:  3 sizes × 3 tones, via cva
States:    rest, hover, focus-visible, active, disabled, open, selected,
           loading, invalid, empty
Keyboard:  arrows, Home/End, type-ahead, Enter, Esc, Tab closes
Motion:    180ms/120ms opacity + scale(0.96), origin at trigger
Edge cases:200-char option label, 0 options, 500 options (virtualised), RTL
Verified:  all states rendered, keyboard pass, VoiceOver, 320px, both themes
```

---

## Gate

- [ ] Not a duplicate of something that already exists
- [ ] Keyboard contract complete for this component type
- [ ] All applicable states implemented and rendered somewhere reviewable
- [ ] Accessible name, role and state correct
- [ ] Tokens only; no hardcoded values
- [ ] `className` merges; ref forwards; `...props` spreads
- [ ] Long content, zero content and RTL handled
- [ ] Build and typecheck pass

## See also
`reference/components.md`, `reference/libraries.md`, `commands/states.md`,
`commands/harden.md`
